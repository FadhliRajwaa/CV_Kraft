# Story 7.3: SEO & Meta Tags

Status: completed

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the product owner,
I want the landing page to be SEO-optimized,
So that CVKraft appears in search results for relevant queries.

## Acceptance Criteria

1. **Given** the landing page
   **When** search engines crawl it
   **Then** it has proper meta title: "CVKraft — Buat CV ATS-Friendly Gratis"
2. **Given** the landing page
   **When** search engines crawl it
   **Then** meta description targets keywords: "CV ATS friendly gratis", "buat CV online", "CV maker Indonesia"
3. **Given** the landing page
   **When** search engines crawl it
   **Then** it has Open Graph tags for social sharing (title, description, image)
4. **Given** the landing page
   **When** search engines crawl it
   **Then** it has proper heading hierarchy (single H1, structured H2-H3)
5. **Given** the landing page
   **When** search engines crawl it
   **Then** there is alt text on all images

## Tasks / Subtasks

- [x] Task 1: Update `layout.tsx` Metadata (AC: 1, 2, 3)
  - [x] Add `title` and `description`.
  - [x] Add `openGraph` and `twitter` metadata.
- [x] Task 2: Validate HTML Hierarchy & Alt Tags (AC: 4, 5)
  - [x] Review `page.tsx` and all components in `src/components/landing/` to ensure only one `<h1>` exists.
  - [x] Ensure all `<img />` or `lucide-react` icons (if acting as images) have proper semantic structure or `alt`/`aria-label`.

## Dev Notes

- **Architecture:** Next.js Metadata API in `src/app/layout.tsx`.
- Keep descriptions under 160 characters for optimal SEO.

### Project Structure Notes

- Edit `src/app/layout.tsx`.

### References

- [Epic 7: Landing Page & Onboarding]({planning_artifacts}/epics.md)

## Dev Agent Record

### Agent Model Used

gemini-3.1-pro-high(xhigh)

### Debug Log References

### Completion Notes List

### File List
