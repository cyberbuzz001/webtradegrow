/**
 * Internal link checker for dist/. Run after build:  node build/check-links.js
 *
 * Must be run with the same BASE_PATH as the build, since a subpath build emits links like
 * /webtradegrow/verify/ which resolve to dist/verify/ on disk.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { BASE } = require('./base.js');

const DIST = path.join(__dirname, '..', 'dist');
const pages = [];
const assets = new Set();
const norm = (p) => '/' + path.relative(DIST, p).split(path.sep).join('/');

(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else {
      if (e.name.endsWith('.html')) pages.push(p);
      assets.add(norm(p));
    }
  }
})(DIST);

const routes = new Set(pages.map((p) => norm(p).replace(/index\.html$/, '')));

let count = 0;
const bad = new Set();

let unbased = 0;

for (const p of pages) {
  const html = fs.readFileSync(p, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const u = m[1];
    count++;

    // Strip the deployment base before resolving against dist/.
    let rel = u;
    if (BASE) {
      if (u === BASE) rel = '/';
      else if (u.startsWith(BASE + '/')) rel = u.slice(BASE.length);
      else {
        // A root-absolute link the builder failed to rewrite — would 404 on a subpath deploy.
        unbased++;
        bad.add(norm(p) + '  ->  ' + u + '   [missing base prefix]');
        continue;
      }
    }

    if (routes.has(rel) || assets.has(rel)) continue;
    bad.add(norm(p) + '  ->  ' + u);
  }
}

console.log(
  `\n  checked ${count} internal links across ${pages.length} pages` +
    (BASE ? ` (base: ${BASE})` : '')
);
if (unbased) console.log(`  ${unbased} link(s) missing the base prefix — these would 404 on a subpath deploy.`);
if (bad.size) {
  console.log('  BROKEN:');
  [...bad].forEach((b) => console.log('    x ' + b));
  process.exitCode = 1;
} else {
  console.log('  no broken internal links\n');
}
