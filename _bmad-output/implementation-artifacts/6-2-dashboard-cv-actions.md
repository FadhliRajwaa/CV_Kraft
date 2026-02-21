# Story 6.2: Dashboard — CV Actions (Edit, Duplicate, Delete)

Status: done

## Story

As a user,
I want to edit, duplicate, and delete my CVs from the dashboard,
So that I can manage my CV collection.

## Acceptance Criteria

1. **Given** I see a CV card on the dashboard
   **When** I click on the card
   **Then** I am navigated to the editor for that CV
2. **Given** I click the "⋮" menu on a CV card
   **When** I select "Duplikasi"
   **Then** a copy of the CV is created with title "[Original Title] (Copy)"
   **And** the new CV appears in the dashboard
3. **Given** I click "Hapus" from the menu
   **When** a confirmation dialog appears and I confirm
   **Then** the CV is permanently deleted
   **And** the card is removed from the dashboard
4. **Given** I click "Download PDF" from the menu
   **When** the PDF generates
   **Then** the PDF downloads without navigating to the editor

## Tasks / Subtasks

- [x] Task 1: Add Dropdown Menu to CV Card (AC: 2, 3, 4)
  - [x] Implement UI for "⋮" menu using shadcn/ui DropdownMenu.
  - [x] Add menu items: Edit, Duplikasi, Download PDF, Hapus.
- [x] Task 2: Implement Edit Action (AC: 1)
  - [x] Wrap the card or add an Edit button that links to `/editor/${cv.id}`.
- [x] Task 3: Implement Duplicate Action (AC: 2)
  - [x] Create API endpoint or Server Action for duplication.
  - [x] Ensure the duplicated CV has "(Copy)" appended to the title and belongs to the same user.
  - [x] Update the dashboard state after duplication.
- [x] Task 4: Implement Delete Action (AC: 3)
  - [x] Create a confirmation dialog (shadcn/ui AlertDialog).
  - [x] Create API endpoint or Server Action to delete the CV from the database.
  - [x] Update the dashboard state after deletion.
- [x] Task 5: Implement PDF Download Action (AC: 4)
  - [x] Reuse the PDF generation logic from `DownloadPdfButton` but adapt it for the dashboard context (might need to fetch CV data if not fully loaded, or pass the available data).

## Dev Notes

- **Architecture:** Next.js App Router, Server Actions for DB mutations, Prisma for ORM.
- **UI:** Tailwind CSS, shadcn/ui (DropdownMenu, AlertDialog).
- **State Management:** `useRouter` for refreshing the page after actions or using React's `useTransition` for optimistic updates.

### Project Structure Notes

- Modifications will be primarily in `src/components/dashboard/cv-card.tsx` and potentially `src/app/(app)/dashboard/page.tsx`.
- New server actions should be placed in a dedicated file (e.g., `src/app/actions/cv.ts`) or within the component if small enough.

### References

- [Epic 6: CV Dashboard Management]({planning_artifacts}/epics.md)

## Dev Agent Record

### Agent Model Used

gemini-3.1-pro-high(xhigh)

### Debug Log References

### Completion Notes List

- Implemented standard Server Actions for CV operations (duplicate, delete, getCvData).
- Reused React PDF generation for the download functionality.
- Successfully implemented Dropdown Menu with shadcn/ui with complete feature parity to Acceptance Criteria.

### File List

- `src/app/actions/cv.ts`
- `src/components/dashboard/cv-card.tsx`
