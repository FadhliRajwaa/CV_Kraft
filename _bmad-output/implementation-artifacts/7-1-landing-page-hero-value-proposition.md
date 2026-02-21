# Story 7.1: Landing Page — Hero & Value Proposition

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to understand what CVKraft does within seconds,
So that I can decide if it's right for me.

## Acceptance Criteria

1. **Given** I visit the CVKraft homepage
   **When** the page loads
   **Then** I see a hero section with headline "Buat CV ATS-Friendly dalam 15 Menit — Gratis!"
2. **Given** I visit the CVKraft homepage
   **When** the page loads
   **Then** I see a prominent CTA button "Mulai Buat CV →"
3. **Given** I visit the CVKraft homepage
   **When** the page loads
   **Then** I see key benefits: 100% Gratis, ATS Score, Download PDF
4. **Given** I visit the CVKraft homepage
   **When** the page loads
   **Then** I see a CV mockup/preview visual
5. **Given** the CVKraft homepage is built
   **When** it is served
   **Then** the page is rendered via SSG for SEO
   **And** the page loads within 3 seconds on 3G connection

## Tasks / Subtasks

- [x] Task 1: Create Hero Section Component (AC: 1, 2)
  - [x] Add headline and subheadline explaining the value proposition.
  - [x] Add CTA button "Mulai Buat CV →" linking to `/login` or `/register` (or directly creating CV if anonymous, but we require auth first per Epic 1).
- [x] Task 2: Add Benefits Summary (AC: 3)
  - [x] Create a row or list of benefits with icons (100% Gratis, ATS Score, Download PDF).
- [x] Task 3: Add Visual Mockup (AC: 4)
  - [x] Implement a placeholder image or a simple CSS representation of a CV to show the end result.
- [x] Task 4: Ensure SSG and Performance (AC: 5)
  - [x] Ensure `src/app/page.tsx` is a Server Component.
  - [x] Optimize images and layout to pass web vitals.

## Dev Notes

- **Architecture:** Next.js App Router Server Component. This is the root `page.tsx`.
- **UI:** Tailwind CSS, shadcn/ui.
- Keep the component structure clean and SEO-friendly with proper HTML tags (h1 for the main headline).

### Project Structure Notes

- Modify `src/app/page.tsx`. Currently it might be a default Next.js page or a placeholder.
- We might need to extract components to `src/components/landing/` for better organization.

### References

- [Epic 7: Landing Page & Onboarding]({planning_artifacts}/epics.md)

## Dev Agent Record

### Agent Model Used

gemini-3.1-pro-high(xhigh)

### Debug Log References

### Completion Notes List
- Created `HeroSection` component in `src/components/landing/hero-section.tsx`.
- Implemented headline, CTA linking to `/login`, and benefits section with icons (`lucide-react`).
- Created a CSS-based CV mockup visual representation using Tailwind CSS utility classes.
- Updated `src/app/page.tsx` to include the `HeroSection` component.
- The `page.tsx` is a Next.js App Router Server Component by default, ensuring SSG and SEO performance.

### File List
- `src/app/page.tsx`
- `src/components/landing/hero-section.tsx`
