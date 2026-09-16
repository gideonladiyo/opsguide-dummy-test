import assert from 'node:assert/strict';
import { buildSheetParams } from './submit.js';

const params = buildSheetParams({
  timestamp: '2026-09-16T00:00:00.000Z',
  sourceUrl: 'http://localhost:3000/dummy-form/1/2/',
  sourcePath: '/dummy-form/1/2/',
  formType: 1,
  duplicate: 2,
  formName: 'Form Kontak',
  fields: { full_name: 'Dummy User', email: 'dummy@example.com', message: 'Test' }
});

assert.equal(params.get('source_url'), 'http://localhost:3000/dummy-form/1/2/');
assert.equal(params.get('form_type'), '1');
assert.equal(params.get('duplicate'), '2');
assert.equal(params.get('name'), 'Dummy User');
assert.match(params.get('description'), /Source URL: .*\/dummy-form\/1\/2\//);
console.log('submit payload check passed');
