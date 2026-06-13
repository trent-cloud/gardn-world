const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('local landing page is wired as a mobile-first QR entry point', () => {
  const html = fs.readFileSync(path.join(root, 'local.html'), 'utf8');

  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.match(html, /<form[^>]+id="local-form"/);
  assert.match(html, /name="postcode"/);
  assert.match(html, /local.css/);
  assert.match(html, /local.js/);
});

test('first screen stays bare and never shows personal-looking defaults', () => {
  const html = fs.readFileSync(path.join(root, 'local.html'), 'utf8');

  assert.match(html, /Your garden already has a story\./);
  assert.match(html, /Enter your name and post code to download the app\./);
  assert.doesNotMatch(html, /First name/);
  assert.match(html, />Download the app\.</);
  assert.doesNotMatch(html, /Sarah/);
  assert.doesNotMatch(html, /NG5 4JL/);
  assert.doesNotMatch(html, /recent rain, the week ahead, and the soil model/);
  assert.doesNotMatch(html, /Why this matters/);
  assert.doesNotMatch(html, /readout-location/);
  assert.doesNotMatch(html, /Around your postcode/);
});

test('local hero uses a brighter flower-led garden image', () => {
  const css = fs.readFileSync(path.join(root, 'local.css'), 'utf8');

  assert.match(css, /photo-meadow\.jpg/);
  assert.doesNotMatch(css, /photo-courtyard\.jpg/);
  assert.doesNotMatch(css, /rgba\(15, 38, 24, 0\.9\)/);
});

test('local page script posts to the readout endpoint and renders text safely', () => {
  const js = fs.readFileSync(path.join(root, 'local.js'), 'utf8');

  assert.match(js, /fetch\('\/api\/local-readout'/);
  assert.match(js, /textContent/);
  assert.doesNotMatch(js, /innerHTML/);
  assert.match(js, /Download the app\./);
  assert.doesNotMatch(js, /Show my garden read/);
  assert.doesNotMatch(js, /Readout ready/);
  assert.doesNotMatch(js, /readout-location/);
  assert.match(js, /renderNoteLines/);
  assert.doesNotMatch(js, /renderFacts/);
  assert.doesNotMatch(js, /readout-card/);
});

test('successful submit replaces the form screen with the readout screen', () => {
  const css = fs.readFileSync(path.join(root, 'local.css'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'local.js'), 'utf8');

  assert.match(css, /body\.has-readout\s+\.local-hero\s*{\s*display:\s*none;/);
  assert.match(css, /body\.has-readout\s+\.local-result\s*{\s*display:\s*block;/);
  assert.match(js, /document\.body\.classList\.add\('has-readout'\)/);
  assert.match(js, /setStatus\('', null\)/);
});

test('result screen is a prose note rather than fact blocks', () => {
  const html = fs.readFileSync(path.join(root, 'local.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'local.css'), 'utf8');

  assert.match(html, /id="readout-note"/);
  assert.doesNotMatch(html, /readout-facts/);
  assert.doesNotMatch(html, /readout-grid/);
  assert.doesNotMatch(css, /readout-grid/);
  assert.doesNotMatch(css, /readout-card/);
  assert.match(css, /\.readout-note\s*{[\s\S]*display:\s*grid/);
  assert.match(css, /\.local-result-shell\s*{[\s\S]*padding:\s*24px/);
});

test('local landing page is unlinked and marked as non-indexable', () => {
  const html = fs.readFileSync(path.join(root, 'local.html'), 'utf8');
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));

  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.match(html, /https:\/\/gardn\.world\/local/);
  assert.doesNotMatch(sitemap, /gardn\.world\/local/);
  assert.doesNotMatch(JSON.stringify(vercelConfig), /nottm-a6-01/);
  assert.ok((vercelConfig.headers || []).some((entry) => (
    entry.source === '/local' &&
    entry.headers.some((header) => (
      header.key === 'X-Robots-Tag' &&
      header.value === 'noindex, nofollow, noarchive'
    ))
  )));
});
