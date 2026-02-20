# Story 2.3: Professional Summary Form

Status: review

## Story

As a user,
I want to write a professional summary,
So that recruiters quickly understand my profile.

## Acceptance Criteria

1. **Given** I am on section "Ringkasan"
   **When** I type in the textarea
   **Then** the summary is saved to CV data
   **And** a content tip shows: "Tulis 2-3 kalimat yang merangkum pengalaman, keahlian utama, dan tujuan karir Anda"
   **And** a character count is displayed (recommended: 150-300 characters).

## Tasks / Subtasks

- [x]Add summary validation contract (AC: 1)
  - [x]Extend `src/lib/validations/cv.ts` with summary payload schema
  - [x]Add validation tests in `src/lib/validations/cv.test.ts`

- [x]Add API endpoint to persist summary into CV JSON (AC: 1)
  - [x]Create route `src/app/api/cv/[id]/summary/route.ts` (PATCH)
  - [x]Enforce authenticated-only access via session cookie
  - [x]Enforce CV ownership (`cv.userId === session.userId`)
  - [x]Merge `summary` into `CV.data` JSON and persist update

- [x]Build ringkasan form UI (AC: 1)
  - [x]Create client component `src/components/cv-builder/summary-form.tsx`
  - [x]Render textarea untuk isi ringkasan
  - [x]Render content tip sesuai AC
  - [x]Render character count + recommendation 150-300
  - [x]Submit ke endpoint summary

- [x]Integrate section rendering in editor (AC: 1)
  - [x]Update stepper agar bisa pindah section
  - [x]Render `SummaryForm` pada section Ringkasan

- [x]Add test coverage for summary flow (AC: 1)
  - [x]API test: unauthenticated request rejected
  - [x]API test: forbidden for non-owner CV
  - [x]API test: validation error for invalid payload
  - [x]API test: success updates `CV.data.summary`

## Dev Notes

### Technical Requirements
- Scope hanya section Ringkasan.
- Penyimpanan dilakukan ke field JSON `CV.data.summary`.
- Character count bersifat informative, bukan hard validation AC.

### Architecture Compliance
- Route editor tetap protected.
- Update data wajib ownership-aware.
- API boundary wajib validasi payload.

### Library / Framework Requirements
- Next.js App Router + Route Handlers
- Prisma 7 + PostgreSQL
- Zod + react-hook-form
- Tailwind v4

### File Structure Requirements
Primary files expected for this story:
- `src/lib/validations/cv.ts`
- `src/lib/validations/cv.test.ts`
- `src/app/api/cv/[id]/summary/route.ts`
- `src/app/api/cv/[id]/summary/route.test.ts`
- `src/components/cv-builder/summary-form.tsx`
- `src/components/cv-builder/form-stepper.tsx`
- `src/app/(app)/editor/[id]/page.tsx`

### Testing Requirements
- Validate all ACs with executable tests.
- Regression check: `npm test`, `npm run lint`, `npm run build` tetap passing.

### Security & Quality Guardrails
- Jangan izinkan update summary tanpa session valid.
- Jangan izinkan update CV milik user lain.
- Jangan overwrite seluruh struktur `CV.data`; update hanya bagian `summary`.

### Previous Story Intelligence
- Story 2.1 menyediakan editor route dan ownership check.
- Story 2.2 menyediakan pola PATCH endpoint, form submit, dan merge JSON CV.data.

### References
- `E:\CV_MAKER\_bmad-output\planning-artifacts\epics.md` — Epic 2, Story 2.3 ACs.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-2-personal-info-form.md` — baseline section form pattern.

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- `npm test` (pass: 71/71 tests)
- `npm run lint` (pass)
- `npm run build` (pass)

### Completion Notes List

- Menambahkan skema validasi ringkasan `cvSummarySchema` di `src/lib/validations/cv.ts` untuk field `summary` (required, trim, max length) dan melengkapi unit test di `src/lib/validations/cv.test.ts`.
- Menambahkan endpoint `PATCH /api/cv/[id]/summary` di `src/app/api/cv/[id]/summary/route.ts` dengan guard session, ownership check, validasi payload boundary, merge update ke `CV.data.summary`, dan optimistic concurrency check berbasis `updatedAt` untuk mengurangi risiko lost update.
- Menambahkan test endpoint summary di `src/app/api/cv/[id]/summary/route.test.ts` mencakup skenario `401`, `403`, `400`, dan `200`.
- Menambahkan komponen `SummaryForm` di `src/components/cv-builder/summary-form.tsx` berisi textarea ringkasan, content tip sesuai AC, character count (rekomendasi 150-300), validasi on blur, submit ke API summary, serta refresh data setelah save sukses.
- Mengupdate `FormStepper` agar step dapat dinavigasi via query `?section=` dan active step mengikuti section terpilih.
- Mengupdate `EditorPage` agar mendukung `searchParams.section`, merender `SummaryForm` pada section `summary`, merender `PersonalInfoForm` pada `personal-info`, dan menampilkan placeholder untuk section yang belum diimplementasikan.
- Mengupdate `EditorPage` tests agar kompatibel dengan prop `searchParams` baru.
- Menjalankan code review story 2.3 dan menindaklanjuti temuan relevan dalam scope (section render correctness, maxLength UI, refresh setelah save, concurrency guard).

### File List

- `src/lib/validations/cv.ts`
- `src/lib/validations/cv.test.ts`
- `src/app/api/cv/[id]/summary/route.ts`
- `src/app/api/cv/[id]/summary/route.test.ts`
- `src/components/cv-builder/summary-form.tsx`
- `src/components/cv-builder/form-stepper.tsx`
- `src/app/(app)/editor/[id]/page.tsx`
- `src/app/(app)/editor/[id]/page.test.ts`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-3-professional-summary-form.md`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\sprint-status.yaml`
