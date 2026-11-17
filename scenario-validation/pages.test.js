import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://opsguide-dummy-test.vercel.app/scenario-validation/';

const lines = readFileSync(join(here, 'companies.csv'), 'utf8').trim().split('\n');
assert.equal(lines[0], 'name,main_company_url,inquiry_url');
const rows = lines.slice(1).map((line) => line.split(','));
assert.equal(rows.length, 8, 'expected 8 companies');

const names = new Set();
for (const [name, mainUrl, inquiryUrl] of rows) {
  assert.ok(name, 'company name is empty');
  assert.ok(!names.has(name), `duplicate company name: ${name}`);
  names.add(name);
  assert.equal(mainUrl, inquiryUrl);
  assert.ok(inquiryUrl.startsWith(BASE), `unexpected URL: ${inquiryUrl}`);

  const slug = inquiryUrl.slice(BASE.length).replace(/\/$/, '');
  const page = join(here, slug, 'index.html');
  assert.ok(existsSync(page), `missing page for ${inquiryUrl}`);
  const html = readFileSync(page, 'utf8');
  assert.match(html, /<form id="contact-form"/, `${slug}: form missing`);
  assert.match(html, /<button id="submit-button" type="submit">送信する<\/button>/, `${slug}: submit button missing`);
  assert.ok(html.includes(name), `${slug}: company name not on page`);

  const fieldCount = (html.match(/<div class="field/g) || []).length;
  if (slug.startsWith('good-')) assert.ok(fieldCount >= 5, `${slug}: expected >= 5 fields, got ${fieldCount}`);
  if (slug.startsWith('bad-')) assert.equal(fieldCount, 1, `${slug}: expected 1 field, got ${fieldCount}`);
}

console.log(`scenario-validation: ${rows.length} pages ok`);
