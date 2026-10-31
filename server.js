import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import nodemailer from 'nodemailer';
import { readFile } from 'node:fs/promises';

import mysql from 'mysql2/promise';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'trainingslager',
  waitForConnections: true,
  connectionLimit: 10
});
const services = new Set([
  'Hotel & Zimmer', 'Verpflegung', 'Trainingsplätze', 'Gym & Regeneration',
  'Testspiele', 'Flughafentransfer', 'Lokaler Transport'
]);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '32kb' }));
app.get('/site-config.js', (_req, res) => {
  res.type('application/javascript').send(
    `window.SITE_CONFIG=${JSON.stringify({
      siteUrl: process.env.PUBLIC_SITE_URL || 'http://localhost:3000',
      ga4MeasurementId: process.env.GA4_MEASUREMENT_ID || '',
      googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || ''
    })};`
  );
});
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(`User-agent: *
Allow: /
Sitemap: ${(process.env.PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')}/sitemap.xml
`);
});
app.get('/sitemap.xml', (_req, res) => {
  const siteUrl = (process.env.PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>`);
});
app.use(express.static(__dirname, { extensions: ['html'] }));

function requiredString(value, field, max = 500) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
  if (value.length > max) throw new Error(`${field} is too long`);
  return value.trim();
}

function optionalString(value, field, max = 2000) {
  if (value == null || value === '') return null;
  return requiredString(value, field, max);
}

function validateEnquiry(body) {
  const email = requiredString(body.email, 'email', 320);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('A valid email is required');
  const result = {
    clubName: requiredString(body.clubName, 'clubName'),
    country: requiredString(body.country, 'country', 100),
    teamType: requiredString(body.teamType, 'teamType', 100),
    contactPerson: requiredString(body.contactPerson, 'contactPerson', 200),
    email,
    phone: requiredString(body.phone, 'phone', 60),
    players: body.players === '' || body.players == null ? null : Number(body.players),
    staff: body.staff === '' || body.staff == null ? null : Number(body.staff),
    ageGroup: optionalString(body.ageGroup, 'ageGroup', 100),
    level: optionalString(body.level, 'level', 150),
    dates: optionalString(body.dates, 'dates', 200),
    nights: body.nights === '' || body.nights == null ? null : Number(body.nights),
    budget: optionalString(body.budget, 'budget', 200),
    services: Array.isArray(body.services) ? body.services.filter((item) => services.has(item)) : [],
    extras: optionalString(body.extras, 'extras'),
    message: optionalString(body.message, 'message'),
    consent: body.consent === true
  };
  for (const [field, value] of [['players', result.players], ['staff', result.staff], ['nights', result.nights]]) {
    if (value !== null && (!Number.isInteger(value) || value < 0 || value > 10000)) {
      throw new Error(`${field} must be a valid positive number`);
    }
  }
  if (!result.consent) throw new Error('Consent is required');
  return result;
}

function adminOnly(req, res, next) {
  const configuredKey = process.env.ADMIN_API_KEY;
  if (!configuredKey || req.get('x-admin-key') !== configuredKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

function mailTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
  });
}

async function sendNotifications(enquiry) {
  const transport = mailTransport();
  if (!transport || !process.env.ADMIN_EMAIL || !process.env.SMTP_FROM) {
    console.warn('Email notifications are disabled: configure SMTP_* and ADMIN_EMAIL in .env');
    return;
  }
  const summary = [
    `Club: ${enquiry.clubName}`,
    `Country: ${enquiry.country}`,
    `Team: ${enquiry.teamType}`,
    `Contact: ${enquiry.contactPerson}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone}`,
    `Players/staff: ${enquiry.players ?? '-'} / ${enquiry.staff ?? '-'}`,
    `Travel: ${enquiry.dates ?? '-'} (${enquiry.nights ?? '-'} nights)`,
    `Services: ${enquiry.services.join(', ') || '-'}`,
    `Budget: ${enquiry.budget ?? '-'}`,
    `Extras: ${enquiry.extras ?? '-'}`,
    `Message: ${enquiry.message ?? '-'}`
  ].join('\n');
  await Promise.all([
    transport.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      replyTo: enquiry.email,
      subject: `New training camp enquiry: ${enquiry.clubName}`,
      text: summary
    }),
    transport.sendMail({
      from: process.env.SMTP_FROM,
      to: enquiry.email,
      subject: 'Thank you for your enquiry | Trainingslager Antalya',
      text: `Thank you for applying. We have received your enquiry and will get back to you within 24 hours.\n\nYour reference is #${enquiry.id}.`
    })
  ]);
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: 'connected' });
  } catch (error) {
    console.error('Health check failed', error);
    res.status(503).json({ ok: false, database: 'unavailable' });
  }
});

app.post('/api/enquiries', async (req, res) => {
  let enquiry;
  try {
    enquiry = validateEnquiry(req.body);
    const [rows] = await pool.execute(
      `INSERT INTO enquiries
        (club_name, country, team_type, contact_person, email, phone, players, staff, age_group, level, dates, nights, budget, services, extras, message, consent)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [enquiry.clubName, enquiry.country, enquiry.teamType, enquiry.contactPerson, enquiry.email, enquiry.phone,
        enquiry.players, enquiry.staff, enquiry.ageGroup, enquiry.level, enquiry.dates, enquiry.nights, enquiry.budget,
        JSON.stringify(enquiry.services), enquiry.extras, enquiry.message, enquiry.consent]
    );
    const [created] = await pool.execute('SELECT id, created_at FROM enquiries WHERE id = ?', [result.insertId]);
    enquiry.id = created[0].id;
    await sendNotifications(enquiry);
    res.status(201).json({ id: created[0].id, createdAt: created[0].created_at });
  } catch (error) {
    if (error.message.includes('required') || error.message.includes('valid') || error.message.includes('too long') || error.message.includes('Consent')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Enquiry submission failed', error);
    res.status(500).json({ error: 'Unable to save your enquiry right now. Please try again.' });
  }
});

app.get('/api/admin/enquiries', adminOnly, async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 200');
    res.json(rows.map((row) => ({ ...row, services: typeof row.services === 'string' ? JSON.parse(row.services) : row.services })));
  } catch (error) {
    console.error('Admin enquiry listing failed', error);
    res.status(500).json({ error: 'Unable to load enquiries' });
  }
});

app.patch('/api/admin/enquiries/:id', adminOnly, async (req, res) => {
  if (!['new', 'contacted', 'closed'].includes(req.body.status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const [result] = await pool.execute(
      'UPDATE enquiries SET status = ? WHERE id = ?',
      [req.body.status, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ id: Number(req.params.id), status: req.body.status });
  } catch (error) {
    console.error('Admin enquiry update failed', error);
    res.status(500).json({ error: 'Unable to update enquiry' });
  }
});

async function start() {
  const schema = await readFile(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  app.listen(port, () => console.log(`Trainingslager Antalya running at http://localhost:${port}`));
}

start().catch((error) => {
  console.error('Unable to start server. Check MySQL configuration and availability.', error);
  process.exitCode = 1;
});
