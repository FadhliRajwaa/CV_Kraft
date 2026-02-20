# Story 1.6: Password Reset

Status: review

## Story

As a user who forgot my password,
I want to reset my password via email,
So that I can regain access to my account.

## Acceptance Criteria

1. **Given** I am on the "Lupa Password" page
   **When** I enter my registered email
   **Then** a reset link is sent to my email.
2. **Given** I click the reset link in my email
   **When** I enter a new password (min 8 characters)
   **Then** my password is updated
   **And** I am redirected to login page with success message.

## Tasks / Subtasks

- [x] Build forgot-password page UI (AC: 1)
  - [x] Create route `src/app/(auth)/forgot-password/page.tsx`
  - [x] Add email input with client-side validation (Zod + react-hook-form)
  - [x] Submit to password reset request API endpoint
  - [x] Show neutral success feedback after submit

- [x] Implement password reset request endpoint (AC: 1)
  - [x] Create route `src/app/api/auth/password-reset/request/route.ts`
  - [x] Validate request payload at API boundary (Zod)
  - [x] Generate secure reset token and expiry (short-lived)
  - [x] Persist hashed token + expiry associated to user
  - [x] Send reset link email using configured email service
  - [x] Return consistent response payload without leaking account existence

- [x] Build reset-password page UI (AC: 2)
  - [x] Create route `src/app/(auth)/reset-password/page.tsx` (token via query param)
  - [x] Add new password + confirm password fields
  - [x] Enforce min length 8 and matching password validation
  - [x] Handle invalid/expired token state with user-friendly error

- [x] Implement password update endpoint (AC: 2)
  - [x] Create route `src/app/api/auth/password-reset/confirm/route.ts`
  - [x] Validate token + new password payload at API boundary
  - [x] Verify token validity and expiry before password update
  - [x] Hash new password with bcrypt (cost factor 12)
  - [x] Invalidate used token after successful reset
  - [x] Return redirect target `/login?reset=success`

- [x] Add persistence support for reset tokens (AC: 1, 2)
  - [x] Extend Prisma schema with password reset token model/table
  - [x] Add migration for reset token storage
  - [x] Ensure token lookup and invalidation indexed efficiently

- [x] Add minimum test coverage for password reset flow (AC: 1, 2)
  - [x] Add schema tests for forgot/reset payload validation
  - [x] Add API tests for request endpoint (valid + neutral response)
  - [x] Add API tests for confirm endpoint (invalid/expired/valid token)
  - [x] Add tests to verify password is updated and token invalidated

## Dev Notes

### Technical Requirements
- Keep implementation strictly scoped to password reset flow via email.
- Reuse existing auth conventions from Story 1.2–1.5 (Zod validation, bcrypt hashing, API response style).
- Maintain compatibility with current email/password login (`src/lib/auth/login.ts`) after password update.

### Architecture Compliance
- Password reset token must be random, single-use, and short-lived.
- Stored token must be hashed before persistence (never store raw token).
- New password must be hashed with bcrypt cost factor 12 before save.
- Flow must not reveal whether an email is registered through differing responses.

### Library / Framework Requirements
- Next.js App Router + Route Handlers
- Prisma 7 + PostgreSQL
- Zod for validation
- bcrypt for password hashing
- Existing auth/session pattern from Epic 1
- Email provider integration (Resend/SendGrid or equivalent) via environment variables

### File Structure Requirements
Primary files expected for this story:
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`
- `src/app/api/auth/password-reset/request/route.ts`
- `src/app/api/auth/password-reset/confirm/route.ts`
- `src/lib/validations/auth.ts` (extend reset schemas)
- Optional: `src/lib/auth/password-reset.ts` for token lifecycle logic
- `prisma/schema.prisma` (add reset token model)

### Testing Requirements
- Validate all ACs with executable tests.
- Minimum checks:
  - forgot-password request returns success-style response and does not leak account existence
  - reset confirm rejects invalid/expired token
  - valid token updates password and invalidates token
  - user is redirected to login with success state after reset
- Regression check: existing `npm test`, `npm run lint`, and `npm run build` remain passing.

### Security & Quality Guardrails
- Never store or log raw reset token.
- Never expose internal token verification details in API response.
- Always invalidate token after successful password reset.
- Treat expired/invalid token as unauthorized reset attempt.

### Previous Story Intelligence
- Story 1.2/1.3 already established email/password auth and bcrypt usage.
- Story 1.5 established robust session handling and protected-route behavior.
- Current `User` model supports credential auth (`password` field) and is compatible with password update flow.

### Scope Boundaries
In scope:
- Forgot-password request flow, reset-password confirmation flow, token persistence, and tests.

Out of scope:
- MFA/2FA recovery flow
- Password strength meter beyond minimum validation
- Account lockout policy redesign
- Session revocation across all devices after password reset

### References
- `E:\CV_MAKER\_bmad-output\planning-artifacts\epics.md` — Epic 1, Story 1.6 ACs.
- `E:\CV_MAKER\_bmad-output\planning-artifacts\prd.md` — FR5 (password reset via email).
- `E:\CV_MAKER\_bmad-output\planning-artifacts\architecture.md` — auth/security constraints.
- `E:\CV_MAKER\_bmad-output\planning-artifacts\implementation-readiness-report-2026-02-20.md` — email service dependency note for FR5.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\1-3-email-login.md` — login/password baseline.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\1-5-logout-session-management.md` — current auth/session behavior.

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- Implementasi Story 1.6 selesai lalu dilakukan code-review dan perbaikan temuan prioritas (rate limiting, hardening base URL production, timeout email provider).

### Completion Notes List

- Halaman `Lupa Password` ditambahkan di `src/app/(auth)/forgot-password/page.tsx` dengan validasi email berbasis Zod + react-hook-form dan feedback netral.
- Halaman `Reset Password` ditambahkan di `src/app/(auth)/reset-password/page.tsx` dengan validasi password minimum 8 karakter, konfirmasi password, penanganan token invalid, dan redirect ke login saat sukses.
- Endpoint request reset password dibuat di `src/app/api/auth/password-reset/request/route.ts` dengan validasi API boundary, respons non-enumeratif, dan integrasi service reset.
- Endpoint konfirmasi reset password dibuat di `src/app/api/auth/password-reset/confirm/route.ts` dengan validasi token+password, pembaruan password, invalidasi token, dan `redirectTo: "/login?reset=success"`.
- Service reset password ditambahkan di `src/lib/auth/password-reset.ts` mencakup token random single-use, hashing token (`sha256`) sebelum simpan, expiry token, invalidasi token aktif sebelumnya, update password bcrypt (cost 12), serta konsumsi token setelah berhasil.
- Hardening tambahan pasca code-review diterapkan:
  - rate limiting request reset (`3` request per `IP+email` per `1` jam) di endpoint request,
  - fallback `request.url` dinonaktifkan untuk production jika `NEXT_PUBLIC_APP_URL` tidak tersedia,
  - panggilan provider email diberi timeout menggunakan `AbortSignal.timeout(...)` dan error logging agar tidak menggantung.
- Prisma schema diperluas dengan model `PasswordResetToken` dan migration baru untuk persistence token reset.
- Shared UI `FormField` diekstrak ke `src/components/ui/form-field.tsx` lalu direuse pada halaman auth terkait agar konsisten.
- Login page diperbarui untuk menampilkan pesan sukses reset password (`?reset=success`) dan link ke `/forgot-password`.
- Test coverage ditambahkan/diupdate untuk schema, service, endpoint request/confirm reset, termasuk skenario limit `429`.
- Verifikasi lulus: `npm test`, `npm run lint`, `npm run build`.

### File List

- `prisma/schema.prisma`
- `prisma/migrations/20260220115026_add_password_reset_tokens/migration.sql`
- `src/lib/validations/auth.ts`
- `src/lib/validations/auth.test.ts`
- `src/lib/auth/password-reset.ts`
- `src/lib/auth/password-reset.test.ts`
- `src/app/api/auth/password-reset/request/route.ts`
- `src/app/api/auth/password-reset/request/route.test.ts`
- `src/app/api/auth/password-reset/confirm/route.ts`
- `src/app/api/auth/password-reset/confirm/route.test.ts`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/components/ui/form-field.tsx`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\1-6-password-reset.md`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\sprint-status.yaml`
