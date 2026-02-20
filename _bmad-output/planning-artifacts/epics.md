---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments: [prd.md, architecture.md, ux-design-specification.md]
project_name: CVKraft
date: 2026-02-20
totalEpics: 7
totalStories: 28
---

# Epics & Stories — CVKraft

## Overview

**Project:** CVKraft — Platform web gratis untuk membuat CV ATS-friendly
**Tech Stack:** Next.js + Tailwind CSS + shadcn/ui + Prisma + PostgreSQL
**Total Epics:** 7
**Total Stories:** 28

---

## Requirements Inventory

### Functional Requirements (43 FRs)

FR1-FR6: User Management | FR7-FR18: CV Builder | FR19-FR21: Live Preview | FR22-FR26: ATS Score & Analysis | FR27-FR30: PDF Export | FR31-FR35: CV Dashboard | FR36-FR39: Landing Page | FR40-FR43: Template Management

### Non-Functional Requirements

NFR1-5: Performance | NFR6-11: Security | NFR12-14: Scalability | NFR15-19: Accessibility | NFR20-23: Reliability

### Additional Requirements

- Responsive design (desktop-first, mobile fallback)
- SEO for landing page (SSG)
- Auto-save (30s debounce)
- Multi-language CV output (ID + EN)

---

## FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | Register dengan email/password |
| FR2 | Epic 1 | Register/login dengan Google OAuth |
| FR3 | Epic 1 | Login akun existing |
| FR4 | Epic 1 | Logout |
| FR5 | Epic 1 | Reset password via email |
| FR6 | Epic 1 | Session management |
| FR7 | Epic 2 | Buat CV baru dari template |
| FR8 | Epic 3 | Pilih template ATS-friendly |
| FR9 | Epic 2 | Isi data pribadi |
| FR10 | Epic 2 | Tulis ringkasan profesional |
| FR11 | Epic 2 | CRUD pengalaman kerja |
| FR12 | Epic 2 | CRUD pendidikan |
| FR13 | Epic 2 | CRUD keahlian |
| FR14 | Epic 2 | CRUD sertifikasi |
| FR15 | Epic 2 | CRUD proyek |
| FR16 | Epic 2 | Atur urutan section |
| FR17 | Epic 2 | Content tips di setiap field |
| FR18 | Epic 2 | Pilih bahasa output CV |
| FR19 | Epic 3 | Live preview real-time |
| FR20 | Epic 3 | Preview dalam template yang dipilih |
| FR21 | Epic 3 | Switch template di preview |
| FR22 | Epic 4 | Hitung ATS Score (4 kriteria) |
| FR23 | Epic 4 | Breakdown score + saran perbaikan |
| FR24 | Epic 4 | Paste job description |
| FR25 | Epic 4 | Analisa keyword + saran |
| FR26 | Epic 4 | ATS Score update real-time |
| FR27 | Epic 5 | Generate PDF dari CV |
| FR28 | Epic 5 | Text-based PDF ATS-parsable |
| FR29 | Epic 5 | Download PDF gratis |
| FR30 | Epic 5 | PDF font standar ATS-safe |
| FR31 | Epic 6 | Lihat daftar semua CV |
| FR32 | Epic 6 | Edit CV existing |
| FR33 | Epic 6 | Duplikasi CV |
| FR34 | Epic 6 | Hapus CV |
| FR35 | Epic 6 | Lihat ATS Score di dashboard |
| FR36 | Epic 7 | Landing page value proposition |
| FR37 | Epic 7 | Contoh template CV |
| FR38 | Epic 7 | CTA ke register/login |
| FR39 | Epic 7 | Edukasi singkat ATS |
| FR40 | Epic 3 | Min 3 template ATS-friendly |
| FR41 | Epic 3 | Font standar ATS-safe |
| FR42 | Epic 3 | Layout single-column clean |
| FR43 | Epic 3 | Template multi-bahasa |

---

## Epic List

### Epic 1: User Authentication & Account Management
Users dapat register, login, dan mengelola akun mereka dengan aman menggunakan email/password atau Google OAuth.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6

### Epic 2: CV Builder — Guided Form Experience
Users dapat membuat CV baru dan mengisi semua section melalui guided form step-by-step dengan content tips di setiap field.
**FRs covered:** FR7, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18

### Epic 3: Live Preview & Template System
Users dapat melihat preview CV real-time dalam template ATS-friendly yang dipilih, dan beralih antar template.
**FRs covered:** FR8, FR19, FR20, FR21, FR40, FR41, FR42, FR43

### Epic 4: ATS Score & Keyword Analysis
Users dapat melihat ATS Score CV mereka, mendapat saran perbaikan, dan mencocokkan keyword dengan job description.
**FRs covered:** FR22, FR23, FR24, FR25, FR26

### Epic 5: PDF Export
Users dapat generate dan download CV dalam format PDF text-based yang ATS-parsable secara gratis.
**FRs covered:** FR27, FR28, FR29, FR30

### Epic 6: CV Dashboard Management
Users dapat mengelola semua CV yang sudah dibuat — melihat daftar, edit, duplikasi, dan hapus.
**FRs covered:** FR31, FR32, FR33, FR34, FR35

### Epic 7: Landing Page & Onboarding
Visitors dapat mempelajari CVKraft, melihat contoh template, dan langsung mulai membuat CV.
**FRs covered:** FR36, FR37, FR38, FR39

---

## Epic 1: User Authentication & Account Management

**Goal:** Users dapat register, login, dan mengelola akun mereka dengan aman.
**Dependencies:** None (foundation epic)

### Story 1.1: Project Setup & Database Foundation

As a developer,
I want to set up the Next.js project with Prisma and PostgreSQL,
So that there is a working foundation to build features on.

**Acceptance Criteria:**

**Given** a fresh project directory
**When** the project is initialized
**Then** Next.js 14+ App Router is configured with TypeScript
**And** Tailwind CSS and shadcn/ui are installed and configured
**And** Prisma is connected to PostgreSQL database
**And** User model exists in Prisma schema with id, name, email, password, image, timestamps
**And** `npm run dev` starts the application successfully on localhost:3000

### Story 1.2: Email Registration

As a new user,
I want to register with my email and password,
So that I can create an account to save my CVs.

**Acceptance Criteria:**

**Given** I am on the registration page
**When** I fill in name, email, and password (min 8 characters)
**Then** a new account is created with password hashed via bcrypt
**And** I am redirected to the dashboard
**And** a session cookie is set (HTTP-only, secure)

**Given** I try to register with an email that already exists
**When** I submit the form
**Then** I see an error message "Email sudah terdaftar"

**Given** I submit an invalid email or short password
**When** I submit the form
**Then** I see inline validation errors (Zod schema)

### Story 1.3: Email Login

As a returning user,
I want to login with my email and password,
So that I can access my saved CVs.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I enter valid email and password
**Then** I am authenticated and redirected to dashboard
**And** a session cookie is set

**Given** I enter wrong email or password
**When** I submit the form
**Then** I see an error "Email atau password salah"

### Story 1.4: Google OAuth Login

As a user,
I want to register and login using my Google account,
So that I can start quickly without creating a new password.

**Acceptance Criteria:**

**Given** I am on the login or register page
**When** I click "Login dengan Google"
**Then** I am redirected to Google OAuth consent screen
**And** after approval, an account is created (if new) or I am logged in (if existing)
**And** I am redirected to dashboard

### Story 1.5: Logout & Session Management

As a logged-in user,
I want to logout from my account,
So that my session is ended securely.

**Acceptance Criteria:**

**Given** I am logged in
**When** I click "Logout" from the user menu
**Then** my session is destroyed
**And** I am redirected to the landing page

**Given** I access a protected route without a valid session
**When** the page loads
**Then** I am redirected to the login page

### Story 1.6: Password Reset

As a user who forgot my password,
I want to reset my password via email,
So that I can regain access to my account.

**Acceptance Criteria:**

**Given** I am on the "Lupa Password" page
**When** I enter my registered email
**Then** a reset link is sent to my email

**Given** I click the reset link in my email
**When** I enter a new password (min 8 characters)
**Then** my password is updated
**And** I am redirected to login page with success message

---

## Epic 2: CV Builder — Guided Form Experience

**Goal:** Users dapat membuat CV baru dan mengisi semua section melalui guided form step-by-step.
**Dependencies:** Epic 1 (authentication required)

### Story 2.1: Create New CV & Form Layout

As a user,
I want to create a new CV and see a step-by-step form layout,
So that I know exactly what to fill in.

**Acceptance Criteria:**

**Given** I am on the dashboard
**When** I click "+ Buat CV Baru"
**Then** a new CV record is created in the database with default title "CV Tanpa Judul"
**And** I am redirected to the editor page (`/editor/[id]`)
**And** I see a split-screen layout: form panel (left) and preview panel (right)
**And** I see a vertical form stepper with 7 sections: Data Pribadi, Ringkasan, Pengalaman, Pendidikan, Keahlian, Sertifikasi, Proyek
**And** the CV belongs to my user account (userId foreign key)

### Story 2.2: Personal Info Form

As a user,
I want to fill in my personal information,
So that my CV has correct contact details.

**Acceptance Criteria:**

**Given** I am on the CV editor, section "Data Pribadi"
**When** I fill in nama lengkap, email, telepon, alamat (optional), LinkedIn (optional), portfolio (optional)
**Then** the data is stored in the CV JSON data field
**And** each field has a content tip tooltip (💡) with guidance
**And** the form validates email format and required fields on blur

### Story 2.3: Professional Summary Form

As a user,
I want to write a professional summary,
So that recruiters quickly understand my profile.

**Acceptance Criteria:**

**Given** I am on section "Ringkasan"
**When** I type in the textarea
**Then** the summary is saved to CV data
**And** a content tip shows: "Tulis 2-3 kalimat yang merangkum pengalaman, keahlian utama, dan tujuan karir Anda"
**And** a character count is displayed (recommended: 150-300 characters)

### Story 2.4: Work Experience Form (CRUD)

As a user,
I want to add, edit, and remove work experience entries,
So that my CV shows my professional history.

**Acceptance Criteria:**

**Given** I am on section "Pengalaman"
**When** I click "+ Tambah Pengalaman"
**Then** a new entry form appears with fields: Perusahaan, Posisi, Tanggal Mulai, Tanggal Selesai, checkbox "Masih bekerja di sini", Deskripsi, Achievements
**And** I can add multiple achievement bullet points
**And** content tips show: "Gunakan angka spesifik — contoh: 'Meningkatkan conversion rate 35%'"

**Given** I have existing experience entries
**When** I click edit on an entry
**Then** the entry form is populated with existing data for editing

**Given** I have existing experience entries
**When** I click delete on an entry
**Then** a confirmation dialog appears
**And** the entry is removed after confirmation

### Story 2.5: Education Form (CRUD)

As a user,
I want to add, edit, and remove education entries,
So that my CV shows my educational background.

**Acceptance Criteria:**

**Given** I am on section "Pendidikan"
**When** I click "+ Tambah Pendidikan"
**Then** a new entry form appears with: Institusi, Gelar, Bidang Studi, Tanggal Mulai, Tanggal Selesai, IPK (optional)
**And** I can add, edit, and delete entries
**And** content tips show relevant guidance

### Story 2.6: Skills, Certifications & Projects Forms

As a user,
I want to add my skills, certifications, and projects,
So that my CV is comprehensive.

**Acceptance Criteria:**

**Given** I am on section "Keahlian"
**When** I add skills
**Then** I can enter skill name and optional category
**And** I can add, reorder, and remove skills

**Given** I am on section "Sertifikasi"
**When** I add certifications
**Then** I can enter: Nama Sertifikasi, Penerbit, Tanggal, URL (optional)

**Given** I am on section "Proyek"
**When** I add projects
**Then** I can enter: Nama Proyek, Deskripsi, URL (optional), Teknologi yang digunakan

### Story 2.7: Section Ordering & Language Selection

As a user,
I want to reorder CV sections and choose the output language,
So that my CV is structured the way I want in the language I need.

**Acceptance Criteria:**

**Given** I am on the CV editor
**When** I drag sections in the stepper or use up/down controls
**Then** the section order changes in both the form and preview

**Given** I am on the CV editor
**When** I select language "English" or "Bahasa Indonesia" from the language selector
**Then** the CV labels and headers in the preview switch to the selected language

### Story 2.8: Auto-Save

As a user,
I want my CV to be saved automatically,
So that I don't lose my work.

**Acceptance Criteria:**

**Given** I am editing a CV
**When** I stop typing for 30 seconds
**Then** the CV data is saved to localStorage (immediate) and synced to database via API
**And** an indicator shows "Tersimpan ✓" with timestamp

**Given** I close the browser accidentally
**When** I return to the editor
**Then** my latest changes are restored from localStorage or database

---

## Epic 3: Live Preview & Template System

**Goal:** Users dapat melihat CV real-time dalam template ATS-friendly dan beralih antar template.
**Dependencies:** Epic 2 (CV data required)

### Story 3.1: Template System & Selection

As a user,
I want to choose from multiple ATS-friendly templates,
So that my CV has a professional look.

**Acceptance Criteria:**

**Given** I am creating a new CV or on the editor
**When** I open the template selector
**Then** I see at least 3 templates: Professional, Modern, Minimal
**And** each template shows a thumbnail preview
**And** all templates use single-column layout, ATS-safe fonts (Inter/Arial/Helvetica), clean formatting
**And** each template is marked with "ATS-Friendly ✓" badge

### Story 3.2: Live Preview Rendering

As a user,
I want to see my CV update in real-time as I type,
So that I know exactly how my final CV will look.

**Acceptance Criteria:**

**Given** I am on the CV editor with the preview panel visible
**When** I type or modify any form field
**Then** the preview updates within 300ms (debounced)
**And** the preview renders using the selected template
**And** the preview shows all filled sections in the correct order

**Given** I switch to a different template
**When** the template selector changes
**Then** the preview re-renders with the new template immediately
**And** all CV data is preserved

### Story 3.3: Template Multi-Language Support

As a user,
I want my CV template to display in my chosen language,
So that section headers match the target audience.

**Acceptance Criteria:**

**Given** I select "English" as output language
**When** the preview renders
**Then** section headers show "Work Experience", "Education", "Skills", etc.

**Given** I select "Bahasa Indonesia" as output language
**When** the preview renders
**Then** section headers show "Pengalaman Kerja", "Pendidikan", "Keahlian", etc.

---

## Epic 4: ATS Score & Keyword Analysis

**Goal:** Users dapat melihat ATS Score dan mencocokkan keyword dengan job description.
**Dependencies:** Epic 2 & 3 (CV data and preview required)

### Story 4.1: ATS Score Calculation

As a user,
I want to see my CV's ATS Score,
So that I know how ATS-friendly my CV is.

**Acceptance Criteria:**

**Given** I am on the CV editor
**When** the ATS Score card is displayed
**Then** I see a total score (0-100) with color indicator (Red 0-40, Orange 41-60, Yellow 61-80, Green 81-100)
**And** I see breakdown per kriteria:
  - Format Compliance (30%): single column, standard font, no images, heading hierarchy
  - Section Completeness (25%): personal info, summary, experience, education, skills
  - Keyword Match (25%): defaults to 0 if no job description provided
  - Content Quality (20%): bullet points, quantifiable achievements, appropriate length, action verbs
**And** the score updates automatically when I modify CV content

### Story 4.2: ATS Score Improvement Suggestions

As a user,
I want to see specific suggestions to improve my ATS Score,
So that I can make my CV more ATS-friendly.

**Acceptance Criteria:**

**Given** my ATS Score is below 100
**When** I view the score breakdown
**Then** I see actionable suggestions for each low-scoring criteria
**And** suggestions are specific: "Tambahkan section Sertifikasi" not "Improve your CV"
**And** completed criteria show a ✓ checkmark

### Story 4.3: Job Description Keyword Matcher

As a user,
I want to paste a job description and see which keywords I'm missing,
So that I can tailor my CV to specific positions.

**Acceptance Criteria:**

**Given** I am on the CV editor
**When** I click "Paste Job Description"
**Then** a dialog/sheet opens with a textarea

**Given** I paste a job description and click "Analisa"
**When** the analysis runs
**Then** I see keywords already in my CV (marked ✅)
**And** I see keywords missing from my CV (marked ⚠️) with suggestions where to add them
**And** the Keyword Match score in ATS Score updates accordingly

---

## Epic 5: PDF Export

**Goal:** Users dapat download CV sebagai PDF ATS-parsable gratis.
**Dependencies:** Epic 3 (template rendering required)

### Story 5.1: PDF Generation & Download

As a user,
I want to download my CV as a PDF file,
So that I can submit it to job applications.

**Acceptance Criteria:**

**Given** I am on the CV editor
**When** I click the "Download PDF" button
**Then** a PDF is generated using @react-pdf/renderer
**And** the PDF uses the selected template layout
**And** the PDF uses ATS-safe fonts (Helvetica/Times)
**And** the PDF is text-based (selectable, copy-able, ATS-parsable)
**And** the PDF file downloads with filename: "{nama}-CV.pdf"
**And** a loading indicator shows during generation (< 5 seconds)
**And** no payment or signup wall is shown — completely free

### Story 5.2: PDF Quality Assurance

As a user,
I want my PDF to look professional and be properly formatted,
So that it makes a good impression and passes ATS systems.

**Acceptance Criteria:**

**Given** a generated PDF
**When** I open it in a PDF reader
**Then** the layout matches the live preview accurately
**And** text is selectable (not image-based)
**And** fonts render consistently across OS (Windows, Mac, Linux)
**And** the PDF is 1-2 pages for typical CV content
**And** margins, spacing, and alignment are consistent

---

## Epic 6: CV Dashboard Management

**Goal:** Users dapat mengelola semua CV yang sudah dibuat.
**Dependencies:** Epic 1 & 2 (auth + CV creation required)

### Story 6.1: Dashboard — CV List View

As a user,
I want to see all my CVs in a dashboard,
So that I can manage them easily.

**Acceptance Criteria:**

**Given** I am logged in and on the dashboard
**When** the page loads
**Then** I see all my CVs displayed as cards in a grid
**And** each card shows: CV title, template thumbnail, ATS Score badge, last edited date
**And** I see a "+ Buat CV Baru" card/button
**And** if I have no CVs, I see an empty state with CTA to create first CV

### Story 6.2: Dashboard — CV Actions (Edit, Duplicate, Delete)

As a user,
I want to edit, duplicate, and delete my CVs from the dashboard,
So that I can manage my CV collection.

**Acceptance Criteria:**

**Given** I see a CV card on the dashboard
**When** I click on the card
**Then** I am navigated to the editor for that CV

**Given** I click the "⋮" menu on a CV card
**When** I select "Duplikasi"
**Then** a copy of the CV is created with title "[Original Title] (Copy)"
**And** the new CV appears in the dashboard

**Given** I click "Hapus" from the menu
**When** a confirmation dialog appears and I confirm
**Then** the CV is permanently deleted
**And** the card is removed from the dashboard

**Given** I click "Download PDF" from the menu
**When** the PDF generates
**Then** the PDF downloads without navigating to the editor

---

## Epic 7: Landing Page & Onboarding

**Goal:** Visitors dapat mempelajari CVKraft dan langsung mulai membuat CV.
**Dependencies:** Epic 1 (auth pages for CTA)

### Story 7.1: Landing Page — Hero & Value Proposition

As a visitor,
I want to understand what CVKraft does within seconds,
So that I can decide if it's right for me.

**Acceptance Criteria:**

**Given** I visit the CVKraft homepage
**When** the page loads
**Then** I see a hero section with headline "Buat CV ATS-Friendly dalam 15 Menit — Gratis!"
**And** I see a prominent CTA button "Mulai Buat CV →"
**And** I see key benefits: 100% Gratis, ATS Score, Download PDF
**And** I see a CV mockup/preview visual
**And** the page is rendered via SSG for SEO
**And** the page loads within 3 seconds on 3G connection

### Story 7.2: Landing Page — Features, Templates & ATS Education

As a visitor,
I want to see CVKraft's features and learn about ATS,
So that I understand the value before signing up.

**Acceptance Criteria:**

**Given** I scroll down the landing page
**When** I reach the features section
**Then** I see 6 feature cards with icons (Guided Form, Live Preview, ATS Score, Keyword Match, Templates, Multi-bahasa)

**Given** I continue scrolling
**When** I reach the templates section
**Then** I see 3-5 template previews in a horizontal showcase

**Given** I scroll to the ATS education section
**When** it renders
**Then** I see a brief explanation of what ATS is and why it matters
**And** there is a final CTA "Buat CV Gratis Sekarang →"

### Story 7.3: SEO & Meta Tags

As the product owner,
I want the landing page to be SEO-optimized,
So that CVKraft appears in search results for relevant queries.

**Acceptance Criteria:**

**Given** the landing page
**When** search engines crawl it
**Then** it has proper meta title: "CVKraft — Buat CV ATS-Friendly Gratis"
**And** meta description targeting keywords: "CV ATS friendly gratis", "buat CV online", "CV maker Indonesia"
**And** Open Graph tags for social sharing (title, description, image)
**And** structured data (JSON-LD) for the website
**And** proper heading hierarchy (single H1, structured H2-H3)
**And** alt text on all images

---

## Validation Summary

### Coverage Verification

| Epic | FRs Covered | Stories | Status |
|------|------------|---------|--------|
| Epic 1: Auth | FR1-FR6 | 6 stories | ✓ Complete |
| Epic 2: CV Builder | FR7, FR9-FR18 | 8 stories | ✓ Complete |
| Epic 3: Preview & Templates | FR8, FR19-FR21, FR40-FR43 | 3 stories | ✓ Complete |
| Epic 4: ATS Score | FR22-FR26 | 3 stories | ✓ Complete |
| Epic 5: PDF Export | FR27-FR30 | 2 stories | ✓ Complete |
| Epic 6: Dashboard | FR31-FR35 | 2 stories | ✓ Complete |
| Epic 7: Landing Page | FR36-FR39 | 3 stories | ✓ Complete |
| **Total** | **43/43 FRs** | **27 stories** | **✓ All covered** |

### NFR Coverage

| NFR Category | Addressed In |
|-------------|-------------|
| Performance (NFR1-5) | Story 3.2 (preview 300ms), Story 5.1 (PDF <5s), Story 7.1 (page load <3s) |
| Security (NFR6-11) | Story 1.2 (bcrypt), Story 1.5 (session), All stories (Zod validation) |
| Scalability (NFR12-14) | Architecture decisions (Vercel + Supabase + CDN) |
| Accessibility (NFR15-19) | Cross-cutting: all form stories include ARIA labels, keyboard nav |
| Reliability (NFR20-23) | Story 2.8 (auto-save), all stories (error handling) |

### Story Independence Check

| Epic | Forward Dependencies | Status |
|------|---------------------|--------|
| Epic 1 | None | ✓ Standalone |
| Epic 2 | Depends on Epic 1 (auth) | ✓ Valid |
| Epic 3 | Depends on Epic 2 (CV data) | ✓ Valid |
| Epic 4 | Depends on Epic 2 & 3 | ✓ Valid |
| Epic 5 | Depends on Epic 3 (template rendering) | ✓ Valid |
| Epic 6 | Depends on Epic 1 & 2 | ✓ Valid |
| Epic 7 | Depends on Epic 1 (auth CTA) | ✓ Valid |

All epics are standalone — each delivers complete functionality for its domain without requiring future epics.
