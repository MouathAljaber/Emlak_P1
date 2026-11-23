/* Antalya Camp — homepage: multi-step enquiry form. */
(function () {
  'use strict';

  var i18nEl = document.getElementById('i18n');
  var t = i18nEl ? JSON.parse(i18nEl.textContent) : {};
  var form = document.getElementById('offerForm');
  if (!form) return;

  var storageKey = 'antalya-camp-form';
  var steps = Array.prototype.slice.call(form.querySelectorAll('.form-step'));
  var stepper = Array.prototype.slice.call(document.querySelectorAll('.stepper li'));
  var progressText = document.getElementById('formProgressText');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var formNav = document.getElementById('formNav');
  var successPanel = document.getElementById('successPanel');
  var errorEl = document.getElementById('formError');
  var summary = document.getElementById('formSummary');
  var total = steps.length;
  var current = 1;

  function field(id) { return document.getElementById(id); }
  function value(id) { var el = field(id); return el ? el.value.trim() : ''; }
  function format(template, values) {
    return String(template || '').replace(/\{(\w+)\}/g, function (_, key) { return values[key]; });
  }

  var SELECTS = ['country', 'teamType', 'players', 'staff', 'ageGroup', 'level', 'startMonth', 'flexibility', 'nights', 'budget'];
  var RE_NAME = /^[\p{L}\p{M}][\p{L}\p{M} .'-]{1,79}$/u;
  var RE_CLUB = /^[\p{L}\p{N}][\p{L}\p{N}\p{M} .,'&()\/+-]{1,99}$/u;
  var RE_EMAIL = /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  var RE_PHONE = /^\+?[0-9 ()./-]{6,25}$/;

  function selectedLabel(id) {
    var el = field(id);
    return el && el.selectedIndex > 0 ? el.options[el.selectedIndex].textContent : '';
  }

  // Fill the month select: next 18 months plus "flexible".
  (function fillMonths() {
    var sel = field('startMonth');
    if (!sel) return;
    var lang = (document.documentElement.lang || 'de').slice(0, 2);
    var fmt = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'de-DE', { month: 'long', year: 'numeric' });
    var now = new Date();
    for (var i = 0; i < 18; i++) {
      var d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      var o = document.createElement('option');
      o.value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      o.textContent = fmt.format(d);
      sel.appendChild(o);
    }
    var flex = document.createElement('option');
    flex.value = 'flexible';
    flex.textContent = sel.getAttribute('data-flexible') || 'Flexible';
    sel.appendChild(flex);
  }());

  // Live input filters: names without digits, phone without letters.
  var nameEl = field('contactPerson');
  if (nameEl) nameEl.addEventListener('input', function () { nameEl.value = nameEl.value.replace(/[0-9_@#$%^*=+<>{}\[\]\\|~`!?;:"\/]/g, ''); });
  var phoneEl = field('phone');
  if (phoneEl) phoneEl.addEventListener('input', function () { phoneEl.value = phoneEl.value.replace(/[^0-9+ ()./-]/g, ''); });

  function collect() {
    var data = {
      clubName: value('clubName').replace(/\s+/g, ' '),
      contactPerson: value('contactPerson').replace(/\s+/g, ' '),
      email: value('email').toLowerCase(),
      phone: value('phone'),
      services: Array.prototype.map.call(form.querySelectorAll('input[name="services"]:checked'), function (input) { return input.value; }),
      extras: value('extras'),
      message: value('message'),
      consent: field('gdpr').checked,
      website: value('website'),
      lang: (document.documentElement.lang || 'de').slice(0, 2),
      labels: {}
    };
    SELECTS.forEach(function (id) { data[id] = value(id); data.labels[id] = selectedLabel(id); });
    return data;
  }

  function teamLabel(teamValue) {
    var option = form.querySelector('#teamType option[value="' + teamValue + '"]');
    return option ? option.textContent : teamValue;
  }

  function serviceLabels(values) {
    return values.map(function (service) {
      var input = form.querySelector('input[name="services"][value="' + service.replace(/"/g, '\\"') + '"]');
      return input ? input.nextElementSibling.textContent : service;
    });
  }

  function renderSummary() {
    var data = collect();
    summary.innerHTML = '';
    var heading = document.createElement('strong');
    heading.textContent = t['summary.title'];
    summary.appendChild(heading);
    [
      [t['summary.club'], [data.clubName, data.labels.country].filter(Boolean).join(', ')],
      [t['summary.team'], teamLabel(data.teamType)],
      [t['summary.group'], [data.labels.players && data.labels.players + ' ' + t['summary.players'], data.labels.staff && data.labels.staff + ' ' + t['summary.staff'], data.labels.ageGroup, data.labels.level].filter(Boolean).join(' · ')],
      [t['summary.trip'], [data.labels.startMonth, data.labels.flexibility, data.labels.nights, data.labels.budget].filter(Boolean).join(' · ')],
      [t['summary.services'], serviceLabels(data.services).join(', ')]
    ].forEach(function (row) {
      var line = document.createElement('span');
      var label = document.createElement('b');
      label.textContent = row[0] + ': ';
      line.appendChild(label);
      line.appendChild(document.createTextNode(row[1] || '—'));
      summary.appendChild(line);
    });
  }

  function render(animate) {
    steps.forEach(function (step) {
      var active = Number(step.getAttribute('data-step')) === current;
      step.hidden = !active;
      step.classList.toggle('is-entering', active && animate);
    });
    stepper.forEach(function (item, index) {
      var n = index + 1;
      item.classList.toggle('active', n === current);
      item.classList.toggle('done', n < current);
      if (n === current) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
    });
    prevBtn.hidden = current === 1;
    progressText.textContent = format(t['progress'], { current: current, total: total });
    nextBtn.innerHTML = current === total
      ? t['btn.submit']
      : t['btn.next'] + ' <span class="arrow" aria-hidden="true">→</span>';
    if (current === total) renderSummary();
  }

  function clearErrors(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll('.field-error'), function (el) { el.remove(); });
    Array.prototype.forEach.call(scope.querySelectorAll('[aria-invalid="true"]'), function (el) { el.removeAttribute('aria-invalid'); });
  }

  function showError(el, key) {
    el.setAttribute('aria-invalid', 'true');
    var message = document.createElement('span');
    message.className = 'field-error';
    message.id = el.id + '-error';
    message.textContent = t[key];
    el.setAttribute('aria-describedby', message.id);
    (el.type === 'checkbox' ? el.parentElement.parentElement : el.parentElement).appendChild(message);
  }

  function stepValid() {
    var stepEl = steps[current - 1];
    clearErrors(stepEl);
    var firstInvalid = null;
    Array.prototype.forEach.call(stepEl.querySelectorAll('input, select, textarea'), function (el) {
      if (el.name === 'services' || el.name === 'website') return;
      var key = '';
      var v = el.value.trim();
      if (el.required && (el.type === 'checkbox' ? !el.checked : !v)) key = el.tagName === 'SELECT' ? 'errors.choose' : 'errors.required';
      else if (el.id === 'clubName' && !RE_CLUB.test(v.replace(/\s+/g, ' '))) key = 'errors.club';
      else if (el.id === 'contactPerson' && (!RE_NAME.test(v) || v.split(/\s+/).length < 2)) key = 'errors.name';
      else if (el.id === 'email' && !RE_EMAIL.test(v)) key = 'errors.email';
      else if (el.id === 'phone' && (!RE_PHONE.test(v) || v.replace(/\D/g, '').length < 7 || v.replace(/\D/g, '').length > 15)) key = 'errors.phone';
      if (key) {
        showError(el, key);
        if (!firstInvalid) firstInvalid = el;
      }
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function save() {
    try {
      var data = collect();
      delete data.website;
      data.current = current;
      sessionStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) { /* storage unavailable */ }
  }

  function restore() {
    try {
      var saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
      if (!saved) return;
      Object.keys(saved).forEach(function (id) {
        if (id === 'current' || id === 'services' || id === 'consent') return;
        var el = field(id);
        if (el && typeof saved[id] === 'string') el.value = saved[id];
      });
      if (Array.isArray(saved.services)) {
        Array.prototype.forEach.call(form.querySelectorAll('input[name="services"]'), function (input) {
          input.checked = saved.services.indexOf(input.value) !== -1;
        });
      }
      field('gdpr').checked = saved.consent === true;
      if (Number.isInteger(saved.current) && saved.current >= 1 && saved.current <= total) current = saved.current;
    } catch (e) { /* ignore corrupt state */ }
  }

  function focusStepHeading() {
    var heading = steps[current - 1].querySelector('h3');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
    var card = document.querySelector('.form-card');
    if (card && card.getBoundingClientRect().top < 0) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function submit() {
    errorEl.hidden = true;
    var data = collect();
    nextBtn.disabled = true;
    fetch('/api/offer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }).then(function (j) { return { ok: r.ok && j.ok, fields: j.fields }; }); })
      .catch(function () { return { ok: false }; })
      .then(function (res) {
        nextBtn.disabled = false;
        if (!res.ok) { errorEl.textContent = res.fields ? t['errors.fields'] : t['errors.send']; errorEl.hidden = false; return; }
        showSuccess();
      });
  }

  function showSuccess() {
    var ref = document.getElementById('successRef');
    if (ref) ref.hidden = true;
    steps.forEach(function (step) { step.hidden = true; });
    formNav.hidden = true;
    formNav.style.display = 'none';
    document.querySelector('.stepper').style.visibility = 'hidden';
    progressText.textContent = '';
    successPanel.hidden = false;
    successPanel.querySelector('h3').setAttribute('tabindex', '-1');
    successPanel.querySelector('h3').focus();
    try { sessionStorage.removeItem(storageKey); } catch (e) { /* ignore */ }
    if (window.analyticsLoaded) window.gtag('event', 'generate_lead', { event_category: 'enquiry_form' });
  }

  nextBtn.addEventListener('click', function () {
    if (!stepValid()) return;
    if (current < total) {
      current += 1;
      render(true);
      save();
      focusStepHeading();
    } else {
      submit();
    }
  });

  prevBtn.addEventListener('click', function () {
    if (current > 1) {
      current -= 1;
      render(true);
      save();
      focusStepHeading();
    }
  });

  form.addEventListener('submit', function (event) { event.preventDefault(); nextBtn.click(); });
  form.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT' && event.target.type !== 'checkbox') {
      event.preventDefault();
      nextBtn.click();
    }
  });
  form.addEventListener('input', function (event) {
    var el = event.target;
    if (el.getAttribute('aria-invalid') === 'true' && el.validity.valid && (el.type === 'checkbox' ? el.checked : el.value.trim())) {
      el.removeAttribute('aria-invalid');
      var error = document.getElementById(el.id + '-error');
      if (error) error.remove();
    }
    save();
  });
  form.addEventListener('change', save);


  restore();
  render(false);
}());
