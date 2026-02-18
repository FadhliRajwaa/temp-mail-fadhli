import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isAllowedMailboxEmail,
  getEmailFromPathname,
  getInitialMailboxEmail,
  buildMailboxUrl,
} from './mailboxLink.js';

test('isAllowedMailboxEmail hanya menerima email valid sesuai domain', () => {
  assert.equal(isAllowedMailboxEmail('user@fadhlirajwaa.my.id', 'fadhlirajwaa.my.id'), true);
  assert.equal(isAllowedMailboxEmail('user@example.com', 'fadhlirajwaa.my.id'), false);
  assert.equal(isAllowedMailboxEmail('invalid-email', 'fadhlirajwaa.my.id'), false);
});

test('getEmailFromPathname ambil email dari path', () => {
  assert.equal(getEmailFromPathname('/anabbey@fadhlirajwaa.my.id'), 'anabbey@fadhlirajwaa.my.id');
  assert.equal(getEmailFromPathname('/'), null);
  assert.equal(getEmailFromPathname('/foo/bar'), null);
});

test('getInitialMailboxEmail prioritas path > query > saved > generated', () => {
  const domain = 'fadhlirajwaa.my.id';

  const fromPath = getInitialMailboxEmail({
    pathname: '/pathuser@fadhlirajwaa.my.id',
    search: '?email=queryuser@fadhlirajwaa.my.id',
    savedEmail: 'saved@fadhlirajwaa.my.id',
    generatedEmail: 'gen@fadhlirajwaa.my.id',
    domain,
  });
  assert.equal(fromPath, 'pathuser@fadhlirajwaa.my.id');

  const fromQuery = getInitialMailboxEmail({
    pathname: '/',
    search: '?email=queryuser@fadhlirajwaa.my.id',
    savedEmail: 'saved@fadhlirajwaa.my.id',
    generatedEmail: 'gen@fadhlirajwaa.my.id',
    domain,
  });
  assert.equal(fromQuery, 'queryuser@fadhlirajwaa.my.id');

  const fromSaved = getInitialMailboxEmail({
    pathname: '/',
    search: '',
    savedEmail: 'saved@fadhlirajwaa.my.id',
    generatedEmail: 'gen@fadhlirajwaa.my.id',
    domain,
  });
  assert.equal(fromSaved, 'saved@fadhlirajwaa.my.id');
});

test('buildMailboxUrl membentuk link mailbox sesuai origin', () => {
  assert.equal(
    buildMailboxUrl('https://fadhlirajwaa.my.id', 'anabbey@fadhlirajwaa.my.id'),
    'https://fadhlirajwaa.my.id/anabbey@fadhlirajwaa.my.id'
  );
});
