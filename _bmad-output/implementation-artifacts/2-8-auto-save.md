# Story 2.8: Auto-Save

Status: done

## Story

As a user,
I want my CV to be saved automatically,
So that I don't lose my work.

## Acceptance Criteria

1. **Given** I am editing a CV
   **When** I stop typing for 30 seconds
   **Then** the CV data is saved to localStorage (immediate) and synced to database via API
   **And** an indicator shows "Tersimpan ✓" with timestamp

2. **Given** I close the browser accidentally
   **When** I return to the editor
   **Then** my latest changes are restored from localStorage or database

## Tasks / Subtasks

- [x] Implement reusable auto-save hook and shared helpers (AC: 1,2)
  - [x] Create `src/hooks/use-auto-save.ts` for hydrate + persist + debounced API sync
  - [x] Create `src/lib/cv/auto-save-helpers.ts` for standardized schema validator and fetcher
  - [x] Add stable hydration guard to prevent re-hydration overwrite during typing

- [x] Add auto-save status UI component (AC: 1)
  - [x] Create `src/components/cv-builder/auto-save-indicator.tsx`
  - [x] Show saving/saved/error/idle states with Indonesian copy and save timestamp

- [x] Integrate auto-save into all editor forms (AC: 1,2)
  - [x] `personal-info-form.tsx`
  - [x] `summary-form.tsx`
  - [x] `experiences-form.tsx`
  - [x] `educations-form.tsx`
  - [x] `skills-form.tsx`
  - [x] `certifications-form.tsx`
  - [x] `projects-form.tsx`

- [x] Preserve existing manual save behavior (AC: 1)
  - [x] Keep explicit submit button flows and server-side error handling intact
  - [x] Keep existing API endpoints/contracts unchanged

- [x] Verification and code review (AC: 1,2)
  - [x] Run `npm test`
  - [x] Run `npm run lint`
  - [x] Run `NODE_OPTIONS=--max-old-space-size=4096 npm run build`
  - [x] Run code review pass and fix high-priority issue in hydration logic

## Dev Notes

### Technical Requirements
- Auto-save uses local draft persistence (`localStorage`) and debounced server sync.
- Draft restoration happens once on initial mount per form.
- Debounce interval follows story requirement: 30 seconds.

### Architecture Compliance
- Keep existing section APIs as source of truth for persistence.
- Keep ownership/auth checks in API layer unchanged.
- Keep optimistic concurrency behavior unchanged (where already implemented by each route).

### Security & Reliability Guardrails
- Unauthorized API responses redirect user to login.
- Malformed local drafts are ignored safely.
- Hydration guard prevents repeated reset that could overwrite current typing.

### Testing Requirements
- Regression checks run green after integration (`test/lint/build`).

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- `npm run lint` (pass)
- `npm test` (pass)
- `NODE_OPTIONS=--max-old-space-size=4096 npm run build` (pass)

### Completion Notes List

- Menambahkan hook generik `useAutoSave` untuk restore draft dari `localStorage`, persist draft saat form berubah, dan sinkronisasi API setelah idle 30 detik.
- Menambahkan helper `createSchemaValidator` dan `createAutoSaveFetcher` agar wiring auto-save antar form konsisten.
- Menambahkan `AutoSaveIndicator` untuk menampilkan status auto-save dan timestamp `Tersimpan ✓`.
- Mengintegrasikan auto-save ke seluruh form editor CV (7 section forms).
- Memperbaiki risiko overwrite input dengan guard hydration satu kali pada `useAutoSave`.
- Menjaga alur simpan manual (submit button) tetap berfungsi seperti sebelumnya.

### File List

- `src/hooks/use-auto-save.ts`
- `src/lib/cv/auto-save-helpers.ts`
- `src/components/cv-builder/auto-save-indicator.tsx`
- `src/components/cv-builder/personal-info-form.tsx`
- `src/components/cv-builder/summary-form.tsx`
- `src/components/cv-builder/experiences-form.tsx`
- `src/components/cv-builder/educations-form.tsx`
- `src/components/cv-builder/skills-form.tsx`
- `src/components/cv-builder/certifications-form.tsx`
- `src/components/cv-builder/projects-form.tsx`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-8-auto-save.md`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\sprint-status.yaml`
