/* Antalya Camp — shared behaviour for every page. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var isGerman = (doc.lang || 'de').toLowerCase().indexOf('de') === 0;
  var config = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function storageGet(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function storageSet(key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* storage blocked */ } }

  /* ---------- analytics (loads only after consent) ---------- */
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.enableAnalytics = function () {
    var id = config.ga4MeasurementId;
    if (!id || window.analyticsLoaded) return;
    window.analyticsLoaded = true;
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
  };
  if (config.googleSiteVerification && !document.querySelector('meta[name="google-site-verification"]')) {
    var verification = document.createElement('meta');
    verification.name = 'google-site-verification';
    verification.content = config.googleSiteVerification;
    document.head.appendChild(verification);
  }

  /* ---------- cookie consent ---------- */
  var consentKey = 'antalya-camp-analytics-consent';
  var savedConsent = storageGet(consentKey);
  var banner = document.getElementById('cookieBanner');
  if (!banner) {
    banner = document.createElement('aside');
    banner.className = 'cookie-banner';
    banner.id = 'cookieBanner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', isGerman ? 'Cookie-Einstellungen' : 'Cookie settings');
    banner.hidden = true;
    var prefix = location.pathname.indexOf('/en/') === 0 ? '/en' : '';
    banner.innerHTML = isGerman
      ? '<p>Wir verwenden optionale Analyse-Cookies, um die Website zu verbessern. <a href="' + prefix + '/cookie-policy/">Mehr erfahren</a></p><div class="cookie-actions"><button type="button" class="btn btn-ghost" data-consent="denied">Nur notwendige</button><button type="button" class="btn btn-accent" data-consent="granted">Analyse erlauben</button></div>'
      : '<p>We use optional analytics cookies to improve this website. <a href="' + prefix + '/cookie-policy/">Learn more</a></p><div class="cookie-actions"><button type="button" class="btn btn-ghost" data-consent="denied">Necessary only</button><button type="button" class="btn btn-accent" data-consent="granted">Allow analytics</button></div>';
    document.body.appendChild(banner);
  }
  if (savedConsent === 'granted') window.enableAnalytics();
  if (!savedConsent) banner.hidden = false;
  banner.addEventListener('click', function (event) {
    var button = event.target.closest('[data-consent]');
    if (!button) return;
    var choice = button.getAttribute('data-consent');
    storageSet(consentKey, choice);
    banner.hidden = true;
    if (choice === 'granted') window.enableAnalytics();
    updateMobileCta();
  });

  /* ---------- header ---------- */
  var header = document.querySelector('.site-header');
  var onScrollHeader = function () { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  var toggle = document.querySelector('.menu-toggle');
  var panel = document.getElementById('mobile-nav');
  if (toggle && panel) {
    var labels = { open: toggle.getAttribute('aria-label'), close: toggle.getAttribute('data-label-close') || toggle.getAttribute('aria-label') };
    var setMenu = function (open) {
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? labels.close : labels.open);
      toggle.innerHTML = open
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    };
    toggle.addEventListener('click', function () { setMenu(panel.hidden); });
    panel.addEventListener('click', function (event) { if (event.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) { setMenu(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100 && !panel.hidden) setMenu(false); });
  }

  /* Active nav link for in-page sections */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a[href^="#"]'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    navLinks.forEach(function (link) { byId[link.getAttribute('href').slice(1)] = link; });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || !byId[entry.target.id]) return;
        navLinks.forEach(function (link) { link.classList.remove('is-active'); });
        byId[entry.target.id].classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ---------- mobile sticky CTA ---------- */
  var mobileCta = document.getElementById('mobileCta');
  var hero = document.querySelector('.hero, .page-hero');
  var enquiry = document.getElementById('anfrage');
  var enquiryVisible = false;
  if (mobileCta && config.whatsappNumber) {
    var whatsapp = mobileCta.querySelector('.btn-whatsapp');
    if (whatsapp) {
      whatsapp.href = 'https://wa.me/' + config.whatsappNumber;
      whatsapp.hidden = false;
    }
  }
  function updateMobileCta() {
    if (!mobileCta) return;
    var pastHero = hero ? window.scrollY > hero.offsetTop + hero.offsetHeight * 0.7 : window.scrollY > 400;
    var show = pastHero && !enquiryVisible && banner.hidden;
    mobileCta.classList.toggle('is-visible', show);
    mobileCta.setAttribute('aria-hidden', String(!show));
    Array.prototype.forEach.call(mobileCta.querySelectorAll('a'), function (link) { link.tabIndex = show ? 0 : -1; });
  }
  if (mobileCta && enquiry && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      enquiryVisible = entries.some(function (entry) { return entry.isIntersecting; });
      updateMobileCta();
    }, { threshold: 0.05 }).observe(enquiry);
  }
  window.addEventListener('scroll', updateMobileCta, { passive: true });
  window.addEventListener('resize', updateMobileCta, { passive: true });
  updateMobileCta();

  /* ---------- gentle reveal ---------- */
  var revealTargets = document.querySelectorAll('[data-reveal]');
  if (!reduceMotion && revealTargets.length && 'IntersectionObserver' in window) {
    doc.classList.add('js-reveal');
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (target) { revealObserver.observe(target); });
  }

  /* ---------- footer year ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });
}());
