# Story 6.1: Dashboard — CV List View

Status: done

## Acceptance Criteria

1. **Given** I am logged in and on the dashboard
   **When** the page loads
   **Then** I see all my CVs displayed as cards in a grid
   **And** each card shows: CV title, template thumbnail, ATS Score badge, last edited date
   **And** I see a "+ Buat CV Baru" card/button
   **And** if I have no CVs, I see an empty state with CTA to create first CV

## Tasks / Subtasks

- [x] Fetch User CVs from Database
  - [x] Update `src/app/(app)/dashboard/page.tsx` to fetch CVs for `session.userId`.
- [x] Build CV Card Component
  - [x] Implement UI for CV metadata (Title, Updated Date).
  - [x] Integrate `calculateAtsScore` to display the score badge on the card.
- [x] Build Dashboard Grid Layout
  - [x] Implement responsive grid.
  - [x] Add empty state design.
- [x] Verification
  - [x] Run `npm run lint` && `npm test`
