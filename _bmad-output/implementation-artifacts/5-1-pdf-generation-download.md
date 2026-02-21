# Story 5.1: PDF Generation & Download

Status: done

## Story

As a user,
I want to download my CV as a PDF file,
So that I can submit it to job applications.

## Acceptance Criteria

1. **Given** I am on the CV editor
   **When** I click the "Download PDF" button
   **Then** a PDF is generated using `@react-pdf/renderer`
   **And** the PDF uses the selected template layout
   **And** the PDF uses ATS-safe fonts (Helvetica/Times)
   **And** the PDF is text-based (selectable, copy-able, ATS-parsable)
   **And** the PDF file downloads with filename: "{nama}-CV.pdf"
   **And** a loading indicator shows during generation (< 5 seconds)
   **And** no payment or signup wall is shown — completely free

## Tasks / Subtasks

- [x] Install and Configure `@react-pdf/renderer`
  - [x] `npm install @react-pdf/renderer`
- [x] Create PDF Template Components
  - [x] Create `ProfessionalPdfTemplate` using `<Document>`, `<Page>`, `<View>`, `<Text>`.
  - [x] Map `CvData` to the PDF layout accurately.
- [x] Implement Download Button UI
  - [x] Add a `PDFDownloadLink` or custom trigger button in the Editor page header.
  - [x] Implement loading states.
- [x] Verification
  - [x] Run `npm run lint` && `npm test`

## Dev Notes
- Since we built the HTML templates using Tailwind, we need to translate the styles to `@react-pdf/renderer` StyleSheet API.
- Keep the logic strictly client-side to avoid serverless function payload limits.
