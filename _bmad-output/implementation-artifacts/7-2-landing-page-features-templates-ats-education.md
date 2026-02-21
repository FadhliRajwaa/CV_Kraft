# Story 7.2: Landing Page — Features, Templates & ATS Education

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to see CVKraft's features and learn about ATS,
So that I understand the value before signing up.

## Acceptance Criteria

1. **Given** I scroll down the landing page
   **When** I reach the features section
   **Then** I see 6 feature cards with icons (Guided Form, Live Preview, ATS Score, Keyword Match, Templates, Multi-bahasa)
2. **Given** I continue scrolling
   **When** I reach the templates section
   **Then** I see 3-5 template previews in a horizontal showcase
3. **Given** I scroll to the ATS education section
   **When** it renders
   **Then** I see a brief explanation of what ATS is and why it matters
   **And** there is a final CTA "Buat CV Gratis Sekarang →"

## Tasks / Subtasks

- [x] Task 1: Add Features Section (AC: 1)
  - [x] Implement a grid of 6 feature cards with icons, title, and short description.
- [x] Task 2: Add Templates Showcase Section (AC: 2)
  - [x] Implement a section showing simple placeholder previews/CSS of the available templates (Professional, Modern, Minimal).
- [x] Task 3: Add ATS Education Section (AC: 3)
  - [x] Add a short text block explaining ATS (Applicant Tracking System).
  - [x] Add a final CTA linking to `/login`.

## Dev Notes

- **Architecture:** Add new sections to `src/app/page.tsx` or as separate components inside `src/components/landing/`.
- **UI:** Tailwind CSS, shadcn/ui.
- Use `lucide-react` for icons.

### Project Structure Notes

- Update `src/app/page.tsx` to include `FeaturesSection`, `TemplatesSection`, and `AtsEducationSection`.

### References

- [Epic 7: Landing Page & Onboarding]({planning_artifacts}/epics.md)

## Dev Agent Record

### Agent Model Used

gemini-3.1-pro-high(xhigh)

### Debug Log References

### Completion Notes List

### File List
