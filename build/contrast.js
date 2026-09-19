/**
 * WCAG contrast checker / token tuner.  node build/contrast.js
 *
 * Checks the design-system colour pairs that actually occur on the site and, for any that
 * fail, finds the nearest darker value on the same hue that passes. Keeps the palette claim
 * in docs/01-design-system.md honest — that claim was previously asserted, not computed.
 */
'use strict';

const hex2rgb = (h) => {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const rgb2hex = (r) => '#' + r.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

const lin = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lum = (hex) => {
  const [r, g, b] = hex2rgb(hex);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

/** Darken toward black in small steps until the pair clears `target`. */
function fix(fg, bg, target) {
  let [r, g, b] = hex2rgb(fg);
  for (let i = 0; i < 100; i++) {
    const cur = rgb2hex([r, g, b]);
    if (ratio(cur, bg) >= target) return cur;
    r *= 0.97; g *= 0.97; b *= 0.97;
  }
  return '#000000';
}

// Tokens are read straight out of the stylesheet, so this file can never drift from it.
const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.join(__dirname, '..', 'site/assets/css/styles.css'), 'utf8');

function token(name) {
  const m = css.match(new RegExp('--' + name + '\\s*:\\s*(#[0-9A-Fa-f]{3,8})'));
  if (!m) throw new Error('token not found in styles.css: --' + name);
  return m[1];
}

const T = {};
for (const n of ['ink', 'ink-2', 'muted', 'muted-2', 'brand', 'brand-50', 'ok', 'ok-50',
                 'warn', 'warn-50', 'danger', 'danger-50', 'bg', 'bg-tint']) T[n] = token(n);

// Pairs that genuinely occur in the rendered site.
const WHITE = T['bg'], TINT = T['bg-tint'];
const pairs = [
  ['--muted',   T['muted'],   WHITE,          4.5, 'body/supporting text on white'],
  ['--muted',   T['muted'],   TINT,           4.5, 'supporting text on tinted sections'],
  ['--muted-2', T['muted-2'], WHITE,          4.5, 'captions, .sym, .card__num, device bar'],
  ['--muted-2', T['muted-2'], TINT,           4.5, 'captions on tint'],
  ['--ok',      T['ok'],      WHITE,          4.5, '.num--up, verified text'],
  ['--ok',      T['ok'],      T['ok-50'],     4.5, 'pill--ok'],
  ['--warn',    T['warn'],    T['warn-50'],   4.5, '.pending badge, .illustrative  <-- critical'],
  ['--warn',    T['warn'],    WHITE,          4.5, 'warn text on white'],
  ['--danger',  T['danger'],  T['danger-50'], 4.5, 'otp-warning, flags'],
  ['--danger',  T['danger'],  WHITE,          4.5, 'danger text on white'],
  ['--brand',   T['brand'],   WHITE,          4.5, 'links'],
  ['--brand',   T['brand'],   T['brand-50'],  4.5, 'links on brand-50'],
  ['--ink',     T['ink'],     WHITE,          4.5, 'body text'],
  ['--ink-2',   T['ink-2'],   WHITE,          4.5, 'secondary text'],
];

let bad = 0;
console.log('\n  WCAG AA contrast — small text needs 4.5:1\n');
for (const [token, fg, bg, target, use] of pairs) {
  const r = ratio(fg, bg);
  const ok = r >= target;
  if (!ok) bad++;
  const suggested = ok ? '' : `  -> ${fix(fg, bg, target)} (${ratio(fix(fg, bg, target), bg).toFixed(2)}:1)`;
  console.log(
    `   ${ok ? 'PASS' : 'FAIL'}  ${token.padEnd(10)} ${fg} on ${bg}  ${r.toFixed(2)}:1   ${use}${suggested}`
  );
}
console.log(`\n  ${bad} failing pair(s)\n`);
process.exitCode = bad ? 1 : 0;
