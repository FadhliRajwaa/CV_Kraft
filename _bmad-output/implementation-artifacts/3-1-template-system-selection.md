# Story 3.1: Template System & Selection

Status: done

## Story

As a user,
I want to choose from different CV templates,
So that I can find the style that best fits my professional brand.

## Acceptance Criteria

1. **Given** I am in the CV Editor
   **When** I click on the template selection UI
   **Then** I can see at least 3 templates: **Professional**, **Modern**, and **Minimal**
   **And** each template has an "ATS-Friendly ✓" badge.

2. **Given** I select a template
   **When** I click it
   **Then** the `templateId` is updated in the database via API
   **And** the live preview (shell) reflects the selection immediately.

3. **Given** I am a user
   **When** viewing the template selector
   **Then** I see localized Indonesian copy (e.g., "Pilih Template", "Profesional").

## Tasks / Subtasks

- [x] Define template registry and metadata (AC: 1)
  - [x] Create `src/lib/templates/registry.ts`
- [x] Implement API endpoint for template updates (AC: 2)
  - [x] Create `src/app/api/cv/[id]/template/route.ts`
- [x] Create Template Selector UI component (AC: 1, 3)
  - [x] Create `src/components/cv-builder/template-selector.tsx`
  - [x] Use `shadcn/ui` Select or specialized grid selector.
- [x] Integrate Selector into Editor Page (AC: 2)
  - [x] Update `src/app/(app)/editor/[id]/page.tsx`
- [x] Verification (AC: 1, 2, 3)
  - [x] Run `npm test`
  - [x] Run `npm run lint`

## Dev Notes

### Technical Requirements
- Template selection is persistent.
- Default template is "professional".
- Use `PATCH` method for the template update API.

### Architecture Compliance
- Registry stores metadata (id, name, description, isAtsFriendly).
- UI uses server-client synchronization via `router.refresh()` or state update.
