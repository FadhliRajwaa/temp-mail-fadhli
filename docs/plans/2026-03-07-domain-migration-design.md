# Domain Migration Design

**Date:** 2026-03-07

**Goal:** Migrate the temp-mail application from the old `fadhlirajwaa.my.id` domain family to the new `fadhlimail.biz.id` domain family.

## Decisions

- Frontend canonical URL remains `https://www.fadhlimail.biz.id`.
- Root web URL `https://fadhlimail.biz.id` is allowed and redirects to `https://www.fadhlimail.biz.id`.
- Disposable inbox addresses use the root email domain `@fadhlimail.biz.id`.
- Runtime code must stop depending on hardcoded legacy domains.

## Scope

- Update frontend env files.
- Update backend env files.
- Update backend SendGrid recipient validation to use `EMAIL_DOMAIN`.
- Update tests and operational PowerShell scripts that still reference the legacy domain.

## Non-Goals

- Bulk rewrite historical setup guides and archival documentation.
- Change deployment providers or introduce new routing structure.

## Verification

- Frontend lint passes.
- Frontend build passes.
- Frontend mailbox helper tests pass.
- Backend lint passes.
- Backend CORS tests pass.
