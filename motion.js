(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var progress = document.createElement('div');
  progress.className = 'motion-progress';
  document.body.appendChild(progress);
  var spotlight = document.createElement('div');
  spotlight.className = 'motion-spotlight';
  document.body.appendChild(spotlight);
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
  document.querySelectorAll('a, button').forEach(function (item) {
    if (item.classList.contains('nav-link')) return;
    item.setAttribute('data-motion-button', '');
  });

  if (!reduceMotion) {
    document.body.classList.add('motion-ready');
    window.addEventListener('pointermove', function (event) {
      spotlight.style.left = event.clientX + 'px';
      spotlight.style.top = event.clientY + 'px';
    }, { passive: true });

    document.querySelectorAll('.hero-visual, .hero-art, .hero-card, [data-motion-card]').forEach(function (item) {
      item.addEventListener('pointermove', function (event) {
        var box = item.getBoundingClientRect();
        var rotateX = ((event.clientY - box.top) / box.height - .5) * -7;
        var rotateY = ((event.clientX - box.left) / box.width - .5) * 7;
        item.style.transform = 'perspective(700px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
      });
      item.addEventListener('pointerleave', function () { item.style.transform = ''; });
    });

    window.addEventListener('scroll', function () {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (scrollable ? window.scrollY / scrollable * 100 : 0) + '%';
    }, { passive: true });
  }
}());
