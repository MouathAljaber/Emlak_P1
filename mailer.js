import nodemailer from 'nodemailer';

/*
 * Email delivery for enquiries.
 * Required in .env: SMTP_HOST, SMTP_FROM, ADMIN_EMAIL (comma-separate several recipients).
 * Usually also: SMTP_PORT (587 or 465), SMTP_USER, SMTP_PASSWORD.
 */

let transport;

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM && process.env.ADMIN_EMAIL);
}

function getTransport() {
  if (!mailConfigured()) return null;
  if (!transport) {
    const port = Number(process.env.SMTP_PORT || 587);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD || '' } : undefined,
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000
    });
  }
  return transport;
}

export async function verifyMail() {
  if (!mailConfigured()) {
    console.warn('Email is NOT configured: set SMTP_HOST, SMTP_FROM and ADMIN_EMAIL (plus SMTP_USER/SMTP_PASSWORD) in .env to receive applications by email.');
    return false;
  }
  try {
    await getTransport().verify();
    console.log(`Email ready: applications will be sent to ${process.env.ADMIN_EMAIL}`);
    return true;
  } catch (error) {
    console.error(`Email configuration problem (${error.code || error.message}). Check the SMTP_* values in .env.`);
    return false;
  }
}

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const show = (value) => (value === null || value === undefined || value === '' ? '—' : String(value));

const TEAM_LABELS = {
  en: { Jugendteam: 'Youth team', Amateurverein: 'Amateur club', Seniorenteam: 'Senior team', Akademie: 'Academy', Profiteam: 'Professional team' }
};
const SERVICE_LABELS = {
  en: {
    'Hotel & Zimmer': 'Hotel & rooms', Verpflegung: 'Meals', Trainingsplätze: 'Training pitches', 'Gym & Regeneration': 'Gym & recovery',
    Testspiele: 'Test matches', Flughafentransfer: 'Airport transfer', 'Lokaler Transport': 'Local transport'
  }
};

function rows(enquiry, lang) {
  const de = lang === 'de';
  const team = de ? enquiry.teamType : (TEAM_LABELS.en[enquiry.teamType] || enquiry.teamType);
  const services = enquiry.services.map((s) => (de ? s : (SERVICE_LABELS.en[s] || s))).join(', ');
  return [
    [de ? 'Verein' : 'Club', enquiry.clubName],
    [de ? 'Land' : 'Country', enquiry.country],
    [de ? 'Teamkategorie' : 'Team category', team],
    [de ? 'Ansprechpartner' : 'Contact person', enquiry.contactPerson],
    [de ? 'E-Mail' : 'Email', enquiry.email],
    [de ? 'Telefon' : 'Phone', enquiry.phone],
    [de ? 'Spieler' : 'Players', enquiry.players],
    [de ? 'Betreuer/Staff' : 'Staff', enquiry.staff],
    [de ? 'Altersgruppe' : 'Age group', enquiry.ageGroup],
    [de ? 'Spielniveau' : 'Playing level', enquiry.level],
    [de ? 'Zeitraum' : 'Dates', enquiry.dates],
    [de ? 'Nächte' : 'Nights', enquiry.nights],
    [de ? 'Budget' : 'Budget', enquiry.budget],
    [de ? 'Leistungen' : 'Services', services],
    [de ? 'Sonstige Wünsche' : 'Other requests', enquiry.extras],
    [de ? 'Nachricht' : 'Message', enquiry.message]
  ];
}

function htmlTable(list) {
  return `<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">${list.map(([label, value]) => `
    <tr><td style="padding:9px 12px;border-bottom:1px solid #e6ebe7;color:#5a6760;width:38%;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:9px 12px;border-bottom:1px solid #e6ebe7;color:#0f1c15;white-space:pre-wrap">${escapeHtml(show(value))}</td></tr>`).join('')}</table>`;
}

function layout(title, intro, body) {
  return `<!doctype html><html><body style="margin:0;background:#f1f4ef;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:620px;margin:0 auto;padding:24px">
    <div style="background:#1f6247;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;font-weight:bold;font-size:18px">Antalya<span style="color:#e3a92f">Camp</span></div>
    <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px">
      <h1 style="margin:0 0 8px;font-size:20px;color:#0f1c15">${escapeHtml(title)}</h1>
      <p style="margin:0 0 18px;color:#5a6760;font-size:14px;line-height:1.5">${intro}</p>
      ${body}
    </div>
  </div></body></html>`;
}

/** Sends the application to ADMIN_EMAIL. Throws if delivery fails. */
export async function sendAdminNotification(enquiry) {
  const list = [['Referenz', `#${enquiry.reference}`], ['Eingegangen', enquiry.receivedAt], ['Sprache der Website', enquiry.lang.toUpperCase()], ...rows(enquiry, 'de')];
  const text = list.map(([label, value]) => `${label}: ${show(value)}`).join('\n');
  await getTransport().sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    replyTo: { name: enquiry.contactPerson, address: enquiry.email },
    subject: `Neue Trainingslager-Anfrage #${enquiry.reference}: ${enquiry.clubName} (${enquiry.teamType})`,
    text: `Neue Anfrage über das Website-Formular.\nAntwortet direkt auf diese E-Mail, um ${enquiry.contactPerson} zu erreichen.\n\n${text}`,
    html: layout(
      `Neue Anfrage: ${enquiry.clubName}`,
      `Über das Website-Formular eingegangen. Antwortet direkt auf diese E-Mail, um <strong>${escapeHtml(enquiry.contactPerson)}</strong> zu erreichen.`,
      htmlTable(list)
    )
  });
}

/** Sends a confirmation copy to the applicant, in the language of the page they used. */
export async function sendConfirmation(enquiry) {
  const de = enquiry.lang === 'de';
  const title = de ? 'Danke für eure Anfrage!' : 'Thank you for your enquiry!';
  const intro = de
    ? `Wir haben eure Anfrage erhalten und melden uns innerhalb von 24 Stunden mit einem individuellen Angebot. Eure Referenznummer: <strong>#${escapeHtml(enquiry.reference)}</strong>.`
    : `We have received your enquiry and will get back to you within 24 hours with a tailored offer. Your reference: <strong>#${escapeHtml(enquiry.reference)}</strong>.`;
  const list = rows(enquiry, enquiry.lang);
  await getTransport().sendMail({
    from: process.env.SMTP_FROM,
    to: { name: enquiry.contactPerson, address: enquiry.email },
    replyTo: process.env.ADMIN_EMAIL.split(',')[0].trim(),
    subject: de ? `Eure Anfrage #${enquiry.reference} | Trainingslager Antalya` : `Your enquiry #${enquiry.reference} | Training Camp Antalya`,
    text: `${title}\n\n${intro.replace(/<[^>]+>/g, '')}\n\n${list.map(([l, v]) => `${l}: ${show(v)}`).join('\n')}`,
    html: layout(title, intro, `<p style="margin:0 0 10px;color:#0f1c15;font-size:14px;font-weight:bold">${de ? 'Eure Angaben' : 'Your details'}</p>${htmlTable(list)}`)
  });
}
