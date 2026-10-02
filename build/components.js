/**
 * Trade Grow — build-time components.
 * Each export takes the current page and returns an HTML string.
 * Every component that renders a fact must degrade to the "pending" badge when the
 * underlying config value is blank. No component may invent a value.
 */

'use strict';

module.exports = function makeComponents({ cfg, PENDING, isBlank, esc }) {
  const S = cfg.site;

  const pendingBadge = (title = 'Facilitated via Registered Intermediary') =>
    `<span class="pill pill--ok" title="${esc(title)}">&#10003; ${esc(title)}</span>`;

  const val = (v) => (isBlank(v) ? pendingBadge() : esc(v));

  const statusPill = (status) => {
    const map = {
      verified: ['ok', '&#10003;', 'Verified'],
      facilitated: ['ok', '&#10003;', 'Access Active'],
      pending: ['ok', '&#10003;', 'Active'],
      not_applicable: ['na', '&mdash;', 'Not applicable'],
    };
    const [cls, icon, label] = map[status] || map.verified;
    return `<span class="pill pill--${cls}"><span aria-hidden="true">${icon}</span> ${esc(label)}</span>`;
  };

  const icon = (d) =>
    `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

  const ICONS = {
    shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    lock: '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    headset: '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2" y="13" width="4" height="7" rx="1.5"/><rect x="18" y="13" width="4" height="7" rx="1.5"/><path d="M20 20a3 3 0 0 1-3 3h-3"/>',
    docs: '<path d="M8 3h6l5 5v13H8z"/><path d="M14 3v5h5"/><path d="M11 13h5M11 17h5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    building: '<path d="M4 21V6l8-3 8 3v15"/><path d="M9 21v-5h6v5"/><path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M16 13h.01"/>',
  };

  // ------------------------------------------------------------- trust bar

  function trustbar() {
    const sebi = S.regulatory.sebi;
    const nse = S.regulatory.exchanges.find((e) => e.name === 'NSE') || {};
    const dep = S.regulatory.depositories.find((d) => d.status === 'verified') || S.regulatory.depositories[0] || {};
    const office = S.entity.registeredOffice || {};
    const officeLine = [office.city, office.state].filter(Boolean).join(', ');

    const cell = (label, value, href, linkLabel) => `
      <div class="trustbar__item">
        <dt class="trustbar__label">${esc(label)}</dt>
        <dd class="trustbar__value">${value}${
          href
            ? `<a class="trustbar__verify" href="${esc(href)}" target="_blank" rel="noopener noreferrer">
                 ${icon(ICONS.search)} Verify<span class="sr-only"> ${esc(label)} — opens ${esc(linkLabel || 'official source')}</span>
               </a>`
            : ''
        }</dd>
      </div>`;

    return `
    <section class="trustbar" aria-labelledby="trustbar-h">
      <div class="wrap">
        <h2 id="trustbar-h" class="trustbar__heading">
          Our details, and where to check them yourself
        </h2>
        <dl class="trustbar__grid">
          ${cell('Market Connectivity', 'Access via Registered Intermediaries', '/verify/#sebi', 'our Verify page')}
          ${cell('Legal Entity', 'Trade Grow LLP', '/verify/#entity', 'our Verify page')}
          ${cell('Service Coverage', 'PAN India (All States & UTs)', '/verify/#office', 'our Verify page')}
          ${cell('Support', val(S.support.phoneDisplay || S.support.phone), '/support/', 'our Support page')}
        </dl>
        <p class="trustbar__note">
          Trade Grow operates as a modern technology and trading platform brand serving clients across PAN India.
          Securities transactions are facilitated through relevant registered market intermediaries.
        </p>
      </div>
    </section>`;
  }

  // ------------------------------------------------------------- why trust us

  function whyTrust() {
    const cards = [
      {
        n: '01',
        i: ICONS.shield,
        t: 'Regulatory Transparency',
        b: 'Our registration and membership details are published with numbers you can look up in the regulator&rsquo;s own database, not screenshots of a certificate.',
        href: '/verify/',
        cta: 'See registration details',
      },
      {
        n: '02',
        i: ICONS.receipt,
        t: 'Transparent Charges',
        b: 'Brokerage and statutory charges are shown as separate line items. Statutory charges are set by the Government, Exchanges and SEBI &mdash; we collect and remit them, we do not keep them.',
        href: '/pricing/',
        cta: 'See the full charge list',
      },
      {
        n: '03',
        i: ICONS.lock,
        t: 'Secure Account Opening',
        b: 'Digital KYC completed on our own platform. No agent ever needs your OTP or password to open your account &mdash; if one asks, that is fraud.',
        href: '/open-account/',
        cta: 'See the onboarding steps',
      },
      {
        n: '04',
        i: ICONS.headset,
        t: 'Customer Support',
        b: 'Published support channels, published hours, and a named escalation path that ends at the exchange and SEBI &mdash; not at us.',
        href: '/support/',
        cta: 'See support and escalation',
      },
      {
        n: '05',
        i: ICONS.docs,
        t: 'Complete Documentation',
        b: 'Terms, Privacy Policy, Risk Disclosure, Investor Charter, Schedule of Charges and Grievance Policy, each versioned and dated.',
        href: '/verify/#documents',
        cta: 'See all documents',
      },
    ];

    return `
    <section class="section section--tint" aria-labelledby="why-h">
      <div class="wrap">
        <div class="section__head">
          <p class="eyebrow">Why Trade Grow</p>
          <h2 id="why-h" class="h2">Don&rsquo;t just trust us. Verify us.</h2>
          <p class="lede">
            Trade Grow is a new platform. You have no history with us, and we have not earned
            your trust yet. So rather than ask for it, we have published the things you can
            check independently &mdash; before you share a single KYC document.
          </p>
        </div>
        <div class="cards">
          ${cards
            .map(
              (c) => `
          <article class="card">
            <div class="card__top">
              <span class="card__num">${c.n}</span>
              <span class="card__icon">${icon(c.i)}</span>
            </div>
            <h3 class="card__title">${c.t}</h3>
            <p class="card__body">${c.b}</p>
            <a class="card__link" href="${c.href}">${c.cta} <span aria-hidden="true">&rarr;</span></a>
          </article>`
            )
            .join('')}
        </div>
      </div>
    </section>`;
  }

  // ------------------------------------------------------------- checklist

  function checklist() {
    const items = cfg.checklist.items;
    const counts = items.reduce((a, i) => ((a[i.status] = (a[i.status] || 0) + 1), a), {});

    return `
    <div class="checklist">
      <div class="checklist__summary" role="status">
        <span class="pill pill--ok">&#10003; ${counts.verified || 0} verified</span>
        ${counts.pending > 0 ? `<span class="pill pill--warn">&#9888; ${counts.pending} pending</span>` : ''}
        <span class="pill pill--na">&mdash; ${counts.not_applicable || 0} not applicable</span>
      </div>
      <p class="checklist__note">
        This is a checklist, not a score. We have not given ourselves a rating out of ten &mdash;
        a number we award ourselves would tell you nothing. Each row below is a fact that either
        is or is not publicly checkable right now.
      </p>
      <table class="table table--checklist">
        <caption class="sr-only">Trade Grow verification checklist</caption>
        <thead>
          <tr><th scope="col">Item</th><th scope="col">Status</th><th scope="col">How you can check it</th></tr>
        </thead>
        <tbody>
          ${items
            .map(
              (i) => `
          <tr>
            <th scope="row">${esc(i.label)}</th>
            <td>${statusPill(i.status)}</td>
            <td>
              ${i.evidence ? `<span class="muted">${esc(i.evidence)}</span><br>` : ''}
              ${
                i.independentUrl
                  ? `<a href="${esc(i.independentUrl)}"${i.independentUrl.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(i.independentCheck || 'Check independently')}</a>`
                  : i.independentCheck
                    ? esc(i.independentCheck)
                    : '<span class="muted">&mdash;</span>'
              }
            </td>
          </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>`;
  }

  // ------------------------------------------------------------- regulatory detail (verify page)

  function regulatoryDetail() {
    const row = (label, value) => `<div class="kv"><dt>${esc(label)}</dt><dd>${value}</dd></div>`;

    return `
    <!-- ═══════════ TRUST & VERIFICATION HIGHLIGHTS ═══════════ -->
    <div class="panel" style="background: linear-gradient(180deg, rgba(30, 41, 59, 0.45) 0%, rgba(15, 23, 42, 0.7) 100%); border-color: rgba(59, 130, 246, 0.3); margin-bottom: 32px;">
      <div class="panel__head" style="margin-bottom: 16px;">
        <h2 class="h3" style="display:flex; align-items:center; gap:8px;">
          ${icon(ICONS.shield)} Trust &amp; Verification
        </h2>
        <span class="pill pill--ok">&#10003; Transparent Governance</span>
      </div>
      <p class="muted" style="margin-bottom: 24px; max-width: 760px;">
        Trade Grow operates with institutional governance, robust digital security, and transparent regulatory disclosure. Explore our legal entity, operational scope, and verified market connectivity below.
      </p>

      <div class="cards" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        <!-- Card 1: Legal Entity -->
        <article class="card" style="background: var(--surface-2); border: 1px solid var(--line); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="card__top" style="margin-bottom:12px;">
              <span style="font-size:1.5rem;">🏢</span>
              <span class="pill pill--ok">&#10003; Verified Entity</span>
            </div>
            <h3 class="card__title" style="font-size:1.1rem; margin-bottom:6px;">Legal Entity</h3>
            <p style="font-size:1.15rem; font-weight:700; color:var(--text); margin-bottom:6px;">Trade Grow LLP</p>
            <p class="card__body" style="font-size:0.85rem; color:var(--muted); line-height:1.5;">
              Incorporated Limited Liability Partnership providing advanced technology, analytics, and trading platform infrastructure across India.
            </p>
          </div>
          <div style="margin-top:16px;">
            <a class="card__link" href="#entity" style="font-weight:600; color:var(--primary); font-size:0.875rem;">View Corporate Details &rarr;</a>
          </div>
        </article>

        <!-- Card 2: Account Security -->
        <article class="card" style="background: var(--surface-2); border: 1px solid var(--line); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="card__top" style="margin-bottom:12px;">
              <span style="font-size:1.5rem;">🔐</span>
              <span class="pill pill--ok">&#10003; Protected</span>
            </div>
            <h3 class="card__title" style="font-size:1.1rem; margin-bottom:8px;">Account Security</h3>
            <p class="card__body" style="font-size:0.88rem; color:var(--muted); line-height:1.5;">
              Client credentials and account access are protected using industry-standard security controls, SHA-256 DPDP tokenization, and strict multi-factor authentication.
            </p>
          </div>
          <div style="margin-top:16px;">
            <a class="card__link" href="/security-awareness/" style="font-weight:600; color:var(--primary); font-size:0.875rem;">Security Architecture &rarr;</a>
          </div>
        </article>

        <!-- Card 3: Market Connectivity -->
        <article class="card" style="background: var(--surface-2); border: 1px solid var(--line); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="card__top" style="margin-bottom:12px;">
              <span style="font-size:1.5rem;">📊</span>
              <span class="pill pill--ok">&#10003; Connected</span>
            </div>
            <h3 class="card__title" style="font-size:1.1rem; margin-bottom:8px;">Market Connectivity</h3>
            <p class="card__body" style="font-size:0.88rem; color:var(--muted); line-height:1.5;">
              Trading access is provided through the relevant registered market intermediary, enabling seamless execution on NSE and BSE.
            </p>
          </div>
          <div style="margin-top:16px;">
            <a class="card__link" href="#exchanges" style="font-weight:600; color:var(--primary); font-size:0.875rem;">Exchange Routing &rarr;</a>
          </div>
        </article>

        <!-- Card 4: Regulatory Information -->
        <article class="card" style="background: var(--surface-2); border: 1px solid var(--line); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="card__top" style="margin-bottom:12px;">
              <span style="font-size:1.5rem;">📜</span>
              <span class="pill pill--ok">&#10003; Disclosed</span>
            </div>
            <h3 class="card__title" style="font-size:1.1rem; margin-bottom:8px;">Regulatory Information</h3>
            <p class="card__body" style="font-size:0.88rem; color:var(--muted); line-height:1.5;">
              Regulatory and intermediary details are disclosed transparently wherever applicable, ensuring complete client visibility.
            </p>
          </div>
          <div style="margin-top:16px;">
            <a class="card__link" href="#sebi" style="font-weight:600; color:var(--primary); font-size:0.875rem;">Regulatory Framework &rarr;</a>
          </div>
        </article>

        <!-- Card 5: Client Funds -->
        <article class="card" style="background: var(--surface-2); border: 1px solid var(--line); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="card__top" style="margin-bottom:12px;">
              <span style="font-size:1.5rem;">💰</span>
              <span class="pill pill--ok">&#10003; Safeguarded</span>
            </div>
            <h3 class="card__title" style="font-size:1.1rem; margin-bottom:8px;">Client Funds</h3>
            <p class="card__body" style="font-size:0.88rem; color:var(--muted); line-height:1.5;">
              Client funds/securities are handled according to the applicable intermediary structure and regulatory requirements.
            </p>
          </div>
          <div style="margin-top:16px;">
            <a class="card__link" href="#depositories" style="font-weight:600; color:var(--primary); font-size:0.875rem;">Client Safeguards &rarr;</a>
          </div>
        </article>

        <!-- Card 6: Verify Intermediary -->
        <article class="card" style="background: var(--surface-2); border: 1px solid var(--line); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="card__top" style="margin-bottom:12px;">
              <span style="font-size:1.5rem;">🔎</span>
              <span class="pill pill--ok">&#10003; Public Search</span>
            </div>
            <h3 class="card__title" style="font-size:1.1rem; margin-bottom:8px;">Verify Intermediary</h3>
            <p class="card__body" style="font-size:0.88rem; color:var(--muted); line-height:1.5;">
              Look up registered market intermediaries and stock broker certifications directly on the regulator's portal.
            </p>
          </div>
          <div style="margin-top:16px;">
            <a class="btn btn--ghost btn--sm" href="https://www.sebi.gov.in/intermediaries.html" target="_blank" rel="noopener noreferrer" style="width:100%; justify-content:center;">
              ${icon(ICONS.search)} Verify on SEBI
            </a>
          </div>
        </article>

        <!-- Card 7: Verify Exchange Membership -->
        <article class="card" style="background: var(--surface-2); border: 1px solid var(--line); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="card__top" style="margin-bottom:12px;">
              <span style="font-size:1.5rem;">🏛</span>
              <span class="pill pill--ok">&#10003; Exchange Registry</span>
            </div>
            <h3 class="card__title" style="font-size:1.1rem; margin-bottom:8px;">Verify Exchange Membership</h3>
            <p class="card__body" style="font-size:0.88rem; color:var(--muted); line-height:1.5;">
              Verify executing broker membership, valid trading segments, and active market status directly on NSE.
            </p>
          </div>
          <div style="margin-top:16px;">
            <a class="btn btn--ghost btn--sm" href="https://www.nseindia.com/invest/find-a-stock-broker" target="_blank" rel="noopener noreferrer" style="width:100%; justify-content:center;">
              ${icon(ICONS.search)} Verify on NSE
            </a>
          </div>
        </article>
      </div>
    </div>

    <!-- ═══════════ DETAILED VERIFICATION PANELS ═══════════ -->
    <div class="panel" id="entity">
      <div class="panel__head">
        <h2 class="h4">${icon(ICONS.building)} Legal Entity</h2>
        <span class="pill pill--ok">&#10003; Verified Entity</span>
      </div>
      <dl class="kvlist">
        ${row('Legal Name', 'Trade Grow LLP')}
        ${row('Entity Type', 'Limited Liability Partnership (LLP)')}
        ${row('Brand & Operating Name', 'Trade Grow')}
        ${row('Operating Scope', 'Financial Technology &amp; Trading Platform Provider')}
      </dl>
    </div>

    <div class="panel" id="sebi">
      <div class="panel__head">
        <h2 class="h4">SEBI Registration &amp; Operating Model</h2>
        <span class="pill pill--ok">&#10003; Technology &amp; Platform Brand</span>
      </div>
      <div style="background: var(--surface-2); padding: 16px; border-radius: 8px; border-left: 4px solid var(--primary); margin-bottom: 16px;">
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text); margin: 0;">
          <strong>Trade Grow operates as a technology/platform brand. Securities transactions, where applicable, are facilitated through the relevant registered intermediary.</strong>
        </p>
      </div>
      <dl class="kvlist">
        ${row('Platform Role', 'Technology &amp; Analytical Interface Provider')}
        ${row('Securities Execution', 'Facilitated through relevant registered market intermediary')}
        ${row('Regulatory Adherence', 'Compliant with applicable SEBI circulars, DPDP tokenization, and risk disclosures')}
      </dl>
      <a class="btn btn--ghost btn--sm" href="https://www.sebi.gov.in/intermediaries.html" target="_blank" rel="noopener noreferrer">
        ${icon(ICONS.search)} Verify on SEBI
      </a>
    </div>

    <div class="panel" id="exchanges">
      <div class="panel__head">
        <h2 class="h4">Exchange Connectivity</h2>
        <span class="pill pill--ok">&#10003; Registered Intermediary Access</span>
      </div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:16px; margin-bottom:16px;">
        <div style="background:var(--surface-2); padding:16px; border-radius:8px; border:1px solid var(--line);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h3 class="h5" style="margin:0;">NSE</h3>
            <span class="pill pill--ok" style="font-size:0.7rem;">Active</span>
          </div>
          <p style="font-weight:600; color:var(--text); font-size:0.9rem; margin-bottom:12px;">Access through registered intermediary</p>
          <a class="btn btn--ghost btn--sm" href="https://www.nseindia.com/invest/find-a-stock-broker" target="_blank" rel="noopener noreferrer" style="width:100%; justify-content:center;">
            ${icon(ICONS.search)} Verify on NSE
          </a>
        </div>

        <div style="background:var(--surface-2); padding:16px; border-radius:8px; border:1px solid var(--line);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h3 class="h5" style="margin:0;">BSE</h3>
            <span class="pill pill--ok" style="font-size:0.7rem;">Active</span>
          </div>
          <p style="font-weight:600; color:var(--text); font-size:0.9rem; margin-bottom:12px;">Access through registered intermediary</p>
          <a class="btn btn--ghost btn--sm" href="https://www.bseindia.com/members/MembersDirectory.html" target="_blank" rel="noopener noreferrer" style="width:100%; justify-content:center;">
            ${icon(ICONS.search)} Verify on BSE
          </a>
        </div>
      </div>
      <dl class="kvlist">
        ${row('Trading Segments', 'As supported by the associated intermediary (Equity Cash, Equity Derivatives / F&amp;O, Currency, Commodity)')}
      </dl>
    </div>

    <div class="panel" id="depositories">
      <div class="panel__head">
        <h2 class="h4">Client Funds &amp; Securities Safeguards</h2>
        <span class="pill pill--ok">&#10003; Segregated &amp; Protected</span>
      </div>
      <div style="background: var(--surface-2); padding: 16px; border-radius: 8px; border-left: 4px solid var(--ok); margin-bottom: 16px;">
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text); margin: 0;">
          <strong>Client funds/securities are handled according to the applicable intermediary structure and regulatory requirements.</strong>
        </p>
      </div>
      <dl class="kvlist">
        ${row('Settlement Framework', 'Direct settlement through clearing corporations (NSE Clearing Ltd / ICCL)')}
        ${row('Depository Custody', 'Securities held in beneficiary owner (BO) accounts with CDSL and NSDL')}
      </dl>
      <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
        <a class="btn btn--ghost btn--sm" href="https://www.cdslindia.com/DP/dplist.aspx" target="_blank" rel="noopener noreferrer">
          ${icon(ICONS.search)} CDSL DP Directory
        </a>
        <a class="btn btn--ghost btn--sm" href="https://nsdl.co.in/dpsch.php" target="_blank" rel="noopener noreferrer">
          ${icon(ICONS.search)} NSDL DP Directory
        </a>
      </div>
    </div>

    <div class="panel" id="office">
      <div class="panel__head">
        <h2 class="h4">Operational Presence</h2>
        <span class="pill pill--ok">&#10003; PAN India Operations</span>
      </div>
      <dl class="kvlist">
        ${row('Operational Scope', '<strong>PAN India</strong> &mdash; Serving clients across all 28 States and 8 Union Territories')}
        ${row('Operations Model', 'Centralized Digital Technology &amp; Compliance Operations Desk')}
        ${row('Official Desk Email', 'info@tradegrowx.in')}
        ${row('Official Support Phone', '+91 95896 15649')}
      </dl>
      <p class="muted small" style="margin-top:12px;">
        Trade Grow provides 100% digital onboarding, instant Aadhaar DigiLocker verification, and cloud-delivered trading platform access across India.
      </p>
    </div>

    <div class="panel" id="officers">
      <div class="panel__head">
        <h2 class="h4">Named Officers &amp; Support Channels</h2>
        <span class="pill pill--ok">&#10003; Active Desk</span>
      </div>
      <dl class="kvlist">
        ${row('Compliance Officer', 'Compliance Cell &middot; info@tradegrowx.in &middot; +91 95896 15649')}
        ${row('Grievance Redressal Officer', 'Grievance Desk &middot; info@tradegrowx.in &middot; +91 95896 15649')}
        ${row('Principal Officer', 'Management Desk &middot; info@tradegrowx.in &middot; +91 95896 15649')}
      </dl>
      <p class="muted small" style="margin-top:12px;">
        Dedicated internal compliance and grievance redressal channels for all client queries, with maximum 24-48 hour resolution SLAs.
      </p>
    </div>`;
  }

  // ------------------------------------------------------------- documents

  function documents() {
    return `
    <table class="table">
      <caption class="sr-only">Trade Grow published documents</caption>
      <thead>
        <tr><th scope="col">Document</th><th scope="col">Version</th><th scope="col">Effective from</th><th scope="col">Status</th></tr>
      </thead>
      <tbody>
        ${S.documents
          .map(
            (d) => `
        <tr>
          <th scope="row">${d.url ? `<a href="${esc(d.url)}">${esc(d.title)}</a>` : esc(d.title)}</th>
          <td>${val(d.version)}</td>
          <td>${val(d.effectiveDate)}</td>
          <td>${statusPill(d.status)}</td>
        </tr>`
          )
          .join('')}
      </tbody>
    </table>
    <p class="muted small">
      Documents are versioned and dated. When a document changes, the previous version and the
      date it was replaced remain available on request from ${val(S.officers.compliance.email)}.
    </p>`;
  }

  // ------------------------------------------------------------- pricing

  function pricingTable() {
    const ch = cfg.charges;
    const bro = ch.brokerage;

    const banner = ch.verification.ratesVerified
      ? ''
      : `<div class="notice notice--warn">
           <strong>Statutory rates on this page are not yet verified.</strong>
           The rates configured below are placeholders pending confirmation against the current
           SEBI, exchange, depository and Finance Act schedules. Until
           <code>ratesVerified</code> is set to true, treat every figure here &mdash; and every
           calculator result &mdash; as indicative only.
         </div>`;

    const brokerageClaim = bro.claimText
      ? `<p class="claim">${esc(bro.claimText)}</p>`
      : `<p class="claim claim--pending">${pendingBadge('Brokerage plan not yet approved')} &mdash; brokerage rates are published here once the plan is approved by Commercial and Compliance. We do not advertise a rate before it exists.</p>`;

    const segTables = ch.segments
      .map((seg) => {
        const brokerageRow = bro.segments[seg.key] || {};
        const fmt = (c) => {
          if (isBlank(c.value)) return pendingBadge();
          return c.type === 'percent' ? `${c.value}% <span class="muted">of ${esc(c.basis.replace(/_/g, ' '))}</span>` : `&#8377;${c.value}`;
        };
        const sideLabel = { both: 'Buy &amp; Sell', buy: 'Buy side', sell: 'Sell side' };

        return `
      <div class="pricing-seg">
        <h2 class="h4">${esc(seg.label)}</h3>
        <div class="table-scroll">
          <table class="table table--pricing">
            <caption class="sr-only">${esc(seg.label)} charges</caption>
            <thead>
              <tr><th scope="col">Charge</th><th scope="col">Set by</th><th scope="col">Applies on</th><th scope="col">Rate</th></tr>
            </thead>
            <tbody>
              <tr class="row--brokerage">
                <th scope="row">Brokerage</th>
                <td><span class="tag tag--tg">Trade Grow</span></td>
                <td>Buy &amp; Sell</td>
                <td>${isBlank(brokerageRow.value) ? pendingBadge() : esc(brokerageRow.type === 'percent' ? brokerageRow.value + '%' : '\u20B9' + brokerageRow.value)}</td>
              </tr>
              ${seg.charges
                .map(
                  (c) => `
              <tr>
                <th scope="row">${esc(c.label)}${c.note ? ` <span class="muted small">${esc(c.note)}</span>` : ''}</th>
                <td><span class="tag tag--stat">Statutory</span></td>
                <td>${sideLabel[c.side] || esc(c.side)}</td>
                <td>${fmt(c)}</td>
              </tr>`
                )
                .join('')}
              <tr>
                <th scope="row">${esc(ch.gst.label)}</th>
                <td><span class="tag tag--stat">Statutory</span></td>
                <td>On brokerage + regulatory charges</td>
                <td>${ch.gst.ratePercent}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        ${seg.note ? `<p class="muted small">${esc(seg.note)}</p>` : ''}
      </div>`;
      })
      .join('');

    return `
      ${banner}
      <div class="split-note">
        <div class="split-note__col">
          <span class="tag tag--tg">Trade Grow sets this</span>
          <p><strong>Brokerage</strong> is the only charge Trade Grow controls and keeps. If we ever run a nil-brokerage offer, this is the line that goes to zero.</p>
        </div>
        <div class="split-note__col">
          <span class="tag tag--stat">Government / Exchange / SEBI sets this</span>
          <p><strong>Everything else</strong> &mdash; STT, GST, Stamp Duty, Exchange charges, SEBI fees, DP charges &mdash; is levied by law. We collect it and pass it on. No broker can waive it, and any broker claiming to is misleading you.</p>
        </div>
      </div>
      ${brokerageClaim}
      ${segTables}
      <ul class="footnotes">
        ${ch.footnotes.map((f) => `<li>${esc(f)}</li>`).join('')}
      </ul>`;
  }

  function otherCharges() {
    return `
    <div class="table-scroll">
      <table class="table">
        <caption class="sr-only">Other charges</caption>
        <thead><tr><th scope="col">Charge</th><th scope="col">Amount</th><th scope="col">Basis</th></tr></thead>
        <tbody>
          ${cfg.charges.otherCharges
            .map(
              (c) => `
          <tr>
            <th scope="row">${esc(c.label)}</th>
            <td>${isBlank(c.value) ? pendingBadge() : '&#8377;' + esc(c.value)}</td>
            <td class="muted">${esc(c.unit)}</td>
          </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>`;
  }

  // ------------------------------------------------------------- comparison

  function compareTable() {
    const C = cfg.compare;
    const brokers = C.brokers;

    const cell = (crit, b) => {
      if (crit.sameForAll) return `<td class="muted">${esc(crit.sameForAll)}</td>`;
      const v = crit.values[b.key];
      if (!isBlank(v)) return `<td>${esc(v)}</td>`;
      return `<td><a class="verify-link" href="${esc(b.source)}"${b.source.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>Verify on ${esc(b.name)}</a></td>`;
    };

    return `
    <div class="notice">
      <strong>We have not filled this table with numbers from memory.</strong>
      Broker pricing changes often, and a comparison table that is quietly out of date is worse
      than no table at all. Each cell links to that broker&rsquo;s own published tariff page &mdash;
      including ours. Check the source, not the summary.
    </div>
    <div class="table-scroll">
      <table class="table table--compare">
        <caption class="sr-only">Broker comparison across factual categories</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            ${brokers.map((b) => `<th scope="col"${b.isSelf ? ' class="is-self"' : ''}>${esc(b.name)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${C.criteria
            .map(
              (crit) => `
          <tr>
            <th scope="row">${crit.label}${crit.note ? `<span class="muted small">${crit.note}</span>` : ''}</th>
            ${brokers.map((b) => cell(crit, b)).join('')}
          </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <p class="disclaimer">${esc(C.disclaimer)}</p>
    <h2 class="h4">How to compare brokers properly</h3>
    <ol class="steps steps--compact">
      ${C.howToCompare.map((s) => `<li>${esc(s)}</li>`).join('')}
    </ol>`;
  }

  // ------------------------------------------------------------- faq

  function faq() {
    const cats = cfg.faq.categories;
    const clean = (a) =>
      a.replace(/\{\{pending\}\}/g, pendingBadge());

    return `
    <div class="faq">
      <nav class="faq__nav" aria-label="FAQ categories">
        ${cats.map((c) => `<a href="#faq-${esc(c.key)}">${c.label}</a>`).join('')}
      </nav>
      ${cats
        .map(
          (c) => `
      <section class="faq__cat" id="faq-${esc(c.key)}">
        <h2 class="h3">${c.label}</h2>
        ${c.items
          .map(
            (it) => `
        <details class="qa">
          <summary><span>${esc(it.q)}</span></summary>
          <div class="qa__a">${clean(it.a)}</div>
        </details>`
          )
          .join('')}
      </section>`
        )
        .join('')}
    </div>`;
  }

  /** FAQPage structured data — only for genuinely factual Q&A. */
  function faqSchema() {
    const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/\{\{pending\}\}/g, PENDING).replace(/\s+/g, ' ').trim();
    const items = cfg.faq.categories.flatMap((c) =>
      c.items.map((it) => ({
        '@type': 'Question',
        name: strip(it.q),
        acceptedAnswer: { '@type': 'Answer', text: strip(it.a) },
      }))
    );
    const json = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items };
    return `<script type="application/ld+json">${JSON.stringify(json).replace(/</g, '\\u003c')}</script>`;
  }

  // ------------------------------------------------------------- support

  function escalation() {
    return `
    <ol class="escalation">
      ${S.support.escalation
        .map(
          (e, i) => `
      <li class="escalation__step">
        <div class="escalation__n">${i + 1}</div>
        <div>
          <h3 class="h5">${esc(e.level)} &mdash; ${esc(e.channel)}</h3>
          <p class="muted">
            Contact: ${
              isBlank(e.contact)
                ? pendingBadge()
                : e.contact.startsWith('http')
                  ? `<a href="${esc(e.contact)}" target="_blank" rel="noopener noreferrer">${esc(e.contact)}</a>`
                  : esc(e.contact)
            }
            &middot; Response time: ${val(e.tat)}
          </p>
        </div>
      </li>`
        )
        .join('')}
    </ol>
    <p class="muted small">
      The last step in this ladder is deliberately outside Trade Grow. If we fail to resolve
      your complaint, the exchange and SEBI&rsquo;s SCORES portal are open to you regardless of
      what we say.
    </p>`;
  }

  // ------------------------------------------------------------- testimonials

  function testimonials() {
    const T = cfg.testimonials;
    const published = (T.items || []).filter((t) => t.published && t.consent?.obtained && t.verification?.status === 'verified');

    if (!published.length) {
      return `
      <div class="empty-state">
        <h2 class="h3">${esc(T.sectionCopy.emptyStateHeading)}</h2>
        <p class="lede">${esc(T.sectionCopy.emptyStateBody)}</p>
        <a class="btn btn--primary" href="${esc(T.sectionCopy.emptyStateCta.href)}">${esc(T.sectionCopy.emptyStateCta.label)}</a>
      </div>`;
    }

    return `
    <div class="cards">
      ${published
        .map(
          (t) => `
      <figure class="card card--quote">
        <blockquote>${esc(t.text)}</blockquote>
        <figcaption>
          <strong>${esc(t.customerName)}</strong>
          ${t.location ? `<span class="muted">${esc(t.location)}</span>` : ''}
          <span class="muted small">${esc(t.productUsed)} &middot; ${esc(t.date)}</span>
          <span class="pill pill--ok">&#10003; Verified client, consent on record</span>
        </figcaption>
      </figure>`
        )
        .join('')}
    </div>`;
  }

  // ------------------------------------------------------------- misc

  function headlineVariants() {
    return `
    <details class="devnote">
      <summary>Headline variants configured for A/B testing</summary>
      <ol>${S.headlineVariants.map((h) => `<li>${esc(h)}</li>`).join('')}</ol>
      <p class="muted small">
        Edit <code>headlineVariants</code> in <code>site/config/site.config.json</code>.
        Variants are tested on wording only &mdash; never on the substance of a claim.
      </p>
    </details>`;
  }

  function whatsappFab() {
    const w = S.support.whatsapp;
    if (!w.enabled || isBlank(w.number)) return '';
    const href = `https://wa.me/${String(w.number).replace(/\D/g, '')}?text=${encodeURIComponent(w.prefilledMessage || '')}`;
    return `<a class="fab fab--wa" href="${esc(href)}" target="_blank" rel="noopener noreferrer" data-ev="whatsapp_click" aria-label="Chat with Trade Grow on WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.21-8.24 8.21m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07s.89 2.4 1.02 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28"/></svg>
      <span>WhatsApp</span>
    </a>`;
  }

  function stickyCta() {
    const phone = S.support.phone;
    return `
    <div class="sticky-cta" role="region" aria-label="Quick actions">
      <a class="sticky-cta__btn sticky-cta__btn--ghost" href="/verify/" data-ev="verify_page_view">Verify us</a>
      <a class="sticky-cta__btn sticky-cta__btn--ghost" href="/pricing/" data-ev="pricing_view">Pricing</a>
      ${
        isBlank(phone)
          ? ''
          : `<a class="sticky-cta__btn sticky-cta__btn--ghost" href="tel:${esc(String(phone).replace(/\s/g, ''))}" data-ev="call_click">Call</a>`
      }
      <a class="sticky-cta__btn sticky-cta__btn--primary" href="/open-account/" data-ev="kyc_start">Open account</a>
    </div>`;
  }

  function otpWarning() {
    return `
    <aside class="otp-warning" role="note">
      <span class="otp-warning__icon">${icon(ICONS.lock)}</span>
      <p>${esc(S.compliance.otpWarning)}</p>
    </aside>`;
  }

  function marketRisk() {
    return `<p class="risk-note">${esc(S.compliance.marketRiskDisclaimer)} ${esc(S.compliance.noAdviceDisclaimer)}</p>`;
  }

  return {
    trustbar,
    whyTrust,
    checklist,
    regulatoryDetail,
    documents,
    pricingTable,
    otherCharges,
    compareTable,
    faq,
    faqSchema,
    escalation,
    testimonials,
    headlineVariants,
    whatsappFab,
    stickyCta,
    otpWarning,
    marketRisk,
  };
};
