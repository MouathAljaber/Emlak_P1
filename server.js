import 'dotenv/config';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import express from 'express';
import helmet from 'helmet';
import { mailConfigured, verifyMail, sendAdminNotification, sendConfirmation } from './mailer.js';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);
const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://trainingslager-antalya.de').replace(/\/+$/, '');
const SITE_HOST = new URL(SITE_URL).hostname.replace(/^www\./, '');
const productionHosts = new Set([SITE_HOST, `www.${SITE_HOST}`]);

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'trainingslager',
  waitForConnections: true,
  connectionLimit: 10
});
let databaseReady = false;

const services = new Set([
  'Hotel & Zimmer', 'Verpflegung', 'Trainingsplätze', 'Gym & Regeneration',
  'Testspiele', 'Flughafentransfer', 'Lokaler Transport'
]);

class ValidationError extends Error {}

/* ---------- security & host handling ---------- */

app.disable('x-powered-by');
// One proxy hop (Render, Railway, nginx…). Prevents spoofed X-Forwarded-* chains.
app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS ?? 1));
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'script-src': ["'self'", 'https://www.googletagmanager.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'img-src': ["'self'", 'data:', 'https:'],
      'connect-src': ["'self'", 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://www.googletagmanager.com'],
      'frame-ancestors': ["'none'"],
      'form-action': ["'self'"],
      'upgrade-insecure-requests': process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: false
}));
app.use((req, res, next) => {
  const host = (req.hostname || '').toLowerCase();
  if (host === `www.${SITE_HOST}`) {
    return res.redirect(301, `${SITE_URL}${req.originalUrl}`);
  }
  if (!productionHosts.has(host)) {
    res.set('X-Robots-Tag', 'noindex, nofollow');
  }
  res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});
app.use(express.json({ limit: '32kb' }));

/* ---------- generated files ---------- */

app.get('/site-config.js', (_req, res) => {
  res.type('application/javascript').set('Cache-Control', 'no-cache').send(
    `/* Set GA4_MEASUREMENT_ID, GOOGLE_SITE_VERIFICATION and WHATSAPP_NUMBER in the deployment environment. */
window.SITE_CONFIG=${JSON.stringify({
      siteUrl: SITE_URL,
      ga4MeasurementId: process.env.GA4_MEASUREMENT_ID || '',
      googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || '',
      whatsappNumber: (process.env.WHATSAPP_NUMBER || '').replace(/\D/g, '')
    })};`
  );
});

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin.html
Sitemap: ${SITE_URL}/sitemap.xml
`);
});

const sitemapRoutes = [
  '/', '/youth-teams/', '/amateur-clubs/', '/professional-teams/',
  '/senior-teams/', '/football-academies/', '/services/', '/how-it-works/',
  '/test-matches/', '/hotels-with-pitches/', '/winter-break-camp/',
  '/plan-football-camp/', '/best-time-training-camp/', '/training-camp-costs/',
  '/request-offer/', '/football-training-camp-turkey/', '/preseason-football-camp/',
  '/football-team-building/', '/football-pitches-antalya/', '/football-recovery-camp/',
  '/airport-transfers-antalya/', '/youth-football-camp-turkey/',
  '/amateur-football-camp-turkey/', '/professional-football-camp-turkey/',
  '/football-camp-europe/', '/about-us/', '/faq/', '/contact/', '/references/',
  '/trainingslager-antalya/', '/fussball-trainingslager-tuerkei/',
  '/jugend-trainingslager-antalya/', '/vereins-trainingslager/',
  '/trainingslager-kosten/', '/trainingslager-checkliste/',
  '/imprint/', '/privacy-policy/', '/cookie-policy/'
];

app.get('/sitemap.xml', (_req, res) => {
  const paths = [...sitemapRoutes, ...sitemapRoutes.map((route) => (route === '/' ? '/en/' : `/en${route}`))];
  const homeAlternates = `<xhtml:link rel="alternate" hreflang="de" href="${SITE_URL}/"/><xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en/"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/"/>`;
  const urls = paths.map((route) => {
    const isHome = route === '/' || route === '/en/';
    return `<url><loc>${SITE_URL}${route}</loc><lastmod>2026-11-19</lastmod>${isHome ? homeAlternates : ''}<changefreq>weekly</changefreq><priority>${isHome ? '1.0' : '0.8'}</priority></url>`;
  }).join('');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`);
});

/* ---------- helpers ---------- */

function requiredString(value, field, max = 500) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ValidationError(`${field} is required`);
  }
  if (value.length > max) throw new ValidationError(`${field} is too long`);
  return value.trim();
}

function optionalString(value, field, max = 2000) {
  if (value == null || value === '') return null;
  return requiredString(value, field, max);
}

function optionalInteger(value, field) {
  if (value === '' || value == null) return null;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > 10000) {
    throw new ValidationError(`${field} must be a valid positive number`);
  }
  return number;
}

function validateEnquiry(body) {
  if (!body || typeof body !== 'object') throw new ValidationError('Invalid request body');
  const email = requiredString(body.email, 'email', 320);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ValidationError('A valid email is required');
  if (body.consent !== true) throw new ValidationError('Consent is required');
  return {
    clubName: requiredString(body.clubName, 'clubName'),
    country: requiredString(body.country, 'country', 100),
    teamType: requiredString(body.teamType, 'teamType', 100),
    contactPerson: requiredString(body.contactPerson, 'contactPerson', 200),
    email,
    phone: requiredString(body.phone, 'phone', 60),
    players: optionalInteger(body.players, 'players'),
    staff: optionalInteger(body.staff, 'staff'),
    ageGroup: optionalString(body.ageGroup, 'ageGroup', 100),
    level: optionalString(body.level, 'level', 150),
    dates: optionalString(body.dates, 'dates', 200),
    nights: optionalInteger(body.nights, 'nights'),
    budget: optionalString(body.budget, 'budget', 200),
    services: Array.isArray(body.services) ? [...new Set(body.services.filter((item) => services.has(item)))] : [],
    extras: optionalString(body.extras, 'extras'),
    message: optionalString(body.message, 'message'),
    consent: true
  };
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function adminOnly(req, res, next) {
  const configuredKey = process.env.ADMIN_API_KEY;
  if (!configuredKey || configuredKey === 'replace-with-a-long-random-key' || !safeEqual(req.get('x-admin-key') || '', configuredKey)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

function requireDatabase(_req, res, next) {
  if (!databaseReady) {
    return res.status(503).json({ error: 'The enquiry service is temporarily unavailable. Please try again shortly.' });
  }
  next();
}

// Small in-memory limiter: protects the public form from floods without extra dependencies.
const submissionLog = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (submissionLog.get(req.ip) || []).filter((time) => now - time < windowMs);
  if (recent.length >= 5) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  recent.push(now);
  submissionLog.set(req.ip, recent);
  if (submissionLog.size > 5000) submissionLog.clear();
  next();
}

/* ---------- API ---------- */

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: 'connected' });
  } catch (error) {
    console.error('Health check failed', error.message);
    res.status(503).json({ ok: false, database: 'unavailable' });
  }
});

app.post('/api/enquiries', rateLimit, async (req, res) => {
  // Honeypot: real visitors never see or fill this field.
  if (req.body && typeof req.body.website === 'string' && req.body.website.trim()) {
    return res.status(201).json({ reference: '0' });
  }
  let enquiry;
  try {
    enquiry = validateEnquiry(req.body);
  } catch (error) {
    if (error instanceof ValidationError) return res.status(400).json({ error: error.message });
    throw error;
  }
  enquiry.lang = req.body.lang === 'en' ? 'en' : 'de';
  enquiry.receivedAt = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });

  // 1) Save to the database when it is available (optional).
  let saved = false;
  if (databaseReady) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO enquiries
          (club_name, country, team_type, contact_person, email, phone, players, staff, age_group, level, dates, nights, budget, services, extras, message, consent)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [enquiry.clubName, enquiry.country, enquiry.teamType, enquiry.contactPerson, enquiry.email, enquiry.phone,
          enquiry.players, enquiry.staff, enquiry.ageGroup, enquiry.level, enquiry.dates, enquiry.nights, enquiry.budget,
          JSON.stringify(enquiry.services), enquiry.extras, enquiry.message, enquiry.consent]
      );
      enquiry.reference = String(result.insertId);
      saved = true;
    } catch (error) {
      console.error('Saving enquiry to the database failed', error.message);
    }
  }
  if (!enquiry.reference) {
    enquiry.reference = `W${Date.now().toString(36).toUpperCase()}`;
  }

  // 2) Email the application to ADMIN_EMAIL (the primary delivery route).
  let emailed = false;
  if (mailConfigured()) {
    try {
      await sendAdminNotification(enquiry);
      emailed = true;
    } catch (error) {
      console.error(`Emailing enquiry #${enquiry.reference} failed`, error.message);
    }
  }

  if (!saved && !emailed) {
    console.error('Enquiry could not be delivered: no database and no working email. Data:', JSON.stringify(enquiry));
    return res.status(503).json({ error: 'Your enquiry could not be sent right now. Please try again shortly.' });
  }
  console.log(`Enquiry #${enquiry.reference} received (${[saved && 'saved', emailed && 'emailed'].filter(Boolean).join(' + ')})`);

  // 3) Confirmation copy to the applicant (best effort).
  if (mailConfigured()) {
    sendConfirmation(enquiry).catch((error) => console.error(`Confirmation email for #${enquiry.reference} failed`, error.message));
  }
  res.status(201).json({ reference: enquiry.reference });
});

app.get('/api/admin/enquiries', adminOnly, requireDatabase, async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 200');
    res.json(rows.map((row) => ({ ...row, services: typeof row.services === 'string' ? JSON.parse(row.services) : row.services })));
  } catch (error) {
    console.error('Admin enquiry listing failed', error);
    res.status(500).json({ error: 'Unable to load enquiries' });
  }
});

app.patch('/api/admin/enquiries/:id', adminOnly, requireDatabase, async (req, res) => {
  if (!['new', 'contacted', 'closed'].includes(req.body?.status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Invalid enquiry id' });
  try {
    const [result] = await pool.execute('UPDATE enquiries SET status = ? WHERE id = ?', [req.body.status, id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ id, status: req.body.status });
  } catch (error) {
    console.error('Admin enquiry update failed', error);
    res.status(500).json({ error: 'Unable to update enquiry' });
  }
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

/* ---------- static site ---------- */

app.use((req, res, next) => {
  if (req.path.endsWith('/index.html')) {
    const target = req.path.slice(0, -'index.html'.length) || '/';
    return res.redirect(301, `${target}${req.url.slice(req.path.length)}`);
  }
  next();
});

const hiddenFiles = /^\/(?:server\.js|mailer\.js|schema\.sql|package(?:-lock)?\.json|docker-compose\.yml|README\.md|scripts\/|src\/|node_modules\/)/;
app.use((req, res, next) => (hiddenFiles.test(req.path) ? res.status(404).sendFile(path.join(__dirname, '404.html')) : next()));

app.use(express.static(__dirname, {
  extensions: ['html'],
  dotfiles: 'ignore',
  setHeaders(res, filePath) {
    if (/\.(css|js|svg)$/.test(filePath)) res.set('Cache-Control', 'no-cache');
  }
}));

app.use((_req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.use((error, _req, res, _next) => {
  if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
  console.error('Unhandled error', error);
  res.status(500).json({ error: 'Internal server error' });
});

/* ---------- startup ---------- */

async function initDatabase() {
  try {
    const schema = await readFile(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    databaseReady = true;
    console.log('Database connected and schema ready.');
  } catch (error) {
    databaseReady = false;
    console.error(`Database unavailable (${error.code || error.message}). Retrying in 15s — the website keeps running.`);
    setTimeout(initDatabase, 15000).unref();
  }
}

app.listen(port, () => {
  console.log(`Trainingslager Antalya running at http://localhost:${port}`);
  initDatabase();
  verifyMail();
});
