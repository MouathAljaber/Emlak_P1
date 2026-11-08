(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('motion-loading');
  window.requestAnimationFrame(function () { document.body.classList.remove('motion-loading'); });
  var marquee = document.createElement('div');
  marquee.className = 'motion-marquee';
  marquee.innerHTML = '<span>ANTALYA CAMP · TRAIN · CONNECT · PERFORM · ANTALYA CAMP · TRAIN · CONNECT · PERFORM · </span>';
  var main = document.querySelector('main');
  if (main) main.parentNode.insertBefore(marquee, main);
  var topButton = document.createElement('button');
  topButton.className = 'motion-top';
  topButton.type = 'button';
  topButton.setAttribute('aria-label', 'Back to top');
  topButton.textContent = '↑';
  document.body.appendChild(topButton);
  topButton.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  var velocity = document.createElement('div');
  velocity.className = 'motion-velocity';
  document.body.appendChild(velocity);
  if (!reduceMotion) {
    var lastScroll = window.scrollY;
    var velocityTimer;
    for (var particleIndex = 0; particleIndex < 16; particleIndex += 1) {
      var particle = document.createElement('span');
      particle.className = 'motion-particle';
      particle.style.left = (5 + Math.random() * 90) + '%';
      particle.style.top = (55 + Math.random() * 45) + '%';
      particle.style.animationDelay = (-Math.random() * 9) + 's';
      particle.style.animationDuration = (7 + Math.random() * 6) + 's';
      document.body.appendChild(particle);
    }
  }
  var progress = document.createElement('div');
  progress.className = 'motion-progress';
  document.body.appendChild(progress);
  var spotlight = document.createElement('div');
  spotlight.className = 'motion-spotlight';
  document.body.appendChild(spotlight);
  var trails = [];
  if (!reduceMotion) {
    for (var trailIndex = 0; trailIndex < 7; trailIndex += 1) {
      var trail = document.createElement('div');
      trail.className = 'motion-trail';
      trail.style.opacity = String(1 - trailIndex / 8);
      document.body.appendChild(trail);
      trails.push({ element: trail, x: 0, y: 0 });
    }
  }
  var revealItems = document.querySelectorAll(
    'main > section, .feature-card, .service-card, .step, .faq-item, .quote, .form-card, article'
  );

  revealItems.forEach(function (item, index) {
    item.setAttribute('data-reveal', index % 3 === 1 ? 'left' : 'right');
    item.style.transitionDelay = Math.min(index * 45, 240) + 'ms';
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px' });
    revealItems.forEach(function (item) { observer.observe(item); });
  }

  var visual = document.querySelector('.hero-visual, .hero-art, .hero-card');
  if (visual && !reduceMotion) visual.classList.add('motion-float');

  document.querySelectorAll(
    '.feature-card, .service-card, .step, .faq-item, .quote, .form-card, article'
  ).forEach(function (item) { item.setAttribute('data-motion-card', ''); });
  document.querySelectorAll('.faq-q').forEach(function (item) {
    item.addEventListener('click', function () {
      item.closest('.faq-item').classList.toggle('motion-faq-bounce');
      window.setTimeout(function () { item.closest('.faq-item').classList.remove('motion-faq-bounce'); }, 420);
    });
  });
  document.querySelectorAll('a, button').forEach(function (item) {
    if (item.classList.contains('nav-link')) return;
    item.setAttribute('data-motion-button', '');
  });

  if (!reduceMotion) {
    document.body.classList.add('motion-ready');
    window.addEventListener('pointermove', function (event) {
      spotlight.style.left = event.clientX + 'px';
      spotlight.style.top = event.clientY + 'px';
      trails[0].x = event.clientX;
      trails[0].y = event.clientY;
    }, { passive: true });
    document.addEventListener('pointerdown', function () {
      spotlight.classList.remove('pulse');
      window.requestAnimationFrame(function () { spotlight.classList.add('pulse'); });
    }, { passive: true });
    function animateTrails() {
      trails.forEach(function (trail, index) {
        var target = index === 0 ? trails[0] : trails[index - 1];
        trail.x += (target.x - trail.x) * .28;
        trail.y += (target.y - trail.y) * .28;
        trail.element.style.transform = 'translate(' + trail.x + 'px,' + trail.y + 'px) scale(' + (1 - index * .08) + ')';
      });
      requestAnimationFrame(animateTrails);
    }
    animateTrails();

    document.querySelectorAll('.hero-visual, .hero-art, .hero-card, [data-motion-card]').forEach(function (item) {
      item.addEventListener('pointermove', function (event) {
        var box = item.getBoundingClientRect();
        var rotateX = ((event.clientY - box.top) / box.height - .5) * -7;
        var rotateY = ((event.clientX - box.left) / box.width - .5) * 7;
        item.style.transform = 'perspective(700px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
      });
      item.addEventListener('pointerleave', function () { item.style.transform = ''; });
    });
    document.querySelectorAll('a.button, .nav-cta, .btn-primary').forEach(function (item) {
      item.setAttribute('data-magnetic', '');
      item.addEventListener('pointermove', function (event) {
        var box = item.getBoundingClientRect();
        item.style.transform = 'translate(' + ((event.clientX - box.left - box.width / 2) * .16) + 'px,' + ((event.clientY - box.top - box.height / 2) * .16) + 'px)';
      });
      var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
      var sectionLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-cta[href^="#"]');
      if ('IntersectionObserver' in window) {
        var sectionObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            sections.forEach(function (section) { section.classList.remove('motion-section-active'); });
            sectionLinks.forEach(function (link) {
              link.classList.toggle('motion-active', link.getAttribute('href') === '#' + entry.target.id);
            });
            entry.target.classList.add('motion-section-active');
          });
        }, { threshold: .35 });
        sections.forEach(function (section) { sectionObserver.observe(section); });
      }
      item.addEventListener('pointerleave', function () { item.style.transform = ''; });
    });
    var successPanel = document.getElementById('successPanel');
    if (successPanel) {
      new MutationObserver(function () {
        if (successPanel.style.display !== 'none') celebrate();
      }).observe(successPanel, { attributes: true, attributeFilter: ['style'] });
    }

    window.addEventListener('scroll', function () {
      var heroCopy = document.querySelector('.hero-copy');
      if (heroCopy) heroCopy.style.transform = 'translateY(' + Math.min(window.scrollY * .12, 42) + 'px)';
      var nav = document.querySelector('.nav');
      if (nav) nav.classList.toggle('motion-compact', window.scrollY > 24);
      topButton.classList.toggle('visible', window.scrollY > window.innerHeight * .7);
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (scrollable ? window.scrollY / scrollable * 100 : 0) + '%';
      if (Math.abs(window.scrollY - lastScroll) > 10) {
        velocity.classList.add('active');
        window.clearTimeout(velocityTimer);
        velocityTimer = window.setTimeout(function () { velocity.classList.remove('active'); }, 180);
      }
      lastScroll = window.scrollY;
    }, { passive: true });
  }

  function celebrate() {
    for (var index = 0; index < 28; index += 1) {
      var piece = document.createElement('span');
      piece.className = 'motion-confetti';
      piece.style.left = (35 + Math.random() * 30) + '%';
      piece.style.top = '18%';
      piece.style.setProperty('--x', ((Math.random() - .5) * 70) + 'vw');
      piece.style.background = ['#d39f26', '#2f6d4f', '#8bc34a', '#f4c95d'][index % 4];
      piece.style.animationDelay = (Math.random() * .18) + 's';
      document.body.appendChild(piece);
      piece.addEventListener('animationend', function () { piece.remove(); });
    }
  }
}());
