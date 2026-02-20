# Story 2.1: Create New CV & Form Layout

Status: review

## Story

As a user,
I want to create a new CV and see a step-by-step form layout,
So that I know exactly what to fill in.

## Acceptance Criteria

1. **Given** I am on the dashboard
   **When** I click "+ Buat CV Baru"
   **Then** a new CV record is created in the database with default title "CV Tanpa Judul"
   **And** I am redirected to the editor page (`/editor/[id]`)
   **And** I see a split-screen layout: form panel (left) and preview panel (right)
   **And** I see a vertical form stepper with 7 sections: Data Pribadi, Ringkasan, Pengalaman, Pendidikan, Keahlian, Sertifikasi, Proyek
   **And** the CV belongs to my user account (userId foreign key).

## Tasks / Subtasks

- [x]Add CV persistence model support (AC: 1)
  - [x]Extend Prisma schema with `CV` model (`userId`, `title`, `templateId`, `language`, `data`, timestamps)
  - [x]Add relation `User (1) -> (N) CV`
  - [x]Add migration for CV table + index on `userId`

- [x]Implement create-new-CV API flow (AC: 1)
  - [x]Create endpoint `src/app/api/cv/route.ts` (POST)
  - [x]Enforce authenticated-only access
  - [x]Create new CV with default title `CV Tanpa Judul`
  - [x]Initialize default `data` JSON sesuai baseline schema
  - [x]Return created CV id for redirect (`/editor/[id]`)

- [x]Add dashboard entry point to create CV (AC: 1)
  - [x]Update dashboard UI dengan tombol `+ Buat CV Baru`
  - [x]Trigger create API call on click
  - [x]Redirect ke `/editor/[id]` saat create berhasil

- [x]Build editor page base layout (AC: 1)
  - [x]Create route `src/app/(app)/editor/[id]/page.tsx`
  - [x]Render split layout: form panel kiri + preview panel kanan
  - [x]Add responsive fallback behavior untuk layar kecil

- [x]Add vertical form stepper scaffold (AC: 1)
  - [x]Create stepper component dengan 7 sections:
    - Data Pribadi
    - Ringkasan
    - Pengalaman
    - Pendidikan
    - Keahlian
    - Sertifikasi
    - Proyek
  - [x]Highlight active step state (stub) tanpa implementasi form detail section (di Story 2.2+)

- [x]Add minimum test coverage for story behavior (AC: 1)
  - [x]Test API create CV: authenticated success
  - [x]Test API create CV: unauthenticated rejected
  - [x]Test redirect flow dari dashboard ke `/editor/[id]`
  - [x]Test editor page renders split layout + stepper labels

## Dev Notes

### Technical Requirements
- Scope hanya untuk create CV baru + layout scaffold editor.
- Form detail per section diimplementasikan pada Story 2.2–2.8, bukan di story ini.
- Gunakan baseline auth/session yang sudah stabil dari Epic 1.

### Architecture Compliance
- Data CV disimpan pada model `CV` dengan field `data` bertipe JSON.
- Setiap CV wajib terikat ke user login (`userId` foreign key).
- Route editor berada di protected area (`src/app/(app)/editor/[id]/page.tsx`).

### Library / Framework Requirements
- Next.js App Router + Route Handlers
- Prisma 7 + PostgreSQL
- Zod untuk validation API boundary
- Tailwind v4 + shadcn/ui untuk layout/stepper UI

### File Structure Requirements
Primary files expected for this story:
- `prisma/schema.prisma`
- `src/app/api/cv/route.ts`
- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/editor/[id]/page.tsx`
- Optional: `src/components/cv-builder/form-stepper.tsx`
- Optional: `src/lib/validations/cv.ts` / `src/lib/validations/cv-schema.ts`

### Testing Requirements
- Validate all ACs with executable tests.
- Minimum checks:
  - create CV endpoint membuat record default dan mengembalikan id
  - CV record memiliki `userId` pemilik session
  - dashboard create action redirect ke `/editor/[id]`
  - editor page menampilkan split layout + 7 step labels
- Regression check: existing `npm test`, `npm run lint`, `npm run build` tetap passing.

### Security & Quality Guardrails
- Jangan izinkan create CV tanpa session valid.
- Jangan expose data CV user lain (enforce ownership sejak create flow).
- Validasi request payload di API boundary meski minimal.

### Previous Story Intelligence
- Epic 1 sudah menyediakan auth guard di dashboard dan session parser.
- Cookie session menggunakan `auth_session` + `SESSION_SECRET` dan sudah dipakai konsisten.
- Pattern route handler + test vitest untuk auth flow sudah established dan bisa direuse.

### Scope Boundaries
In scope:
- Create CV record, redirect ke editor, split layout scaffold, vertical stepper scaffold.

Out of scope:
- CRUD detail section form (Story 2.2+)
- ATS score per section
- Auto-save behavior (Story 2.8)
- Template switching logic lengkap

### References
- `E:\CV_MAKER\_bmad-output\planning-artifacts\epics.md` — Epic 2, Story 2.1 ACs.
- `E:\CV_MAKER\_bmad-output\planning-artifacts\architecture.md` — CV model, editor route, split-layout guidance.
- `E:\CV_MAKER\_bmad-output\planning-artifacts\prd.md` — FR7+ dan CV builder requirements.
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\1-6-password-reset.md` — status terakhir auth foundation.

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- `npm test -- "src/app/(app)/editor/[id]/page.test.ts" "src/app/api/cv/route.test.ts"` (pass: 7/7 tests)
- `npm run lint` (pass)
- `npm run build` (pass)

### Completion Notes List

- Menambahkan model `CV` di Prisma beserta relasi ke `User`, field JSON `data`, dan migration tabel CV + index `userId`.
- Mengimplementasikan endpoint `POST /api/cv` untuk user terautentikasi, membuat CV default (`CV Tanpa Judul`) dengan baseline data JSON, dan mengembalikan `redirectTo` ke `/editor/[id]`.
- Mengupdate dashboard dengan server action create CV melalui tombol `+ Buat CV Baru` yang redirect ke editor setelah berhasil.
- Menambahkan halaman editor base scaffold split layout (form panel kiri + preview kanan) serta komponen stepper vertikal 7 section.
- Menambahkan guard ownership di editor (`findUnique`, `notFound` saat CV tidak ada, redirect `/dashboard` saat CV bukan milik user) untuk mencegah IDOR.
- Menyesuaikan test API dan editor agar mencakup authenticated/unauthenticated flow, notFound, dan ownership mismatch.
- Verifikasi regresi lulus: test target story, lint, dan build.

### File List

- `prisma/schema.prisma`
- `prisma/migrations/20260220125901_add_cv_model/migration.sql`
- `src/lib/cv/default-data.ts`
- `src/app/api/cv/route.ts`
- `src/app/api/cv/route.test.ts`
- `src/components/cv-builder/form-stepper.tsx`
- `src/app/(app)/editor/[id]/page.tsx`
- `src/app/(app)/editor/[id]/page.test.ts`
- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/dashboard/page.test.ts`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\2-1-create-new-cv-form-layout.md`
- `E:\CV_MAKER\_bmad-output\implementation-artifacts\sprint-status.yaml`
