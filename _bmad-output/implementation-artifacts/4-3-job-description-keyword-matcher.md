# Story 4.3: Job Description Keyword Matcher

Status: done

## Acceptance Criteria

1. **Given** I am on the CV editor
   **When** I click "Paste Job Description"
   **Then** a dialog/sheet opens with a textarea
2. **Given** I paste a job description and click "Analisa"
   **When** the analysis runs
   **Then** I see keywords already in my CV (marked ✅)
   **And** I see keywords missing from my CV (marked ⚠️) with suggestions
   **And** the Keyword Match score in ATS Score updates accordingly

## Tasks / Subtasks

- [x] Create Job Description Input UI
  - [x] Add a button in the ATS Score Card.
  - [x] Implement a Dialog/Modal using shadcn/ui.
- [x] Keyword Extraction & Matching Logic
  - [x] Simple implementation: extract words, remove stop words.
  - [x] Compare extracted words with CV text content.
- [x] Update ATS Score Context
  - [x] Feed job description into ATS Context so `calculateAtsScore` can update the Keyword Match score.
- [x] Verification
  - [x] Run `npm run lint` && `npm test`
