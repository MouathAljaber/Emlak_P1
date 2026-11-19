#!/usr/bin/env node
/*
 * Static site build.
 *  - Generates /index.html (DE) and /en/index.html (EN) from src/home.template.html + src/{de,en}.json
 *  - Applies the shared header and footer to every content page (between <!-- site-header --> markers)
 *  - Generates 404.html
 * Run with: npm run build
 */
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://trainingslager-antalya.de').replace(/\/+$/, '');
const HERO_IMAGE = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&amp;fit=crop&amp;q=75';
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
    sister: 'Sucht ihr ein Familien- oder Jugendcamp statt Vereinstraining?', product: 'Antalya Camp ist ein Produkt der Emlak AG',
    rights: 'Alle Rechte vorbehalten.', brandName: 'Trainingslager Antalya',
    notFoundTitle: 'Seite nicht gefunden', notFoundText: 'Die gewünschte Seite ist nicht verfügbar oder wurde verschoben. Hier geht es weiter:'
  },
  en: {
    skip: 'Skip to content', navLabel: 'Main navigation', langLabel: 'Choose language', menuOpen: 'Open menu', menuClose: 'Close menu',
    cta: 'Request an offer', home: 'Home', teams: 'Teams', services: 'Services', howItWorks: 'How it works', faq: 'FAQ', about: 'About us', contact: 'Contact',
    references: 'References', imprint: 'Imprint', privacy: 'Privacy policy', cookies: 'Cookies', legal: 'Legal',
    youth: 'Youth teams', amateur: 'Amateur clubs', senior: 'Senior teams', academies: 'Academies', pro: 'Professional teams',
    tagline: 'Football training camps for clubs and teams in Antalya, Turkey.',
    sister: 'Looking for a family or youth camp instead of club training?', product: 'Antalya Camp is a product of Emlak AG',
    rights: 'All rights reserved.', brandName: 'Training Camp Antalya',
    notFoundTitle: 'Page not found', notFoundText: 'The page you are looking for does not exist or has moved. Continue here:'
  }
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
      ${col(ui.legal, [[`${prefix}/imprint/`, ui.imprint], [`${prefix}/privacy-policy/`, ui.privacy], [`${prefix}/cookie-policy/`, ui.cookies]])}
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> ${ui.brandName}. ${ui.rights}</span>
      <a class="emlak" href="https://emlak-ag.de/" target="_blank" rel="noopener noreferrer"><img src="https://emlak-ag.de/wp-content/uploads/2016/11/logo121.png" alt="Emlak AG" width="112" height="26" loading="lazy">${ui.product}</a>
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
        { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: 'Antalya Camp', url: `${SITE_URL}/`, logo: `${SITE_URL}/favicon.svg`, parentOrganization: { '@type': 'Organization', name: 'Emlak AG', url: 'https://emlak-ag.de/' } },
        { '@type': 'Service', name: 'Antalya Camp', url: canonical, description: dict['meta.description'], serviceType: lang === 'de' ? 'Fußball-Trainingslager' : 'Football training camp', areaServed: ['DE', 'AT', 'CH'], provider: { '@id': `${SITE_URL}/#org` }, inLanguage: lang },
        { '@type': 'FAQPage', inLanguage: lang, mainEntity: [1, 2, 3, 4].map((n) => ({ '@type': 'Question', name: stripTags(dict[`faq.${n}.q`]), acceptedAnswer: { '@type': 'Answer', text: stripTags(dict[`faq.${n}.a`]) } })) }
      ]
    };
    const clientKeys = Object.keys(dict).filter((key) => /^(summary\.|btn\.|errors\.|progress$|form\.|success\.ref$)/.test(key));
    const vars = {
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

async function buildContentPages() {
  const pages = await listContentPages();
  for (const page of pages) {
    let html = await readFile(page.file, 'utf8');
    html = upgradeLegacy(html, page.prefix);
    const lang = /<html lang="de"/.test(html) ? 'de' : 'en';
    const dePath = `/${page.slug}/`;
    const enPath = `/en/${page.slug}/`;
    html = html
      .replace(/<!-- site-header -->[\s\S]*?<!-- \/site-header -->/, pageHeader(lang, page.prefix, dePath, enPath))
      .replace(/<!-- site-footer -->[\s\S]*?<!-- \/site-footer -->/, pageFooter(lang, page.prefix));
    await writeFile(page.file, html);
  }
  console.log(`updated ${pages.length} content pages`);
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
await build404();
