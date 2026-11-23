#!/usr/bin/env node
/*
 * Static site build.
 *  - Generates /index.html (DE) and /en/index.html (EN) from src/home.template.html + src/{de,en}.json
 *  - Applies the shared header and footer to every content page (between <!-- site-header --> markers)
 *  - Generates 404.html
 * Run with: npm run build
 */
import { readFile, writeFile, readdir, stat, access, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GUIDES, CLIMATE, EXTRA_FAQ } from './guides.mjs';
import { OPTIONS, COUNTRIES } from '../lib/offer.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://trainingslager-antalya.de').replace(/\/+$/, '');
const HERO_IMAGE = 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&amp;fit=crop&amp;q=75';
const FONT_LINKS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">';

const LOGO = '<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#1f6247"/><path d="M8.5 15a13.5 13.5 0 0 1 23 0" stroke="#e3a92f" stroke-width="2.6" stroke-linecap="round"/><path d="m20 13 4.2 3.1v5.2L20 24.4l-4.2-3.1v-5.2L20 13Z" fill="#fff"/><path d="m15.8 16.6-4.3 2m12.7-2 4.3 2M20 24.4v5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>';
const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ICON_CHECK_CIRCLE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8 12 2.5 2.5L16 9"/></svg>';

const UI = {
  de: {
    skip: 'Zum Inhalt springen', navLabel: 'Hauptnavigation', langLabel: 'Sprache wählen', menuOpen: 'Menü öffnen', menuClose: 'Menü schließen',
    cta: 'Angebot anfragen', home: 'Startseite', teams: 'Teams', services: 'Leistungen', howItWorks: 'Ablauf', faq: 'FAQ', about: 'Über uns', contact: 'Kontakt',
    references: 'Referenzen', imprint: 'Impressum', privacy: 'Datenschutz', cookies: 'Cookies', legal: 'Rechtliches',
    youth: 'Jugendteams', amateur: 'Amateurvereine', senior: 'Seniorenteams', academies: 'Akademien', pro: 'Profiteams',
    tagline: 'Trainingslager für Fußballvereine und -teams in Antalya, Türkei.',
    sister: 'Sucht ihr ein Familien- oder Jugendcamp statt Vereinstraining?',
    guides: 'Ratgeber', related: 'Weiterführende Seiten', climateTitle: 'Antalya im Jahresverlauf', steps: 'So läuft eure Anfrage ab', facts: 'Auf einen Blick', moreFaq: 'Weitere Fragen und Antworten', updated: 'Stand', rights: 'Alle Rechte vorbehalten.', brandName: 'Trainingslager Antalya',
    notFoundTitle: 'Seite nicht gefunden', notFoundText: 'Die gewünschte Seite ist nicht verfügbar oder wurde verschoben. Hier geht es weiter:'
  },
  en: {
    skip: 'Skip to content', navLabel: 'Main navigation', langLabel: 'Choose language', menuOpen: 'Open menu', menuClose: 'Close menu',
    cta: 'Request an offer', home: 'Home', teams: 'Teams', services: 'Services', howItWorks: 'How it works', faq: 'FAQ', about: 'About us', contact: 'Contact',
    references: 'References', imprint: 'Imprint', privacy: 'Privacy policy', cookies: 'Cookies', legal: 'Legal',
    youth: 'Youth teams', amateur: 'Amateur clubs', senior: 'Senior teams', academies: 'Academies', pro: 'Professional teams',
    tagline: 'Football training camps for clubs and teams in Antalya, Turkey.',
    sister: 'Looking for a family or youth camp instead of club training?',
    guides: 'Guides', related: 'Related pages', climateTitle: 'Antalya through the year', steps: 'How your enquiry works', facts: 'At a glance', moreFaq: 'More questions and answers', updated: 'Updated', rights: 'All rights reserved.', brandName: 'Training Camp Antalya',
    notFoundTitle: 'Page not found', notFoundText: 'The page you are looking for does not exist or has moved. Continue here:'
  }
};


/* ---------- illustrations (inline SVG, animated with SMIL/CSS) ---------- */

const SHORT = { belek: ['Trainingslager Belek', 'Belek camp'], spain: ['Türkei oder Spanien?', 'Turkey or Spain?'], climate: ['Klima & Reisezeit', 'Climate & timing'], nutrition: ['Ernährung', 'Nutrition'], schedule: ['Tagesablauf', 'Daily schedule'], safety: ['Reiseunterlagen', 'Travel documents'] };

const ART = {
  stadium: `<svg viewBox="0 0 420 320" class="art" role="img" aria-label="Football pitch under floodlights"><defs><linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f8a63"/><stop offset="1" stop-color="#1f6247"/></linearGradient><radialGradient id="gL" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".85"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>
<g class="art-lights"><path d="M62 40 20 250h150z" fill="url(#gL)"/><path d="M358 40l42 210H250z" fill="url(#gL)"/></g>
<rect x="55" y="34" width="14" height="190" rx="3" fill="#0c1d15"/><rect x="351" y="34" width="14" height="190" rx="3" fill="#0c1d15"/>
<rect x="40" y="22" width="44" height="16" rx="4" fill="#e3a92f"/><rect x="336" y="22" width="44" height="16" rx="4" fill="#e3a92f"/>
<path d="M30 250h360l26 50H4z" fill="url(#gA)"/>
<g fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="2" class="art-lines"><path d="M30 250h360l26 50H4z" pathLength="1"/><path d="M210 250v50" pathLength="1"/><ellipse cx="210" cy="275" rx="38" ry="12" pathLength="1"/></g>
<g class="art-ball"><ellipse cx="210" cy="292" rx="12" ry="3" fill="#0c1d15" opacity=".25"/><g><circle cx="210" cy="270" r="11" fill="#fff" stroke="#0c1d15" stroke-width="1.6"/><path d="m210 263 5 4-2 6h-6l-2-6z" fill="#0c1d15"/><animateTransform attributeName="transform" type="translate" values="0 0;0 -70;0 0" keyTimes="0;.5;1" dur="2.4s" repeatCount="indefinite" calcMode="spline" keySplines=".33 0 .67 1;.33 0 .67 1"/></g></g></svg>`,
  route: `<svg viewBox="0 0 420 320" class="art" role="img" aria-label="Flight route to Antalya"><defs><linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a9bd0" stop-opacity=".35"/><stop offset="1" stop-color="#1f6247" stop-opacity=".35"/></linearGradient></defs>
<circle cx="330" cy="70" r="34" fill="#e3a92f" class="art-sun"/><g class="art-rays" stroke="#e3a92f" stroke-width="3" stroke-linecap="round"><path d="M330 16v14M330 110v14M276 70h14M370 70h14M292 32l10 10M358 98l10 10M368 32l-10 10M302 98l-10 10"/></g>
<path d="M0 250c60-14 110 10 170-4s120-22 250 6v68H0z" fill="url(#gS)"/><path d="M0 268c70-12 120 8 180-4s120-14 240 4" fill="none" stroke="#3a9bd0" stroke-opacity=".6" stroke-width="2" class="art-wave"/>
<path id="flight" d="M40 230C110 90 250 70 360 190" fill="none" stroke="#1f6247" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round" class="art-path"/>
<g class="art-pin"><circle cx="40" cy="230" r="8" fill="#1f6247"/><circle cx="40" cy="230" r="16" fill="none" stroke="#1f6247" stroke-opacity=".5"/><path d="M360 160c-14 0-22 10-22 22 0 16 22 38 22 38s22-22 22-38c0-12-8-22-22-22z" fill="#e3a92f"/><circle cx="360" cy="182" r="8" fill="#fff"/></g>
<g><path d="M-16 0 4-4l14-20h6l-6 18 12-1 4-8h4l-2 12 2 12h-4l-4-8-12-1 6 18h-6L4 4z" transform="scale(1.1)" fill="#0c1d15"/><animateMotion dur="6s" repeatCount="indefinite" rotate="auto"><mpath href="#flight"/></animateMotion></g></svg>`,
  tactical: `<svg viewBox="0 0 420 320" class="art" role="img" aria-label="Tactical board"><rect x="20" y="20" width="380" height="280" rx="14" fill="#1f6247"/><g fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2" class="art-lines"><rect x="36" y="36" width="348" height="248" rx="6" pathLength="1"/><path d="M210 36v248" pathLength="1"/><circle cx="210" cy="160" r="40" pathLength="1"/><rect x="36" y="100" width="56" height="120" pathLength="1"/><rect x="328" y="100" width="56" height="120" pathLength="1"/></g>
<path id="pass" d="M80 160 140 90 220 190 300 110 350 160" fill="none" stroke="#e3a92f" stroke-width="3" stroke-dasharray="4 8" stroke-linecap="round" class="art-path"/>
<g class="art-players"><circle cx="80" cy="160" r="9" fill="#fff"/><circle cx="140" cy="90" r="9" fill="#fff"/><circle cx="220" cy="190" r="9" fill="#fff"/><circle cx="300" cy="110" r="9" fill="#fff"/><circle cx="350" cy="160" r="9" fill="#e3a92f"/><circle cx="180" cy="120" r="8" fill="#0c1d15"/><circle cx="260" cy="150" r="8" fill="#0c1d15"/></g>
<g><circle r="7" fill="#fff" stroke="#0c1d15" stroke-width="1.6"/><animateMotion dur="4.8s" repeatCount="indefinite"><mpath href="#pass"/></animateMotion></g></svg>`
};

/* ---------- shared layout ---------- */

function langSwitch(ui, prefix, dePath, enPath) {
  const isEn = prefix === '/en';
  return `<div class="lang-switch" role="group" aria-label="${ui.langLabel}"><a href="${dePath}" hreflang="de" lang="de"${isEn ? '' : ' aria-current="true"'}>DE</a><a href="${enPath}" hreflang="en" lang="en"${isEn ? ' aria-current="true"' : ''}>EN</a></div>`;
}

function pageHeader(lang, prefix, dePath, enPath) {
  const ui = UI[lang];
  const links = [
    [`${prefix}/services/`, ui.services], [`${prefix}/how-it-works/`, ui.howItWorks],
    [`${prefix}/faq/`, ui.faq], [`${prefix}/about-us/`, ui.about], [`${prefix}/contact/`, ui.contact]
  ];
  return `<!-- site-header -->
<a class="skip-link" href="#main">${ui.skip}</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${prefix}/" aria-label="Antalya Camp">${LOGO}<span>Antalya<b>Camp</b></span></a>
    <nav class="main-nav" aria-label="${ui.navLabel}">${links.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}</nav>
    <div class="header-actions">
      ${langSwitch(ui, prefix, dePath, enPath)}
      <a class="btn btn-primary btn-sm" href="${prefix}/#anfrage">${ui.cta}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="${ui.menuOpen}" data-label-close="${ui.menuClose}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    </div>
  </div>
  <div class="mobile-nav" id="mobile-nav" hidden>
    <div class="wrap">
      <ul>${links.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul>
      <div class="mobile-nav-actions">${langSwitch(ui, prefix, dePath, enPath)}<a class="btn btn-primary btn-sm" href="${prefix}/#anfrage">${ui.cta}</a></div>
    </div>
  </div>
</header>
<!-- /site-header -->`;
}

function pageFooter(lang, prefix) {
  const ui = UI[lang];
  const col = (title, items) => `<div class="footer-col"><h4>${title}</h4><ul>${items.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul></div>`;
  return `<!-- site-footer -->
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="${prefix}/" aria-label="Antalya Camp">${LOGO}<span>Antalya<b>Camp</b></span></a>
        <p>${ui.tagline}</p>
        <div class="footer-sister"><span>${ui.sister}</span><a href="https://fussballcamp-antalya.de" target="_blank" rel="noopener">fussballcamp-antalya.de →</a></div>
      </div>
      ${col('Antalya Camp', [[`${prefix}/about-us/`, ui.about], [`${prefix}/services/`, ui.services], [`${prefix}/how-it-works/`, ui.howItWorks], [`${prefix}/references/`, ui.references], [`${prefix}/faq/`, ui.faq], [`${prefix}/contact/`, ui.contact]])}
      ${col(ui.guides, GUIDES.map((g) => [`${prefix}/${g[lang].slug}/`, SHORT[g.id][lang === 'de' ? 0 : 1]]))}
      ${col(ui.legal, [[`${prefix}/imprint/`, ui.imprint], [`${prefix}/privacy-policy/`, ui.privacy], [`${prefix}/cookie-policy/`, ui.cookies]])}
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> ${ui.brandName}. ${ui.rights}</span>
    </div>
  </div>
</footer>
<!-- /site-footer -->`;
}

/* ---------- homepage ---------- */

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
}

function render(template, dict, vars) {
  let html = template.replace(/\{\{([\w.@-]+)\}\}/g, (match, key) => {
    if (key.startsWith('@')) {
      const name = key.slice(1);
      if (!(name in vars)) throw new Error(`Missing variable ${key}`);
      return vars[name];
    }
    if (!(key in dict)) throw new Error(`Missing translation "${key}"`);
    return dict[key];
  });
  // Translations themselves may contain {{@prefix}}
  html = html.replace(/\{\{@prefix\}\}/g, vars.prefix);
  return html;
}

async function buildHome() {
  const template = await readFile(path.join(root, 'src/home.template.html'), 'utf8');
  for (const lang of ['de', 'en']) {
    const dict = JSON.parse(await readFile(path.join(root, `src/${lang}.json`), 'utf8'));
    const prefix = lang === 'en' ? '/en' : '';
    const canonical = `${SITE_URL}${prefix}/`;
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: 'Antalya Camp', url: `${SITE_URL}/`, logo: `${SITE_URL}/favicon.svg` },
        { '@type': 'Service', name: 'Antalya Camp', url: canonical, description: dict['meta.description'], serviceType: lang === 'de' ? 'Fußball-Trainingslager' : 'Football training camp', areaServed: ['DE', 'AT', 'CH'], provider: { '@id': `${SITE_URL}/#org` }, inLanguage: lang },
        { '@type': 'FAQPage', inLanguage: lang, mainEntity: [1, 2, 3, 4].map((n) => ({ '@type': 'Question', name: stripTags(dict[`faq.${n}.q`]), acceptedAnswer: { '@type': 'Answer', text: stripTags(dict[`faq.${n}.a`]) } })) }
      ]
    };
    const clientKeys = Object.keys(dict).filter((key) => /^(summary\.|btn\.|errors\.|progress$|form\.|success\.ref$)/.test(key));
    let heroVideo = '';
    try {
      await access(path.join(root, 'media/hero.mp4'));
      heroVideo = '<video class="hero-video" autoplay muted loop playsinline preload="metadata" aria-hidden="true"><source src="/media/hero.mp4" type="video/mp4"></video>';
    } catch { /* no video supplied */ }
    const marqueeItems = [dict['marquee.1'], dict['marquee.2'], dict['marquee.3'], dict['marquee.4'], dict['marquee.5'], dict['marquee.6']];
    const marquee = marqueeItems.map((x) => `<span>${x}</span>`).join('');
    const optHtml = (group) => OPTIONS[group].map((v) => `<option value="${v}">${dict[`o.${group}.${v}`]}</option>`).join('');
    const regionNames = new Intl.DisplayNames([lang], { type: 'region' });
    const optCountry = COUNTRIES.map((c) => ({ c, n: regionNames.of(c) })).sort((x, y) => x.n.localeCompare(y.n, lang)).map(({ c, n }) => `<option value="${c}">${n}</option>`).join('');
    const vars = {
      optCountry, optPlayers: optHtml('players'), optStaff: optHtml('staff'), optAgeGroup: optHtml('ageGroup'), optLevel: optHtml('level'), optFlexibility: optHtml('flexibility'), optNights: optHtml('nights'), optBudget: optHtml('budget'),
      heroVideo, marquee,
      lang, prefix, canonical, siteUrl: SITE_URL, heroImage: HERO_IMAGE,
      deCurrent: lang === 'de' ? 'aria-current="true"' : '',
      enCurrent: lang === 'en' ? 'aria-current="true"' : '',
      logo: LOGO, iconCheck: ICON_CHECK, iconCheckCircle: ICON_CHECK_CIRCLE,
      footer: pageFooter(lang, prefix),
      jsonLd: escapeJson(jsonLd),
      i18nJson: escapeJson(Object.fromEntries(clientKeys.map((key) => [key, dict[key]])))
    };
    const out = render(template, dict, vars);
    await writeFile(path.join(root, lang === 'en' ? 'en/index.html' : 'index.html'), out);
    console.log(`built ${lang === 'en' ? 'en/index.html' : 'index.html'}`);
  }
}

/* ---------- content pages ---------- */

async function listContentPages() {
  const pages = [];
  for (const base of ['', 'en']) {
    const dir = path.join(root, base);
    for (const name of await readdir(dir)) {
      if (['en', 'node_modules', 'src', 'scripts', '.git', 'antalya-camp-landing'].includes(name) && base === '') continue;
      const file = path.join(dir, name, 'index.html');
      try {
        if ((await stat(file)).isFile()) pages.push({ file, prefix: base ? '/en' : '', slug: name });
      } catch { /* not a page directory */ }
    }
  }
  return pages;
}

function upgradeLegacy(html, prefix) {
  // Remove old animation/stylesheet references and the legacy top bar.
  html = html
    .replace(/<link rel="stylesheet" href="\/motion\.css">/g, '')
    .replace(/<link rel="stylesheet" href="\/seo-pages\.css">/g, `${FONT_LINKS}<link rel="stylesheet" href="/site.css">`)
    .replace(/<script src="\/motion\.js" defer><\/script>/g, '<script src="/site-config.js"></script><script src="/site.js" defer></script>')
    .replace(/<meta name="theme-color" content="#2F6D4F">/g, '<meta name="theme-color" content="#0c1d15">');
  if (!html.includes('<!-- site-header -->')) {
    html = html.replace(/<body>[\s\S]*?<\/nav>/, '<body><!-- site-header --><!-- /site-header -->');
  }
  if (!html.includes('<!-- site-footer -->')) {
    html = html.replace(/<footer class="footer">[\s\S]*?<\/footer>/, '<!-- site-footer --><!-- /site-footer -->');
  }
  html = html
    .replace('<header class="hero">', '<section class="page-hero">')
    .replace(/(<section class="page-hero">[\s\S]*?)<\/header>/, '$1</section>')
    .replace('<main id="main" class="main">', '<main id="main" class="page-main">')
    .replace(/<section class="cta">([\s\S]*?)<\/section>/g, '<div class="cta">$1</div>');
  // Move the page hero inside <main> so the skip link lands on the page title.
  const heroOutsideMain = /(<section class="page-hero">[\s\S]*?<\/section>)\s*<main id="main" class="page-main">/;
  if (heroOutsideMain.test(html)) {
    html = html.replace(heroOutsideMain, '<main id="main">$1<div class="page-main">').replace(/<\/main>(?![\s\S]*<\/main>)/, '</div></main>');
  }
  // Fix broken links in the English section.
  if (prefix === '/en') {
    html = html.replace(/href="\/en\/en\/"/g, 'href="/en/"').replace(/href="\/#anfrage"/g, 'href="/en/#anfrage"');
  }
  return html;
}

function contentTopic(lang, slug) {
  const de = lang === 'de';
  const team = /youth|jugend|amateur|senior|academy|akademie|professional|profi|clubs|vereins|team/.test(slug);
  const planning = /plan|cost|kosten|checkliste|best-time|winter|preseason|saison|europe|europa|turkey|tuerkei/.test(slug);
  const facilities = /pitch|platz|hotel|transfer|airport|recovery|regeneration|test-match|testspiele/.test(slug);

  if (team) return de ? {
    eyebrow: 'Vorbereitung nach Mannschaftstyp',
    lead: 'Der richtige Wochenplan hängt von Alter, Leistungsniveau, Mannschaftsgröße und sportlichem Ziel ab. Beschreibt diese Eckdaten vor der Anfrage, damit Hotel, Trainingseinheiten, Platzkapazität und Spielpraxis aufeinander abgestimmt werden.',
    sections: [
      ['Sportliches Ziel definieren', 'Leistungsstand, gewünschte Belastung, taktische Schwerpunkte und freie Tage geben die Reihenfolge der Trainingseinheiten vor.'],
      ['Kader und Betreuer planen', 'Legt Spielerzahl, Begleitpersonal, Zimmerbelegung und separate Räumlichkeiten fest, bevor ein konkretes Angebot angefragt wird.'],
      ['Wochenplan realistisch gestalten', 'Kombiniert Belastung und Regeneration mit An- und Abreise, Flugzeiten und einem oder mehreren Testspielen.'],
      ['Unterkunft passend auswählen', 'Wichtig sind kurze Wege, Ruhezonen, Verpflegungszeiten und die Möglichkeit, Gruppen oder Einheiten getrennt zu organisieren.'],
      ['Spielpraxis abstimmen', 'Für Testspiele sollten Altersklasse, Spielniveau, Termin, Platz und gewünschter Spielmodus schriftlich festgehalten werden.'],
      ['Anfrage mit Daten vorbereiten', 'Teamtyp, Zeitraum, Spieler, Staff, Verpflegung, Transferbedarf und Budgetrahmen ermöglichen eine konkrete erste Einschätzung.']
    ],
    faq: [
      ['Welche Angaben benötigt ihr für ein Angebot?', 'Nennt Teamtyp, Altersklasse, Leistungsniveau, Reisezeitraum, Teilnehmerzahl, gewünschte Leistungen und euren Budgetrahmen.'],
      ['Kann die Woche nach meinem Trainingsplan aufgebaut werden?', 'Der Trainingsinhalt bleibt Sache des Vereins. Wir können Unterkunft, Platzzeiten, Transfers und Testspieloptionen in den gewünschten Ablauf einbinden.'],
      ['Wie früh sollte angefragt werden?', 'Frühe Anfragen verbessern die Auswahl bei beliebten Trainingszeiten, Hotels und Spielpartnern. Ein flexibler Zeitraum schafft zusätzliche Optionen.']
    ]
  } : {
    eyebrow: 'Preparation by team profile',
    lead: 'A suitable camp plan depends on age, playing level, squad size and sporting objectives. Share these basics before requesting an offer so accommodation, pitch time, training sessions and match preparation can work as one schedule.',
    sections: [
      ['Define the sporting goal', 'Current performance, desired workload, tactical priorities and rest periods determine the sequence of training sessions.'],
      ['Plan players and staff', 'Confirm squad size, accompanying staff, room allocation and any separate meeting or recovery spaces before requesting availability.'],
      ['Build a realistic week', 'Balance training and recovery with arrival, flight times and one or more test matches where appropriate.'],
      ['Choose suitable accommodation', 'Short travel distances, quiet rest areas, meal times and separate areas for groups or units are key considerations.'],
      ['Align match opponents', 'For test matches, record age group, playing level, date, venue and preferred match format to request a suitable opponent.'],
      ['Prepare a complete enquiry', 'Team type, travel dates, player and staff numbers, catering, transfers and budget help us prepare a useful first response.']
    ],
    faq: [
      ['What information is needed for an offer?', 'Please share team type, age group, level, dates, participant numbers, required services and your indicative budget.'],
      ['Can the schedule follow our coaching plan?', 'Your coaching team remains responsible for the sessions. We can coordinate accommodation, pitch slots, transfers and match options around that plan.'],
      ['How early should we enquire?', 'An early enquiry improves availability around popular travel periods. Flexible dates usually offer more accommodation and pitch options.']
    ]
  };

  if (facilities) return de ? {
    eyebrow: 'Anlage, Hotel und Logistik',
    lead: 'Ein gutes Trainingslager entsteht nicht durch eine einzelne Leistung, sondern durch kurze Wege und einen verlässlichen Ablauf. Prüft deshalb Gelände, Zimmer, Verpflegung, Platzqualität und Transport gemeinsam statt isoliert.',
    sections: [
      ['Die richtige Platzqualität prüfen', 'Beschreibt Flächentyp, gewünschte Nutzung, Beleuchtung, Umkleiden und mögliche Belastung. Verbindliche Informationen sollten vor der Buchung schriftlich bestätigt werden.'],
      ['Hotel und Trainingsort kombinieren', 'Kurze Wege sparen Tageszeit und reduzieren Transferrisiken. Beachtet außerdem Mahlzeiten, Ruhezeiten und Platz für Teambesprechungen.'],
      ['Transfers als Tagesablauf planen', 'Flughafentransfer, Platztransporte und Fahrt zu Testspielen sollten zeitlich auf Einheiten, Mahlzeiten und Vereinsabende abgestimmt sein.'],
      ['Verpflegung abstimmen', 'Nennt Ernährungsanforderungen, Essenszeiten, Allergien und Teamgröße. Die Verfügbarkeit einzelner Optionen wird je nach Hotel bestätigt.'],
      ['Regeneration einplanen', 'Gym, Pool oder physikalische Angebote können ergänzend geplant werden. Die konkrete Verfügbarkeit hängt von Hotel und Leistungsniveau ab.'],
      ['Angebote vergleichen', 'Vergleicht nicht nur den Gesamtpreis, sondern auch enthaltene Leistungen, Abreisezeiten, Umbuchungsbedingungen und Zusatzkosten.']
    ],
    faq: [
      ['Sind bestimmte Plätze oder Hotels garantiert?', 'Verfügbarkeit und konkrete Bezeichnungen werden erst nach Terminanfrage und schriftlicher Bestätigung verbindlich.'],
      ['Was gehört in einen guten Wochenablauf?', 'Erwartete Transferzeiten, Mahlzeiten, Platzzeiten, Regeneration und Testspiele sollten alle vorab in einem Tagesplan sichtbar sein.'],
      ['Welche Zusatzkosten können entstehen?', 'Prüft lokale Transfers, Mietausrüstung, zusätzliche Platznutzung, Schiedsrichter, Spielgebühren und mögliche Gebühren für Programmänderungen.']
    ]
  } : {
    eyebrow: 'Facilities, hotel and logistics',
    lead: 'A good training camp is not defined by one facility alone. Accommodation, pitch quality, catering and transfer times need to fit a reliable daily schedule.',
    sections: [
      ['Check pitch conditions', 'Specify surface type, intended use, lighting, changing rooms and workload. Confirm final details in writing before booking.'],
      ['Combine hotel and pitch location', 'Short distances save team time and reduce transfer risk. Also consider meal times, rest periods and space for team meetings.'],
      ['Plan transfers as a daily schedule', 'Airport transport, local transfers and journeys to test matches should match training units, meals and group activities.'],
      ['Confirm catering arrangements', 'Share dietary requirements, preferred meal times, allergies and squad size. Individual options remain subject to hotel confirmation.'],
      ['Schedule recovery', 'Gym access, pool use or physiotherapy can be added where needed. Availability depends on the selected accommodation and package.'],
      ['Compare offers consistently', 'Look beyond the headline price and check included services, cancellation terms, arrival and departure times and likely extras.']
    ],
    faq: [
      ['Are specific hotels or pitches guaranteed?', 'Availability and names should only be treated as confirmed after the dates and final package are agreed in writing.'],
      ['What belongs in a daily plan?', 'Include travel times, meals, pitch slots, recovery and match arrangements so the team has a predictable routine.'],
      ['Which extras may affect the final price?', 'Potential extras include local transport, equipment rental, additional pitch use, referees, match fees and changes to the programme.']
    ]
  };

  return de ? {
    eyebrow: 'Planung für Vereine',
    lead: 'Eine erfolgreiche Fußballreise beginnt mit klaren Zielen und einer belastbaren Planung. Mit einer vollständigen Anfrage lassen sich Kosten, Termine, Leistungen und Abläufe früher miteinander vergleichen.',
    sections: [
      ['Ziele für die Woche festlegen', 'Legt fest, ob Fitness, taktische Vorbereitung, Spielpraxis oder Teambuilding im Vordergrund steht. Daraus ergeben sich Belastung und Tagesstruktur.'],
      ['Daten und Teilnehmer erfassen', 'Reisedaten, Spielerzahl, Staff, Altersklasse, Leistungsniveau und Zimmerbedarf bilden die Grundlage für ein individuelles Angebot.'],
      ['Leistungen priorisieren', 'Entscheidet zwischen Hotel, Verpflegung, Plätzen, Transfers, Testspielen und Zusatzleistungen und trennt Pflichtleistungen von optionalen Wünschen.'],
      ['Zeitraum und Flexibilität prüfen', 'Schulferien, Liga-Programme und beliebte Trainingsphasen beeinflussen Verfügbarkeit. Ein alternativer Zeitraum kann die Auswahl verbessern.'],
      ['Angebot und Bedingungen prüfen', 'Achtet auf enthaltene Leistungen, Zahlungsplan, Stornobedingungen, Zimmerbelegung und mögliche Zusatzkosten.'],
      ['Interne Abstimmung dokumentieren', 'Eine gemeinsame Checkliste für Verein, Trainer und Begleitpersonal reduziert Missverständnisse und vorbereitetes Material spart vor Ort Zeit.']
    ],
    faq: [
      ['Welche Informationen sind für die erste Anfrage wichtig?', 'Teamtyp, Spielerzahl, Alter oder Niveau, Zeitraum, Leistungsumfang, Budget und besondere Anforderungen reichen für eine erste Einschätzung.'],
      ['Ist die Anfrage verbindlich?', 'Eine erste Anfrage ist grundsätzlich unverbindlich. Verbindliche Leistungen, Preise und Stornobedingungen sollten erst in der schriftlichen Bestätigung festgelegt werden.'],
      ['Wie bereiten wir die Abreise vor?', 'Koordinieren Sie Ausweise, Reiseunterlagen, Trainingsausrüstung, Zimmerlisten, Mahlzeiten und Zuständigkeiten frühzeitig mit Ihrem Verein.']
    ]
  } : {
    eyebrow: 'Planning for football clubs',
    lead: 'A successful football camp starts with clear goals and a dependable plan. A complete enquiry makes it easier to compare dates, costs, services and the daily schedule.',
    sections: [
      ['Set the objectives for the week', 'Decide whether fitness, tactical preparation, match play or team cohesion is the priority. The answer determines workload and daily structure.'],
      ['Collect travel and participant data', 'Dates, player and staff numbers, age group, playing level and room requirements provide the basis for an individual offer.'],
      ['Prioritise required services', 'Choose between accommodation, catering, pitches, transfers, test matches and extras, and distinguish essential services from optional wishes.'],
      ['Check dates and flexibility', 'School holidays, league schedules and popular training periods affect availability. A second date range can increase the choice of hotels and pitches.'],
      ['Review offer terms', 'Check included services, payment stages, cancellation terms, room allocation and any likely additional costs.'],
      ['Document internal decisions', 'A shared checklist for the club, coaches and accompanying staff reduces misunderstandings and helps the trip run smoothly.']
    ],
    faq: [
      ['What information belongs in the first enquiry?', 'Please include team type, player and staff numbers, level or age group, dates, required services, budget and special requirements.'],
      ['Is the enquiry binding?', 'A first enquiry is generally non-binding. Confirmed prices, services and cancellation terms should be stated in the written offer.'],
      ['How should we prepare departure?', 'Coordinate travel documents, training equipment, room lists, meal requirements and responsible staff well before departure.']
    ]
  };
}

function enrichContentPage(html, lang, slug, prefix) {
  const legal = /^(imprint|privacy-policy|cookie-policy)$/.test(slug);
  const contact = /^(contact|request-offer)$/.test(slug);
  if (legal || contact) return html;
  const copy = contentTopic(lang, slug);
  const de = lang === 'de';
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1] : (de ? 'Fußball-Trainingslager in Antalya' : 'Football training camp in Antalya');
  const introMatch = html.match(/<section class="page-hero[^"]*">[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
  const intro = introMatch ? introMatch[1] : copy.lead;
  const home = de ? 'Startseite' : 'Home';
  const inquiry = de ? 'Angebot anfragen' : 'Request an offer';
  const faqTitle = de ? 'Häufige Fragen zur Planung' : 'Frequently asked planning questions';
  const breadcrumb = de ? 'Übersicht' : 'Overview';
  const guide = GUIDES.find((g) => g[lang].slug === slug && g[lang] && (prefix === '/en') === (lang === 'en'));
  const g = guide ? guide[lang] : null;
  const ui = UI[lang];
  const artKey = guide ? guide.art : (/youth|jugend|amateur|senior|academ|akademie|professional|profi|clubs|vereins|team/.test(slug) ? 'tactical' : (/plan|cost|kosten|checkliste|best-time|winter|preseason|europe|turkey|tuerkei|how-it|faq|about|references|services/.test(slug) ? 'route' : 'stadium'));
  const heroArt = `<div class="hero-art" aria-hidden="false">${ART[artKey]}</div>`;
  const heroBlock = `<section class="page-hero has-art"><div class="wrap hero-split"><div class="hero-text"><nav class="breadcrumb" aria-label="${breadcrumb}"><a href="${prefix}/">${home}</a><span aria-hidden="true">/</span><span>${stripTags(h1)}</span></nav><h1>${h1}</h1><p>${intro}</p><a class="button" href="${prefix}/#anfrage">${inquiry}</a></div>${heroArt}</div></section>`;

  const sections = guide ? g.sections : copy.sections;
  const cards = sections.map(([title, text], i) => `<article class="card"><span class="card-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h2>${title}</h2><p>${text}</p></article>`).join('');

  // varied extra FAQs (deterministic per slug)
  const pool = EXTRA_FAQ[lang];
  let seed = 0; for (const ch of slug) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const extraFaq = [0, 1, 2, 3].map((k) => pool[(seed + k * 3) % pool.length]).filter((v, i, arr) => arr.indexOf(v) === i);
  const baseFaq = guide ? g.faq : copy.faq;
  const allFaq = [...baseFaq, ...extraFaq.filter((q) => !baseFaq.some((b) => b[0] === q[0]))];
  const faqItems = allFaq.map(([question, answer]) => `<details class="qa-item"><summary>${question}</summary><p>${answer}</p></details>`).join('');

  const bullets = guide ? `<section class="facts"><h2>${ui.facts}</h2><ul>${g.bullets.map((x) => `<li>${ICON_CHECK_CIRCLE}<span>${x}</span></li>`).join('')}</ul></section>` : '';
  const climate = (guide && guide.climate) || /best-time|winter|preseason|klima/.test(slug) ? (() => {
    const c = CLIMATE[lang]; const max = Math.max(...c.high);
    return `<section class="climate"><h2>${ui.climateTitle}</h2><div class="climate-chart" role="img" aria-label="${c.note}">${c.high.map((v, i) => `<div class="bar" style="--h:${Math.round((v / max) * 100)}%;--i:${i}"><span class="val">${v}°</span><span class="mon">${c.months[i]}</span></div>`).join('')}</div><p class="muted">${c.note}</p></section>`;
  })() : '';
  const stepsList = lang === 'de'
    ? [['Anfrage senden', 'Teamtyp, Zeitraum, Teilnehmer und Wünsche angeben.'], ['Erste Einschätzung', 'Wir melden uns in der Regel innerhalb von 24 Stunden.'], ['Angebot prüfen', 'Leistungen, Preise und Bedingungen schriftlich erhalten.'], ['Reise vorbereiten', 'Details abstimmen und Camp durchführen.']]
    : [['Send enquiry', 'Share team type, dates, participants and wishes.'], ['First assessment', 'We usually reply within 24 hours.'], ['Review the offer', 'Receive services, prices and terms in writing.'], ['Prepare the trip', 'Agree details and run the camp.']];
  const steps = `<section class="camp-steps"><h2>${ui.steps}</h2><ol>${stepsList.map(([t, d], i) => `<li style="--i:${i}"><span class="step-dot">${i + 1}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join('')}</ol></section>`;

  // related links
  const mine = `${prefix}/${slug}/`;
  const candidates = Object.entries(PAGE_TITLES[lang] || {}).filter(([href]) => href !== mine && !/imprint|privacy|cookie|impressum|request|contact/.test(href));
  let rs = seed; const picks = [];
  while (picks.length < Math.min(6, candidates.length)) { rs = (rs * 1103515245 + 12345) >>> 0; const c = candidates[rs % candidates.length]; if (!picks.includes(c)) picks.push(c); }
  const related = `<section class="related"><h2>${ui.related}</h2><ul>${picks.map(([href, title]) => `<li><a href="${href}">${stripTags(title)}<span aria-hidden="true">→</span></a></li>`).join('')}</ul></section>`;

  const today = new Date().toISOString().slice(0, 10);
  const main = `<main id="main">${heroBlock}<div class="page-main"><div class="wrap"><section class="content-intro"><p>${guide ? g.lead : copy.lead}</p></section>${bullets}<div class="grid">${cards}</div>${climate}${steps}<section class="content-faq" aria-labelledby="faq-${slug}"><h2 id="faq-${slug}">${guide ? ui.moreFaq : faqTitle}</h2><div class="qa-list">${faqItems}</div></section>${related}<div class="cta"><h2>${de ? 'Vereinsdaten für ein konkretes Angebot zusammenstellen' : 'Prepare the club details for a concrete offer'}</h2><p>${de ? 'Teilt uns Teamtyp, Zeitraum, Teilnehmerzahl, gewünschte Leistungen und besondere Anforderungen mit.' : 'Share your team type, dates, participant numbers, required services and special requirements.'}</p><a class="button" href="${prefix}/#anfrage">${inquiry}</a></div><p class="updated muted">${ui.updated}: <time datetime="${today}">${today}</time></p></div></div></main>`;
  html = html.replace(/<main id="main"[\s\S]*?<\/main>/i, main);
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaq.map(([question, answer]) => ({
      '@type': 'Question',
      name: stripTags(question),
      acceptedAnswer: { '@type': 'Answer', text: stripTags(answer) }
    }))
  };
  html = html.replace(/<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?<\/script>/gi, '');
  html = html.replace('</head>', `<script type="application/ld+json">${escapeJson(faqLd)}</script></head>`);
  return html;
}


/* ---------- per-page SEO head (idempotent) ---------- */

function seoHead(html, lang, slug, prefix, dePath, enPath) {
  html = html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/g, '');
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/i);
  if (!titleMatch) return html;
  const title = titleMatch[1];
  const desc = descMatch ? descMatch[1] : '';
  const de = lang === 'de';
  const url = `${SITE_URL}${prefix}/${slug}/`;
  const deUrl = `${SITE_URL}${dePath}`;
  const enUrl = `${SITE_URL}${enPath}`;
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, title])[1];
  const has = (re) => re.test(html);
  const tags = [];
  if (!has(/<meta name="robots"/i)) tags.push('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">');
  if (!has(/hreflang="de"/i)) {
    tags.push(`<link rel="alternate" hreflang="de" href="${deUrl}"><link rel="alternate" hreflang="en" href="${enUrl}"><link rel="alternate" hreflang="x-default" href="${deUrl}">`);
  }
  tags.push(`<meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:locale" content="${de ? 'de_DE' : 'en_GB'}"><meta property="og:locale:alternate" content="${de ? 'en_GB' : 'de_DE'}"><meta property="og:site_name" content="Antalya Camp"><meta property="og:image" content="${HERO_IMAGE}&amp;w=1200"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${desc}"><meta name="twitter:image" content="${HERO_IMAGE}&amp;w=1200">`);
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: stripTags(h1), description: stripTags(desc), inLanguage: lang, isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': `${SITE_URL}/#org` }, breadcrumb: { '@id': `${url}#breadcrumb` } },
      { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Antalya Camp', publisher: { '@id': `${SITE_URL}/#org` }, inLanguage: ['de', 'en'] },
      { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: 'Antalya Camp', url: `${SITE_URL}/`, logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` }, areaServed: ['DE', 'AT', 'CH'], knowsAbout: ['Fußball-Trainingslager', 'Football training camps', 'Antalya'] },
      { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
        { '@type': 'ListItem', position: 1, name: de ? 'Startseite' : 'Home', item: `${SITE_URL}${prefix}/` },
        { '@type': 'ListItem', position: 2, name: stripTags(h1), item: url }
      ] }
    ]
  };
  tags.push(`<script type="application/ld+json">${escapeJson(ld)}</script>`);
  return html.replace('</head>', `<!-- seo:start -->${tags.join('')}<!-- seo:end --></head>`);
}


const PAGE_TITLES = { de: {}, en: {} };
const PAIRS = new Map(); // route -> { de, en }
for (const g of GUIDES) {
  const de = `/${g.de.slug}/`, en = `/en/${g.en.slug}/`;
  PAIRS.set(de, { de, en }); PAIRS.set(en, { de, en });
}
function pairFor(prefix, slug) {
  const route = `${prefix}/${slug}/`;
  return PAIRS.get(route) || { de: `/${slug}/`, en: `/en/${slug}/` };
}

async function writeGuideStubs() {
  for (const g of GUIDES) {
    for (const lang of ['de', 'en']) {
      const d = g[lang];
      const prefix = lang === 'en' ? '/en' : '';
      const dir = path.join(root, prefix.slice(1), d.slug);
      await mkdir(dir, { recursive: true });
      const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${d.title}</title><meta name="description" content="${d.desc}"><link rel="canonical" href="${SITE_URL}${prefix}/${d.slug}/"><meta name="theme-color" content="#0c1d15"><link rel="icon" href="/favicon.svg" type="image/svg+xml">${FONT_LINKS}<link rel="stylesheet" href="/site.css"></head><body><!-- site-header --><!-- /site-header --><main id="main"><section class="page-hero"><div class="wrap"><h1>${d.h1}</h1><p>${d.lead}</p></div></section></main><!-- site-footer --><!-- /site-footer --><script src="/site-config.js"></script><script src="/site.js" defer></script></body></html>`;
      await writeFile(path.join(dir, 'index.html'), html);
    }
  }
}

async function buildContentPages() {
  await writeGuideStubs();
  const pages = await listContentPages();
  for (const page of pages) {
    const raw = await readFile(page.file, 'utf8');
    const l = /<html lang="de"/.test(raw) ? 'de' : 'en';
    const m = raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (m) PAGE_TITLES[l][`${page.prefix}/${page.slug}/`] = m[1];
  }
  for (const page of pages) {
    let html = await readFile(page.file, 'utf8');
    html = upgradeLegacy(html, page.prefix);
    const lang = /<html lang="de"/.test(html) ? 'de' : 'en';
    const { de: dePath, en: enPath } = pairFor(page.prefix, page.slug);
    html = enrichContentPage(html, lang, page.slug, page.prefix);
    html = seoHead(html, lang, page.slug, page.prefix, dePath, enPath);
    html = html
      .replace(/<!-- site-header -->[\s\S]*?<!-- \/site-header -->/, pageHeader(lang, page.prefix, dePath, enPath))
      .replace(/<!-- site-footer -->[\s\S]*?<!-- \/site-footer -->/, pageFooter(lang, page.prefix));
    await writeFile(page.file, html);
  }
  console.log(`updated ${pages.length} content pages`);
}

/* ---------- static SEO files ---------- */

async function buildStaticSeo() {
  await writeFile(path.join(root, 'site-config.js'), `window.SITE_CONFIG=${JSON.stringify({
    siteUrl: SITE_URL,
    ga4MeasurementId: '',
    googleSiteVerification: '',
    whatsappNumber: ''
  })};`);
  await writeFile(path.join(root, 'robots.txt'), `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml
`);
  const pages = await listContentPages();
  const routes = ['/', ...pages.filter((page) => page.prefix === '').map((page) => `/${page.slug}/`)];
  routes.push('/en/');
  for (const page of pages.filter((page) => page.prefix === '/en')) routes.push(`/en/${page.slug}/`);
  const unique = [...new Set(routes)];
  const alt = (route) => {
    const isEn = route.startsWith('/en/');
    const pr = PAIRS.get(route);
    const dePath = pr ? pr.de : (isEn ? route.replace(/^\/en/, '') || '/' : route);
    const enPath = pr ? pr.en : (isEn ? route : `/en${route}`);
    if (!unique.includes(dePath) || !unique.includes(enPath)) return '';
    return `<xhtml:link rel="alternate" hreflang="de" href="${SITE_URL}${dePath}"/><xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${enPath}"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${dePath}"/>`;
  };
  const today = new Date().toISOString().slice(0, 10);
  const urls = unique.map((route) => `  <url><loc>${SITE_URL}${route}</loc>${alt(route)}<lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${route === '/' || route === '/en/' ? '1.0' : '0.8'}</priority></url>`).join('\n');
  await writeFile(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`);
  console.log('built static SEO files');
}

/* ---------- 404 ---------- */

async function build404() {
  const ui = UI.de;
  const html = `<!doctype html>
<!-- Generated by scripts/build.mjs -->
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow">
<meta name="theme-color" content="#0c1d15">
<title>${ui.notFoundTitle} | Antalya Camp</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${FONT_LINKS}
<link rel="stylesheet" href="/site.css">
<script src="/site-config.js"></script>
<script src="/site.js" defer></script>
</head>
<body>
${pageHeader('de', '', '/', '/en/')}
<main id="main" class="not-found">
  <div class="wrap">
    <div class="code">404</div>
    <h1>${ui.notFoundTitle}</h1>
    <p>${ui.notFoundText}</p>
    <div class="actions">
      <a class="btn btn-primary" href="/">${ui.home}</a>
      <a class="btn btn-ghost" href="/faq/">FAQ</a>
      <a class="btn btn-ghost" href="/#anfrage">${ui.cta}</a>
      <a class="btn btn-ghost" href="/en/" lang="en">English</a>
    </div>
  </div>
</main>
${pageFooter('de', '')}
</body>
</html>
`;
  await writeFile(path.join(root, '404.html'), html);
  console.log('built 404.html');
}

await buildHome();
await buildContentPages();
await buildStaticSeo();
await build404();
