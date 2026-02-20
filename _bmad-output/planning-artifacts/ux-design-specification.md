---
stepsCompleted: [step-01-init, step-02-discovery, step-03-core-experience, step-04-emotional-response, step-05-inspiration, step-06-design-system, step-07-defining-experience, step-08-visual-foundation, step-09-design-directions, step-10-user-journeys, step-11-component-strategy, step-12-ux-patterns, step-13-responsive-accessibility, step-14-complete]
inputDocuments: [product-brief-CV_MAKER-2026-02-20.md, prd.md, architecture.md]
---

# UX Design Specification — CVKraft

**Author:** Fadhli Rajwaa Rahmana
**Date:** 2026-02-20

---

## Design Philosophy

**Core Principle:** "Simplicity breeds confidence" — CVKraft harus membuat user merasa percaya diri bahwa mereka sedang membuat CV yang profesional dan ATS-ready, tanpa perlu pengetahuan teknis tentang ATS.

**Design Personality:**
- **Trustworthy** — desain bersih dan profesional yang merefleksikan kualitas CV yang dihasilkan
- **Guiding** — setiap langkah jelas, tidak ada kebingungan
- **Encouraging** — memberikan feedback positif dan progress visibility
- **Efficient** — minimal klik, maksimal output

## Emotional Response Map

| Touchpoint | Target Emotion | Design Approach |
|-----------|---------------|-----------------|
| Landing Page | "Ini yang saya butuhkan!" | Clear value prop, contoh CV yang rapi |
| Registration | "Gampang banget" | Social login prominent, form minimal |
| Template Selection | "Semuanya bagus" | Visual preview, confidence badges "ATS-Friendly" |
| Form Filling | "Saya bisa melakukan ini" | Step indicator, tips contextual, progress bar |
| Live Preview | "Wow, CV saya keren!" | Real-time update, professional rendering |
| ATS Score | "Saya tahu apa yang harus diperbaiki" | Clear scoring, actionable suggestions |
| PDF Download | "Mission accomplished!" | Celebratory moment, satisfaction |

## Visual Foundation

### Color Palette

```
Primary:
  Blue-600:    #2563EB  (Primary actions, CTA, links)
  Blue-700:    #1D4ED8  (Hover states)
  Blue-50:     #EFF6FF  (Light backgrounds)

Neutral:
  Gray-900:    #111827  (Headings, primary text)
  Gray-600:    #4B5563  (Secondary text)
  Gray-400:    #9CA3AF  (Placeholder, disabled)
  Gray-100:    #F3F4F6  (Background, cards)
  White:       #FFFFFF  (Surface)

Success/Feedback:
  Green-500:   #22C55E  (Success, high ATS score)
  Yellow-500:  #EAB308  (Warning, medium ATS score)
  Red-500:     #EF4444  (Error, low ATS score)
  Orange-500:  #F97316  (Tips, suggestions)

ATS Score Gradient:
  0-40:   Red-500     (Poor)
  41-60:  Orange-500  (Needs Work)
  61-80:  Yellow-500  (Good)
  81-100: Green-500   (Excellent)
```

**Rationale:** Blue conveys trust dan profesionalisme — sesuai dengan domain recruitment. Palette netral memastikan CV preview tetap menjadi focal point.

### Typography

```
Headings:    Inter (sans-serif) — Bold, clean, modern
Body:        Inter (sans-serif) — Regular, excellent readability
Monospace:   JetBrains Mono — Code blocks, technical details

Scale:
  H1: 36px / 2.25rem  (Landing page hero)
  H2: 30px / 1.875rem (Section headings)
  H3: 24px / 1.5rem   (Sub-headings)
  H4: 20px / 1.25rem  (Card titles)
  Body: 16px / 1rem   (Default text)
  Small: 14px / 0.875rem (Captions, hints)
  XS: 12px / 0.75rem  (Labels, badges)
```

### Spacing System

```
Base unit: 4px
Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
Usage:
  - Component padding: 16px (p-4)
  - Section spacing: 32-48px (py-8 to py-12)
  - Card gap: 16-24px (gap-4 to gap-6)
  - Form field gap: 16px (space-y-4)
```

### Border Radius

```
Small:   6px  (buttons, inputs)
Medium:  8px  (cards)
Large:   12px (modals, panels)
Full:    9999px (badges, avatars)
```

### Shadows

```
sm:   0 1px 2px rgba(0,0,0,0.05)   — Cards, inputs
md:   0 4px 6px rgba(0,0,0,0.07)   — Dropdowns, popovers
lg:   0 10px 15px rgba(0,0,0,0.10) — Modals, floating panels
```

## Page Layouts

### 1. Landing Page (`/`)

```
┌──────────────────────────────────────────────────┐
│  Logo   [Fitur]  [Tentang]         [Login] [CTA] │ ← Navbar
├──────────────────────────────────────────────────┤
│                                                   │
│   Buat CV ATS-Friendly                           │
│   dalam 15 Menit — Gratis!                       │
│                                                   │
│   [Mulai Buat CV →]              ┌──────────┐   │
│                                   │  CV       │   │
│   ✓ 100% Gratis                  │  Preview  │   │
│   ✓ ATS Score                    │  Mockup   │   │
│   ✓ Download PDF                 │           │   │
│                                   └──────────┘   │
├──────────────────────────────────────────────────┤
│                                                   │
│   Kenapa CV Kamu Tidak Dipanggil Interview?       │
│   [Edukasi ATS section — 3 cards]                │
│                                                   │
├──────────────────────────────────────────────────┤
│                                                   │
│   Fitur CVKraft                                   │
│   [6 feature cards with icons]                   │
│                                                   │
├──────────────────────────────────────────────────┤
│                                                   │
│   Template ATS-Friendly                           │
│   [3-5 template previews — horizontal scroll]    │
│                                                   │
├──────────────────────────────────────────────────┤
│                                                   │
│   [CTA: Buat CV Gratis Sekarang →]               │
│                                                   │
├──────────────────────────────────────────────────┤
│   Footer: Links, Social, Copyright               │
└──────────────────────────────────────────────────┘
```

### 2. Dashboard (`/dashboard`)

```
┌──────────────────────────────────────────────────┐
│  Logo   Dashboard                    [User Menu] │
├──────────────────────────────────────────────────┤
│                                                   │
│  CV Saya                    [+ Buat CV Baru]     │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ CV #1    │  │ CV #2    │  │ + Buat   │      │
│  │ ████████ │  │ ████████ │  │   Baru   │      │
│  │ ████████ │  │ ████████ │  │          │      │
│  │          │  │          │  │   ┌──┐   │      │
│  │ Score:92 │  │ Score:78 │  │   │+ │   │      │
│  │ [Edit]   │  │ [Edit]   │  │   └──┘   │      │
│  │ [⋮ More] │  │ [⋮ More] │  │          │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│                                                   │
│  Menu More: Duplicate | Download PDF | Delete    │
│                                                   │
└──────────────────────────────────────────────────┘
```

### 3. CV Editor (`/editor/[id]`) — Core Experience

```
┌──────────────────────────────────────────────────┐
│  ← Dashboard    CV Title    [ATS: 85]  [↓ PDF]  │
├───────────────────────┬──────────────────────────┤
│                       │                           │
│  FORM PANEL (50%)     │  PREVIEW PANEL (50%)     │
│                       │                           │
│  ┌─ Steps ──────────┐│  ┌───────────────────┐   │
│  │ ① Data Pribadi ✓ ││  │                   │   │
│  │ ② Ringkasan    ✓ ││  │   CV Preview      │   │
│  │ ③ Pengalaman   ● ││  │   (Real-time)     │   │
│  │ ④ Pendidikan     ││  │                   │   │
│  │ ⑤ Keahlian       ││  │   ┌─────────────┐ │   │
│  │ ⑥ Sertifikasi    ││  │   │ Nama User   │ │   │
│  │ ⑦ Proyek         ││  │   │ email@...   │ │   │
│  └──────────────────┘││  │   ├─────────────┤ │   │
│                       ││  │   │ Ringkasan   │ │   │
│  ┌─ Active Form ────┐││  │   │ ...         │ │   │
│  │                   │││  │   ├─────────────┤ │   │
│  │  Perusahaan:      │││  │   │ Pengalaman  │ │   │
│  │  [____________]   │││  │   │ ...         │ │   │
│  │                   │││  │   └─────────────┘ │   │
│  │  Posisi:    💡    │││  │                   │   │
│  │  [____________]   │││  │                   │   │
│  │                   │││  └───────────────────┘   │
│  │  [+ Tambah Entry] │││                          │
│  └───────────────────┘││                          │
│                       │                           │
│  ┌─ ATS Score ──────┐│                           │
│  │ Score: 85/100 🟢  ││                           │
│  │ ▓▓▓▓▓▓▓▓▓░ 85%   ││                           │
│  │                   ││                           │
│  │ Format:    95% ✓  ││                           │
│  │ Section:   80% ⚠  ││                           │
│  │ Keywords:  75% ⚠  ││                           │
│  │ Content:   90% ✓  ││                           │
│  │                   ││                           │
│  │ [Paste Job Desc]  ││                           │
│  └───────────────────┘│                           │
├───────────────────────┴──────────────────────────┤
│  Auto-saved ✓ 2 menit lalu         Template: [▼] │
└──────────────────────────────────────────────────┘
```

**Key UX Decisions:**
- **Split-screen layout** — form kiri, preview kanan. User melihat hasil langsung
- **Step indicator** — vertical stepper di kiri atas, menunjukkan progress
- **ATS Score card** — collapsible panel di bawah form, always visible
- **💡 Tips icon** — contextual tooltip di setiap field yang memerlukan panduan
- **Auto-save indicator** — bottom bar, subtle confirmation
- **Template switcher** — bottom bar, bisa ganti template kapan saja

## Component Strategy (shadcn/ui)

### Core Components Needed

| Component | Source | Usage |
|-----------|--------|-------|
| Button | shadcn/ui | CTAs, form actions |
| Input | shadcn/ui | All text inputs |
| Textarea | shadcn/ui | Summary, descriptions |
| Select | shadcn/ui | Template picker, language selector |
| Dialog | shadcn/ui | Confirmations, keyword matcher |
| Card | shadcn/ui | Dashboard CV cards, feature cards |
| Tabs | shadcn/ui | Form sections (alternative to stepper) |
| Form | shadcn/ui + react-hook-form | All form handling |
| Badge | shadcn/ui | ATS score, status indicators |
| Progress | shadcn/ui | ATS score bar, form completion |
| Tooltip | shadcn/ui | Content tips, info icons |
| DropdownMenu | shadcn/ui | CV card actions (edit, duplicate, delete) |
| Avatar | shadcn/ui | User menu |
| Separator | shadcn/ui | Section dividers |
| Sheet | shadcn/ui | Mobile sidebar, keyword matcher panel |
| Skeleton | shadcn/ui | Loading states |
| Toast | shadcn/ui (sonner) | Save confirmations, error notifications |

### Custom Components to Build

| Component | Description |
|-----------|-------------|
| `FormStepper` | Vertical step indicator with progress |
| `CVPreview` | Live preview renderer per template |
| `ATSScoreCard` | Score display with breakdown and suggestions |
| `KeywordMatcher` | Job description paste + keyword analysis UI |
| `TemplateCard` | Template selection with preview thumbnail |
| `CVCard` | Dashboard card with thumbnail, score, actions |
| `ContentTip` | Contextual tooltip with writing suggestions |
| `PDFDownloadButton` | Generate + download PDF with loading state |

## UX Patterns

### Form Patterns

**Progressive Disclosure:**
- Step-by-step form — satu section pada satu waktu
- User bisa navigate ke section manapun via stepper (non-linear)
- Section yang sudah diisi ditandai ✓
- Section aktif ditandai ●

**Inline Validation:**
- Validate saat blur (bukan realtime — mengurangi noise)
- Error message di bawah field
- Success state (green border) setelah valid

**Dynamic Entries:**
- Pengalaman, Pendidikan, dll: "Add" button untuk entry baru
- Drag-and-drop reorder (future enhancement, manual reorder untuk MVP)
- Inline delete dengan konfirmasi

### ATS Score UX Pattern

```
┌─ ATS Score ─────────────────────┐
│                                  │
│  ┌──────┐                       │
│  │  85  │  Excellent!           │
│  │ /100 │  CV kamu siap         │
│  └──────┘  untuk dikirim        │
│                                  │
│  Format Compliance    ▓▓▓▓▓░ 95%│
│  Section Complete     ▓▓▓▓░░ 80%│
│  Keyword Match        ▓▓▓░░░ 75%│
│  Content Quality      ▓▓▓▓▓░ 90%│
│                                  │
│  💡 Saran Perbaikan:            │
│  • Tambahkan keyword "project   │
│    management" di ringkasan     │
│  • Section Sertifikasi kosong   │
│                                  │
│  [📋 Paste Job Description]     │
│                                  │
└──────────────────────────────────┘
```

### Keyword Matcher UX Flow

```
User klik [Paste Job Description]
    ↓
Dialog/Sheet muncul:
┌─────────────────────────────────┐
│  Analisa Keyword Match          │
│                                  │
│  Paste job description di sini: │
│  ┌──────────────────────────┐   │
│  │                          │   │
│  │  (textarea)              │   │
│  │                          │   │
│  └──────────────────────────┘   │
│  [Analisa]                      │
│                                  │
│  ── Hasil Analisa ──            │
│                                  │
│  ✅ Sudah ada di CV:            │
│  • marketing • leadership       │
│                                  │
│  ⚠️ Perlu ditambahkan:          │
│  • project management           │
│  • data analytics               │
│  • ROI optimization             │
│                                  │
│  [Tutup]                        │
└─────────────────────────────────┘
```

### Template Selection UX

```
┌─ Pilih Template ──────────────────────────────────┐
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │          │  │          │  │          │       │
│  │ Profes-  │  │ Modern   │  │ Minimal  │       │
│  │ sional   │  │          │  │          │       │
│  │          │  │          │  │          │       │
│  │  ████    │  │  ████    │  │  ████    │       │
│  │  ████    │  │  ████    │  │  ████    │       │
│  │          │  │          │  │          │       │
│  └──────────┘  └──────────┘  └──────────┘       │
│   ✓ Selected    ATS-Safe ✓    ATS-Safe ✓        │
│                                                    │
│  Semua template 100% ATS-Friendly                 │
└────────────────────────────────────────────────────┘
```

## Responsive Strategy

### Breakpoints

```
Mobile:   < 768px    (Single column, form only)
Tablet:   768-1023px (Stacked: form above, preview below)
Desktop:  >= 1024px  (Split screen: form left, preview right)
Wide:     >= 1440px  (Wider preview panel)
```

### CV Editor Responsive Behavior

| Screen | Layout | Notes |
|--------|--------|-------|
| Desktop (>=1024px) | Side-by-side (form + preview) | Primary experience |
| Tablet (768-1023px) | Form above, preview collapsed with toggle | "Preview" floating button |
| Mobile (<768px) | Form only, preview via modal/sheet | "Preview CV" button at bottom |

### Landing Page Responsive

| Screen | Layout |
|--------|--------|
| Desktop | Hero side-by-side (text + mockup), 3-column features |
| Tablet | Hero stacked, 2-column features |
| Mobile | Full-width stacked, single column |

## Accessibility Strategy

### WCAG 2.1 AA Compliance

| Category | Implementation |
|----------|---------------|
| **Keyboard** | All interactive elements focusable, tab order logical, skip links |
| **Screen Reader** | ARIA labels pada semua form fields, live regions untuk ATS Score updates |
| **Color** | Contrast ratio >= 4.5:1, tidak mengandalkan warna saja (icons + text) |
| **Motion** | Respect `prefers-reduced-motion`, no auto-playing animations |
| **Forms** | Associated labels, error messages linked via `aria-describedby` |
| **Focus** | Visible focus indicators (ring-2 ring-blue-600) |

### ATS Score Accessibility

- Score ditampilkan sebagai angka (bukan hanya progress bar)
- Warna score disertai label teks ("Excellent", "Good", "Needs Work", "Poor")
- Suggestions list accessible via screen reader
- Live region (`aria-live="polite"`) untuk score updates

## User Flow Diagrams

### Flow 1: New User — First CV

```
Landing Page → [CTA: Mulai] → Register (Google/Email)
    → Template Selection → CV Editor (Step 1: Data Pribadi)
    → Step 2: Ringkasan → Step 3: Pengalaman → ... → Step 7: Proyek
    → Review ATS Score → [Optional: Paste JD → Keyword Match]
    → Improve based on suggestions → Download PDF → Dashboard
```

### Flow 2: Returning User — Edit CV

```
Login → Dashboard → [Click CV card] → CV Editor
    → Edit sections → ATS Score updates → Download PDF
```

### Flow 3: Returning User — New CV from Existing

```
Login → Dashboard → [⋮ More on CV card] → Duplicate
    → New CV created → Edit → Download PDF
```

## Design System Summary

| Token | Value |
|-------|-------|
| Primary Color | Blue-600 `#2563EB` |
| Font Family | Inter |
| Base Spacing | 4px |
| Border Radius | 6px (buttons) / 8px (cards) |
| Shadow | sm for cards, md for dropdowns |
| Transition | 150ms ease-in-out |
| Max Content Width | 1280px |
| Editor Form Width | 50% of viewport |
| Editor Preview Width | 50% of viewport |
