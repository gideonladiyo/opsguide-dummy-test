import assert from 'node:assert/strict';
import { triggerOnce } from './script.js';

const values = new Map();
const storage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
};

assert.equal(triggerOnce(storage, 'a'), 'error');
assert.equal(triggerOnce(storage, 'a'), 'success');
assert.equal(triggerOnce(storage, 'b'), 'error');
assert.equal(triggerOnce(storage, 'b'), 'success');
storage.removeItem('webrpa-error-once-failed-a');
assert.equal(triggerOnce(storage, 'a'), 'error');
assert.equal(triggerOnce(storage, 'b'), 'success');
