# Story 2.7: Section Ordering & Language Selection

Status: done

## Story

As a user,
I want to reorder CV sections and choose the output language,
So that my CV is structured the way I want in the language I need.

## Acceptance Criteria

1. **Given** I am on the CV editor
   **When** I drag sections in the stepper or use up/down controls
   **Then** the section order changes in both the form and preview

2. **Given** I am on the CV editor
   **When** I select language "English" or "Bahasa Indonesia" from the language selector
   **Then** the CV labels and headers in the preview switch to the selected language

## Tasks / Subtasks

- [x] Add validation contracts for section order and language (AC: 1,2)
  - [x] Add `CV_SECTION_KEYS` constant in `src/lib/validations/cv.ts`
  - [x] Add `cvSectionOrderSchema` + duplicate guard
  - [x] Add `cvLanguageSchema` enum (`id`/`en`)
  - [x] Add validation tests in `src/lib/validations/cv.test.ts`

- [x] Add persistence APIs (AC: 1,2)
  - [x] Create route `src/app/api/cv/[id]/section-order/route.ts` (PATCH)
  - [x] Create route `src/app/api/cv/[id]/language/route.ts` (PATCH)
  - [x] Enforce authenticated-only access, ownership check, payload validation
  - [x] Add optimistic concurrency guard (`updatedAt` + `updateMany`)

- [x] Update editor UI to support ordering and language selection (AC: 1,2)
  - [x] Refactor `FormStepper` to render from persisted ordered sections
  - [x] Add up/down controls for section reordering and persist through API
  - [x] Add `LanguageSelector` component and persist selected language through API
  - [x] Show preview headers in selected language and ordered sections

- [x] Sync default CV data shape and editor hydration (AC: 1,2)
  - [x] Add `sectionOrder` to `CvData` in `src/lib/cv/default-data.ts`
  - [x] Hydrate/sanitize `sectionOrder` in `src/app/(app)/editor/[id]/page.tsx`
  - [x] Hydrate current `cv.language` from DB

- [x] Add API tests coverage (AC: 1,2)
  - [x] Section order API test: `401`, `403`, `400`, `200`, `409`
  - [x] Language API test: `401`, `403`, `400`, `200`, `409`

## Dev Notes

### Technical Requirements
- Scope story ini fokus pada pengaturan urutan section dan pilihan bahasa output CV.
- Fitur reordering diimplementasikan via kontrol up/down pada stepper.
- Bahasa output disimpan di kolom `CV.language` (`id` atau `en`).

### Architecture Compliance
- Semua endpoint mengikuti pola route sebelumnya: auth guard, ownership check, payload validation.
- Update API memakai optimistic concurrency guard untuk mencegah stale overwrite.

### Library / Framework Requirements
- Next.js App Router + Route Handlers
- Prisma 7 + PostgreSQL
- Zod + react-hook-form ecosystem
- Tailwind v4

### File Structure Requirements
Primary files expected for this story:
- `src/lib/cv/default-data.ts`
- `src/lib/validations/cv.ts`
- `src/lib/validations/cv.test.ts`
- `src/components/cv-builder/form-stepper.tsx`
- `src/components/cv-builder/language-selector.tsx`
- `src/app/(app)/editor/[id]/page.tsx`
- `src/app/(app)/editor/[id]/page.test.ts`
- `src/app/api/cv/[id]/section-order/route.ts`
- `src/app/api/cv/[id]/section-order/route.test.ts`
- `src/app/api/cv/[id]/language/route.ts`
- `src/app/api/cv/[id]/language/route.test.ts`

### Testing Requirements
- Validate all ACs with executable tests.
- Regression check: `npm test`, `npm run lint`, `npm run build` tetap passing.

### Security & Quality Guardrails
- Jangan izinkan update urutan section/bahasa tanpa session valid.
- Jangan izinkan update CV milik user lain.
- Jangan overwrite seluruh `CV.data`; update hanya `sectionOrder` untuk route order.

### Previous Story Intelligence
- Story 2.1 menyediakan editor route + stepper baseline.
- Story 2.2–2.6 menyediakan pattern section PATCH endpoints dengan ownership guard.

### References
- `E:\CV_MAKER\_bmad-output\planning-artifacts\epics.md` — Epic 2, Story 2.7 ACs.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-6-skills-certifications-projects-forms.md` — baseline latest section pattern.

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- `npm test` (pass)
- `npm run lint` (pass)
- `NODE_OPTIONS=--max-old-space-size=4096 npm run build` (pass)

### Completion Notes List

- Menambahkan konstanta section keys dan schema validasi baru (`cvSectionOrderSchema`, `cvLanguageSchema`) untuk menjaga integritas payload order/bahasa.
- Menambahkan endpoint `PATCH /api/cv/[id]/section-order` untuk menyimpan urutan section ke `CV.data.sectionOrder`.
- Menambahkan endpoint `PATCH /api/cv/[id]/language` untuk menyimpan bahasa output ke kolom `CV.language`.
- Menambahkan coverage test untuk kedua endpoint dengan skenario `401`, `403`, `400`, `200`, dan `409`.
- Memperbarui `FormStepper` menjadi komponen client yang menerima urutan section terpersisten dan menyediakan kontrol naik/turun.
- Menambahkan komponen `LanguageSelector` untuk memilih Bahasa Indonesia/English dari editor.
- Memperbarui editor page agar meng-hydrate/sanitize urutan section, membaca bahasa CV dari database, dan menampilkan preview headers yang mengikuti bahasa + urutan section.
- Menambahkan field `sectionOrder` ke default CV data agar kompatibel dengan data baru.

### File List

- `src/lib/cv/default-data.ts`
- `src/lib/validations/cv.ts`
- `src/lib/validations/cv.test.ts`
- `src/components/cv-builder/form-stepper.tsx`
- `src/components/cv-builder/language-selector.tsx`
- `src/app/(app)/editor/[id]/page.tsx`
- `src/app/(app)/editor/[id]/page.test.ts`
- `src/app/api/cv/[id]/section-order/route.ts`
- `src/app/api/cv/[id]/section-order/route.test.ts`
- `src/app/api/cv/[id]/language/route.ts`
- `src/app/api/cv/[id]/language/route.test.ts`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-7-section-ordering-language-selection.md`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\sprint-status.yaml`
