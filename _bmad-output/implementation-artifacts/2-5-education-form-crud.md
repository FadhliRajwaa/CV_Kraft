# Story 2.5: Education Form (CRUD)

Status: review

## Story

As a user,
I want to add, edit, and remove education entries,
So that my CV shows my educational background.

## Acceptance Criteria

1. **Given** I am on section "Pendidikan"
   **When** I click "+ Tambah Pendidikan"
   **Then** a new entry form appears with: Institusi, Gelar, Bidang Studi, Tanggal Mulai, Tanggal Selesai, IPK (optional)
   **And** I can add, edit, and delete entries
   **And** content tips show relevant guidance

## Tasks / Subtasks

- [x] Add education validation contract (AC: 1)
  - [x] Extend `src/lib/validations/cv.ts` with `cvEducationItemSchema` + `cvEducationsSchema`
  - [x] Add date format and chronology validation for education dates
  - [x] Add validation tests in `src/lib/validations/cv.test.ts`

- [x] Add API endpoint to persist educations into CV JSON (AC: 1)
  - [x] Create route `src/app/api/cv/[id]/educations/route.ts` (PATCH)
  - [x] Enforce authenticated-only access via session cookie
  - [x] Enforce CV ownership (`cv.userId === session.userId`)
  - [x] Merge `educations` into `CV.data` JSON and persist update
  - [x] Add optimistic concurrency guard (`updatedAt` + `updateMany`)

- [x] Build pendidikan form UI (AC: 1)
  - [x] Create client component `src/components/cv-builder/educations-form.tsx`
  - [x] Render add/edit/delete education entries
  - [x] Render required fields + optional IPK
  - [x] Render content tip guidance
  - [x] Submit to educations endpoint and refresh editor data

- [x] Integrate section rendering in editor (AC: 1)
  - [x] Update `src/app/(app)/editor/[id]/page.tsx` to hydrate `educations` data
  - [x] Render `EducationsForm` pada section `educations`

- [x] Add test coverage for education flow (AC: 1)
  - [x] API test: unauthenticated request rejected
  - [x] API test: forbidden for non-owner CV
  - [x] API test: validation error for invalid payload
  - [x] API test: success updates `CV.data.educations`
  - [x] API test: conflict on concurrent update returns `409`
  - [x] Validation unit tests for education payload

## Dev Notes

### Technical Requirements
- Scope story ini hanya section Pendidikan.
- Penyimpanan dilakukan ke field JSON `CV.data.educations`.
- IPK bersifat opsional.

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
- `src/app/api/cv/[id]/educations/route.ts`
- `src/app/api/cv/[id]/educations/route.test.ts`
- `src/components/cv-builder/educations-form.tsx`
- `src/app/(app)/editor/[id]/page.tsx`

### Testing Requirements
- Validate all ACs with executable tests.
- Regression check: `npm test`, `npm run lint`, `npm run build` tetap passing.

### Security & Quality Guardrails
- Jangan izinkan update educations tanpa session valid.
- Jangan izinkan update CV milik user lain.
- Jangan overwrite seluruh struktur `CV.data`; update hanya bagian `educations`.

### Previous Story Intelligence
- Story 2.1 menyediakan editor route dan ownership check.
- Story 2.2-2.4 menyediakan pola PATCH endpoint + form submit + merge JSON CV.data.

### References
- `E:\CV_MAKER\_bmad-output\planning-artifacts\epics.md` — Epic 2, Story 2.5 ACs.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-4-work-experience-form-crud.md` — baseline CRUD section pattern.

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- `npm test` (pass: 87/87 tests)
- `npm run lint` (pass)
- `npm run build` (pass)

### Completion Notes List

- Menambahkan skema validasi pendidikan `cvEducationItemSchema` dan `cvEducationsSchema` di `src/lib/validations/cv.ts` termasuk validasi format tanggal `YYYY-MM` serta validasi kronologi tanggal.
- Menambahkan unit tests validasi pendidikan di `src/lib/validations/cv.test.ts` untuk skenario valid, required fields kosong, dan rentang tanggal tidak valid.
- Menambahkan endpoint `PATCH /api/cv/[id]/educations` di `src/app/api/cv/[id]/educations/route.ts` dengan guard session, ownership check, validasi payload boundary, merge update ke `CV.data.educations`, dan optimistic concurrency guard berbasis `updatedAt`.
- Menambahkan test endpoint education di `src/app/api/cv/[id]/educations/route.test.ts` mencakup skenario `401`, `403`, `400`, `200`, dan `409`.
- Menambahkan komponen `EducationsForm` di `src/components/cv-builder/educations-form.tsx` untuk add/edit/delete entry pendidikan, field IPK opsional, validasi on blur, submit API, dan refresh setelah save sukses.
- Mengupdate `EditorPage` agar section `educations` ter-render via `renderSectionForm()` menggunakan switch-case dan hydrasi data `educations` dari `CV.data`.
- Menjalankan code review story 2.5 dan menindaklanjuti temuan penting dalam scope (hardening validasi format tanggal, mitigasi race condition update, dan konsistensi render section).

### File List

- `src/lib/validations/cv.ts`
- `src/lib/validations/cv.test.ts`
- `src/app/api/cv/[id]/educations/route.ts`
- `src/app/api/cv/[id]/educations/route.test.ts`
- `src/components/cv-builder/educations-form.tsx`
- `src/app/(app)/editor/[id]/page.tsx`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-5-education-form-crud.md`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\sprint-status.yaml`
