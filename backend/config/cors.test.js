import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAllowedOrigins, isAllowedOrigin } from './cors.js';

test('parseAllowedOrigins membaca FRONTEND_URLS csv', () => {
  const parsed = parseAllowedOrigins('https://fadhlirajwaa.my.id, https://www.fadhlirajwaa.my.id');
  assert.deepEqual(parsed, ['https://fadhlirajwaa.my.id', 'https://www.fadhlirajwaa.my.id']);
});

test('parseAllowedOrigins fallback ke FRONTEND_URL', () => {
  const parsed = parseAllowedOrigins('', 'https://fadhlirajwaa.my.id');
  assert.deepEqual(parsed, ['https://fadhlirajwaa.my.id']);
});

test('isAllowedOrigin mengizinkan origin yang ada di daftar', () => {
  const allowed = ['https://fadhlirajwaa.my.id', 'https://www.fadhlirajwaa.my.id'];
  assert.equal(isAllowedOrigin('https://www.fadhlirajwaa.my.id', allowed), true);
  assert.equal(isAllowedOrigin('https://evil.com', allowed), false);
});

test('isAllowedOrigin mengizinkan request tanpa origin', () => {
  const allowed = ['https://fadhlirajwaa.my.id'];
  assert.equal(isAllowedOrigin(undefined, allowed), true);
});
