#!/usr/bin/env node
/**
 * Trade Grow — static site builder.
 * Zero dependencies. Node 18+.
 *
 *   node build/build.js            build once into dist/
 *   node build/build.js --serve    build, then serve dist/ on :4321 with rebuild-on-request
 *
 * Why a builder instead of plain HTML files:
 *   Every regulatory / contact / pricing fact lives in site/config/*.json. The builder
 *   inlines those values into real static HTML, so the facts are in the server response
 *   (crawlable, no layout shift) while non-developers still only ever edit JSON.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const DIST = path.join(ROOT, 'dist');

const read = (p) => fs.readFileSync(p, 'utf8');
const readJSON = (p) => JSON.parse(read(p));

// ---------------------------------------------------------------- config load

const cfg = {
  site: readJSON(path.join(SITE, 'config/site.config.json')),
  charges: readJSON(path.join(SITE, 'config/charges.config.json')),
  faq: readJSON(path.join(SITE, 'config/faq.json')),
  compare: readJSON(path.join(SITE, 'config/compare.json')),
  checklist: readJSON(path.join(SITE, 'config/checklist.json')),
  testimonials: readJSON(path.join(SITE, 'config/testimonials.json')),
};

const PENDING = cfg.site.compliance.pendingLabel;

/**
 * Deployment targets differ in where the site is rooted:
 *   - a real domain (tradegrow.in)          → BASE_PATH = ''
 *   - a GitHub Pages project site           → BASE_PATH = '/webtradegrow'
 * Pages are authored with root-absolute links (/verify/, /assets/...), which is correct
 * for the production domain. When BASE_PATH is set we rewrite those at build time so the
 * same source deploys to a subpath without touching a single page file.
 */
// Accepts "webtradegrow" or "/webtradegrow". The leading-slash-free form is preferred on
// Windows, where Git Bash's MSYS path conversion rewrites a leading "/" into a drive path.
const BASE = (function () {
  let b = (process.env.BASE_PATH || '').trim().replace(/\/+$/, '');
  if (!b) return '';
  if (/^[A-Za-z]:[\\/]/.test(b)) {
    // MSYS mangled it (e.g. C:/Program Files/Git/webtradegrow) — keep the last segment.
    b = b.split(/[\\/]/).pop();
  }
  return b.startsWith('/') ? b : '/' + b;
})();
const SITE_URL = (process.env.SITE_URL || cfg.site.brand.domain || '').replace(/\/+$/, '');

/** Rewrite root-absolute href/src to sit under BASE. Leaves //host and http(s):// alone. */
function applyBase(html) {
  if (!BASE) return html;
  return html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${BASE}/`);
}

/** Resolve a dotted path against the merged config namespace. */
function get(obj, dotted) {
  return dotted.split('.').reduce((o, k) => (o === null || o === undefined ? undefined : o[k]), obj);
}

function resolve(dotted) {
  // Namespaced: charges.*, faq.*, compare.* ... otherwise site.*
  const [head] = dotted.split('.');
  if (Object.prototype.hasOwnProperty.call(cfg, head)) return get(cfg, dotted);
  return get(cfg.site, dotted);
}

const isBlank = (v) => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** HTML-context value: renders the pending badge when unverified. */
function cfgHtml(dotted) {
  const v = resolve(dotted);
  if (isBlank(v)) return `<span class="pending" title="Not yet confirmed by Compliance">${esc(PENDING)}</span>`;
  return esc(v);
}

/** Plain-text value with an explicit fallback, for attributes. */
function cfgRaw(dotted, fallback) {
  const v = resolve(dotted);
  if (isBlank(v)) return fallback === undefined ? '' : fallback;
  return String(v);
}

// ---------------------------------------------------------------- components

const components = require('./components.js')({ cfg, PENDING, isBlank, esc, get });

// ---------------------------------------------------------------- templating

const partial = (name) => read(path.join(SITE, 'partials', name + '.html'));

/**
 * Token grammar (deliberately tiny — anything more belongs in components.js):
 *   {{> name }}            include a partial
 *   {{comp:name}}          render a component
 *   {{cfg:a.b.c}}          config value, HTML-escaped, pending badge if blank
 *   {{raw:a.b.c|fallback}} config value for attributes, plain, literal fallback
 *   {{page:key}}           page meta value
 */
function render(tpl, page, depth = 0) {
  if (depth > 6) throw new Error('template include depth exceeded');

  let out = tpl;

  out = out.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => render(partial(name), page, depth + 1));
  out = out.replace(/\{\{comp:([\w-]+)\}\}/g, (_, name) => {
    if (!components[name]) throw new Error(`Unknown component: ${name}`);
    return components[name](page);
  });
  out = out.replace(/\{\{cfg:([\w.[\]]+)\}\}/g, (_, p) => cfgHtml(p));
  out = out.replace(/\{\{raw:([\w.[\]]+)(?:\|([^}]*))?\}\}/g, (_, p, fb) => esc(cfgRaw(p, fb)));
  out = out.replace(/\{\{page:(\w+)\}\}/g, (_, k) => esc(page[k] ?? ''));

  return out;
}

// ---------------------------------------------------------------- page loading

function loadPages(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let pages = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      pages = pages.concat(loadPages(full, prefix + e.name + '/'));
    } else if (e.name.endsWith('.html')) {
      const src = read(full);
      const m = src.match(/^<!--meta\s*([\s\S]*?)-->\s*/);
      if (!m) throw new Error(`Page missing <!--meta {...}--> block: ${full}`);
      const meta = JSON.parse(m[1]);
      const slug = e.name.replace(/\.html$/, '');
      const route = slug === 'index' ? prefix : prefix + slug + '/';
      pages.push({ ...meta, body: src.slice(m[0].length), route: '/' + route, file: full });
    }
  }
  return pages;
}

// ---------------------------------------------------------------- fs helpers

function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// ---------------------------------------------------------------- compliance linter

const BANNED = [
  /\bguaranteed\s+(returns?|profits?)\b/i,
  /\bassured\s+returns?\b/i,
  /\b100%\s*(safe|secure|guaranteed)\b/i,
  /\brisk[-\s]?free\b/i,
  /\bzero\s+tax\b/i,
  /\bsure[-\s]?shot\b/i,
  /\bmultibagger\b/i,
  /\bearn\s+lakhs?\b/i,
  /\bdon'?t\s+miss\b/i,
  /\blimited\s+time\s*!{2,}/i,
];

/**
 * A page that warns customers about "assured returns" has to be able to print the words
 * "assured returns". Two escape hatches, both deliberate and both narrow:
 *   1. <!--lint:ignore--> ... <!--/lint:ignore--> around quoted fraudulent claims.
 *   2. A negation immediately before the phrase ("we do not offer assured returns").
 * Everything else fails the build.
 */
const NEGATORS = /\b(not|never|no|without|cannot|can't|don't|does not|doesn't|avoid|beware|claiming|advertising|promising|offering you|anyone)\b[^.]{0,60}$/i;

function lint(html, route, problems) {
  const scrubbed = html.replace(/<!--lint:ignore-->[\s\S]*?<!--\/lint:ignore-->/g, '');
  const text = scrubbed.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ');

  for (const re of BANNED) {
    const flags = re.flags.includes('g') ? re.flags : re.flags + 'g';
    const rx = new RegExp(re.source, flags);
    let m;
    while ((m = rx.exec(text)) !== null) {
      const before = text.slice(Math.max(0, m.index - 70), m.index);
      if (NEGATORS.test(before)) continue; // warning *against* the claim, not making it
      problems.push(`${route} — banned claim: "${m[0].trim()}" (…${before.trim().slice(-45)}⟦${m[0]}⟧)`);
    }
  }
}

// ---------------------------------------------------------------- build

function build() {
  const t0 = Date.now();
  rmrf(DIST);
  fs.mkdirSync(DIST, { recursive: true });

  const layout = partial('layout');
  const pages = loadPages(path.join(SITE, 'pages'));
  const problems = [];

  for (const page of pages) {
    const content = render(page.body, page);
    const html = applyBase(
      render(layout, {
        ...page,
        canonical: SITE_URL + BASE + page.route,
        siteUrl: SITE_URL + BASE,
        base: BASE,
      }).replace('{{content}}', content)
    );

    lint(html, page.route, problems);

    if (page.route === '/404/') {
      // Static hosts (GitHub Pages, Netlify, most CDNs) look for /404.html specifically,
      // not /404/index.html.
      fs.writeFileSync(path.join(DIST, '404.html'), html);
    } else {
      const outDir = path.join(DIST, page.route);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), html);
    }
  }

  copyDir(path.join(SITE, 'assets'), path.join(DIST, 'assets'));

  // Runtime config for the pricing calculator.
  fs.mkdirSync(path.join(DIST, 'assets/config'), { recursive: true });
  fs.writeFileSync(
    path.join(DIST, 'assets/config/charges.json'),
    JSON.stringify(cfg.charges)
  );

  // sitemap + robots
  const urls = pages
    .filter((p) => p.noindex !== true)
    .map((p) => `  <url><loc>${SITE_URL}${BASE}${p.route}</loc></url>`)
    .join('\n');
  fs.writeFileSync(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
  fs.writeFileSync(
    path.join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}${BASE}/sitemap.xml\n`
  );

  // Report
  console.log(`\n  Trade Grow — built ${pages.length} pages in ${Date.now() - t0}ms -> dist/`);

  const pendingCount = countPending();
  if (pendingCount) {
    console.log(`  ${pendingCount} config values still read "${PENDING}".`);
    console.log(`  That is expected pre-launch. Fill site/config/*.json as Compliance signs off.`);
  }
  if (!cfg.charges.verification.ratesVerified) {
    console.log(`  Statutory rates are NOT verified — the pricing page is showing the warning banner.`);
  }
  if (problems.length) {
    console.log(`\n  COMPLIANCE LINT FAILED:`);
    problems.forEach((p) => console.log(`    x ${p}`));
    process.exitCode = 1;
  } else {
    console.log(`  Compliance lint passed (no prohibited claims found).\n`);
  }
}

function countPending() {
  let n = 0;
  const walk = (o) => {
    if (o === null) { n++; return; }
    if (Array.isArray(o)) return o.forEach(walk);
    if (typeof o === 'object') {
      for (const [k, v] of Object.entries(o)) {
        if (k.startsWith('_')) continue;
        walk(v);
      }
    }
  };
  walk({ e: cfg.site.entity, r: cfg.site.regulatory, o: cfg.site.officers, s: cfg.site.support });
  return n;
}

// ---------------------------------------------------------------- dev server

function serve() {
  const http = require('http');
  const PORT = process.env.PORT || 4321;
  const TYPES = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
    '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  };
  http
    .createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      let file = path.join(DIST, p);
      if (!file.startsWith(DIST)) { res.writeHead(403).end('forbidden'); return; }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404</h1><p><a href="/">Back to Trade Grow</a></p>');
        return;
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(fs.readFileSync(file));
    })
    .listen(PORT, () => console.log(`  Dev server: http://localhost:${PORT}\n`));
}

build();
if (process.argv.includes('--serve')) serve();
