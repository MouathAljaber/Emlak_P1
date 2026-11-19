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

  function collect() {
    return {
      clubName: value('clubName'),
      country: value('country'),
      teamType: value('teamType'),
      contactPerson: value('contactPerson'),
      email: value('email'),
      phone: value('phone'),
      players: value('players'),
      staff: value('staff'),
      ageGroup: value('ageGroup'),
      level: value('level'),
      dates: value('dates'),
      nights: value('nights'),
      budget: value('budget'),
      services: Array.prototype.map.call(form.querySelectorAll('input[name="services"]:checked'), function (input) { return input.value; }),
      extras: value('extras'),
      message: value('message'),
      consent: field('gdpr').checked,
      website: value('website'),
      lang: (document.documentElement.lang || 'de').slice(0, 2)
    };
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
      [t['summary.club'], [data.clubName, data.country].filter(Boolean).join(', ')],
      [t['summary.team'], teamLabel(data.teamType)],
      [t['summary.group'], [data.players && data.players + ' ' + t['summary.players'], data.staff && data.staff + ' ' + t['summary.staff'], data.ageGroup].filter(Boolean).join(' · ')],
      [t['summary.trip'], [data.dates, data.nights && data.nights + ' ' + t['summary.nights']].filter(Boolean).join(' · ')],
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
      if (el.required && (el.type === 'checkbox' ? !el.checked : !el.value.trim())) key = 'errors.required';
      else if (el.type === 'email' && el.value && !el.validity.valid) key = 'errors.email';
      else if (el.type === 'number' && !el.validity.valid) key = 'errors.number';
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
    var lines = [
      'Antalya Camp - ' + (data.lang === 'en' ? 'Training camp request' : 'Trainingslager-Anfrage'),
      '',
      'Club: ' + data.clubName,
      'Country: ' + data.country,
      'Team: ' + teamLabel(data.teamType),
      'Contact: ' + data.contactPerson,
      'Email: ' + data.email,
      'Phone: ' + data.phone,
      'Players: ' + data.players,
      'Staff: ' + data.staff,
      'Age group: ' + data.ageGroup,
      'Level: ' + data.level,
      'Dates: ' + data.dates,
      'Nights: ' + data.nights,
      'Budget: ' + data.budget,
      'Services: ' + serviceLabels(data.services).join(', '),
      'Extras: ' + data.extras,
      'Message: ' + data.message
    ];
    var text = lines.join('\n');
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var download = document.createElement('a');
    download.href = url;
    download.download = 'antalya-camp-request.txt';
    document.body.appendChild(download);
    download.click();
    download.remove();
    URL.revokeObjectURL(url);

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
