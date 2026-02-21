# Story 4.1: ATS Score Calculation

Status: done

## Story

As a user,
I want to see my CV's ATS Score,
So that I know how ATS-friendly my CV is.

## Acceptance Criteria

1. **Given** I am on the CV editor
   **When** the ATS Score card is displayed
   **Then** I see a total score (0-100) with color indicator (Red 0-40, Orange 41-60, Yellow 61-80, Green 81-100)
   **And** I see breakdown per kriteria:
     - Format Compliance (30%)
     - Section Completeness (25%)
     - Keyword Match (25%)
     - Content Quality (20%)
   **And** the score updates automatically when I modify CV content

## Tasks / Subtasks

- [x] Create ATS Score Utility function (AC: 1)
  - [x] Implement calculation logic for Section Completeness.
  - [x] Implement format compliance logic (assume 100% since template enforces this).
  - [x] Calculate Content Quality based on simple heuristics (length, bullets).
  - [x] Keep Keyword Match logic at 0 by default until job description is provided.
- [x] Create UI Component `ATSScoreCard` (AC: 1)
  - [x] Read `cvData` from `CvEditorContext`.
  - [x] Calculate score locally on context update.
  - [x] Render circular progress or simple badge with colors.
- [x] Inject into `EditorPage` (AC: 1)
  - [x] Put the score card in the editor's left or right aside.
- [x] Verification (AC: 1)
  - [x] Run `npm run lint`
  - [x] Run `npm test`

## Dev Notes

- The calculation can be performed client-side dynamically since it only depends on the `cvData` state.
- Keep the logic simple initially.

## Dev Agent Record

### Agent Model Used

gemini-3.1-pro-high(xhigh)

### Completion Notes List

### File List
