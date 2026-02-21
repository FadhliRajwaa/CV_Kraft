# Story 3.2: Live Preview Rendering

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to see my CV update in real-time as I type,
So that I know exactly how my final CV will look.

## Acceptance Criteria

1. **Given** I am on the CV editor with the preview panel visible
   **When** I type or modify any form field
   **Then** the preview updates within 300ms (debounced)
   **And** the preview renders using the selected template
   **And** the preview shows all filled sections in the correct order

2. **Given** I switch to a different template
   **When** the template selector changes
   **Then** the preview re-renders with the new template immediately
   **And** all CV data is preserved

## Tasks / Subtasks

- [x] Connect CV Form State to Preview Panel (AC: 1)
  - [x] Implement debounced state updates (300ms) for form fields.
  - [x] Pass the CV data state to the preview rendering component.
- [x] Implement Template Rendering Logic (AC: 1, 2)
  - [x] Use the `templateId` to select the correct template component from the registry.
  - [x] Render the CV data using the selected template component.
- [x] Ensure Section Ordering (AC: 1)
  - [x] Pass section ordering state to the preview panel.
  - [x] Render sections based on the active ordering.
- [x] Verification (AC: 1, 2)
  - [x] Run `npm run lint`
  - [x] Run `npm test`

## Dev Notes

- Use `useWatch` or `watch` from React Hook Form with a custom debounce hook (e.g., `useDebounce`) to avoid excessive re-renders while typing.
- The preview component should dynamically import or switch based on `templateId` stored in the CV data.

### Project Structure Notes

- Alignment with unified project structure:
  - Preview components and their wrappers should be placed in `src/components/cv-builder/` or `src/components/cv-builder/preview/`.
- No detected conflicts.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2: Live Preview Rendering]

## Dev Agent Record

### Agent Model Used

gemini-3.1-pro-high(xhigh)

### Debug Log References

### Completion Notes List

### File List
