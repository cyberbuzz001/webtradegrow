/** Internal link checker for dist/. Run after build:  node build/check-links.js */
'use strict';
const fs = require('fs');
const path = require('path');

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

for (const p of pages) {
  const html = fs.readFileSync(p, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const u = m[1];
    count++;
    if (routes.has(u) || assets.has(u)) continue;
    bad.add(norm(p) + '  ->  ' + u);
  }
}

console.log(`\n  checked ${count} internal links across ${pages.length} pages`);
if (bad.size) {
  console.log('  BROKEN:');
  [...bad].forEach((b) => console.log('    x ' + b));
  process.exitCode = 1;
} else {
  console.log('  no broken internal links\n');
}
