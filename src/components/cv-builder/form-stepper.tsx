"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CV_SECTION_KEYS, CV_SECTION_LABELS } from "@/lib/validations/cv";

type SectionKey = (typeof CV_SECTION_KEYS)[number];

type FormStepperProps = {
  activeSection: string;
  cvId: string;
  language: "id" | "en";
  orderedSections: SectionKey[];
};

export function FormStepper({ activeSection, cvId, language, orderedSections }: FormStepperProps) {
  const router = useRouter();

  async function moveSection(index: number, direction: "up" | "down"): Promise<void> {
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= orderedSections.length) {
      return;
    }

    const nextOrder = [...orderedSections];
    [nextOrder[index], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[index]];

    const response = await fetch(`/api/cv/${cvId}/section-order`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionOrder: nextOrder }),
    });

    if (response.status === 401) {
      router.push("/login");
      return;
    }

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <nav aria-label="Form CV stepper" className="space-y-2">
      {orderedSections.map((sectionKey, index) => {
        const isActive = sectionKey === activeSection;

        return (
          <div key={sectionKey} className="space-y-2 rounded-md border border-gray-200 p-2">
            <Link
              href={`/editor/${cvId}?section=${sectionKey}`}
              className={`block rounded-md border px-3 py-2 text-sm ${
                isActive ? "border-black bg-black text-white" : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              {index + 1}. {CV_SECTION_LABELS[sectionKey][language]}
            </Link>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={index === 0}
                onClick={() => void moveSection(index, "up")}
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={index === orderedSections.length - 1}
                onClick={() => void moveSection(index, "down")}
              >
                ↓
              </Button>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
