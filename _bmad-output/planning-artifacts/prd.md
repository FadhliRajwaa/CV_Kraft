---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete]
inputDocuments: [product-brief-CV_MAKER-2026-02-20.md]
workflowType: prd
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - CVKraft

**Author:** Fadhli Rajwaa Rahmana
**Date:** 2026-02-20

## Executive Summary

**CVKraft** adalah platform web gratis untuk membuat CV ATS-friendly. Platform ini menyelesaikan masalah utama pencari kerja yang kehilangan kesempatan interview karena CV mereka tidak lolos sistem ATS (Applicant Tracking System) — software filtering otomatis yang digunakan perusahaan. User mengisi form guided step-by-step, melihat live preview, mendapat ATS Score, dan download PDF gratis.

**Target Users:** Fresh graduate, profesional berpengalaman (career switcher), freelancer, siswa SMK/SMA — lintas bidang apapun.

**Tech Stack:** Next.js + Tailwind CSS + shadcn/ui + Prisma + PostgreSQL

**Business Model:** Gratis sepenuhnya untuk MVP. Monetisasi (subscription) dipertimbangkan setelah product-market fit tercapai.

### What Makes This Special

1. **100% Gratis** — export PDF tanpa biaya, berbeda dari kompetitor (Zety, Resume.io) yang freemium
2. **ATS-First Approach** — setiap template dirancang khusus untuk lolos ATS, bukan sekadar visual
3. **ATS Score + Job Description Keyword Match** — feedback actionable yang tidak dimiliki Canva
4. **Edukasi ATS built-in** — user memahami kenapa format ATS penting
5. **Multi-bahasa (ID + EN)** — melayani pasar Indonesia yang underserved
6. **General-purpose** — semua bidang profesi

## Project Classification

- **Project Type:** Web Application (SPA + SSR hybrid via Next.js)
- **Domain:** General / Productivity Tools
- **Complexity:** Low
- **Project Context:** Greenfield (project baru dari nol)

## Success Criteria

### User Success

| Kriteria | Target | Measurement |
|----------|--------|-------------|
| CV Completion Rate | > 70% | Funnel tracking: form start → PDF download |
| Time to Complete | < 15 menit | Timestamp start → finish |
| ATS Score Average | > 80/100 | Auto-calculation pada preview |
| Return User Rate | > 30% dalam 30 hari | Login tracking |
| PDF Download Rate | > 85% dari CV yang selesai | Download event tracking |

### Business Success

| Periode | Objective | Target |
|---------|-----------|--------|
| 3 Bulan | User acquisition | 1.000 users, 500 CV generated |
| 6 Bulan | Growth & retention | 5.000 users, 40% return rate |
| 12 Bulan | Market establishment | 20.000 users, evaluasi monetisasi |

### Technical Success

| Kriteria | Target |
|----------|--------|
| Uptime | 99% |
| Error Rate | < 1% |
| Page Load Time | < 3 detik |
| PDF Generation Time | < 5 detik |
| Lighthouse Score | > 90 (Performance, Accessibility) |

### Measurable Outcomes

- **North Star Metric:** Total CV berhasil di-download (PDF)
- **Leading Indicator:** CV completion rate (mulai form → selesai)
- **Engagement:** MAU growth 30% MoM di 6 bulan pertama
- **Feature Adoption:** > 60% user pakai ATS Score, > 40% pakai Keyword Match

## Product Scope

### MVP - Minimum Viable Product

| # | Fitur | Prioritas |
|---|-------|-----------|
| 1 | User Authentication (Email + Google OAuth) | P0 |
| 2 | Guided Form Input (step-by-step) | P0 |
| 3 | Live Preview (real-time) | P0 |
| 4 | ATS-Friendly Templates (3-5 template) | P0 |
| 5 | PDF Export (gratis, text-based) | P0 |
| 6 | ATS Score (format, section, keyword, content) | P0 |
| 7 | Job Description Keyword Match | P1 |
| 8 | Content Tips (tooltip di setiap field) | P1 |
| 9 | Multi-bahasa CV (ID + EN) | P1 |
| 10 | Dashboard CV (manage, edit, duplicate, hapus) | P1 |
| 11 | Landing Page (value prop + CTA) | P1 |

### Growth Features (Post-MVP)

- Multiple CV versions per job application
- Template marketplace (user-contributed)
- Advanced ATS analytics dengan benchmark industri
- AI-powered content suggestions (integrasi LLM)
- Import CV dari LinkedIn/PDF

### Vision (Future)

- Cover Letter Builder
- Mobile app (React Native)
- Job matching & rekomendasi lowongan
- Interview preparation tools
- B2B offering (universitas/career center)

## User Journeys

### Journey 1: Rina — Fresh Graduate Membuat CV Pertama

**Opening Scene:** Rina (22, baru lulus S1 Manajemen) frustasi. Sudah apply 50+ lowongan di JobStreet dan LinkedIn tapi tidak pernah dipanggil interview. CV-nya dibuat di Canva — desainnya cantik dengan grafik dan ikon, tapi dia tidak tahu bahwa ATS tidak bisa membacanya.

**Rising Action:** Rina menemukan CVKraft lewat pencarian Google "cara bikin CV ATS friendly gratis". Dia register dengan Google account (1 klik). Di dashboard, dia pilih template "Fresh Graduate" dan mulai mengisi form step-by-step. Di bagian Pengalaman Kerja yang kosong, CVKraft menampilkan tips: "Belum punya pengalaman? Masukkan magang, volunteer, atau proyek kuliah." Rina memasukkan magang 6 bulannya dan 2 proyek akhir kuliah.

**Climax:** Saat preview muncul, Rina melihat CV-nya tertata rapi dalam format single-column yang bersih. Dia cek ATS Score: 78/100. Tips menunjukkan bahwa dia perlu menambahkan keyword dari job description. Dia paste job description "Marketing Trainee" — CVKraft menyarankan 5 keyword yang perlu ditambahkan. Setelah revisi, ATS Score naik ke 91/100.

**Resolution:** Rina download PDF gratis. Dalam 2 minggu, dia mendapat 3 panggilan interview — pertama kalinya sejak lulus. Dia kembali ke CVKraft untuk membuat versi CV baru untuk posisi berbeda.

### Journey 2: Andi — Career Switcher Update CV

**Opening Scene:** Andi (30, Marketing Executive 5 tahun) dapat tawaran dari headhunter untuk posisi Senior Marketing Manager. Deadline kirim CV besok. CV lamanya format Word, berantakan, dan terakhir diupdate 3 tahun lalu.

**Rising Action:** Andi register di CVKraft, pilih template "Professional", dan mulai isi form. Data pribadi dan pengalaman kerja cepat terisi. Di bagian achievement, CVKraft memberi tips: "Gunakan angka spesifik — contoh: 'Meningkatkan conversion rate 35% dalam 6 bulan'." Andi menulis ulang achievement-nya dengan data kuantitatif.

**Climax:** Andi paste job description dari headhunter ke fitur Keyword Match. CVKraft analisa dan sarankan 7 keyword industri yang belum ada di CV-nya: "digital marketing strategy", "ROI optimization", "cross-functional leadership". Setelah menambahkan, ATS Score melonjak dari 52 ke 94.

**Resolution:** Andi download PDF, kirim ke headhunter malam itu juga. Dapat panggilan interview dalam 3 hari. Dia simpan CV di dashboard CVKraft untuk update berkala.

### Journey 3: Maya — Siswa SMK Pertama Kali Bikin CV

**Opening Scene:** Maya (17, SMK Akuntansi) diminta guru BK untuk magang di perusahaan lokal. Dia belum pernah bikin CV dan tidak punya budget untuk tools berbayar. Contoh CV dari guru terlihat kuno.

**Rising Action:** Maya menemukan CVKraft dari teman sekelas. Register gratis, pilih template "Minimal". Form guided membantu: di section "Keahlian", CVKraft memberi saran skill yang relevan untuk jurusan Akuntansi. Di section "Pengalaman", tips menampilkan: "Cantumkan kegiatan organisasi, kepanitiaan, atau proyek sekolah."

**Climax:** Maya mengisi OSIS sebagai Bendahara dan proyek akuntansi mini-company. Preview menampilkan CV yang terlihat profesional — jauh lebih baik dari contoh guru. ATS Score: 82/100.

**Resolution:** Maya download PDF, cetak, dan berhasil diterima magang. Dia rekomendasikan CVKraft ke seluruh kelas.

### Journey 4: Admin — System Operations

**Opening Scene:** (Future user — admin internal atau operator platform)

**Core Journey:** Monitor platform health via external analytics (GA/Posthog), track user registration, CV generation metrics, dan error rates. Untuk MVP, admin operations dilakukan melalui database langsung dan external tools — tidak ada admin dashboard built-in.

### Journey Requirements Summary

| Journey | Capabilities Revealed |
|---------|----------------------|
| Rina (Fresh Grad) | Registration, guided form, content tips, template selection, ATS Score, keyword match, PDF download |
| Andi (Career Switcher) | Quick registration, professional templates, achievement tips, keyword match, ATS Score improvement flow |
| Maya (Siswa SMK) | Simple registration, minimal template, skill suggestions per jurusan, organizational experience guidance |
| Admin (Operations) | External analytics integration, database management (MVP: no admin dashboard) |

## Web Application Specific Requirements

### Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |
| Mobile browsers | iOS Safari, Chrome Android |

### Responsive Design

- **Desktop-first** design (primary use case: CV editing di layar besar)
- **Responsive** ke tablet dan mobile untuk landing page dan dashboard
- **CV editor** optimal di screen width >= 1024px (form + live preview side-by-side)
- **Mobile fallback** untuk CV editor: form-only view dengan preview toggle

### Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to Interactive (TTI) | < 3s |
| PDF Generation | < 5s |
| Live Preview Update | < 300ms (debounced) |

### SEO Strategy

- Landing page di-render server-side (SSR/SSG) untuk SEO
- Target keywords: "CV ATS friendly gratis", "buat CV online", "CV maker Indonesia"
- Meta tags, Open Graph, structured data untuk landing page
- Blog/educational content tentang ATS (future)

### Accessibility

- Target: WCAG 2.1 Level AA
- Keyboard navigation untuk semua form
- ARIA labels pada form elements
- Color contrast ratio minimum 4.5:1
- Screen reader compatible form flow

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP — fokus menyelesaikan masalah inti (CV tidak ATS-friendly) dengan fitur minimum yang deliver real value.

**Resource Requirements:** Solo developer (Fadhli) — full-stack Next.js. Estimasi MVP: fokus pada delivery, bukan timeline.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Fresh Graduate membuat CV pertama (Rina)
- Career Switcher update/buat CV baru (Andi)
- Siswa bikin CV sederhana (Maya)

**Must-Have Capabilities:**
- Auth (email + Google OAuth)
- Form builder (7 sections: Data Pribadi, Ringkasan, Pengalaman, Pendidikan, Keahlian, Sertifikasi, Proyek)
- Live preview
- 3-5 ATS-friendly templates
- PDF export (text-based)
- ATS Score
- Keyword Match
- Content Tips
- Dashboard CV
- Landing Page

### Post-MVP Features

**Phase 2 (v1.5-v2.0):**
- Multiple CV versions per job
- Template marketplace
- AI content suggestions
- Import dari LinkedIn/PDF
- Cover Letter Builder
- Admin dashboard

**Phase 3 (v3.0):**
- Mobile app
- Job matching
- Interview prep tools
- B2B offering

### Risk Mitigation Strategy

| Risk | Mitigation |
|------|-----------|
| **PDF rendering inconsistencies** | Gunakan `@react-pdf/renderer` yang proven, test di berbagai OS/browser |
| **ATS Score accuracy** | Riset ATS parsing standards, iterasi berdasarkan user feedback |
| **Performance di mobile** | Desktop-first approach, lazy loading, optimize assets |
| **User acquisition** | SEO-optimized landing page, content marketing tentang ATS |
| **Solo developer bottleneck** | Prioritisasi fitur ketat, gunakan shadcn/ui pre-built components |

## Functional Requirements

### User Management

- FR1: User dapat register akun baru menggunakan email dan password
- FR2: User dapat register dan login menggunakan Google OAuth
- FR3: User dapat login ke akun yang sudah ada
- FR4: User dapat logout dari akun
- FR5: User dapat reset password via email
- FR6: System menyimpan session user yang sudah login

### CV Builder

- FR7: User dapat membuat CV baru dari template yang tersedia
- FR8: User dapat memilih template ATS-friendly sebelum mulai mengisi CV
- FR9: User dapat mengisi data pribadi (nama, email, telepon, alamat, LinkedIn, portfolio)
- FR10: User dapat menulis ringkasan profesional
- FR11: User dapat menambahkan, mengedit, dan menghapus entri pengalaman kerja
- FR12: User dapat menambahkan, mengedit, dan menghapus entri pendidikan
- FR13: User dapat menambahkan, mengedit, dan menghapus keahlian/skills
- FR14: User dapat menambahkan, mengedit, dan menghapus sertifikasi
- FR15: User dapat menambahkan, mengedit, dan menghapus proyek
- FR16: User dapat mengatur urutan section dalam CV
- FR17: User dapat melihat content tips/panduan di setiap field form
- FR18: User dapat memilih bahasa output CV (Indonesia atau English)

### Live Preview

- FR19: System menampilkan preview CV real-time yang terupdate setiap perubahan field
- FR20: User dapat melihat preview dalam template yang dipilih
- FR21: User dapat beralih antar template dan melihat perubahan di preview

### ATS Score & Analysis

- FR22: System menghitung dan menampilkan ATS Score berdasarkan 4 kriteria (format compliance, section completeness, keyword match, content quality)
- FR23: System menampilkan breakdown score per kriteria dengan saran perbaikan
- FR24: User dapat paste job description untuk analisa keyword match
- FR25: System menganalisa job description dan menyarankan keyword yang perlu ditambahkan ke CV
- FR26: System mengupdate ATS Score secara real-time setelah user melakukan perubahan

### PDF Export

- FR27: User dapat generate PDF dari CV yang sudah dibuat
- FR28: System menghasilkan text-based PDF yang ATS-parsable
- FR29: User dapat download PDF tanpa biaya
- FR30: PDF menggunakan font standar yang readable oleh ATS

### CV Dashboard

- FR31: User dapat melihat daftar semua CV yang sudah dibuat
- FR32: User dapat mengedit CV yang sudah ada
- FR33: User dapat menduplikasi CV yang sudah ada
- FR34: User dapat menghapus CV
- FR35: User dapat melihat ATS Score terakhir untuk setiap CV di dashboard

### Landing Page

- FR36: Visitor dapat melihat penjelasan CVKraft dan value proposition
- FR37: Visitor dapat melihat contoh template CV
- FR38: Visitor dapat langsung mulai membuat CV (CTA ke register/login)
- FR39: Visitor dapat membaca edukasi singkat tentang ATS

### Template Management

- FR40: System menyediakan minimal 3 template ATS-friendly (Professional, Modern, Minimal)
- FR41: Setiap template menggunakan font standar ATS-safe
- FR42: Setiap template menggunakan layout single-column yang clean
- FR43: Template mendukung output dalam Bahasa Indonesia dan English

## Non-Functional Requirements

### Performance

- NFR1: Halaman utama (landing page) load dalam < 3 detik pada koneksi 3G
- NFR2: Live preview update dalam < 300ms setelah perubahan field (debounced)
- NFR3: PDF generation selesai dalam < 5 detik
- NFR4: ATS Score calculation selesai dalam < 2 detik
- NFR5: Lighthouse Performance Score > 90

### Security

- NFR6: Password di-hash menggunakan bcrypt/argon2 (tidak plain text)
- NFR7: Session management menggunakan HTTP-only secure cookies
- NFR8: Semua traffic menggunakan HTTPS
- NFR9: Input validation pada semua form fields untuk mencegah XSS/injection
- NFR10: OAuth tokens disimpan secara secure, tidak exposed ke client
- NFR11: Data CV user hanya accessible oleh pemilik akun (row-level security)

### Scalability

- NFR12: Arsitektur mendukung hingga 10.000 concurrent users tanpa degradasi signifikan
- NFR13: Database schema mendukung pertumbuhan hingga 100.000 users
- NFR14: Static assets di-serve via CDN

### Accessibility

- NFR15: Memenuhi WCAG 2.1 Level AA
- NFR16: Semua form elements memiliki label yang sesuai
- NFR17: Keyboard navigation berfungsi di seluruh flow CV builder
- NFR18: Color contrast ratio minimum 4.5:1 untuk teks
- NFR19: Screen reader compatible pada form dan preview

### Reliability

- NFR20: Uptime target 99%
- NFR21: Auto-save draft CV setiap 30 detik untuk mencegah data loss
- NFR22: Graceful error handling dengan pesan yang user-friendly
- NFR23: Database backup harian
