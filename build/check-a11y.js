/**
 * Static accessibility checker for dist/. Zero dependencies.
 *   node build/check-a11y.js
 *
 * WHAT THIS CATCHES (structural, statically detectable):
 *   duplicate ids, unlabelled form controls, images without alt, controls with no
 *   accessible name, skipped heading levels, missing/multiple h1, positive tabindex,
 *   tables without a caption, missing lang or title.
 *
 * WHAT THIS DOES NOT CATCH — do not treat a pass here as "the site is accessible":
 *   colour contrast, focus order, keyboard traps, screen-reader output, ARIA
 *   correctness beyond presence, anything rendered by JavaScript after load.
 *   Those still need a real audit with axe/Lighthouse and manual keyboard testing.
 *
 * Exits 1 on any HIGH finding so it can gate CI. MED/LOW are reported, not fatal.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const SEV = { high: 0, med: 0, low: 0 };
const findings = [];

const pages = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) pages.push(p);
  }
})(DIST);

const rel = (p) => '/' + path.relative(DIST, p).split(path.sep).join('/');

/** Strip tags to get an element's text content. */
const textOf = (html) => html.replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').trim();

/** Byte ranges covered by <label> … </label>, so we can detect wrapped controls. */
function labelRanges(html) {
  const ranges = [];
  const re = /<label\b[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const close = html.indexOf('</label>', m.index);
    if (close > -1) ranges.push([m.index, close]);
  }
  return ranges;
}

function attr(tag, name) {
  const m = tag.match(new RegExp(name + '\\s*=\\s*"([^"]*)"', 'i')) ||
            tag.match(new RegExp(name + "\\s*=\\s*'([^']*)'", 'i'));
  return m ? m[1] : null;
}
const has = (tag, name) => new RegExp('\\b' + name + '\\b', 'i').test(tag);

function check(file) {
  const html = fs.readFileSync(file, 'utf8');
  const route = rel(file);
  const add = (sev, type, detail) => {
    SEV[sev]++;
    findings.push({ sev, route, type, detail });
  };

  // --- document level -------------------------------------------------------
  if (!/<html[^>]*\blang\s*=/i.test(html)) add('high', 'no-lang', '<html> has no lang attribute');
  if (!/<title>[^<]+<\/title>/i.test(html)) add('high', 'no-title', 'missing or empty <title>');

  // --- duplicate ids --------------------------------------------------------
  const ids = {};
  for (const m of html.matchAll(/\sid\s*=\s*"([^"]+)"/g)) ids[m[1]] = (ids[m[1]] || 0) + 1;
  Object.entries(ids)
    .filter(([, n]) => n > 1)
    .forEach(([id, n]) => add('high', 'duplicate-id', `#${id} appears ${n}x`));

  // --- form controls --------------------------------------------------------
  const forSet = new Set([...html.matchAll(/<label\b[^>]*\bfor\s*=\s*"([^"]+)"/gi)].map((m) => m[1]));
  const ranges = labelRanges(html);
  const inLabel = (i) => ranges.some(([a, b]) => i > a && i < b);

  for (const m of html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)) {
    const tag = m[0];
    const type = (attr(tag, 'type') || '').toLowerCase();
    if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') continue;
    const id = attr(tag, 'id');
    const named =
      (id && forSet.has(id)) ||
      attr(tag, 'aria-label') ||
      attr(tag, 'aria-labelledby') ||
      inLabel(m.index);
    if (!named) add('high', 'unlabelled-control', `<${m[1]}${id ? ' #' + id : ''}> has no accessible name`);
  }

  // --- images ---------------------------------------------------------------
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!has(m[0], 'alt')) add('high', 'img-no-alt', m[0].slice(0, 70));
  }

  // --- links & buttons with no accessible name ------------------------------
  for (const m of html.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    const [, tagName, attrs, inner] = m;
    if (tagName.toLowerCase() === 'a' && !attr('<a' + attrs + '>', 'href')) continue; // anchors, not links
    const name =
      textOf(inner) ||
      attr('<x' + attrs + '>', 'aria-label') ||
      attr('<x' + attrs + '>', 'title');
    if (!name) add('high', 'empty-control', `<${tagName}> with no text or aria-label`);
  }

  // --- headings -------------------------------------------------------------
  const heads = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)];
  let prev = 0;
  for (const h of heads) {
    const lvl = +h[1];
    if (prev && lvl > prev + 1) {
      add('med', 'heading-skip', `h${prev} -> h${lvl}: "${textOf(h[2]).slice(0, 44)}"`);
    }
    prev = lvl;
  }
  const h1s = heads.filter((h) => h[1] === '1').length;
  if (h1s !== 1) add('med', 'h1-count', `${h1s} <h1> on page (expected exactly 1)`);

  // --- misc -----------------------------------------------------------------
  for (const m of html.matchAll(/\stabindex\s*=\s*"(\d+)"/g)) {
    if (+m[1] > 0) add('med', 'positive-tabindex', `tabindex="${m[1]}" breaks natural focus order`);
  }
  for (const m of html.matchAll(/<table\b[\s\S]*?<\/table>/gi)) {
    if (!/<caption\b/i.test(m[0])) add('low', 'table-no-caption', m[0].slice(0, 60).replace(/\s+/g, ' '));
  }
}

pages.forEach(check);

// ---------------------------------------------------------------- report

const order = { high: 0, med: 1, low: 2 };
findings.sort((a, b) => order[a.sev] - order[b.sev] || a.route.localeCompare(b.route));

console.log(`\n  accessibility: scanned ${pages.length} pages`);
console.log(`  high: ${SEV.high}   med: ${SEV.med}   low: ${SEV.low}`);

if (findings.length) {
  console.log('');
  const seen = new Set();
  for (const f of findings) {
    const key = f.sev + f.route + f.type + f.detail;
    if (seen.has(key)) continue;
    seen.add(key);
    const mark = f.sev === 'high' ? 'x' : f.sev === 'med' ? '!' : '-';
    console.log(`    ${mark} [${f.sev}] ${f.route}  ${f.type}: ${f.detail}`);
  }
}

if (SEV.high) {
  console.log(`\n  FAILED: ${SEV.high} high-severity accessibility issue(s).\n`);
  process.exitCode = 1;
} else {
  console.log(`\n  No high-severity issues. (Contrast, focus order and screen-reader\n  behaviour are NOT covered here — they still need a manual audit.)\n`);
}
