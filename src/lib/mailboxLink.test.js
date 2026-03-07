import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isAllowedMailboxEmail,
  getEmailFromPathname,
  getInitialMailboxEmail,
  buildMailboxUrl,
} from './mailboxLink.js';

test('isAllowedMailboxEmail hanya menerima email valid sesuai domain', () => {
  assert.equal(isAllowedMailboxEmail('user@fadhlimail.biz.id', 'fadhlimail.biz.id'), true);
  assert.equal(isAllowedMailboxEmail('user@example.com', 'fadhlimail.biz.id'), false);
  assert.equal(isAllowedMailboxEmail('invalid-email', 'fadhlimail.biz.id'), false);
});

test('getEmailFromPathname ambil email dari path', () => {
  assert.equal(getEmailFromPathname('/anabbey@fadhlimail.biz.id'), 'anabbey@fadhlimail.biz.id');
  assert.equal(getEmailFromPathname('/'), null);
  assert.equal(getEmailFromPathname('/foo/bar'), null);
});

test('getInitialMailboxEmail prioritas path > query > saved > generated', () => {
  const domain = 'fadhlimail.biz.id';

  const fromPath = getInitialMailboxEmail({
    pathname: '/pathuser@fadhlimail.biz.id',
    search: '?email=queryuser@fadhlimail.biz.id',
    savedEmail: 'saved@fadhlimail.biz.id',
    generatedEmail: 'gen@fadhlimail.biz.id',
    domain,
  });
  assert.equal(fromPath, 'pathuser@fadhlimail.biz.id');

  const fromQuery = getInitialMailboxEmail({
    pathname: '/',
    search: '?email=queryuser@fadhlimail.biz.id',
    savedEmail: 'saved@fadhlimail.biz.id',
    generatedEmail: 'gen@fadhlimail.biz.id',
    domain,
  });
  assert.equal(fromQuery, 'queryuser@fadhlimail.biz.id');

  const fromSaved = getInitialMailboxEmail({
    pathname: '/',
    search: '',
    savedEmail: 'saved@fadhlimail.biz.id',
    generatedEmail: 'gen@fadhlimail.biz.id',
    domain,
  });
  assert.equal(fromSaved, 'saved@fadhlimail.biz.id');
});

test('buildMailboxUrl membentuk link mailbox sesuai origin', () => {
  assert.equal(
    buildMailboxUrl('https://www.fadhlimail.biz.id', 'anabbey@fadhlimail.biz.id'),
    'https://www.fadhlimail.biz.id/anabbey@fadhlimail.biz.id'
  );
});
