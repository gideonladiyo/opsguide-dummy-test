import assert from 'node:assert/strict';
import invoiceError from './invoice-error.js';
import invoiceJson from './invoice-json.js';

function mockResponse() {
  return {
    statusCode: null,
    headers: {},
    body: null,
    setHeader(name, value) { this.headers[name] = value; },
    end(text) { this.body = text; },
  };
}

// === HTTP 500 ===
const resError = mockResponse();
invoiceError({ method: 'GET' }, resError);
assert.equal(resError.statusCode, 500);
assert.match(resError.headers['Content-Type'], /application\/json/);
const errorBody = JSON.parse(resError.body);
assert.equal(errorBody.status, 500);
assert.equal(errorBody.error, 'INTERNAL_SERVER_ERROR');

// === JSON, bukan file ===
const resJson = mockResponse();
invoiceJson({ method: 'GET' }, resJson);
assert.equal(resJson.statusCode, 200);
assert.match(resJson.headers['Content-Type'], /application\/json/);
// Content-Disposition attachment memaksa download, bukan render di tab
assert.match(resJson.headers['Content-Disposition'], /attachment; filename="invoice-error\.json"/);
const jsonBody = JSON.parse(resJson.body);
assert.equal(jsonBody.error, 'INVOICE_UNAVAILABLE');
assert.equal(jsonBody.invoice, null);

// body JSON tidak boleh menyembunyikan dirinya sebagai PDF
assert.ok(!resJson.body.startsWith('%PDF'), 'JSON body tidak boleh diawali signature PDF');

console.log('dummy-inv api check passed');
