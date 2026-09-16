/* Trade Grow — site runtime.
   Deliberately small. No framework, no third-party scripts, no cookies set by this file. */

(function () {
  'use strict';

  /* ------------------------------------------------------------ mobile nav */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* -------------------------------------------------- current page marker */

  var here = location.pathname.replace(/\/+$/, '/') || '/';
  document.querySelectorAll('.nav > a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here || (href !== '/' && here.indexOf(href) === 0)) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ------------------------------------------------------------ copyright */

  var y = document.querySelector('[data-year]');
  if (y) y.textContent = String(new Date().getFullYear());

  /* -------------------------------------------------------------- events

     Privacy-conscious event tracking.
     - Honours Do Not Track and Global Privacy Control.
     - Sends only: event name, page path, timestamp, anonymous session id.
     - NEVER sends form field values, PAN, phone numbers, emails or query strings.
     - With no endpoint configured, events are queued in memory only.
  */

  var TRACK_ENDPOINT = null; // set at deploy time; see docs/09-analytics-and-events.md

  var dnt =
    navigator.doNotTrack === '1' ||
    window.doNotTrack === '1' ||
    navigator.globalPrivacyControl === true;

  function sessionId() {
    try {
      var k = 'tg_sid';
      var v = sessionStorage.getItem(k);
      if (!v) {
        v = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()).slice(0, 36);
        sessionStorage.setItem(k, v);
      }
      return v;
    } catch (e) {
      return 'no-storage';
    }
  }

  var queue = [];

  function track(name, props) {
    if (dnt) return;
    var ev = {
      event: name,
      path: location.pathname, // path only — never search/hash, which can carry PII
      ts: new Date().toISOString(),
      sid: sessionId(),
      props: props || {},
    };
    queue.push(ev);
    if (!TRACK_ENDPOINT) return;
    try {
      var body = JSON.stringify(ev);
      if (navigator.sendBeacon) navigator.sendBeacon(TRACK_ENDPOINT, new Blob([body], { type: 'application/json' }));
      else fetch(TRACK_ENDPOINT, { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' }, keepalive: true });
    } catch (e) {
      /* tracking must never break the page */
    }
  }

  window.tgTrack = track;
  window.tgQueue = queue;

  // Page view, named per route.
  var VIEW = {
    '/': 'homepage_view',
    '/verify/': 'verify_page_view',
    '/pricing/': 'pricing_view',
    '/compare/': 'comparison_view',
    '/platform/': 'platform_demo',
    '/faq/': 'faq_view',
    '/open-account/': 'kyc_start',
    '/security/': 'security_view',
    '/security-awareness/': 'security_awareness_view',
    '/support/': 'support_view',
  };
  track(VIEW[here] || 'page_view');

  // Declarative events via data-ev.
  document.addEventListener(
    'click',
    function (e) {
      var el = e.target.closest('[data-ev]');
      if (el) track(el.getAttribute('data-ev'), { label: (el.textContent || '').trim().slice(0, 60) });
    },
    { passive: true }
  );

  // Outbound verification clicks — the signal that matters most for a new broker.
  document.addEventListener(
    'click',
    function (e) {
      var a = e.target.closest('a[href^="http"]');
      if (!a) return;
      if (a.hostname === location.hostname) return;
      track('registration_verify_click', { host: a.hostname });
    },
    { passive: true }
  );

  /* ------------------------------------------------------ support ticket */

  var ticketForm = document.getElementById('ticket-form');
  if (ticketForm) {
    ticketForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('ticket-status');
      var endpoint = ticketForm.getAttribute('data-endpoint');

      if (!endpoint) {
        status.className = 'form-status form-status--err';
        status.textContent =
          'The ticket endpoint is not configured yet. Please use the phone or email channels listed above.';
        return;
      }

      status.className = 'form-status';
      status.textContent = 'Submitting…';

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(ticketForm))),
      })
        .then(function (r) {
          if (!r.ok) throw new Error('bad status');
          return r.json();
        })
        .then(function (d) {
          status.className = 'form-status form-status--ok';
          status.textContent = 'Ticket received. Reference: ' + (d.reference || '—') + '. We will respond by email.';
          ticketForm.reset();
          track('support_ticket_created');
        })
        .catch(function () {
          status.className = 'form-status form-status--err';
          status.textContent = 'We could not submit your ticket. Please call or email us using the details above.';
        });
    });
  }
})();
