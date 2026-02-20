# Story 1.2: Email Registration

Status: review

## Story

As a new user,
I want to register with my email and password,
so that I can create an account to save my CVs.

## Acceptance Criteria

1. **Given** I am on the registration page
   **When** I fill in name, email, and password (min 8 characters)
   **Then** a new account is created with password hashed via bcrypt
   **And** I am redirected to the dashboard
   **And** a session cookie is set (HTTP-only, secure).
2. **Given** I try to register with an email that already exists
   **When** I submit the form
   **Then** I see an error message `Email sudah terdaftar`.
3. **Given** I submit an invalid email or short password
   **When** I submit the form
   **Then** I see inline validation errors (Zod schema).

## Tasks / Subtasks

- [x] Build registration page UI with inline validation (AC: 1, 3)
  - [x] Create route `src/app/(auth)/register/page.tsx`
  - [x] Create form fields: name, email, password
  - [x] Add client-side validation using Zod + react-hook-form
  - [x] Render inline error messages for invalid input

- [x] Implement registration API endpoint (AC: 1, 2, 3)
  - [x] Create endpoint `src/app/api/auth/register/route.ts`
  - [x] Validate request payload with Zod at API boundary
  - [x] Check duplicate email using Prisma
  - [x] Return error response with message `Email sudah terdaftar` for duplicate email
  - [x] Hash password with bcrypt (cost factor 12) before save
  - [x] Create user record in database

- [x] Integrate auth session after successful registration (AC: 1)
  - [x] Ensure successful register flow proceeds to authenticated session
  - [x] Redirect successful registration to `/dashboard`
  - [x] Ensure cookie/session behavior follows secure NextAuth defaults

- [x] Add minimum test coverage for story behavior (AC: 1, 2, 3)
  - [x] Add validation tests for invalid email/password cases
  - [x] Add duplicate-email behavior test for API logic
  - [x] Add success-path test for user creation with hashed password

## Dev Notes

### Technical Requirements
- Keep implementation strictly scoped to email registration only.
- Use existing project baseline from Story 1.1 (`done`): Next.js App Router, Prisma 7, PostgreSQL, Tailwind v4, shadcn/ui foundation.
- Authentication stack target remains NextAuth.js v5/Auth.js + Prisma adapter (from architecture decision).

### Architecture Compliance
- Follow auth architecture in `planning-artifacts/architecture.md`:
  - Passwords must be hashed with bcrypt (cost factor 12).
  - Session must be cookie-based and secure (`HTTP-only`, `secure`, `SameSite`).
  - Input validation required on API endpoints (Zod).
- Keep DB access via Prisma client from `src/lib/prisma.ts`.

### Library / Framework Requirements
- Next.js App Router + Route Handlers
- Prisma 7 + PostgreSQL
- Zod for validation
- bcrypt for password hashing
- NextAuth/Auth.js-compatible session flow
- Tailwind v4 + shadcn/ui for form UI

### File Structure Requirements
Primary files expected for this story:
- `src/app/(auth)/register/page.tsx`
- `src/app/api/auth/register/route.ts`
- `src/lib/validations/auth.ts` (or equivalent auth validation module)
- Optional: `src/components/auth/register-form.tsx` if UI extracted into component

### Testing Requirements
- Validate all ACs with executable tests (unit/integration as applicable).
- Minimum checks:
  - invalid input returns validation errors
  - duplicate email path returns expected error message
  - success path creates user with hashed password
- Regression check: existing build and lint remain passing.

### Security & Quality Guardrails
- Never store plain password.
- Never leak DB/internal error details in API response.
- Keep error message for duplicate email exactly aligned with story AC.
- Validate at both form-level UX and API boundary.

### Previous Story Intelligence (Story 1.1)
- Prisma 7 config already uses `prisma.config.ts`; datasource URL is managed there.
- Prisma client is generated to `src/generated/prisma` and wrapped in `src/lib/prisma.ts` with `@prisma/adapter-pg`.
- Baseline build/lint/dev already confirmed working; keep consistency and avoid reworking bootstrap files.

### Scope Boundaries
In scope:
- Email registration page + endpoint + validation + password hashing + success redirect/session behavior.

Out of scope:
- Email login flow (Story 1.3)
- Google OAuth (Story 1.4)
- Logout/session management details beyond post-register session behavior (Story 1.5)
- Password reset (Story 1.6)

### References
- `E:\CV_MAKER\_bmad-output\planning-artifacts\epics.md` — Epic 1, Story 1.2 ACs.
- `E:\CV_MAKER\_bmad-output\planning-artifacts\architecture.md` — Auth decision, security architecture, bcrypt/session requirements.
- `E:\CV_MAKER\_bmad-output\planning-artifacts\prd.md` — FR1 (register email/password), NFR security constraints.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\1-1-project-setup-database-foundation.md` — completed baseline and tooling context.

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- N/A (story creation stage)

### Completion Notes List

- Registration page berhasil dibuat di `src/app/(auth)/register/page.tsx` dengan field nama, email, password dan inline validation (Zod + react-hook-form).
- Endpoint register berhasil dibuat di `src/app/api/auth/register/route.ts` dengan validasi payload Zod, pengecekan email duplikat, hash password bcrypt (cost 12), dan create user via Prisma.
- Duplicate email menghasilkan respons dengan pesan `Email sudah terdaftar` sesuai AC.
- Success registration mengembalikan redirect target `/dashboard` dan set HTTP-only secure cookie (`registration_session`).
- Session cookie diperkuat: nilai cookie sekarang ditandatangani HMAC (`userId.nonce.signature`) menggunakan `REGISTRATION_SESSION_SECRET` untuk mencegah spoofing cookie ID mentah.
- Race condition duplicate email saat create user ditangani: error Prisma `P2002` dipetakan ke `DuplicateEmailError` agar respons tetap konsisten `409`.
- Logging ditambahkan pada jalur error 500 di API register untuk mempermudah observability/debugging.
- Dashboard placeholder route dibuat di `src/app/(app)/dashboard/page.tsx` untuk target redirect.
- Test coverage ditambahkan untuk validasi schema, service register, dan API route register (termasuk test penanganan `P2002` dan cookie session bertanda tangan).
- Verifikasi lulus: `npm test`, `npm run lint`, `npm run build`.

### File List

- `src/app/(auth)/register/page.tsx`
- `src/app/(app)/dashboard/page.tsx`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/register/route.test.ts`
- `src/lib/auth/register.ts`
- `src/lib/auth/register.test.ts`
- `src/lib/validations/auth.ts`
- `src/lib/validations/auth.test.ts`
- `vitest.config.ts`
- `package.json`
- `package-lock.json`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\1-2-email-registration.md`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\sprint-status.yaml`
