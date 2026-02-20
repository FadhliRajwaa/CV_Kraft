# Story 2.6: Skills, Certifications & Projects Forms

Status: review

## Story

As a user,
I want to add my skills, certifications, and projects,
So that my CV is comprehensive.

## Acceptance Criteria

1. **Given** I am on section "Keahlian"
   **When** I add skills
   **Then** I can enter skill name and optional category
   **And** I can add, reorder, and remove skills

2. **Given** I am on section "Sertifikasi"
   **When** I add certifications
   **Then** I can enter: Nama Sertifikasi, Penerbit, Tanggal, URL (optional)

3. **Given** I am on section "Proyek"
   **When** I add projects
   **Then** I can enter: Nama Proyek, Deskripsi, URL (optional), Teknologi yang digunakan

## Tasks / Subtasks

- [x] Add validation contracts for skills/certifications/projects (AC: 1,2,3)
  - [x] Extend `src/lib/validations/cv.ts` with `cvSkillItemSchema` + `cvSkillsSchema`
  - [x] Extend `src/lib/validations/cv.ts` with `cvCertificationItemSchema` + `cvCertificationsSchema`
  - [x] Extend `src/lib/validations/cv.ts` with `cvProjectItemSchema` + `cvProjectsSchema`
  - [x] Add validation tests in `src/lib/validations/cv.test.ts`

- [x] Add API endpoints to persist section data into CV JSON (AC: 1,2,3)
  - [x] Create route `src/app/api/cv/[id]/skills/route.ts` (PATCH)
  - [x] Create route `src/app/api/cv/[id]/certifications/route.ts` (PATCH)
  - [x] Create route `src/app/api/cv/[id]/projects/route.ts` (PATCH)
  - [x] Enforce authenticated-only access via session cookie
  - [x] Enforce CV ownership (`cv.userId === session.userId`)
  - [x] Merge section payload into `CV.data` JSON and persist update
  - [x] Add optimistic concurrency guard (`updatedAt` + `updateMany`)

- [x] Build form UI for three sections (AC: 1,2,3)
  - [x] Create client component `src/components/cv-builder/skills-form.tsx`
  - [x] Create client component `src/components/cv-builder/certifications-form.tsx`
  - [x] Create client component `src/components/cv-builder/projects-form.tsx`
  - [x] Skills form supports add/reorder/remove entries
  - [x] Certifications form supports add/edit/delete entries
  - [x] Projects form supports add/edit/delete entries with technologies input

- [x] Integrate section rendering in editor (AC: 1,2,3)
  - [x] Update `src/app/(app)/editor/[id]/page.tsx` to hydrate `skills`, `certifications`, `projects`
  - [x] Render `SkillsForm`, `CertificationsForm`, dan `ProjectsForm` berdasarkan query `section`

- [x] Add test coverage for section APIs (AC: 1,2,3)
  - [x] Skills API test: `401`, `403`, `400`, `200`, `409`
  - [x] Certifications API test: `401`, `403`, `400`, `200`, `409`
  - [x] Projects API test: `401`, `403`, `400`, `200`, `409`
  - [x] Validation unit tests for skill/certification/project payload

## Dev Notes

### Technical Requirements
- Scope story ini mencakup section Keahlian, Sertifikasi, dan Proyek.
- Penyimpanan dilakukan ke field JSON `CV.data.skills`, `CV.data.certifications`, dan `CV.data.projects`.
- Kategori skill bersifat opsional.
- URL sertifikasi dan URL proyek bersifat opsional.

### Architecture Compliance
- Route editor tetap protected.
- Update data wajib ownership-aware.
- API boundary wajib validasi payload.
- Update API memakai optimistic concurrency guard untuk mencegah stale overwrite.

### Library / Framework Requirements
- Next.js App Router + Route Handlers
- Prisma 7 + PostgreSQL
- Zod + react-hook-form
- Tailwind v4

### File Structure Requirements
Primary files expected for this story:
- `src/lib/cv/default-data.ts`
- `src/lib/validations/cv.ts`
- `src/lib/validations/cv.test.ts`
- `src/app/api/cv/[id]/skills/route.ts`
- `src/app/api/cv/[id]/skills/route.test.ts`
- `src/app/api/cv/[id]/certifications/route.ts`
- `src/app/api/cv/[id]/certifications/route.test.ts`
- `src/app/api/cv/[id]/projects/route.ts`
- `src/app/api/cv/[id]/projects/route.test.ts`
- `src/components/cv-builder/skills-form.tsx`
- `src/components/cv-builder/certifications-form.tsx`
- `src/components/cv-builder/projects-form.tsx`
- `src/app/(app)/editor/[id]/page.tsx`

### Testing Requirements
- Validate all ACs with executable tests.
- Regression check: `npm test`, `npm run lint`, `npm run build` tetap passing.

### Security & Quality Guardrails
- Jangan izinkan update section tanpa session valid.
- Jangan izinkan update CV milik user lain.
- Jangan overwrite seluruh struktur `CV.data`; update hanya bagian section terkait.

### Previous Story Intelligence
- Story 2.1 menyediakan editor route dan ownership check.
- Story 2.2–2.5 menyediakan pola PATCH endpoint + form submit + merge JSON CV.data.

### References
- `E:\CV_MAKER\_bmad-output\planning-artifacts\epics.md` — Epic 2, Story 2.6 ACs.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-5-education-form-crud.md` — baseline CRUD section pattern.

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- `npm test` (pass)
- `npm run lint` (pass)
- `npm run build` (pass)

### Completion Notes List

- Menambahkan kontrak validasi baru di `src/lib/validations/cv.ts` untuk skills (`cvSkillsSchema`), certifications (`cvCertificationsSchema`), dan projects (`cvProjectsSchema`) termasuk aturan required dan batas panjang field.
- Menambahkan unit tests validasi baru di `src/lib/validations/cv.test.ts` untuk payload skills, certifications, dan projects.
- Menambahkan endpoint `PATCH /api/cv/[id]/skills`, `PATCH /api/cv/[id]/certifications`, dan `PATCH /api/cv/[id]/projects` dengan guard session, ownership check, validasi payload boundary, merge update ke JSON `CV.data`, serta optimistic concurrency guard (`updatedAt` + `updateMany`).
- Menambahkan test endpoint untuk ketiga route di atas dengan skenario `401`, `403`, `400`, `200`, dan `409`.
- Menambahkan tiga komponen form section baru: `SkillsForm`, `CertificationsForm`, dan `ProjectsForm` untuk mendukung add/edit/delete, serta reorder pada skills.
- Mengupdate tipe `CvData` di `src/lib/cv/default-data.ts` agar shape `skills`, `certifications`, dan `projects` sinkron dengan AC dan payload form/API.
- Mengupdate `EditorPage` agar section `skills`, `certifications`, dan `projects` ter-hydrate dari `CV.data` dan ter-render melalui switch-case pada `renderSectionForm()`.
- Menjalankan code review story 2.6 dan menindaklanjuti temuan penting terkait race condition pada optimistic locking (`updatedAt` di `updateMany`).

### File List

- `src/lib/cv/default-data.ts`
- `src/lib/validations/cv.ts`
- `src/lib/validations/cv.test.ts`
- `src/app/api/cv/[id]/skills/route.ts`
- `src/app/api/cv/[id]/skills/route.test.ts`
- `src/app/api/cv/[id]/certifications/route.ts`
- `src/app/api/cv/[id]/certifications/route.test.ts`
- `src/app/api/cv/[id]/projects/route.ts`
- `src/app/api/cv/[id]/projects/route.test.ts`
- `src/components/cv-builder/skills-form.tsx`
- `src/components/cv-builder/certifications-form.tsx`
- `src/components/cv-builder/projects-form.tsx`
- `src/app/(app)/editor/[id]/page.tsx`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-6-skills-certifications-projects-forms.md`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\sprint-status.yaml`
