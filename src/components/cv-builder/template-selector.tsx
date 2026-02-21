"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { TEMPLATES, type TemplateId } from "@/lib/templates/registry";
import { useCvEditor } from "@/components/cv-builder/cv-editor-context";

type TemplateSelectorProps = {
  cvId: string;
  value?: string;
};

export function TemplateSelector({ cvId }: TemplateSelectorProps) {
  const router = useRouter();
  const { templateId: activeTemplateId, setTemplateId } = useCvEditor();
  const [savingTemplateId, setSavingTemplateId] = useState<string | null>(null);

  async function handleTemplateSelect(nextTemplateId: TemplateId): Promise<void> {
    if (nextTemplateId === activeTemplateId || savingTemplateId !== null) {
      return;
    }

    setTemplateId(nextTemplateId);
    setSavingTemplateId(nextTemplateId);

    try {
      const response = await fetch(`/api/cv/${cvId}/template`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: nextTemplateId }),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.ok) {
        router.refresh();
      }
    } finally {
      setSavingTemplateId(null);
    }
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Template CV</h2>

      <div className="space-y-2">
        {TEMPLATES.map((template) => {
          const isActive = activeTemplateId === template.id;
          const isSaving = savingTemplateId === template.id;

          return (
            <button
              key={template.id}
              type="button"
              aria-pressed={isActive}
              disabled={savingTemplateId !== null}
              onClick={() => void handleTemplateSelect(template.id)}
              className={`w-full rounded-md border p-3 text-left transition ${
                isActive ? "border-black bg-black text-white" : "border-gray-200 bg-white text-gray-800"
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{template.name}</span>
                {template.isAtsFriendly ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    ATS-Friendly ✓
                  </span>
                ) : null}
              </div>

              <p className={`text-xs ${isActive ? "text-white/90" : "text-gray-600"}`}>{template.description}</p>

              {isSaving ? <p className="mt-2 text-xs">Menyimpan template...</p> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
