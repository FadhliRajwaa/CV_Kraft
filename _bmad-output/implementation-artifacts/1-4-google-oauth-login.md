# Story 1.4: Google OAuth Login

Status: review

## Story

As a user,
I want to register and login using my Google account,
so that I can start quickly without creating a new password.

## Acceptance Criteria

1. **Given** I am on the login or register page
   **When** I click "Login dengan Google"
   **Then** I am redirected to Google OAuth consent screen
   **And** after approval, an account is created (if new) or I am logged in (if existing)
   **And** I am redirected to dashboard.

## Tasks / Subtasks

- [x] Add Google OAuth entry points on auth pages (AC: 1)
  - [x] Add button "Login dengan Google" on `src/app/(auth)/login/page.tsx`
  - [x] Add button "Login dengan Google" on `src/app/(auth)/register/page.tsx`

- [x] Implement Google OAuth route handler (AC: 1)
  - [x] Create endpoint `src/app/api/auth/google/route.ts`
  - [x] Redirect user to Google OAuth consent URL
  - [x] Handle callback with `code` + `state`
  - [x] Exchange auth code to Google access token
  - [x] Fetch Google profile and email
  - [x] Create or reuse local user account
  - [x] Set signed secure session cookie and redirect to `/dashboard`

- [x] Implement Google user provisioning service (AC: 1)
  - [x] Create `src/lib/auth/google-oauth.ts`
  - [x] Implement find-or-create flow by normalized email

- [x] Add security and resilience hardening (AC: 1)
  - [x] Validate OAuth `state` using cookie
  - [x] Add state cookie expiry (10 minutes)
  - [x] Use `NEXT_PUBLIC_APP_URL` fallback for stable redirect URI in production
  - [x] Parse cookie state with explicit key parser helper
  - [x] Show OAuth failure message on login page (`/login?error=google_oauth_failed`)

- [x] Add minimum test coverage for story behavior (AC: 1)
  - [x] Add tests for OAuth service find/create logic
  - [x] Add tests for auth URL redirect and state cookie
  - [x] Add tests for invalid state callback
  - [x] Add tests for successful callback flow

## Dev Notes

### Technical Requirements
- Keep implementation scoped to Google OAuth login/registration entry only.
- Reuse established auth/session pattern from Story 1.2 and 1.3 (signed cookie).
- Keep DB access via Prisma client from `src/lib/prisma.ts`.

### Architecture Compliance
- OAuth callback validates anti-CSRF `state`.
- Session cookie remains secure (`HTTP-only`, `secure`, `SameSite=lax`).
- User account provisioning is idempotent by email.

### Security & Quality Guardrails
- Never expose internal OAuth/token errors to user responses.
- Redirect failures to `/login?error=google_oauth_failed`.
- Keep state cookie short-lived and cleared after success callback.

### References
- `E:\CV_MAKER\_bmad-output\planning-artifacts\epics.md` — Epic 1, Story 1.4 ACs.
- `E:\CV_MAKER\_bmad-output\planning-artifacts\architecture.md` — Auth architecture and security constraints.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\1-3-email-login.md` — login/session baseline.

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- N/A

### Completion Notes List

- Tombol "Login dengan Google" ditambahkan pada halaman login dan register.
- Endpoint OAuth dibuat di `src/app/api/auth/google/route.ts` untuk inisiasi OAuth, callback handler, token exchange, profile fetch, provisioning user, set session cookie, dan redirect ke dashboard.
- Service provisioning Google user ditambahkan di `src/lib/auth/google-oauth.ts` dengan normalisasi email dan alur find-or-create.
- Hardening hasil code-review diterapkan: parsing state cookie pakai helper key parser, state cookie TTL 10 menit, fallback base URL via `NEXT_PUBLIC_APP_URL`, dan error feedback OAuth di halaman login.
- Test coverage ditambahkan untuk service dan route OAuth callback.
- Verifikasi lulus: `npm test`, `npm run lint`, `npm run build`.

### File List

- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/api/auth/google/route.ts`
- `src/app/api/auth/google/route.test.ts`
- `src/lib/auth/google-oauth.ts`
- `src/lib/auth/google-oauth.test.ts`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\1-4-google-oauth-login.md`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\sprint-status.yaml`
