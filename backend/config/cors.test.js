import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAllowedOrigins, isAllowedOrigin } from './cors.js';

test('parseAllowedOrigins membaca FRONTEND_URLS csv', () => {
  const parsed = parseAllowedOrigins('https://fadhlimail.biz.id, https://www.fadhlimail.biz.id');
  assert.deepEqual(parsed, ['https://fadhlimail.biz.id', 'https://www.fadhlimail.biz.id']);
});

test('parseAllowedOrigins fallback ke FRONTEND_URL', () => {
  const parsed = parseAllowedOrigins('', 'https://www.fadhlimail.biz.id');
  assert.deepEqual(parsed, ['https://www.fadhlimail.biz.id']);
});

test('isAllowedOrigin mengizinkan origin yang ada di daftar', () => {
  const allowed = ['https://fadhlimail.biz.id', 'https://www.fadhlimail.biz.id'];
  assert.equal(isAllowedOrigin('https://www.fadhlimail.biz.id', allowed), true);
  assert.equal(isAllowedOrigin('https://evil.com', allowed), false);
});

test('isAllowedOrigin mengizinkan request tanpa origin', () => {
  const allowed = ['https://www.fadhlimail.biz.id'];
  assert.equal(isAllowedOrigin(undefined, allowed), true);
});
