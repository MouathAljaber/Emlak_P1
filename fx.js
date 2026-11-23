/* Antalya Camp — homepage cinematic effects (hero particles, pointer parallax, scroll-driven play story). */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.querySelector('.hero');

  /* ---------- hero: particles, pointer glow and parallax ---------- */
  var canvas = document.querySelector('.hero-fx');
  if (hero && canvas && !reduce) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, parts = [], running = true, mx = 0.5, my = 0.5;
    function size() {
      var r = hero.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(90, Math.max(28, w / 16)));
      parts = [];
      for (var i = 0; i < n; i++) parts.push(spawn(true));
    }
    function spawn(anywhere) {
      return { x: Math.random() * w, y: anywhere ? Math.random() * h : h + 10, r: Math.random() * 2 + .4, vy: -(Math.random() * .35 + .08), vx: (Math.random() - .5) * .15, a: Math.random() * .6 + .2, t: Math.random() * 6.28, z: Math.random() };
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.t += .02; p.x += p.vx + (mx - .5) * p.z * .6; p.y += p.vy;
        if (p.y < -10 || p.x < -10 || p.x > w + 10) parts[i] = p = spawn(false);
        var tw = p.a * (.6 + .4 * Math.sin(p.t));
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,' + (200 + Math.round(p.z * 40)) + ',' + (110 + Math.round(p.z * 60)) + ',' + tw.toFixed(3) + ')';
        ctx.shadowColor = 'rgba(255,214,120,.8)'; ctx.shadowBlur = p.r * 5;
        ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    size();
    window.addEventListener('resize', size, { passive: true });
    new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting;
      if (vis && !running) { running = true; requestAnimationFrame(frame); } else if (!vis) running = false;
    }).observe(hero);
    document.addEventListener('visibilitychange', function () { if (document.hidden) running = false; else if (!running) { running = true; requestAnimationFrame(frame); } });
    requestAnimationFrame(frame);

    var bg = hero.querySelector('.hero-bg, .hero-video');
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--gx', (mx * 100).toFixed(1) + '%');
      hero.style.setProperty('--gy', (my * 100).toFixed(1) + '%');
      if (bg) bg.style.translate = ((.5 - mx) * -22).toFixed(1) + 'px ' + ((.5 - my) * -14).toFixed(1) + 'px';
    }, { passive: true });
  }

  /* ---------- play story: ball follows the path as you scroll ---------- */
  var track = document.querySelector('.playstory-track');
  var pathBg = document.getElementById('playPath');
  var pathFill = document.getElementById('playPathFill');
  var ball = document.getElementById('playBall');
  var pointsG = document.getElementById('playPoints');
  if (track && pathBg && pathFill && ball) {
    var len = pathBg.getTotalLength();
    var stops = [0.02, 0.36, 0.68, 1];
    var items = Array.prototype.slice.call(document.querySelectorAll('.play-steps li'));
    var NS = 'http://www.w3.org/2000/svg';
    var dots = stops.map(function (s, i) {
      var pt = pathBg.getPointAtLength(len * s);
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'pb-point'); g.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')');
      g.innerHTML = '<circle r="20" class="pb-ring"/><circle r="12" class="pb-dot"/><text y="5" text-anchor="middle" class="pb-num">' + (i + 1) + '</text>';
      pointsG.appendChild(g);
      return g;
    });
    pathFill.style.strokeDasharray = len;
    function setProgress(p) {
      p = Math.max(0, Math.min(1, p));
      pathFill.style.strokeDashoffset = len * (1 - p);
      var pt = pathBg.getPointAtLength(len * p);
      var pt2 = pathBg.getPointAtLength(Math.min(len, len * p + 2));
      var ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
      ball.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ') rotate(' + (p * 900) + ')');
      var active = 0;
      stops.forEach(function (s, i) { if (p >= s - .02) active = i; });
      items.forEach(function (li, i) { li.classList.toggle('is-active', i === active); li.classList.toggle('is-done', i < active); });
      dots.forEach(function (g, i) { g.classList.toggle('is-on', i <= active); });
    }
    if (reduce) {
      track.classList.add('is-static'); setProgress(1);
    } else {
      var tick = false;
      var update = function () {
        tick = false;
        var r = track.getBoundingClientRect();
        var total = r.height - window.innerHeight;
        setProgress(total > 0 ? (-r.top) / total : 1);
      };
      window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
      window.addEventListener('resize', update, { passive: true });
      setProgress(0); update();
    }
  }
}());
