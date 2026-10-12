import assert from 'node:assert/strict';
import { parseParams, resolveRedirectUrl, formatCountdown, isValidRedirect } from './script.js';

// delay valid
assert.equal(parseParams('?delay=3').delay, 3);
assert.equal(parseParams('?delay=1').delay, 1);

// delay dibatasi maksimal 60
assert.equal(parseParams('?delay=999').delay, 60);

// delay invalid diabaikan
assert.equal(parseParams('').delay, 0);
assert.equal(parseParams('?delay=abc').delay, 0);
assert.equal(parseParams('?delay=-2').delay, 0);
assert.equal(parseParams('?delay=0').delay, 0);
assert.equal(parseParams('?delay=2.5').delay, 0);

// redirect valid
assert.equal(parseParams('?redirect=receipt').redirect, 'receipt');
assert.equal(parseParams('?redirect=download').redirect, 'download');
assert.equal(parseParams('?redirect=billing').redirect, 'billing');
assert.equal(parseParams('?redirect=invoice').redirect, 'invoice');

// redirect invalid ditolak (whitelist + anti open-redirect)
assert.equal(parseParams('').redirect, null);
assert.equal(parseParams('?redirect=../../etc').redirect, null);
assert.equal(parseParams('?redirect=https://evil.example').redirect, null);
assert.equal(parseParams('?redirect=').redirect, null);

// kombinasi
const combo = parseParams('?delay=2&redirect=billing');
assert.equal(combo.delay, 2);
assert.equal(combo.redirect, 'billing');

// isValidRedirect
assert.equal(isValidRedirect('receipt'), true);
assert.equal(isValidRedirect('nope'), false);

// resolveRedirectUrl: relative ke hub
globalThis.window = { location: { href: 'https://opsguide-dummy-test.vercel.app/dummy-invoices/receipt/' } };
assert.equal(
  resolveRedirectUrl('../', 'billing'),
  'https://opsguide-dummy-test.vercel.app/dummy-invoices/billing/'
);

globalThis.window = { location: { href: 'https://opsguide-dummy-test.vercel.app/dummy-invoices/' } };
assert.equal(
  resolveRedirectUrl('./', 'invoice'),
  'https://opsguide-dummy-test.vercel.app/dummy-invoices/invoice/'
);

// resolveRedirectUrl menolak target di luar whitelist
assert.equal(resolveRedirectUrl('../', '../../etc'), null);
assert.equal(resolveRedirectUrl('../', 'https://evil.example'), null);

// formatCountdown
assert.equal(formatCountdown(1), 'Downloading in 1 second…');
assert.equal(formatCountdown(3), 'Downloading in 3 seconds…');

console.log('dummy-invoices variant check passed');
