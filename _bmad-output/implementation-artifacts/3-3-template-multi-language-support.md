# Story 3.3: Template Multi-Language Support

Status: done

## Story

As a user,
I want my CV template to display in my chosen language,
So that section headers match the target audience.

## Acceptance Criteria

1. **Given** I select "English" as output language
   **When** the preview renders
   **Then** section headers show "Work Experience", "Education", "Skills", etc.

2. **Given** I select "Bahasa Indonesia" as output language
   **When** the preview renders
   **Then** section headers show "Pengalaman Kerja", "Pendidikan", "Keahlian", etc.

## Tasks / Subtasks

- [x] Integrate `CV_SECTION_LABELS` to template renderer (AC: 1, 2)
  - [x] Fetch label definition from `src/lib/validations/cv.ts`.
  - [x] Modify rendering logic in `ProfessionalTemplate` (and derived templates) to use translated section headers.
- [x] Provide multi-language fallback for specific text labels (AC: 1, 2)
  - [x] Add inline logic for "IPK / GPA", "dalam / in", "Teknologi / Technologies".
- [x] Verify state propagation (AC: 1, 2)
  - [x] Ensure language selection immediately triggers re-render with correct headers.
- [x] Verification (AC: 1, 2)
  - [x] Run `npm run lint`
  - [x] Run `npm test`

## Dev Notes

- Language support is deeply embedded in `CvEditorContext` via `LanguageSelector`.
- Template headers map safely through the statically-defined `CV_SECTION_LABELS` constant.

## Dev Agent Record

### Agent Model Used

gemini-3.1-pro-high(xhigh)

### Completion Notes List

- Story ini secara implisit sudah terpenuhi saat mengimplementasikan `LivePreview` di Story 3.2, karena rendering sudah menggunakan `CV_SECTION_LABELS[key][language]`.
- Testing sudah berjalan melalui `npm run test` bersama 122 test suite lainnya tanpa masalah.
