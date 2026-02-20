# Story 3.1: Template System & Selection

Status: review

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

- [ ] Define template registry and metadata (AC: 1)
  - [ ] Create `src/lib/templates/registry.ts`
- [ ] Implement API endpoint for template updates (AC: 2)
  - [ ] Create `src/app/api/cv/[id]/template/route.ts`
- [ ] Create Template Selector UI component (AC: 1, 3)
  - [ ] Create `src/components/cv-builder/template-selector.tsx`
  - [ ] Use `shadcn/ui` Select or specialized grid selector.
- [ ] Integrate Selector into Editor Page (AC: 2)
  - [ ] Update `src/app/(app)/editor/[id]/page.tsx`
- [ ] Verification (AC: 1, 2, 3)
  - [ ] Run `npm test`
  - [ ] Run `npm run lint`

## Dev Notes

### Technical Requirements
- Template selection is persistent.
- Default template is "professional".
- Use `PATCH` method for the template update API.

### Architecture Compliance
- Registry stores metadata (id, name, description, isAtsFriendly).
- UI uses server-client synchronization via `router.refresh()` or state update.
