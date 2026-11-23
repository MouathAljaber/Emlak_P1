// Shared by server.js (local) and worker.js (Cloudflare). Uses only web-standard APIs.
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clip = (v, n = 2000) => String(v ?? '').slice(0, n).trim();

export async function processOffer(raw, env) {
  let d;
  try { d = JSON.parse(raw); } catch { return { status: 400, body: { ok: false, error: 'invalid_json' } }; }
  if (clip(d.website)) return { status: 200, body: { ok: true } }; // honeypot

  const f = {};
  for (const k of ['clubName', 'country', 'teamType', 'contactPerson', 'email', 'phone', 'players', 'staff', 'ageGroup', 'level', 'dates', 'nights', 'budget', 'extras', 'message']) f[k] = clip(d[k]);
  f.services = Array.isArray(d.services) ? d.services.slice(0, 20).map((x) => clip(x, 100)) : [];
  const lang = d.lang === 'en' ? 'en' : 'de';
  if (!f.clubName || !f.contactPerson || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) || d.consent !== true) {
    return { status: 400, body: { ok: false, error: 'invalid' } };
  }

  const apiKey = env.RESEND_API_KEY;
  const to = env.OFFER_TO_EMAIL;
  const from = env.RESEND_FROM || 'Antalya Camp <onboarding@resend.dev>';
  if (!apiKey || !to) return { status: 500, body: { ok: false, error: 'not_configured' } };

  const rows = [['Club', f.clubName], ['Country', f.country], ['Team type', f.teamType], ['Contact', f.contactPerson], ['Email', f.email], ['Phone', f.phone], ['Players', f.players], ['Staff', f.staff], ['Age group', f.ageGroup], ['Level', f.level], ['Dates', f.dates], ['Nights', f.nights], ['Budget', f.budget], ['Services', f.services.join(', ')], ['Extras', f.extras], ['Message', f.message], ['Language', lang]].filter(([, v]) => v);
  const html = `<h2>New training camp request</h2><table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">${rows.map(([k, v]) => `<tr><td style="border:1px solid #ddd"><b>${esc(k)}</b></td><td style="border:1px solid #ddd">${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: to.split(',').map((x) => x.trim()), reply_to: f.email, subject: `Anfrage: ${f.clubName} (${f.country || '-'})`, html, text })
    });
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text());
      return { status: 502, body: { ok: false, error: 'send_failed' } };
    }
    return { status: 200, body: { ok: true } };
  } catch (e) {
    console.error('Resend request failed', e);
    return { status: 502, body: { ok: false, error: 'send_failed' } };
  }
}
