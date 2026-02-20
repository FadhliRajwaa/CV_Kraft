export type TemplateMetadata = {
  id: string;
  name: string;
  description: string;
  isAtsFriendly: boolean;
  thumbnailUrl?: string;
};

export const TEMPLATES = [
  {
    id: "professional",
    name: "Professional",
    description: "Layout formal dengan struktur kronologis yang jelas untuk kebutuhan corporate.",
    isAtsFriendly: true,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Tampilan modern dengan penekanan visual ringan tanpa mengorbankan keterbacaan ATS.",
    isAtsFriendly: true,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Desain ringkas dan bersih yang fokus pada konten inti CV.",
    isAtsFriendly: true,
  },
] as const satisfies TemplateMetadata[];

export type TemplateId = (typeof TEMPLATES)[number]["id"];

const TEMPLATE_ID_SET = new Set<string>(TEMPLATES.map((template) => template.id));

export const DEFAULT_TEMPLATE_ID: TemplateId = "professional";

export function isTemplateId(value: string): value is TemplateId {
  return TEMPLATE_ID_SET.has(value);
}
