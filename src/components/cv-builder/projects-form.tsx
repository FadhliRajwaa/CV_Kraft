"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";

import { AutoSaveIndicator } from "@/components/cv-builder/auto-save-indicator";
import { Button } from "@/components/ui/button";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useCvEditor } from "@/components/cv-builder/cv-editor-context";
import { createAutoSaveFetcher } from "@/lib/cv/auto-save-helpers";
import { cvProjectsSchema, type CvProjectInput, type CvProjectsInput } from "@/lib/validations/cv";

type ProjectsFormProps = {
  cvId: string;
  initialValues: CvProjectsInput;
};

type ProjectFormItem = Omit<CvProjectInput, "technologies"> & {
  technologiesText: string;
};

type ProjectsFormValues = {
  projects: ProjectFormItem[];
};

const EMPTY_PROJECT: ProjectFormItem = {
  name: "",
  description: "",
  technologiesText: "",
  url: "",
};

const PROJECTS_TIP = "Fokuskan pada proyek yang menunjukkan impact dan teknologi utama yang kamu kuasai.";

export function ProjectsForm({ cvId, initialValues }: ProjectsFormProps) {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const { updateCvData } = useCvEditor();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectsFormValues>({
    mode: "onBlur",
    defaultValues: {
      projects: initialValues.projects.map((item) => ({
        ...item,
        technologiesText: (item.technologies ?? []).join("\n"),
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  const autoSave = useAutoSave<ProjectsFormValues, CvProjectsInput>({
    control,
    reset,
    storageKey: `cv:${cvId}:projects`,
    parseDraft: (draft) => {
      const fromPayload = cvProjectsSchema.safeParse(draft);

      if (fromPayload.success) {
        return {
          projects: fromPayload.data.projects.map((item) => ({
            ...item,
            technologiesText: item.technologies.join("\n"),
          })),
        };
      }

      if (!draft || typeof draft !== "object") {
        return null;
      }

      const candidate = (draft as { projects?: unknown }).projects;

      if (!Array.isArray(candidate)) {
        return null;
      }

      return {
        projects: candidate.map((item): ProjectFormItem => {
          if (!item || typeof item !== "object") {
            return EMPTY_PROJECT;
          }

          return {
            name: typeof item.name === "string" ? item.name : "",
            description: typeof item.description === "string" ? item.description : "",
            url: typeof item.url === "string" ? item.url : "",
            technologiesText: typeof item.technologiesText === "string" ? item.technologiesText : "",
          };
        }),
      };
    },
    toPayload: (values) => {
      const payload: CvProjectsInput = {
        projects: values.projects.map((item) => ({
          name: item.name,
          description: item.description,
          url: item.url,
          technologies: item.technologiesText
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0),
        })),
      };

      const validated = cvProjectsSchema.safeParse(payload);
      return validated.success ? validated.data : null;
    },
    save: createAutoSaveFetcher(`/api/cv/${cvId}/projects`),
    onUnauthorized: () => router.push("/login"),
    onDraftChange: (draft) => updateCvData({ projects: draft.projects.map(d => ({...d, url: d.url || undefined, technologies: d.technologiesText.split("\n").map(l => l.trim()).filter(l => l.length > 0)})) }),
  });

  async function onSubmit(values: ProjectsFormValues): Promise<void> {
    setServerError("");
    setSuccessMessage("");

    const body: CvProjectsInput = {
      projects: values.projects.map((item) => ({
        name: item.name,
        description: item.description,
        url: item.url,
        technologies: item.technologiesText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0),
      })),
    };

    const validated = cvProjectsSchema.safeParse(body);

    if (!validated.success) {
      setServerError("Data proyek tidak valid");
      return;
    }

    const response = await fetch(`/api/cv/${cvId}/projects`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated.data),
    });

    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      if (response.status === 401) {
        router.push("/login");
        return;
      }

      setServerError(payload?.message ?? "Gagal menyimpan proyek");
      return;
    }

    setSuccessMessage(payload?.message ?? "Proyek berhasil disimpan");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Proyek</h2>
        <p className="text-sm text-gray-600">
          <span className="mr-1">💡</span>
          {PROJECTS_TIP}
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-3 rounded-md border border-gray-200 p-4">
            <div className="space-y-1.5">
              <label htmlFor={`project-name-${field.id}`} className="text-sm font-medium">
                Nama Proyek <span className="text-red-600">*</span>
              </label>
              <input
                id={`project-name-${field.id}`}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Contoh: CVKraft"
                {...register(`projects.${index}.name`)}
              />
              {errors.projects?.[index]?.name?.message ? (
                <p className="text-sm text-red-600">{errors.projects[index]?.name?.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor={`project-description-${field.id}`} className="text-sm font-medium">
                Deskripsi <span className="text-red-600">*</span>
              </label>
              <textarea
                id={`project-description-${field.id}`}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Jelaskan tujuan proyek dan hasil utamanya"
                {...register(`projects.${index}.description`)}
              />
              {errors.projects?.[index]?.description?.message ? (
                <p className="text-sm text-red-600">{errors.projects[index]?.description?.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor={`project-url-${field.id}`} className="text-sm font-medium">
                URL (Opsional)
              </label>
              <input
                id={`project-url-${field.id}`}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://github.com/username/project"
                {...register(`projects.${index}.url`)}
              />
              {errors.projects?.[index]?.url?.message ? (
                <p className="text-sm text-red-600">{errors.projects[index]?.url?.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor={`project-tech-${field.id}`} className="text-sm font-medium">
                Teknologi yang Digunakan
              </label>
              <textarea
                id={`project-tech-${field.id}`}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Satu baris satu teknologi"
                {...register(`projects.${index}.technologiesText`)}
              />
              <p className="text-xs text-gray-500">Pisahkan teknologi dengan baris baru.</p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (window.confirm("Hapus proyek ini?")) {
                  remove(index);
                }
              }}
            >
              Hapus Proyek
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => append(EMPTY_PROJECT)}>
          + Tambah Proyek
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Proyek"}
        </Button>
      </div>
      <AutoSaveIndicator status={autoSave.status} lastSavedAt={autoSave.lastSavedAt} />

      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
      {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}
    </form>
  );
}
