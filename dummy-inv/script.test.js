import assert from 'node:assert/strict';
import {
  parseParams,
  resolveRedirectUrl,
  resolveFileHref,
  formatCountdown,
  isValidRedirect,
  isValidFile,
  CORRECT_PIN,
  FILE_TARGETS,
  PARAM_DOCS,
} from './script.js';

// === delay ===
assert.equal(parseParams('?delay=3').delay, 3);
assert.equal(parseParams('?delay=1').delay, 1);
assert.equal(parseParams('?delay=999').delay, 60);
assert.equal(parseParams('').delay, 0);
assert.equal(parseParams('?delay=abc').delay, 0);
assert.equal(parseParams('?delay=-2').delay, 0);
assert.equal(parseParams('?delay=0').delay, 0);
assert.equal(parseParams('?delay=2.5').delay, 0);

// === redirect ===
assert.equal(parseParams('?redirect=receipt').redirect, 'receipt');
assert.equal(parseParams('?redirect=download').redirect, 'download');
assert.equal(parseParams('?redirect=billing').redirect, 'billing');
assert.equal(parseParams('?redirect=invoice').redirect, 'invoice');
assert.equal(parseParams('').redirect, null);
assert.equal(parseParams('?redirect=../../etc').redirect, null);
assert.equal(parseParams('?redirect=https://evil.example').redirect, null);
assert.equal(parseParams('?redirect=').redirect, null);
assert.equal(isValidRedirect('receipt'), true);
assert.equal(isValidRedirect('nope'), false);

// === file ===
for (const key of ['html', 'empty', 'expired', 'json', 'error500']) {
  assert.equal(parseParams('?file=' + key).file, key);
  assert.equal(isValidFile(key), true);
}
assert.equal(parseParams('').file, null);
assert.equal(parseParams('?file=nope').file, null);
assert.equal(parseParams('?file=').file, null);
assert.equal(isValidFile('nope'), false);

// === selector v2 ===
assert.equal(parseParams('?selector=v2').selectorV2, true);
assert.equal(parseParams('').selectorV2, false);
assert.equal(parseParams('?selector=v1').selectorV2, false);

// === cookie banner ===
assert.equal(parseParams('?cookie_banner=1').cookieBanner, true);
assert.equal(parseParams('').cookieBanner, false);
assert.equal(parseParams('?cookie_banner=true').cookieBanner, false);

// === pin gate ===
assert.equal(parseParams('?pin_gate=1').pinGate, true);
assert.equal(parseParams('').pinGate, false);
assert.equal(CORRECT_PIN, '1234');

// === kombinasi ===
const combo = parseParams('?pin_gate=1&delay=5&file=expired&selector=v2');
assert.equal(combo.pinGate, true);
assert.equal(combo.delay, 5);
assert.equal(combo.file, 'expired');
assert.equal(combo.selectorV2, true);

// === resolveRedirectUrl: relative ke hub ===
globalThis.window = { location: { href: 'https://opsguide-dummy-test.vercel.app/dummy-inv/receipt/' } };
assert.equal(
  resolveRedirectUrl('../', 'billing'),
  'https://opsguide-dummy-test.vercel.app/dummy-inv/billing/'
);
globalThis.window = { location: { href: 'https://opsguide-dummy-test.vercel.app/dummy-inv/' } };
assert.equal(
  resolveRedirectUrl('./', 'invoice'),
  'https://opsguide-dummy-test.vercel.app/dummy-inv/invoice/'
);
assert.equal(resolveRedirectUrl('../', '../../etc'), null);
assert.equal(resolveRedirectUrl('../', 'https://evil.example'), null);

// === resolveFileHref ===
globalThis.window = { location: { href: 'https://opsguide-dummy-test.vercel.app/dummy-inv/receipt/' } };
assert.equal(
  resolveFileHref('../', 'html'),
  'https://opsguide-dummy-test.vercel.app/dummy-inv/invoice-fake.pdf'
);
// endpoint /api/ dipakai apa adanya, tanpa di-resolve relatif
assert.equal(resolveFileHref('../', 'json'), '/api/invoice-json');
assert.equal(resolveFileHref('./', 'error500'), '/api/invoice-error');
assert.equal(resolveFileHref('../', 'nope'), null);

// === FILE_TARGETS lengkap ===
assert.deepEqual(Object.keys(FILE_TARGETS).sort(), ['empty', 'error500', 'expired', 'html', 'json']);

// === formatCountdown ===
assert.equal(formatCountdown(1), 'Downloading in 1 second…');
assert.equal(formatCountdown(3), 'Downloading in 3 seconds…');

// === PARAM_DOCS dokumentasikan semua varian ===
const docParams = PARAM_DOCS.map((d) => d.param).join(' ');
for (const key of ['?delay', '?redirect', '?cookie_banner', '?pin_gate', '?selector', '?file=html', '?file=empty', '?file=expired', '?file=json', '?file=error500']) {
  assert.ok(docParams.includes(key), 'PARAM_DOCS kehilangan ' + key);
}

console.log('dummy-inv variant check passed');
