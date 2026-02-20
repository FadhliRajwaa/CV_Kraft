---
stepsCompleted: [step-01-init, step-02-context, step-03-starter, step-04-decisions, step-05-patterns, step-06-structure, step-07-validation, step-08-complete]
inputDocuments: [product-brief-CV_MAKER-2026-02-20.md, prd.md]
workflowType: architecture
project_name: CVKraft
user_name: Fadhli Rajwaa Rahmana
date: 2026-02-20
---

# Architecture Decision Document — CVKraft

_Dokumen ini berisi keputusan arsitektur untuk CVKraft, platform web gratis pembuat CV ATS-friendly._

## System Context

### Project Overview

CVKraft adalah greenfield web application untuk membuat CV ATS-friendly. Sistem ini memerlukan:
- Form builder dengan guided step-by-step input
- Live preview engine untuk rendering CV real-time
- ATS scoring algorithm
- PDF generation engine
- User authentication & data persistence
- Landing page dengan SEO

### System Boundary

```
┌─────────────────────────────────────────────────┐
│                    CVKraft                        │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Landing   │  │ CV       │  │ Dashboard     │  │
│  │ Page      │  │ Editor   │  │               │  │
│  │ (SSG)     │  │ (CSR)    │  │ (CSR)         │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
│                      │                            │
│  ┌──────────────────────────────────────────┐    │
│  │           Next.js API Routes             │    │
│  │  (Auth, CV CRUD, PDF Gen, ATS Score)     │    │
│  └──────────────────────────────────────────┘    │
│                      │                            │
│  ┌──────────────────────────────────────────┐    │
│  │         PostgreSQL (via Prisma)           │    │
│  └──────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
         │                          │
    ┌────┴────┐              ┌──────┴──────┐
    │ Google  │              │ Vercel /    │
    │ OAuth   │              │ CDN         │
    └─────────┘              └─────────────┘
```

### External Dependencies

| Dependency | Purpose | Risk Level |
|-----------|---------|------------|
| Google OAuth | Social login | Low — stable API |
| PostgreSQL (Supabase/Neon) | Database | Low — managed service |
| Vercel | Hosting & CDN | Low — Next.js native |
| `@react-pdf/renderer` | PDF generation | Medium — browser-side rendering |

## Tech Stack Decision

### Decision: Next.js 14+ (App Router) Full-Stack

**Chosen:** Next.js dengan App Router

**Alternatives Considered:**
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Next.js App Router | SSR/SSG, API routes built-in, React ecosystem, Vercel deploy | Learning curve App Router | **Selected** |
| Vite + Express | Simpler, faster builds | 2 deployments, no SSR native | Rejected |
| Remix | Good SSR, nested routes | Smaller ecosystem, less tooling | Rejected |

**Rationale:** Single framework untuk frontend + backend. SSG untuk landing page (SEO), CSR untuk CV editor (interactivity). API routes menghindari backend terpisah. Vercel deployment seamless.

### Decision: Tailwind CSS + shadcn/ui

**Chosen:** Tailwind CSS v3 + shadcn/ui

**Rationale:**
- shadcn/ui menyediakan komponen form yang lengkap (Input, Select, Textarea, Dialog, Tabs) — esensial untuk CV builder
- Copy-paste component model — full control, no vendor lock-in
- Built on Radix UI primitives — accessible by default
- Tailwind utility-first — rapid styling tanpa CSS bloat

### Decision: Prisma + PostgreSQL

**Chosen:** Prisma ORM + PostgreSQL (hosted via Supabase atau Neon)

**Rationale:**
- Type-safe database queries
- Auto-generated TypeScript types dari schema
- Migration system built-in
- PostgreSQL relational model cocok untuk CV data structure (user → CVs → sections → entries)

### Decision: Authentication — NextAuth.js v5 (Auth.js)

**Chosen:** NextAuth.js v5 (Auth.js)

**Alternatives Considered:**
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| NextAuth.js v5 | Native Next.js, Google OAuth built-in, session management | Config complexity | **Selected** |
| Better Auth | Modern, lightweight | Newer, smaller community | Considered for future |
| Custom JWT | Full control | Security risk, maintenance burden | Rejected |

**Rationale:** NextAuth.js memiliki integrasi native dengan Next.js App Router, built-in Google OAuth provider, dan Prisma adapter untuk session persistence di database.

### Decision: PDF Generation — @react-pdf/renderer

**Chosen:** `@react-pdf/renderer`

**Rationale:**
- React component-based PDF creation — consistent dengan tech stack
- Text-based PDF output — ATS-parsable (bukan image-based)
- Client-side rendering — no server load untuk PDF generation
- Full control atas layout, fonts, dan formatting
- Standard fonts (Helvetica, Times, Courier) yang ATS-safe

**Alternative:** Puppeteer server-side rendering — rejected karena memerlukan headless browser di server, lebih kompleks dan resource-intensive.

## Data Model

### Entity Relationship

```
User (1) ──── (N) CV
                │
                ├── (1) PersonalInfo
                ├── (1) Summary
                ├── (N) Experience
                ├── (N) Education
                ├── (N) Skill
                ├── (N) Certification
                └── (N) Project
```

### Prisma Schema (Core Models)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  accounts      Account[]
  sessions      Session[]
  cvs           CV[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model CV {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title        String   @default("Untitled CV")
  templateId   String   @default("professional")
  language     String   @default("id")
  data         Json     // CV content as structured JSON
  atsScore     Int?
  lastEdited   DateTime @default(now())
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([userId])
}
```

### Decision: CV Data Storage — JSON Column

**Chosen:** Single `data` JSON column di model CV

**Rationale:**
- CV sections bervariasi per user (ada yang punya 5 pengalaman, ada yang 0)
- JSON lebih fleksibel untuk dynamic form data
- Prisma mendukung typed JSON dengan Zod validation
- Avoid over-normalization — CV data selalu diakses sebagai unit lengkap
- Tidak memerlukan complex joins untuk render CV

**CV Data JSON Structure:**

```typescript
interface CVData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    address?: string
    linkedin?: string
    portfolio?: string
  }
  summary: string
  experiences: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate?: string
    current: boolean
    description: string
    achievements: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate?: string
    gpa?: string
  }>
  skills: Array<{
    id: string
    name: string
    category?: string
  }>
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date?: string
    url?: string
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    url?: string
    technologies: string[]
  }>
}
```

## Application Architecture

### Rendering Strategy

| Page | Strategy | Rationale |
|------|----------|-----------|
| Landing Page (`/`) | SSG (Static) | SEO, fast load, content jarang berubah |
| Login/Register (`/auth/*`) | SSR | Security, session handling |
| Dashboard (`/dashboard`) | CSR + Server Component | Dynamic data, protected route |
| CV Editor (`/editor/[id]`) | CSR | Heavy interactivity, real-time preview |
| PDF Preview | Client-side | React-pdf rendering di browser |

### Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Landing page group
│   │   ├── page.tsx              # Landing page (SSG)
│   │   └── layout.tsx
│   ├── (auth)/                   # Auth pages group
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (app)/                    # Protected app group
│   │   ├── dashboard/page.tsx
│   │   ├── editor/[id]/page.tsx
│   │   └── layout.tsx            # Auth check layout
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/
│   │   ├── cv/
│   │   │   ├── route.ts          # CRUD operations
│   │   │   └── [id]/route.ts
│   │   └── ats-score/
│   │       └── route.ts
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── cv-builder/               # CV form components
│   │   ├── personal-info-form.tsx
│   │   ├── experience-form.tsx
│   │   ├── education-form.tsx
│   │   ├── skills-form.tsx
│   │   ├── certification-form.tsx
│   │   ├── project-form.tsx
│   │   └── form-stepper.tsx
│   ├── cv-preview/               # Live preview components
│   │   ├── cv-renderer.tsx
│   │   └── templates/
│   │       ├── professional.tsx
│   │       ├── modern.tsx
│   │       └── minimal.tsx
│   ├── cv-pdf/                   # PDF generation components
│   │   ├── pdf-document.tsx
│   │   └── templates/
│   │       ├── professional-pdf.tsx
│   │       ├── modern-pdf.tsx
│   │       └── minimal-pdf.tsx
│   ├── ats/                      # ATS scoring components
│   │   ├── ats-score-card.tsx
│   │   └── keyword-matcher.tsx
│   ├── dashboard/                # Dashboard components
│   │   ├── cv-card.tsx
│   │   └── cv-list.tsx
│   └── landing/                  # Landing page components
│       ├── hero.tsx
│       ├── features.tsx
│       └── template-showcase.tsx
├── lib/
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # NextAuth config
│   ├── ats-scorer.ts             # ATS scoring algorithm
│   ├── keyword-matcher.ts        # Job description keyword extraction
│   ├── validations/
│   │   └── cv-schema.ts          # Zod schemas for CV data
│   └── utils.ts                  # Utility functions
├── hooks/
│   ├── use-cv-form.ts            # CV form state management
│   ├── use-ats-score.ts          # ATS score calculation hook
│   └── use-auto-save.ts          # Auto-save hook
├── types/
│   └── cv.ts                     # TypeScript types
└── prisma/
    ├── schema.prisma
    └── seed.ts                   # Template seed data
```

### State Management

**Decision: React Hook Form + Zustand**

| Concern | Solution | Rationale |
|---------|----------|-----------|
| Form state | React Hook Form | Built-in validation, performance, uncontrolled inputs |
| Form validation | Zod (via `@hookform/resolvers`) | Type-safe, composable, reusable schemas |
| CV data (cross-component) | Zustand | Lightweight, simple API, persist middleware untuk auto-save |
| Server state | TanStack Query | CV list fetching, caching, optimistic updates |
| Auth state | NextAuth session | Built-in session provider |

### ATS Scoring Algorithm

**Decision: Client-side calculation**

**Scoring Formula:**

```typescript
interface ATSScore {
  total: number           // 0-100
  formatCompliance: number    // 30% weight
  sectionCompleteness: number // 25% weight
  keywordMatch: number        // 25% weight (requires JD)
  contentQuality: number      // 20% weight
}

// Format Compliance (30%)
// - Single column layout: +10
// - Standard font used: +10
// - No images/graphics: +5
// - Proper heading hierarchy: +5

// Section Completeness (25%)
// - Personal Info complete: +5
// - Summary present: +5
// - Experience present: +5
// - Education present: +5
// - Skills present: +5

// Keyword Match (25%) — requires job description
// - Matching keywords found / Total JD keywords * 25

// Content Quality (20%)
// - Bullet points used in experience: +5
// - Quantifiable achievements: +5
// - Appropriate length (1-2 pages): +5
// - Action verbs used: +5
```

### Auto-Save Strategy

**Decision: Debounced client-side save via Zustand persist + API sync**

- Zustand persist middleware → localStorage (instant, offline-safe)
- Debounced API call (setiap 30 detik idle) → database sync
- Optimistic updates — user tidak perlu menunggu server response
- Conflict resolution: last-write-wins (single user per CV)

## Deployment Architecture

### Decision: Vercel + Supabase

| Component | Service | Rationale |
|-----------|---------|-----------|
| Frontend + API | Vercel | Native Next.js hosting, edge functions, CDN |
| Database | Supabase (PostgreSQL) | Free tier generous, managed, Prisma compatible |
| File Storage | Tidak diperlukan untuk MVP | CV data di database, PDF generated client-side |
| Domain | Custom domain via Vercel | HTTPS automatic |
| Analytics | PostHog / Google Analytics | User tracking, funnel analysis |

### Environment Strategy

| Environment | Purpose | Database |
|-------------|---------|----------|
| Development | Local dev | Local PostgreSQL / Supabase dev |
| Preview | PR previews di Vercel | Supabase staging branch |
| Production | Live | Supabase production |

## Security Architecture

### Authentication Flow

```
User → Login Page → NextAuth.js
  ├── Email/Password → bcrypt verify → Session cookie
  └── Google OAuth → OAuth flow → Session cookie
       ↓
  Session stored in DB (Prisma adapter)
       ↓
  Protected routes check session via middleware
```

### Data Protection

| Data | Protection Method |
|------|------------------|
| Passwords | bcrypt hash (cost factor 12) |
| Sessions | HTTP-only, secure, SameSite cookies |
| CV data | Row-level access control (userId check on every query) |
| API routes | NextAuth session validation middleware |
| CSRF | Built-in Next.js CSRF protection |
| Input | Zod validation on all API endpoints |

## Architecture Validation Checklist

| Requirement | Architecture Support |
|-------------|---------------------|
| FR1-6: Auth | NextAuth.js + Prisma adapter |
| FR7-18: CV Builder | React Hook Form + Zustand + JSON data model |
| FR19-21: Live Preview | Client-side React components, template system |
| FR22-26: ATS Score | Client-side algorithm, keyword extraction |
| FR27-30: PDF Export | @react-pdf/renderer, client-side |
| FR31-35: Dashboard | TanStack Query + Server Components |
| FR36-39: Landing Page | SSG, SEO-optimized |
| FR40-43: Templates | Component-based template system |
| NFR1-5: Performance | SSG, CSR, lazy loading, debounced preview |
| NFR6-11: Security | NextAuth, bcrypt, HTTPS, Zod validation |
| NFR12-14: Scalability | Vercel edge, Supabase, CDN |
| NFR15-19: Accessibility | shadcn/ui (Radix), ARIA, keyboard nav |
| NFR20-23: Reliability | Auto-save, error boundaries, DB backup |
