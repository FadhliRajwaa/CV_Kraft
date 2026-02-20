# Story 1.3: Email Login

Status: review

## Story

As a returning user,
I want to login with my email and password,
so that I can access my saved CVs.

## Acceptance Criteria

1. **Given** I am on the login page
   **When** I enter valid email and password
   **Then** I am authenticated and redirected to dashboard
   **And** a session cookie is set.
2. **Given** I enter wrong email or password
   **When** I submit the form
   **Then** I see an error `Email atau password salah`.

## Tasks / Subtasks

- [x] Build login page UI with validation (AC: 1, 2)
  - [x] Create route `src/app/(auth)/login/page.tsx`
  - [x] Create form fields: email, password
  - [x] Add client-side validation using Zod + react-hook-form
  - [x] Render inline error messages for invalid input

- [x] Implement login API endpoint (AC: 1, 2)
  - [x] Create endpoint `src/app/api/auth/login/route.ts`
  - [x] Validate request payload with Zod at API boundary
  - [x] Find user by email using Prisma
  - [x] Verify password with bcrypt compare
  - [x] Return error response with message `Email atau password salah` for invalid credentials

- [x] Integrate auth session after successful login (AC: 1)
  - [x] Ensure successful login flow proceeds to authenticated session
  - [x] Redirect successful login to `/dashboard`
  - [x] Ensure cookie/session behavior follows secure NextAuth defaults

- [x] Add minimum test coverage for story behavior (AC: 1, 2)
  - [x] Add validation tests for invalid login payload
  - [x] Add invalid-credential behavior test for API logic
  - [x] Add success-path test for credential verification and session cookie

## Dev Notes

### Technical Requirements
- Keep implementation strictly scoped to email login only.
- Use existing baseline from Story 1.1 (`done`) and Story 1.2 (`review`): Next.js App Router, Prisma 7, PostgreSQL, Tailwind v4, shadcn/ui foundation.
- Authentication stack target remains NextAuth.js v5/Auth.js + Prisma adapter (from architecture decision).

### Architecture Compliance
- Follow auth architecture in `planning-artifacts/architecture.md`:
  - Password verification must use bcrypt compare.
  - Session must be cookie-based and secure (`HTTP-only`, `secure`, `SameSite`).
  - Input validation required on API endpoints (Zod).
- Keep DB access via Prisma client from `src/lib/prisma.ts`.

### Library / Framework Requirements
- Next.js App Router + Route Handlers
- Prisma 7 + PostgreSQL
- Zod for validation
- bcrypt for credential verification
- NextAuth/Auth.js-compatible session flow
- Tailwind v4 + shadcn/ui for form UI

### File Structure Requirements
Primary files expected for this story:
- `src/app/(auth)/login/page.tsx`
- `src/app/api/auth/login/route.ts`
- `src/lib/validations/auth.ts` (extend with login schema)
- Optional: `src/lib/auth/login.ts` if auth service is extracted

### Testing Requirements
- Validate all ACs with executable tests (unit/integration as applicable).
- Minimum checks:
  - invalid payload returns validation errors
  - wrong credentials return expected error message
  - success path authenticates user and sets session cookie
- Regression check: existing build and lint remain passing.

### Security & Quality Guardrails
- Never expose whether email exists via different error messages (tetap `Email atau password salah` untuk kredensial invalid).
- Never leak DB/internal error details in API response.
- Validate at both form-level UX and API boundary.
- Reuse signed/secure session cookie approach yang sudah dipakai di Story 1.2.

### Previous Story Intelligence
- Story 1.2 sudah memiliki pola validasi form + API route + service layer + test structure untuk auth flow.
- Session cookie di Story 1.2 sudah diperkuat dengan nilai bertanda tangan HMAC.
- Error duplicate email pada registrasi sudah ditangani dengan pemetaan Prisma `P2002`.

### Scope Boundaries
In scope:
- Email login page + endpoint + validation + credential verification + success redirect/session behavior.

Out of scope:
- Google OAuth (Story 1.4)
- Logout/session management detail beyond post-login behavior (Story 1.5)
- Password reset (Story 1.6)

### References
- `E:\CV_MAKER\_bmad-output\planning-artifacts\epics.md` — Epic 1, Story 1.3 ACs.
- `E:\CV_MAKER\_bmad-output\planning-artifacts\architecture.md` — Auth decision, security architecture, session requirements.
- `E:\CV_MAKER\_bmad-output\planning-artifacts\prd.md` — FR login/auth constraints.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\1-2-email-registration.md` — previous story implementation patterns.

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- N/A (story creation stage)

### Completion Notes List

- Login page berhasil dibuat di `src/app/(auth)/login/page.tsx` dengan field email dan password serta inline validation (Zod + react-hook-form).
- Endpoint login berhasil dibuat di `src/app/api/auth/login/route.ts` dengan validasi payload Zod, pencarian user berdasarkan email, dan verifikasi password via bcrypt compare.
- Kredensial invalid mengembalikan respons `Email atau password salah` sesuai AC.
- Success login mengembalikan redirect target `/dashboard` dan set HTTP-only secure signed session cookie (`auth_session`) menggunakan `SESSION_SECRET`.
- Login service ditambahkan di `src/lib/auth/login.ts` dengan `InvalidCredentialsError`, pola dependency injection untuk testability, dan mitigasi timing attack menggunakan dummy bcrypt hash.
- Endpoint login ditambah rate limiting in-memory (maks 5 percobaan/60 detik per kombinasi IP+email) yang mengembalikan status `429` saat limit terlampaui.
- Skema validasi auth diperluas dengan `loginSchema` di `src/lib/validations/auth.ts`.
- Test coverage ditambahkan untuk login schema, login service, dan API route login (termasuk verifikasi timing-safe compare path dan respons `429`).
- Verifikasi lulus: `npm test`, `npm run lint`, `npm run build`.

### File List

- `src/app/(auth)/login/page.tsx`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/login/route.test.ts`
- `src/lib/auth/login.ts`
- `src/lib/auth/login.test.ts`
- `src/lib/validations/auth.ts`
- `src/lib/validations/auth.test.ts`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\1-3-email-login.md`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\sprint-status.yaml`
