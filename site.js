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


  /* ---------- motion enhancements ---------- */
  // Auto-reveal content-page blocks with a stagger (no markup changes needed).
  Array.prototype.forEach.call(document.querySelectorAll('.page-main .grid, .page-main .content-faq .grid'), function (grid) {
    Array.prototype.forEach.call(grid.children, function (child, i) {
      if (child.hasAttribute('data-reveal')) return;
      child.setAttribute('data-reveal', '');
      child.style.transitionDelay = Math.min(i % 3, 2) * 90 + 'ms';
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll('.content-intro, .page-main .cta, .content-faq > h2'), function (el) { el.setAttribute('data-reveal', ''); });
  (function () {
    var late = document.querySelectorAll('[data-reveal]:not(.is-visible)');
    if (!reduceMotion && 'IntersectionObserver' in window && late.length) {
      doc.classList.add('js-reveal');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      late.forEach(function (el) { io.observe(el); });
    }
  }());

  // Scroll progress bar + back-to-top button.
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var topBtn = document.createElement('button');
  topBtn.type = 'button';
  topBtn.className = 'to-top';
  topBtn.setAttribute('aria-label', isGerman ? 'Nach oben' : 'Back to top');
  topBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg>';
  topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
  document.body.appendChild(topBtn);
  var ticking = false;
  function onScrollFx() {
    ticking = false;
    var max = doc.scrollHeight - window.innerHeight;
    var y = window.scrollY;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    topBtn.classList.toggle('is-shown', y > 700);
    var hero = document.querySelector('.page-hero .wrap, .hero .wrap');
    if (hero && !reduceMotion && y < 700) hero.style.transform = 'translate3d(0,' + (y * 0.08).toFixed(1) + 'px,0)';
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; window.requestAnimationFrame(onScrollFx); } }, { passive: true });
  onScrollFx();

  // Count-up for elements marked data-count="123".
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        co.unobserve(entry.target);
        var el = entry.target, end = parseFloat(el.getAttribute('data-count')), suffix = el.getAttribute('data-suffix') || '', t0 = null;
        (function step(t) {
          t0 = t0 || t;
          var p = Math.min((t - t0) / 1400, 1), e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * e) + suffix;
          if (p < 1) window.requestAnimationFrame(step);
        }(performance.now()));
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }


  /* ---------- homepage show-off motion ---------- */
  var heroTitle = document.querySelector('.hero h1');
  if (heroTitle && !reduceMotion) {
    var wi = 0;
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span');
            s.className = 'w'; s.textContent = part; s.style.animationDelay = (0.15 + wi++ * 0.07) + 's';
            frag.appendChild(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) { split(child); }
      });
    }(heroTitle));
  }
  // Cursor spotlight on cards.
  document.addEventListener('pointermove', function (e) {
    var card = e.target.closest && e.target.closest('.card');
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });
  Array.prototype.forEach.call(document.querySelectorAll('.section-head'), function (el) {
    if (reduceMotion || !('IntersectionObserver' in window)) { el.classList.add('is-visible'); return; }
    var o = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { el.classList.add('is-visible'); o.disconnect(); } }, { threshold: 0.4 });
    o.observe(el);
  });


  /* ---------- pro motion: tilt, magnetic buttons, section reveal ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('.hero-card, .hero-art'), function (el) {
      el.classList.add('tilt');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = 'perspective(900px) rotateY(' + (x * 10).toFixed(2) + 'deg) rotateX(' + (-y * 10).toFixed(2) + 'deg)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.btn-accent, .btn-primary, .page-hero .button'), function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .28).toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('.climate, .steps'), function (el) {
    if (reduceMotion || !('IntersectionObserver' in window)) { el.classList.add('is-visible'); return; }
    var o = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { el.classList.add('is-visible'); o.disconnect(); } }, { threshold: 0.25 });
    o.observe(el);
  });

  /* ---------- footer year ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });
}());
