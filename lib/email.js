// Email templates (table layout + inline styles for maximum client compatibility).
const C = { brand: '#1f6247', brandDark: '#154733', night: '#0c1d15', accent: '#e3a92f', accentSoft: '#fbf1db', bg: '#eef2ee', card: '#ffffff', ink: '#0f1c15', muted: '#5a6760', line: '#e3e9e4', soft: '#f4f7f4' };
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nl2br = (v) => esc(v).replace(/\r?\n/g, '<br>');

const LABELS = {
  de: {
    teamType: { Jugendteam: 'Jugendteam', Amateurverein: 'Amateurverein', Seniorenteam: 'Seniorenteam', Akademie: 'Akademie', Profiteam: 'Profiteam' },
    players: { '1-10': '1–10', '11-15': '11–15', '16-20': '16–20', '21-25': '21–25', '26-30': '26–30', '31-40': '31–40', '41+': 'Über 40' },
    staff: { '0-2': '0–2', '3-5': '3–5', '6-10': '6–10', '11+': 'Über 10' },
    ageGroup: { 'u7-u9': 'U7–U9', 'u10-u12': 'U10–U12', 'u13-u15': 'U13–U15', 'u16-u19': 'U16–U19', senior: 'Herren / Damen', ue32: 'Ü32', ue40: 'Ü40 und älter', mixed: 'Gemischt' },
    level: { recreational: 'Hobby / Freizeit', district: 'Kreis- / Bezirksebene', regional: 'Landes- / Regionalebene', oberliga: 'Oberliga / nationale Amateurliga', semipro: 'Halbprofi', pro: 'Profi', academy: 'Nachwuchsleistungszentrum' },
    nights: { 3: '3 Nächte', 4: '4 Nächte', 5: '5 Nächte', 6: '6 Nächte', 7: '7 Nächte', '8-10': '8–10 Nächte', '11-14': '11–14 Nächte', '15+': 'Über 14 Nächte' },
    flexibility: { fixed: 'Fester Termin', 'flex-week': '± 1 Woche', flexible: 'Flexibel' },
    budget: { lt500: 'Unter 500 €', '500-800': '500–800 €', '800-1200': '800–1.200 €', '1200-1800': '1.200–1.800 €', gt1800: 'Über 1.800 €', unsure: 'Noch unsicher' },
    flexibleMonth: 'Flexibel / offen'
  },
  en: {
    teamType: { Jugendteam: 'Youth team', Amateurverein: 'Amateur club', Seniorenteam: 'Senior team', Akademie: 'Academy', Profiteam: 'Professional team' },
    players: { '1-10': '1–10', '11-15': '11–15', '16-20': '16–20', '21-25': '21–25', '26-30': '26–30', '31-40': '31–40', '41+': 'Over 40' },
    staff: { '0-2': '0–2', '3-5': '3–5', '6-10': '6–10', '11+': 'Over 10' },
    ageGroup: { 'u7-u9': 'U7–U9', 'u10-u12': 'U10–U12', 'u13-u15': 'U13–U15', 'u16-u19': 'U16–U19', senior: 'Men / Women', ue32: 'Over 32', ue40: 'Over 40', mixed: 'Mixed' },
    level: { recreational: 'Recreational', district: 'District / local league', regional: 'Regional league', oberliga: 'National amateur league', semipro: 'Semi-professional', pro: 'Professional', academy: 'Academy / elite youth' },
    nights: { 3: '3 nights', 4: '4 nights', 5: '5 nights', 6: '6 nights', 7: '7 nights', '8-10': '8–10 nights', '11-14': '11–14 nights', '15+': 'Over 14 nights' },
    flexibility: { fixed: 'Fixed date', 'flex-week': '± 1 week', flexible: 'Flexible' },
    budget: { lt500: 'Under €500', '500-800': '€500–800', '800-1200': '€800–1,200', '1200-1800': '€1,200–1,800', gt1800: 'Over €1,800', unsure: 'Not sure yet' },
    flexibleMonth: 'Flexible / open'
  }
};
const SERVICES = {
  de: { 'Hotel & Zimmer': 'Hotel & Zimmer', Verpflegung: 'Verpflegung', Trainingsplätze: 'Trainingsplätze', 'Gym & Regeneration': 'Gym & Regeneration', Testspiele: 'Testspiele', Flughafentransfer: 'Flughafentransfer', 'Lokaler Transport': 'Lokaler Transport' },
  en: { 'Hotel & Zimmer': 'Hotel & rooms', Verpflegung: 'Catering', Trainingsplätze: 'Training pitches', 'Gym & Regeneration': 'Gym & recovery', Testspiele: 'Test matches', Flughafentransfer: 'Airport transfer', 'Lokaler Transport': 'Local transport' }
};

function resolve(f, lang) {
  const L = LABELS[lang];
  let country = f.country;
  try { country = new Intl.DisplayNames([lang], { type: 'region' }).of(f.country) || f.country; } catch { /* keep code */ }
  let month = L.flexibleMonth;
  if (f.startMonth !== 'flexible') {
    try {
      const [y, m] = f.startMonth.split('-').map(Number);
      month = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'de-DE', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, 1)));
    } catch { month = f.startMonth; }
  }
  return {
    country, month,
    teamType: L.teamType[f.teamType] || f.teamType,
    players: L.players[f.players] || f.players,
    staff: L.staff[f.staff] || f.staff,
    ageGroup: L.ageGroup[f.ageGroup] || f.ageGroup,
    level: L.level[f.level] || f.level,
    nights: L.nights[f.nights] || f.nights,
    flexibility: L.flexibility[f.flexibility] || f.flexibility,
    budget: L.budget[f.budget] || f.budget,
    services: f.services.map((s) => SERVICES[lang][s] || s)
  };
}

/* ---------- building blocks ---------- */
const wrap = (preheader, inner) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background:${C.bg};font-family:${FONT};color:${C.ink}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}${'&nbsp;&zwnj;'.repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${C.card};border-radius:20px;overflow:hidden;box-shadow:0 18px 50px -20px rgba(12,29,21,.35)">${inner}</table>
</td></tr></table></body></html>`;

const header = (badge, logoUrl) => `<tr><td style="background:${C.night};background-image:linear-gradient(135deg,${C.night} 0%,${C.brandDark} 100%);padding:26px 32px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-.3px"><img src="${esc(logoUrl)}" width="40" height="40" alt="" style="display:inline-block;vertical-align:middle;margin-right:10px;border:0;outline:none;width:40px;height:40px"><span style="vertical-align:middle">Antalya<span style="color:${C.accent}">Camp</span></span></td>
<td align="right"><span style="display:inline-block;padding:7px 14px;border-radius:999px;background:${C.accent};color:${C.night};font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase">${esc(badge)}</span></td>
</tr></table></td></tr>
<tr><td style="height:4px;line-height:4px;font-size:0;background:${C.accent};background-image:linear-gradient(90deg,${C.accent},#f3d27a,${C.accent})">&nbsp;</td></tr>`;

const stat = (value, label) => `<td width="33%" align="center" style="padding:16px 6px;background:${C.soft};border-radius:14px"><div style="font-size:20px;font-weight:800;color:${C.brand};line-height:1.2">${esc(value)}</div><div style="margin-top:4px;font-size:11px;letter-spacing:.8px;text-transform:uppercase;color:${C.muted}">${esc(label)}</div></td>`;
const stats = (items) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="6" style="margin:22px -6px 0;width:calc(100% + 12px)"><tr>${items.map(([v, l]) => stat(v, l)).join('')}</tr></table>`;

const section = (title) => `<div style="margin:30px 0 10px;font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:${C.brand}">${esc(title)}</div>`;
const rows = (list) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14.5px">${list.filter(([, v]) => v).map(([k, v], i, a) => `<tr><td style="padding:11px 0;${i < a.length - 1 ? `border-bottom:1px solid ${C.line};` : ''}color:${C.muted};width:42%">${esc(k)}</td><td align="right" style="padding:11px 0;${i < a.length - 1 ? `border-bottom:1px solid ${C.line};` : ''}font-weight:650;color:${C.ink}">${v.__html ? v.__html : esc(v)}</td></tr>`).join('')}</table>`;
const html = (s) => ({ __html: s });
const pills = (list) => list.map((s) => `<span style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border-radius:999px;background:${C.accentSoft};border:1px solid #f1d9a0;color:#7a5a0e;font-size:13px;font-weight:650">${esc(s)}</span>`).join('');
const quote = (text) => `<div style="margin-top:10px;padding:18px 20px;border-left:4px solid ${C.accent};background:${C.soft};border-radius:0 12px 12px 0;font-size:14.5px;line-height:1.6;color:${C.ink}">${nl2br(text)}</div>`;
const button = (href, label, primary) => `<a href="${esc(href)}" style="display:inline-block;padding:14px 24px;border-radius:999px;font-size:14px;font-weight:750;text-decoration:none;${primary ? `background:${C.brand};color:#ffffff;` : `background:#ffffff;color:${C.brand};border:2px solid ${C.brand};padding:12px 22px;`}">${esc(label)}</a>`;
const footer = (lines) => `<tr><td style="padding:22px 32px;background:${C.soft};border-top:1px solid ${C.line};text-align:center;font-size:12px;line-height:1.7;color:${C.muted}">${lines.join('<br>')}</td></tr>`;

/* ---------- owner (German) ---------- */
export function ownerEmail(f, site, assetOrigin) {
  const logoUrl = `${(assetOrigin || site).replace(/\/+$/, '')}/logo.png`;
  const r = resolve(f, 'de');
  const first = f.contactPerson.split(/\s+/)[0];
  const replySubject = encodeURIComponent(`Ihr Trainingslager in Antalya – ${f.clubName}`);
  const tel = f.phone.replace(/[^\d+]/g, '');
  const inner = `${header('Neue Anfrage', logoUrl)}
<tr><td style="padding:32px 32px 8px">
<div style="font-size:13px;color:${C.muted}">${esc(r.teamType)} · ${esc(r.country)}</div>
<div style="margin-top:4px;font-size:28px;font-weight:800;letter-spacing:-.6px;line-height:1.15;color:${C.ink}">${esc(f.clubName)}</div>
<div style="margin-top:6px;font-size:15px;color:${C.muted}">Kontakt: <b style="color:${C.ink}">${esc(f.contactPerson)}</b></div>
${stats([[r.players, 'Spieler'], [r.nights, 'Dauer'], [r.budget, 'Budget p. P.']])}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px"><tr>
<td style="padding-right:10px">${button(`mailto:${f.email}?subject=${replySubject}`, `Antwort an ${first}`, true)}</td>
<td>${button(`tel:${tel}`, 'Anrufen', false)}</td></tr></table>
${section('Kontakt')}${rows([['Name', f.contactPerson], ['E-Mail', html(`<a href="mailto:${esc(f.email)}" style="color:${C.brand};text-decoration:none">${esc(f.email)}</a>`)], ['Telefon', html(`<a href="tel:${esc(tel)}" style="color:${C.brand};text-decoration:none">${esc(f.phone)}</a>`)]])}
${section('Gruppe')}${rows([['Mannschaft', r.teamType], ['Altersklasse', r.ageGroup], ['Spielniveau', r.level], ['Spieler', r.players], ['Betreuer', r.staff]])}
${section('Reise')}${rows([['Startmonat', r.month], ['Flexibilität', r.flexibility], ['Dauer', r.nights], ['Budget pro Person', r.budget]])}
${r.services.length ? `${section('Gewünschte Leistungen')}<div>${pills(r.services)}</div>` : ''}
${f.extras ? `${section('Sonderwünsche')}${quote(f.extras)}` : ''}
${f.message ? `${section('Nachricht')}${quote(f.message)}` : ''}
<div style="height:30px;line-height:30px">&nbsp;</div>
</td></tr>
${footer([`Automatisch erstellt über ${esc(site.replace(/^https?:\/\//, ''))}`, 'Mit „Antworten“ geht eure Nachricht direkt an den Kunden.'])}`;
  const text = [`NEUE ANFRAGE – ${f.clubName}`, `${r.teamType} · ${r.country}`, '', `Kontakt: ${f.contactPerson}`, `E-Mail: ${f.email}`, `Telefon: ${f.phone}`, '', `Spieler: ${r.players} | Betreuer: ${r.staff}`, `Altersklasse: ${r.ageGroup} | Niveau: ${r.level}`, `Start: ${r.month} (${r.flexibility}) | Dauer: ${r.nights}`, `Budget p. P.: ${r.budget}`, `Leistungen: ${r.services.join(', ') || '-'}`, f.extras && `Sonderwünsche: ${f.extras}`, f.message && `Nachricht: ${f.message}`].filter((x) => x !== '' ? x !== false && x !== undefined : true).join('\n');
  return { subject: `Neue Anfrage: ${f.clubName} · ${r.players} Spieler · ${r.month}`, html: wrap(`${f.clubName} – ${r.players} Spieler, ${r.nights}, ${r.month}`, inner), text };
}

/* ---------- customer confirmation (DE / EN) ---------- */
export function customerEmail(f, lang, site, assetOrigin) {
  const logoUrl = `${(assetOrigin || site).replace(/\/+$/, '')}/logo.png`;
  const r = resolve(f, lang);
  const de = lang === 'de';
  const first = f.contactPerson.split(/\s+/)[0];
  const T = de
    ? { badge: 'Bestätigung', h: `Danke, ${first}!`, p: 'Eure Anfrage ist bei uns eingegangen. Wir prüfen alle Angaben persönlich und melden uns in der Regel innerhalb von 24 Stunden mit einer ersten Einschätzung.', next: 'So geht es weiter', s1: ['Anfrage erhalten', 'Eure Angaben liegen uns vor.'], s2: ['Persönliche Prüfung', 'Wir klären Hotel, Plätze, Testspiele und Transfers.'], s3: ['Euer Angebot', 'Ihr erhaltet Leistungen, Preise und Bedingungen schriftlich.'], summary: 'Eure Angaben im Überblick', club: 'Verein', team: 'Mannschaft', group: 'Gruppe', trip: 'Reise', budget: 'Budget p. P.', services: 'Gewünschte Leistungen', msg: 'Eure Nachricht', visit: 'Website besuchen', foot1: 'Diese E-Mail wurde automatisch versendet, weil über unsere Website eine Anfrage mit dieser Adresse gestellt wurde.', foot2: 'Ihr habt nichts angefragt? Dann könnt ihr diese Nachricht ignorieren.', subject: 'Eure Trainingslager-Anfrage ist eingegangen', players: 'Spieler', staff: 'Betreuer', start: 'Start' }
    : { badge: 'Confirmation', h: `Thank you, ${first}!`, p: 'Your request has reached us. We review every detail personally and usually reply within 24 hours with a first assessment.', next: 'What happens next', s1: ['Request received', 'We have your details.'], s2: ['Personal review', 'We check hotel, pitches, test matches and transfers.'], s3: ['Your offer', 'You receive services, prices and terms in writing.'], summary: 'Your details at a glance', club: 'Club', team: 'Team', group: 'Group', trip: 'Trip', budget: 'Budget p.p.', services: 'Requested services', msg: 'Your message', visit: 'Visit website', foot1: 'This email was sent automatically because a request was made on our website with this address.', foot2: 'Did not request anything? You can safely ignore this message.', subject: 'We received your training camp request', players: 'Players', staff: 'Staff', start: 'Start' };
  const step = (n, [t, d], last) => `<tr><td width="44" valign="top" style="padding-bottom:${last ? 0 : 18}px"><div style="width:32px;height:32px;line-height:32px;text-align:center;border-radius:50%;background:${n === 1 ? C.brand : C.accent};color:${n === 1 ? '#fff' : C.night};font-weight:800;font-size:14px">${n === 1 ? '✓' : n}</div></td><td style="padding-bottom:${last ? 0 : 18}px"><div style="font-weight:750;font-size:15px;color:${C.ink}">${esc(t)}</div><div style="font-size:13.5px;color:${C.muted};margin-top:2px">${esc(d)}</div></td></tr>`;
  const inner = `${header(T.badge, logoUrl)}
<tr><td style="padding:34px 32px 8px">
<div style="font-size:30px;font-weight:800;letter-spacing:-.7px;line-height:1.15;color:${C.ink}">${esc(T.h)}</div>
<div style="margin-top:12px;font-size:15.5px;line-height:1.65;color:${C.muted}">${esc(T.p)}</div>
${section(T.next)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${step(1, T.s1)}${step(2, T.s2)}${step(3, T.s3, true)}</table>
<div style="margin-top:34px;padding:22px 22px 8px;border:1px solid ${C.line};border-radius:16px;background:#fcfdfc">
<div style="font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:${C.brand};margin-bottom:6px">${esc(T.summary)}</div>
${rows([[T.club, `${f.clubName}`], [T.team, `${r.teamType} · ${r.ageGroup}`], [T.group, `${r.players} ${T.players} · ${r.staff} ${T.staff}`], [T.trip, `${r.month} · ${r.nights}`], [T.budget, r.budget]])}
${r.services.length ? `<div style="margin-top:16px;font-size:12px;color:${C.muted};margin-bottom:8px">${esc(T.services)}</div><div>${pills(r.services)}</div>` : '<div style="height:10px">&nbsp;</div>'}
</div>
${f.message ? `${section(T.msg)}${quote(f.message)}` : ''}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:30px 0 8px"><tr><td>${button(site, T.visit, true)}</td></tr></table>
</td></tr>
${footer([esc(T.foot1), esc(T.foot2), `<a href="${esc(site)}" style="color:${C.brand};text-decoration:none">${esc(site.replace(/^https?:\/\//, ''))}</a>`])}`;
  const text = [T.h, T.p, '', `${T.club}: ${f.clubName}`, `${T.team}: ${r.teamType} · ${r.ageGroup}`, `${T.group}: ${r.players} ${T.players} · ${r.staff} ${T.staff}`, `${T.trip}: ${r.month} · ${r.nights}`, `${T.budget}: ${r.budget}`, `${T.services}: ${r.services.join(', ') || '-'}`, f.message && `${T.msg}: ${f.message}`, '', site].filter((x) => x !== false && x !== undefined).join('\n');
  return { subject: T.subject, html: wrap(T.p.slice(0, 110), inner), text };
}
