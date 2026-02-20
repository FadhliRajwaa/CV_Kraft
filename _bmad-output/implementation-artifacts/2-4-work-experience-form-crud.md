# Story 2.4: Work Experience Form (CRUD)

Status: review

## Story

As a user,
I want to add, edit, and remove work experience entries,
So that my CV shows my professional history.

## Acceptance Criteria

1. **Given** I am on section "Pengalaman"
   **When** I click "+ Tambah Pengalaman"
   **Then** a new entry form appears with fields: Perusahaan, Posisi, Tanggal Mulai, Tanggal Selesai, checkbox "Masih bekerja di sini", Deskripsi, Achievements
   **And** I can add multiple achievement bullet points
   **And** content tips show: "Gunakan angka spesifik — contoh: 'Meningkatkan conversion rate 35%'"

2. **Given** I have existing experience entries
   **When** I click edit on an entry
   **Then** the entry form is populated with existing data for editing

3. **Given** I have existing experience entries
   **When** I click delete on an entry
   **Then** a confirmation dialog appears
   **And** the entry is removed after confirmation

## Tasks / Subtasks

- [x] Add experiences validation contract (AC: 1,2,3)
  - [x] Extend `src/lib/validations/cv.ts` with `cvExperienceItemSchema` + `cvExperiencesSchema`
  - [x] Add guard for chronological dates (`startDate <= endDate` when not current)
  - [x] Add validation tests in `src/lib/validations/cv.test.ts`

- [x] Add API endpoint to persist experiences into CV JSON (AC: 1,2,3)
  - [x] Create route `src/app/api/cv/[id]/experiences/route.ts` (PATCH)
  - [x] Enforce authenticated-only access via session cookie
  - [x] Enforce CV ownership (`cv.userId === session.userId`)
  - [x] Merge `experiences` into `CV.data` JSON and persist update

- [x] Build pengalaman form UI (AC: 1,2,3)
  - [x] Create client component `src/components/cv-builder/experiences-form.tsx`
  - [x] Render CRUD entry list (add, edit via bound fields, delete)
  - [x] Render required fields sesuai AC
  - [x] Render content tip sesuai AC
  - [x] Support multiple achievements (newline to bullet array mapping)
  - [x] Submit to experiences endpoint and refresh editor data

- [x] Integrate section rendering in editor (AC: 1)
  - [x] Update `src/app/(app)/editor/[id]/page.tsx` to hydrate `experiences` data
  - [x] Render `ExperiencesForm` on section `experiences`

- [x] Add test coverage for experiences flow (AC: 1,2,3)
  - [x] API test: unauthenticated request rejected
  - [x] API test: forbidden for non-owner CV
  - [x] API test: validation error for invalid payload
  - [x] API test: success updates `CV.data.experiences`
  - [x] Validation unit tests for experience payload

## Dev Notes

### Technical Requirements
- Scope story ini hanya section Pengalaman.
- Penyimpanan dilakukan ke field JSON `CV.data.experiences`.
- UI edit menggunakan prefilled bound inputs dari data existing (in-place edit).

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
- `src/app/api/cv/[id]/experiences/route.ts`
- `src/app/api/cv/[id]/experiences/route.test.ts`
- `src/components/cv-builder/experiences-form.tsx`
- `src/app/(app)/editor/[id]/page.tsx`

### Testing Requirements
- Validate all ACs with executable tests.
- Regression check: `npm test`, `npm run lint`, `npm run build` tetap passing.

### Security & Quality Guardrails
- Jangan izinkan update experiences tanpa session valid.
- Jangan izinkan update CV milik user lain.
- Jangan overwrite seluruh struktur `CV.data`; update hanya bagian `experiences`.

### Previous Story Intelligence
- Story 2.1 menyediakan editor route dan ownership check.
- Story 2.2 dan 2.3 menyediakan pola PATCH endpoint + form submit + merge JSON CV.data.

### References
- `E:\CV_MAKER\_bmad-output\planning-artifacts\epics.md` — Epic 2, Story 2.4 ACs.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-3-professional-summary-form.md` — baseline section pattern.

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- `npm test` (pass: 79/79 tests)
- `npm run lint` (pass)
- `npm run build` (pass)

### Completion Notes List

- Menambahkan skema validasi pengalaman `cvExperienceItemSchema` dan `cvExperiencesSchema` di `src/lib/validations/cv.ts` dengan validasi required fields, list achievements, dan validasi kronologi tanggal (`startDate <= endDate` saat `isCurrent=false`).
- Menambahkan unit tests validasi experiences di `src/lib/validations/cv.test.ts` untuk skenario valid, required fields kosong, achievement kosong, dan tanggal tidak valid.
- Menambahkan endpoint `PATCH /api/cv/[id]/experiences` di `src/app/api/cv/[id]/experiences/route.ts` dengan guard session, ownership check, validasi payload boundary, serta merge update ke `CV.data.experiences`.
- Menambahkan test endpoint experiences di `src/app/api/cv/[id]/experiences/route.test.ts` mencakup skenario `401`, `403`, `400`, dan `200`.
- Menambahkan komponen `ExperiencesForm` di `src/components/cv-builder/experiences-form.tsx` untuk add/edit/delete pengalaman, parsing multiple achievements, checkbox "Masih bekerja di sini", auto-clear `endDate` saat current job, submit ke API, dan refresh data setelah save sukses.
- Mengupdate `EditorPage` agar section `experiences` me-render `ExperiencesForm` dengan hydrasi data existing dari `CV.data`.
- Menjalankan code review story 2.4 dan menindaklanjuti temuan relevan dalam scope (validasi rentang tanggal dan sinkronisasi `endDate` saat current job).

### File List

- `src/lib/validations/cv.ts`
- `src/lib/validations/cv.test.ts`
- `src/app/api/cv/[id]/experiences/route.ts`
- `src/app/api/cv/[id]/experiences/route.test.ts`
- `src/components/cv-builder/experiences-form.tsx`
- `src/app/(app)/editor/[id]/page.tsx`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-4-work-experience-form-crud.md`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\sprint-status.yaml`
