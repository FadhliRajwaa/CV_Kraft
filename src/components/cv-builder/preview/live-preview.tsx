"use client";

import { useCvEditor } from "@/components/cv-builder/cv-editor-context";
import { ProfessionalTemplate } from "./templates/professional";
import { ModernTemplate } from "./templates/modern";
import { MinimalTemplate } from "./templates/modern"; // Using same file for simple re-export placeholders

export function LivePreview() {
  const { cvData, language, templateId } = useCvEditor();

  const renderTemplate = () => {
    switch (templateId) {
      case "modern":
        return <ModernTemplate data={cvData} language={language} />;
      case "minimal":
        return <MinimalTemplate data={cvData} language={language} />;
      case "professional":
      default:
        return <ProfessionalTemplate data={cvData} language={language} />;
    }
  };

  return (
    <div className="flex h-full w-full justify-center overflow-auto rounded-lg border border-gray-200 bg-gray-100 p-4">
      <div className="origin-top scale-[0.5] sm:scale-[0.6] md:scale-[0.7] lg:scale-100">
        <div className="shadow-2xl">{renderTemplate()}</div>
      </div>
    </div>
  );
}
