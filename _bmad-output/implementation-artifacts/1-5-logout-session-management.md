# Story 1.5: Logout & Session Management

Status: review

## Story

As a logged-in user,
I want to logout from my account,
so that my session is ended securely.

## Acceptance Criteria

1. **Given** I am logged in
   **When** I click "Logout" from the user menu
   **Then** my session is destroyed
   **And** I am redirected to the landing page.
2. **Given** I access a protected route without a valid session
   **When** the page loads
   **Then** I am redirected to the login page.

## Tasks / Subtasks

- [x] Add logout action endpoint (AC: 1)
  - [x] Create route `src/app/api/auth/logout/route.ts`
  - [x] Clear auth session cookie securely
  - [x] Return redirect target to landing page (`/`)

- [x] Add logout UI entry point (AC: 1)
  - [x] Add logout button/action in authenticated area (dashboard context)
  - [x] Trigger logout API call and navigate to landing page

- [x] Add protected-route enforcement (AC: 2)
  - [x] Implement session check helper for protected pages
  - [x] Enforce redirect to `/login` when session is missing/invalid
  - [x] Apply enforcement on `/dashboard`

- [x] Add minimum test coverage for logout/session management (AC: 1, 2)
  - [x] Add test for logout endpoint clearing cookie
  - [x] Add test for protected route redirect when unauthenticated
  - [x] Add test for allowed access when authenticated

## Dev Notes

### Technical Requirements
- Keep implementation strictly scoped to logout and session guard behavior.
- Continue using current signed cookie session approach from Story 1.3/1.4 (`auth_session`).
- Preserve existing auth API conventions and error-response style.

### Architecture Compliance
- Session destruction must invalidate client cookie.
- Protected route behavior must redirect unauthenticated users to login.
- Keep API boundary and session checks simple and explicit.

### Library / Framework Requirements
- Next.js App Router + Route Handlers
- Existing session cookie signing approach
- Tailwind v4 + shadcn/ui for UI entry point where needed
- Vitest for tests

### File Structure Requirements
Primary files expected for this story:
- `src/app/api/auth/logout/route.ts`
- `src/app/(app)/dashboard/page.tsx` (or related dashboard layout/guard)
- Optional: `src/lib/auth/session.ts` for cookie parsing/validation helper
- Optional: middleware or server-side guard utility for protected routes

### Testing Requirements
- Validate all ACs with executable tests.
- Minimum checks:
  - logout clears auth cookie and redirects to landing target
  - protected route redirects unauthenticated user to `/login`
  - authenticated user still can access protected route
- Regression check: existing build/lint/test remain passing.

### Security & Quality Guardrails
- Never keep stale auth cookie after logout.
- Never expose internal session parsing errors to end user.
- Ensure invalid session is treated as unauthenticated.

### Previous Story Intelligence
- Story 1.3 men-standardisasi cookie session ke `auth_session` dengan `SESSION_SECRET`.
- Story 1.4 menambah OAuth flow berbasis cookie session yang sama.
- Dashboard route sudah tersedia sebagai target redirect auth flow.

### Scope Boundaries
In scope:
- Logout endpoint + UI trigger + protected-route redirect behavior.

Out of scope:
- Password reset flow (Story 1.6)
- Role-based permissions granular
- Session persistence DB-backed migration

### References
- `E:\CV_MAKER\_bmad-output\planning-artifacts\epics.md` — Epic 1, Story 1.5 ACs.
- `E:\CV_MAKER\_bmad-output\planning-artifacts\architecture.md` — auth and session architecture constraints.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\1-3-email-login.md` — baseline session model.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\1-4-google-oauth-login.md` — OAuth/session continuity.

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- N/A (story creation stage)

### Completion Notes List

- Session helper ditambahkan di `src/lib/auth/session.ts` untuk parsing + validasi signature cookie `auth_session` menggunakan `SESSION_SECRET` dan `timingSafeEqual`.
- `SESSION_COOKIE_OPTIONS` diekstrak sebagai shared constant dari `src/lib/auth/session.ts` lalu direuse oleh logout route dan server action dashboard agar konfigurasi cookie konsisten.
- Endpoint logout dibuat di `src/app/api/auth/logout/route.ts` untuk menghapus cookie session (`Max-Age=0`) dan mengembalikan redirect target `/`.
- Halaman dashboard diperbarui di `src/app/(app)/dashboard/page.tsx`:
  - melakukan guard session di server-side,
  - redirect ke `/login` jika tidak ada/invalid session,
  - menyediakan tombol Logout yang menghapus cookie dan redirect ke landing page.
- Konsistensi lintas auth flow dirapikan pasca code-review: register route sekarang menggunakan cookie name `auth_session` dan secret env `SESSION_SECRET` yang sama dengan login/google/logout.
- Test coverage ditambahkan untuk session parser, logout endpoint, dan guard dashboard; test register ikut disesuaikan terhadap standardisasi cookie/secret.
- Verifikasi lulus: `npm test`, `npm run lint`, `npm run build`.

### File List

- `src/lib/auth/session.ts`
- `src/lib/auth/session.test.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/logout/route.test.ts`
- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/dashboard/page.test.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/register/route.test.ts`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\1-5-logout-session-management.md`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\sprint-status.yaml`
