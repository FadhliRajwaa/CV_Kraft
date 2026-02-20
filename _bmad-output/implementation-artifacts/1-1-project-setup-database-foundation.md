# Story 1.1: Project Setup & Database Foundation

Status: done

## Story

As a developer,
I want to set up the Next.js project with Prisma and PostgreSQL,
so that there is a working foundation to build features on.

## Acceptance Criteria

1. **Given** a fresh project directory
   **When** the project is initialized
   **Then** Next.js 14+ App Router is configured with TypeScript.
2. **Given** the base project is created
   **When** UI stack setup is performed
   **Then** Tailwind CSS and shadcn/ui are installed and configured.
3. **Given** database setup is started
   **When** Prisma is configured
   **Then** Prisma is connected to PostgreSQL.
4. **Given** auth foundation schema is prepared
   **When** Prisma schema is defined
   **Then** `User` model exists with fields: `id`, `name`, `email`, `password`, `image`, timestamps.
5. **Given** foundational setup is complete
   **When** developer runs local app
   **Then** `npm run dev` starts successfully at `http://localhost:3000`.

## Tasks / Subtasks

- [x] Initialize Next.js 14+ App Router project with TypeScript (AC: 1)
  - [x] Create app using App Router structure
  - [x] Ensure TypeScript strict mode is enabled for baseline safety
  - [x] Verify app boots with default route

- [x] Install and configure UI foundation (AC: 2)
  - [x] Configure Tailwind CSS in project
  - [x] Initialize shadcn/ui and confirm component generation path
  - [x] Ensure base UI primitives can be imported from `src/components/ui`

- [x] Set up Prisma and PostgreSQL connectivity (AC: 3)
  - [x] Add Prisma dependencies and initialize Prisma
  - [x] Configure `DATABASE_URL` in environment file for PostgreSQL
  - [x] Add reusable Prisma client at `src/lib/prisma.ts`
  - [x] Run initial Prisma migration

- [x] Implement initial `User` model in Prisma schema (AC: 4)
  - [x] Define `User` model in `prisma/schema.prisma`
  - [x] Include required fields and timestamp fields (`createdAt`, `updatedAt`)
  - [x] Generate Prisma client after schema update

- [x] Validate local development startup (AC: 5)
  - [x] Run `npm run dev`
  - [x] Confirm app serves on port 3000 without startup errors
  - [x] Confirm database connection can be established by Prisma tooling

## Dev Notes

### Technical Requirements
- Framework baseline must follow **Next.js 14+ App Router** with unified full-stack approach.
- ORM and DB stack must use **Prisma + PostgreSQL**.
- Foundation should prepare future auth integration with NextAuth/Auth.js and Prisma adapter.
- Keep implementation simple and focused only on bootstrap + schema baseline.

### Architecture Compliance
- Follow architecture decisions in `planning-artifacts/architecture.md`:
  - Next.js App Router as selected framework.
  - Tailwind CSS + shadcn/ui as UI system.
  - Prisma + PostgreSQL for persistence layer.
- `User` model here is foundational subset for Epic 1; do not over-implement unrelated entities.

### Library / Framework Requirements
- Next.js: 14+ (App Router)
- React + TypeScript project setup
- Tailwind CSS v4
- shadcn/ui (Radix-based components)
- Prisma ORM with PostgreSQL driver

### File Structure Requirements
Target structure to establish in this story:
- `src/app/` (App Router root)
- `src/components/ui/` (shadcn/ui components path)
- `src/lib/prisma.ts` (singleton Prisma client)
- `prisma/schema.prisma` (data model and datasource)

### Testing Requirements
- This story focuses on environment/bootstrap validation rather than feature tests.
- Minimum verification:
  - Dev server boot success (`npm run dev`)
  - Prisma migration success
  - Prisma client generation success
- Deeper functional tests start from subsequent auth stories.

### Security & Quality Guardrails
- Do not hardcode secrets; use environment variables for DB connection.
- Keep password field in schema as hashed-storage intent (actual hashing implementation in Story 1.2).
- Avoid adding non-requested services (email provider, OAuth provider setup) in this story.

### Scope Boundaries
In scope:
- Project bootstrap, UI stack setup, Prisma + PostgreSQL connection, `User` model baseline, local run validation.

Out of scope:
- Registration/login UI and API logic
- Session management
- OAuth providers
- Password reset flow

### Project Structure Notes
- Story aligns with architecture’s unified Next.js full-stack structure and prepares directories used in next stories.
- No conflict detected with existing sprint planning artifacts.

### References
- `E:\CV_MAKER\_bmad-output\planning-artifacts\epics.md` — Epic 1, Story 1.1 acceptance criteria.
- `E:\CV_MAKER\_bmad-output\planning-artifacts\architecture.md` — Tech Stack Decision (Next.js, Tailwind+shadcn/ui, Prisma+PostgreSQL), Project Structure, Security Architecture.
- `E:\CV_MAKER\_bmad-output\planning-artifacts\prd.md` — FR1–FR6 (User Management scope foundation).
- `E:\CV_MAKER\_bmad-output\planning-artifacts\ux-design-specification.md` — Component strategy baseline (shadcn/ui usage consistency).

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex(auto)

### Debug Log References

- N/A (story creation stage)

### Completion Notes List

- Next.js foundation berhasil di-bootstrap langsung di root project (tanpa direktori tambahan) dengan App Router + TypeScript + Tailwind v4.
- shadcn/ui berhasil diinisialisasi dan komponen `button` berhasil dibuat di `src/components/ui/button.tsx`.
- Prisma 7 berhasil dikonfigurasi (`prisma.config.ts` + `prisma/schema.prisma`) dan `Prisma Client` berhasil di-generate ke `src/generated/prisma`.
- `npm run dev` berhasil start pada `http://localhost:3000`.
- `npm run lint` dan `npm run build` berhasil.
- Initial migration berhasil dijalankan (`npx prisma migrate dev --name init`) dan database `cvkraft_dev` berhasil dibuat/sinkron.
- Koneksi PostgreSQL tervalidasi setelah update `DATABASE_URL` lokal dengan kredensial yang benar.

### File List

- `.env`
- `.env.example`
- `.gitignore`
- `components.json`
- `eslint.config.mjs`
- `next-env.d.ts`
- `next.config.ts`
- `package.json`
- `package-lock.json`
- `postcss.config.mjs`
- `prisma.config.ts`
- `prisma/schema.prisma`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/ui/button.tsx`
- `src/generated/prisma/**`
- `src/lib/prisma.ts`
- `src/lib/utils.ts`
- `tsconfig.json`
- `_bmad-output/implementation-artifacts/1-1-project-setup-database-foundation.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`