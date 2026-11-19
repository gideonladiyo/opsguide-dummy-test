import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import whoami from './api/whoami.js';

const here = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://opsguide-dummy-test.vercel.app/cactas-submit/';

// === companies.csv -> one page per company ===
const lines = readFileSync(join(here, 'companies.csv'), 'utf8').trim().split('\n');
assert.equal(lines[0], 'name,main_company_url,inquiry_url');
const rows = lines.slice(1).map((line) => line.split(','));
assert.equal(rows.length, 30, 'expected 30 companies');

const names = new Set();
for (const [name, mainUrl, inquiryUrl] of rows) {
  assert.ok(name && !names.has(name), `empty or duplicate company name: ${name}`);
  names.add(name);
  assert.equal(mainUrl, inquiryUrl);
  assert.ok(inquiryUrl.startsWith(BASE), `unexpected URL: ${inquiryUrl}`);

  const slug = inquiryUrl.slice(BASE.length).replace(/\/$/, '');
  const page = join(here, slug, 'index.html');
  assert.ok(existsSync(page), `missing page for ${inquiryUrl}`);
  const html = readFileSync(page, 'utf8');
  assert.ok(html.includes(name), `${slug}: company name not on page`);
  assert.match(html, /<form id="contact-form"/, `${slug}: contact form missing`);
  assert.match(html, /<script src="\.\.\/form\.js" defer><\/script>/, `${slug}: form.js missing`);
  if (slug !== 'a00-drift') assert.match(html, /id="submit-button"/, `${slug}: #submit-button missing`);
}

for (const extra of ['thanks', 'search', 'newsletter', 'a13-confirm-flow/confirm']) {
  assert.ok(existsSync(join(here, extra, 'index.html')), `missing ${extra}/index.html`);
}

// === /api/cactas-whoami ===
const response = {
  statusCode: null, headers: {}, body: null,
  setHeader(key, value) { this.headers[key] = value; },
  end(text) { this.body = text; },
};
const originalLog = console.log;
console.log = () => {};
whoami({
  url: '/api/cactas-whoami?page=c01-whoami&event=submit&btn=submit-button',
  headers: { 'x-forwarded-for': '203.0.113.10, 10.0.0.1', 'user-agent': 'test' },
}, response);
console.log = originalLog;
assert.equal(response.statusCode, 200);
assert.equal(response.headers['Cache-Control'], 'no-store');
const entry = JSON.parse(response.body);
assert.equal(entry.ip, '203.0.113.10');
assert.equal(entry.page, 'c01-whoami');
assert.equal(entry.event, 'submit');
assert.equal(entry.btn, 'submit-button');

console.log(`cactas-submit: ${rows.length} pages ok`);
