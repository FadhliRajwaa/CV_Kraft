import type { TemplateProps } from "./types";
import { ProfessionalTemplate } from "./professional";

// Placeholder for ModernTemplate (uses Professional for now, just a different visual styling later)
export function ModernTemplate(props: TemplateProps) {
  // Can be uniquely styled, but to save scope, we wrap Professional or do basic changes
  return (
    <div className="font-sans">
      <ProfessionalTemplate {...props} />
    </div>
  );
}

// Placeholder for MinimalTemplate
export function MinimalTemplate(props: TemplateProps) {
  return (
    <div className="font-mono">
      <ProfessionalTemplate {...props} />
    </div>
  );
}
