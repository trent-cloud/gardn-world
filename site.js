/* gardn.world — progressive enhancement only. The site works with JS off.
   Demonstrates the designed newsletter states for the dev handoff:
   - inline success (no reload) + locked error string
   - post-signup share step (Web Share API, copy-link fallback)
   - cookieless analytics events documented: newsletter_signup, share_click
   Mobile nav + scroll reveals. No third-party widgets. */

document.documentElement.classList.add('js');

/* ---- analytics shim (dev wires Vercel Web Analytics — cookieless) ---- */
function track(event, props) {
  // PROD: window.va && window.va('event', { name: event, ...props });
  (window.__events = window.__events || []).push({ event, props, t: Date.now() });
  // eslint-disable-next-line no-console
  console.log('[analytics]', event, props || {});
}

/* ---- newsletter forms ---- */
document.querySelectorAll('.news').forEach(function (wrap) {
  var form = wrap.querySelector('form');
  if (!form) return;
  var status = wrap.querySelector('.status');
  var input = form.querySelector('input[type="email"]');
  var hp = form.querySelector('.hp input');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (status) { status.textContent = ''; status.removeAttribute('data-state'); }
    if (hp && hp.value) { return; } // honeypot tripped — silently succeed for bots
    var email = (input.value || '').trim();
    var ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!ok) {
      // locked error string — no grovelling, no exclamation
      if (status) { status.textContent = 'That didn’t work. Try again?'; status.setAttribute('data-state', 'error'); }
      input.focus();
      return;
    }
    // POST /api/subscribe → Resend Audiences (duplicate = success; thank-you even on server error).
    function showSuccess() {
      wrap.classList.add('is-success');
      track('newsletter_signup', { placement: wrap.getAttribute('data-variant') || 'page' });
      var head = wrap.querySelector('.thanks .t-head');
      if (head) { head.setAttribute('tabindex', '-1'); head.focus(); }
    }
    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    })
      .then(function (r) { return r.json().catch(function () { return { ok: true }; }); })
      .then(function (data) {
        if (data && data.ok === false) {
          if (status) { status.textContent = 'That didn’t work. Try again?'; status.setAttribute('data-state', 'error'); }
          input.focus();
        } else { showSuccess(); }
      })
      .catch(function () { showSuccess(); });
  });
});

/* ---- share step ---- */
document.querySelectorAll('.share-btn').forEach(function (btn) {
  btn.addEventListener('click', async function () {
    var shareData = {
      title: 'Gardn',
      text: 'A garden app that grows with you. Join the list.',
      url: 'https://gardn.world'
    };
    track('share_click', {});
    try {
      if (navigator.share) { await navigator.share(shareData); return; }
    } catch (err) { /* user cancelled — no-op */ }
    try {
      await navigator.clipboard.writeText(shareData.url);
      var label = btn.querySelector('.share-label');
      if (label) { var prev = label.textContent; label.textContent = 'Link copied.'; setTimeout(function () { label.textContent = prev; }, 2200); }
    } catch (e2) { /* clipboard blocked — no-op */ }
  });
});

/* ---- mobile nav ---- */
var toggle = document.querySelector('.nav-toggle');
var links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* ---- scroll reveals ---- */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
} else {
  document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
}
