# Story 2.2: Personal Info Form

Status: done

## Story

As a user,
I want to fill in my personal information,
So that my CV has correct contact details.

## Acceptance Criteria

1. **Given** I am on the CV editor, section "Data Pribadi"
   **When** I fill in nama lengkap, email, telepon, alamat (optional), LinkedIn (optional), portfolio (optional)
   **Then** the data is stored in the CV JSON data field
   **And** each field has a content tip tooltip (💡) with guidance
   **And** the form validates email format and required fields on blur.

## Tasks / Subtasks

- [x]Add personal info validation contract (AC: 1)
  - [x]Create CV personal info schema in `src/lib/validations/cv.ts`
  - [x]Enforce required fields: `fullName`, `email`, `phone`
  - [x]Mark optional fields: `address`, `linkedIn`, `portfolio`

- [x]Add API endpoint to persist personal info into CV JSON (AC: 1)
  - [x]Create route `src/app/api/cv/[id]/personal-info/route.ts` (PATCH)
  - [x]Enforce authenticated-only access via session cookie
  - [x]Enforce CV ownership (`cv.userId === session.userId`)
  - [x]Merge `personalInfo` into `CV.data` JSON and persist update

- [x]Build Data Pribadi form UI in editor (AC: 1)
  - [x]Create client component for personal info form
  - [x]Prefill form from existing `CV.data.personalInfo`
  - [x]Validate on blur using Zod + react-hook-form
  - [x]Add content tip tooltip (💡) for each field guidance
  - [x]Submit to PATCH endpoint and show success/error feedback

- [x]Integrate form into editor section Data Pribadi (AC: 1)
  - [x]Update `src/app/(app)/editor/[id]/page.tsx` to load `data` field
  - [x]Render personal info form in editor content panel

- [x]Add test coverage for personal info flow (AC: 1)
  - [x]API test: unauthenticated request rejected
  - [x]API test: forbidden for non-owner CV
  - [x]API test: validation error for invalid payload
  - [x]API test: success updates `CV.data.personalInfo`
  - [x]Validation unit test for CV personal info schema

## Dev Notes

### Technical Requirements
- Scope hanya mencakup section "Data Pribadi".
- Penyimpanan dilakukan ke field JSON `CV.data.personalInfo`.
- Auto-save tidak diimplementasikan di story ini (Story 2.8).

### Architecture Compliance
- Route editor tetap protected.
- Update data wajib ownership-aware untuk mencegah IDOR.
- API boundary wajib validasi payload.

### Library / Framework Requirements
- Next.js App Router + Route Handlers
- Prisma 7 + PostgreSQL
- Zod + react-hook-form
- Tailwind v4

### File Structure Requirements
Primary files expected for this story:
- `src/lib/validations/cv.ts`
- `src/app/api/cv/[id]/personal-info/route.ts`
- `src/app/api/cv/[id]/personal-info/route.test.ts`
- `src/components/cv-builder/personal-info-form.tsx`
- `src/app/(app)/editor/[id]/page.tsx`

### Testing Requirements
- Validate all ACs with executable tests.
- Regression check: `npm test`, `npm run lint`, `npm run build` tetap passing.

### Security & Quality Guardrails
- Jangan izinkan update personal info tanpa session valid.
- Jangan izinkan update CV milik user lain.
- Jangan overwrite seluruh struktur `CV.data`; update hanya bagian `personalInfo`.

### Previous Story Intelligence
- Story 2.1 sudah menyediakan CV model, editor protected route, dan stepper section.
- Story 2.1 sudah menambahkan ownership check saat akses editor.

### References
- `E:\CV_MAKER\_bmad-output\planning-artifacts\epics.md` — Epic 2, Story 2.2 ACs.
- `E:\CV_MAKER\_bmad-output\planning-artifacts\prd.md` — CV builder requirements.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-1-create-new-cv-form-layout.md` — baseline editor & create CV flow.

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- `npm test` (pass: 65/65 tests)
- `npm run lint` (pass)
- `npm run build` (pass)

### Completion Notes List

- Menambahkan skema validasi personal info di `src/lib/validations/cv.ts` untuk field wajib (`fullName`, `email`, `phone`) dan field opsional (`address`, `linkedIn`, `portfolio`) dengan normalisasi email lowercase.
- Menambahkan hardening validasi pasca code-review: trimming email, batas panjang karakter, serta validasi URL untuk `linkedIn` dan `portfolio` (tetap mendukung string kosong).
- Menambahkan endpoint `PATCH /api/cv/[id]/personal-info` di `src/app/api/cv/[id]/personal-info/route.ts` dengan guard session, ownership check, validasi payload boundary, dan merge update ke `CV.data.personalInfo`.
- Menambahkan komponen client `PersonalInfoForm` di `src/components/cv-builder/personal-info-form.tsx` dengan validasi on blur, prefill data awal, content tip (💡), submit ke API, feedback sukses/gagal, serta redirect ke login saat session invalid (401).
- Mengintegrasikan form Data Pribadi ke editor panel di `src/app/(app)/editor/[id]/page.tsx` dengan load data JSON dari CV dan fallback default personal info.
- Menambahkan test coverage untuk API personal info (`401`, `403`, `400`, `200`) dan unit test validation schema personal info.
- Code-review story 2.2 dijalankan dan temuan penting yang relevan dengan scope sudah ditangani (validasi input + handling 401 di form).

### File List

- `src/lib/validations/cv.ts`
- `src/lib/validations/cv.test.ts`
- `src/app/api/cv/[id]/personal-info/route.ts`
- `src/app/api/cv/[id]/personal-info/route.test.ts`
- `src/components/cv-builder/personal-info-form.tsx`
- `src/app/(app)/editor/[id]/page.tsx`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-2-personal-info-form.md`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\sprint-status.yaml`
