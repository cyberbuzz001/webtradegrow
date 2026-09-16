/**
 * Shared deployment base path.
 *
 * Deployment targets differ in where the site is rooted:
 *   - a real domain (tradegrow.in)   → BASE_PATH unset  → ''
 *   - a GitHub Pages project site    → BASE_PATH=webtradegrow → '/webtradegrow'
 *
 * Accepts "webtradegrow" or "/webtradegrow". The leading-slash-free form is preferred on
 * Windows, where Git Bash's MSYS path conversion rewrites a leading "/" into a drive path.
 *
 * Used by build.js (to rewrite links) and check-links.js (to resolve them). Keeping it in
 * one module means the builder and the checker can never disagree about the base.
 */
'use strict';

function normalize(raw) {
  let b = (raw || '').trim().replace(/\/+$/, '');
  if (!b) return '';
  if (/^[A-Za-z]:[\\/]/.test(b)) {
    // MSYS mangled it (e.g. C:/Program Files/Git/webtradegrow) — keep the last segment.
    b = b.split(/[\\/]/).pop();
  }
  return b.startsWith('/') ? b : '/' + b;
}

module.exports = {
  normalize,
  BASE: normalize(process.env.BASE_PATH),
};
