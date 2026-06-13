document.documentElement.classList.add('js');

var form = document.getElementById('local-form');
var statusEl = document.getElementById('local-status');
var resultEl = document.getElementById('local-result');
var greetingEl = document.getElementById('readout-greeting');
var introEl = document.getElementById('readout-intro');
var factsEl = document.getElementById('readout-facts');
var ctaEl = document.getElementById('readout-cta');

function setStatus(message, state) {
  if (!statusEl) return;
  statusEl.textContent = message || '';
  if (state) statusEl.setAttribute('data-state', state);
  else statusEl.removeAttribute('data-state');
}

function setLoading(loading) {
  if (!form) return;
  var button = form.querySelector('button[type="submit"]');
  if (!button) return;
  button.disabled = loading;
  button.textContent = loading ? 'Reading your garden.' : 'Download the app.';
}

function addText(el, text) {
  if (el) el.textContent = text || '';
}

function renderFacts(facts) {
  if (!factsEl) return;
  factsEl.replaceChildren();
  (facts || []).forEach(function (fact) {
    var card = document.createElement('article');
    card.className = 'readout-card';

    var header = document.createElement('div');
    header.className = 'readout-card-header';

    var label = document.createElement('span');
    label.className = 'readout-card-label';
    label.textContent = fact.label || '';

    var value = document.createElement('span');
    value.className = 'readout-card-value';
    value.textContent = fact.value || '';

    header.appendChild(label);
    header.appendChild(value);
    card.appendChild(header);
    factsEl.appendChild(card);
  });
}

function renderReadout(readout) {
  document.body.classList.add('has-readout');
  addText(greetingEl, readout.greeting);
  addText(introEl, readout.intro);
  addText(ctaEl, readout.cta);
  renderFacts(readout.facts);
  if (resultEl) {
    resultEl.hidden = false;
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    setStatus('', null);

    var data = new FormData(form);
    var name = String(data.get('name') || '').trim();
    var postcode = String(data.get('postcode') || '').trim();

    if (!postcode) {
      setStatus('Add a UK postcode to get the readout.', 'error');
      return;
    }

    setLoading(true);
    setStatus('Reading the rain, soil and week ahead.', null);

    fetch('/api/local-readout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, postcode: postcode }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (payload) {
        if (!payload || payload.ok === false) {
          var error = payload && payload.error === 'invalid_postcode'
            ? 'That postcode did not read. Try the full UK postcode.'
            : 'That did not read cleanly. Try again in a moment.';
          setStatus(error, 'error');
          return;
        }
        renderReadout(payload.readout || {});
        setStatus('', null);
      })
      .catch(function () {
        setStatus('That did not read cleanly. Try again in a moment.', 'error');
      })
      .finally(function () {
        setLoading(false);
      });
  });
}
