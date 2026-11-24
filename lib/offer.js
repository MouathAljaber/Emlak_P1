import { ownerEmail, customerEmail } from './email.js';
// Shared by server.js (local) and worker.js (Cloudflare). Uses only web-standard APIs.
export const OPTIONS = {
  teamType: ['Jugendteam', 'Amateurverein', 'Seniorenteam', 'Akademie', 'Profiteam'],
  players: ['1-10', '11-15', '16-20', '21-25', '26-30', '31-40', '41+'],
  staff: ['0-2', '3-5', '6-10', '11+'],
  ageGroup: ['u7-u9', 'u10-u12', 'u13-u15', 'u16-u19', 'senior', 'ue32', 'ue40', 'mixed'],
  level: ['recreational', 'district', 'regional', 'oberliga', 'semipro', 'pro', 'academy'],
  nights: ['3', '4', '5', '6', '7', '8-10', '11-14', '15+'],
  flexibility: ['fixed', 'flex-week', 'flexible'],
  budget: ['lt500', '500-800', '800-1200', '1200-1800', 'gt1800', 'unsure'],
  services: ['Hotel & Zimmer', 'Verpflegung', 'Trainingsplätze', 'Gym & Regeneration', 'Testspiele', 'Flughafentransfer', 'Lokaler Transport']
};
export const COUNTRIES = ['DE', 'AT', 'CH', 'LI', 'LU', 'NL', 'BE', 'FR', 'DK', 'SE', 'NO', 'FI', 'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'GR', 'IT', 'ES', 'PT', 'GB', 'IE', 'TR', 'UA', 'RS', 'HR', 'SI', 'BA', 'AL', 'XK', 'KZ', 'AE', 'SA', 'QA', 'KW', 'JO', 'EG', 'US', 'CA'];

const RE_NAME = /^[\p{L}\p{M}][\p{L}\p{M} .'-]{1,79}$/u;
const RE_CLUB = /^[\p{L}\p{N}][\p{L}\p{N}\p{M} .,'&()\/+-]{1,99}$/u;
const RE_EMAIL = /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const RE_PHONE = /^\+?[0-9 ()./-]{6,25}$/;

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clip = (v, n = 2000) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, n).trim();

function monthOk(v) {
  if (v === 'flexible') return true;
  const m = /^(\d{4})-(\d{2})$/.exec(v);
  if (!m) return false;
  const idx = Number(m[1]) * 12 + Number(m[2]) - 1;
  const now = new Date();
  const cur = now.getUTCFullYear() * 12 + now.getUTCMonth();
  return Number(m[2]) >= 1 && Number(m[2]) <= 12 && idx >= cur - 1 && idx <= cur + 30;
}

export function validateOffer(d) {
  const bad = [];
  const f = {};
  f.clubName = clip(d.clubName, 100);
  if (!RE_CLUB.test(f.clubName)) bad.push('clubName');
  f.country = clip(d.country, 2).toUpperCase();
  if (!COUNTRIES.includes(f.country)) bad.push('country');
  f.teamType = clip(d.teamType, 40);
  if (!OPTIONS.teamType.includes(f.teamType)) bad.push('teamType');
  f.contactPerson = clip(d.contactPerson, 80);
  if (!RE_NAME.test(f.contactPerson) || f.contactPerson.split(/\s+/).length < 2) bad.push('contactPerson');
  f.email = clip(d.email, 254).toLowerCase();
  if (!RE_EMAIL.test(f.email)) bad.push('email');
  f.phone = clip(d.phone, 25);
  const digits = f.phone.replace(/\D/g, '');
  if (!RE_PHONE.test(f.phone) || digits.length < 7 || digits.length > 15) bad.push('phone');
  for (const k of ['players', 'staff', 'ageGroup', 'level', 'nights', 'budget', 'flexibility']) {
    f[k] = clip(d[k], 20);
    if (!OPTIONS[k].includes(f[k])) bad.push(k);
  }
  f.startMonth = clip(d.startMonth, 10);
  if (!monthOk(f.startMonth)) bad.push('startMonth');
  f.services = (Array.isArray(d.services) ? d.services : []).map((x) => clip(x, 40)).filter((x, i, a) => OPTIONS.services.includes(x) && a.indexOf(x) === i);
  f.extras = clip(d.extras, 1500);
  f.message = clip(d.message, 1500);
  if (((f.extras + f.message).match(/https?:\/\//gi) || []).length > 2) bad.push('message');
  if (d.consent !== true) bad.push('consent');
  const labels = {};
  if (d.labels && typeof d.labels === 'object') for (const k of Object.keys(d.labels).slice(0, 30)) labels[k] = clip(d.labels[k], 80);
  return { f, bad, labels, lang: d.lang === 'en' ? 'en' : 'de' };
}

export async function processOffer(raw, env) {
  let d;
  try { d = JSON.parse(raw); } catch { return { status: 400, body: { ok: false, error: 'invalid_json' } }; }
  if (clip(d.website)) return { status: 200, body: { ok: true } }; // honeypot
  const { f, bad, labels, lang } = validateOffer(d);
  if (bad.length) return { status: 400, body: { ok: false, error: 'invalid', fields: bad } };

  const apiKey = env.RESEND_API_KEY;
  const notify = env.NOTIFY_EMAIL || env.OFFER_TO_EMAIL;
  const from = env.FROM_EMAIL || env.RESEND_FROM || 'Antalya Camp <onboarding@resend.dev>';
  if (!apiKey || !notify) return { status: 500, body: { ok: false, error: 'not_configured' } };

  const site = (env.SITE_URL || 'https://trainingslager-antalya.de').replace(/\/+$/, '');
  const send = async (payload) => {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
  };

  // 1) Notification to the owner (German). Failure here fails the request.
  const owner = ownerEmail(f, site);
  try {
    await send({ from, to: notify.split(',').map((x) => x.trim()), reply_to: f.email, subject: owner.subject, html: owner.html, text: owner.text });
  } catch (e) {
    console.error('Resend notification failed', e);
    return { status: 502, body: { ok: false, error: 'send_failed' } };
  }

  // 2) Confirmation to the customer. Failure here must not fail the request.
  const customer = customerEmail(f, lang, site);
  try {
    await send({ from, to: [f.email], reply_to: notify.split(',')[0].trim(), subject: customer.subject, html: customer.html, text: customer.text });
  } catch (e) {
    console.error('Resend confirmation failed', e);
  }
  return { status: 200, body: { ok: true } };
}
