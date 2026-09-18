import assert from 'node:assert/strict';
import { triggerOnce } from './script.js';

const values = new Map();
const storage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
};

assert.equal(triggerOnce(storage), 'error');
assert.equal(triggerOnce(storage), 'success');
storage.removeItem('webrpa-error-once-failed');
assert.equal(triggerOnce(storage), 'error');
