"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";

import { AutoSaveIndicator } from "@/components/cv-builder/auto-save-indicator";
import { Button } from "@/components/ui/button";
import { useAutoSave } from "@/hooks/use-auto-save";
import { createAutoSaveFetcher, createSchemaValidator } from "@/lib/cv/auto-save-helpers";
import { cvSkillsSchema, type CvSkillInput, type CvSkillsInput } from "@/lib/validations/cv";

type SkillsFormProps = {
  cvId: string;
  initialValues: CvSkillsInput;
};

const EMPTY_SKILL: CvSkillInput = {
  name: "",
  category: "",
};

const SKILLS_TIP = "Tambahkan keahlian yang relevan dengan posisi target, urutkan dari yang paling kuat.";

export function SkillsForm({ cvId, initialValues }: SkillsFormProps) {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CvSkillsInput>({
    mode: "onBlur",
    defaultValues: initialValues,
  });

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "skills",
  });

  const skillsValidator = createSchemaValidator(cvSkillsSchema);

  const autoSave = useAutoSave<CvSkillsInput, CvSkillsInput>({
    control,
    reset,
    storageKey: `cv:${cvId}:skills`,
    parseDraft: skillsValidator,
    toPayload: skillsValidator,
    save: createAutoSaveFetcher(`/api/cv/${cvId}/skills`),
    onUnauthorized: () => router.push("/login"),
  });

  async function onSubmit(values: CvSkillsInput): Promise<void> {
    setServerError("");
    setSuccessMessage("");

    const validated = cvSkillsSchema.safeParse(values);

    if (!validated.success) {
      setServerError("Data keahlian tidak valid");
      return;
    }

    const response = await fetch(`/api/cv/${cvId}/skills`, {
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

      setServerError(payload?.message ?? "Gagal menyimpan keahlian");
      return;
    }

    setSuccessMessage(payload?.message ?? "Keahlian berhasil disimpan");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Keahlian</h2>
        <p className="text-sm text-gray-600">
          <span className="mr-1">💡</span>
          {SKILLS_TIP}
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-3 rounded-md border border-gray-200 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor={`skill-name-${field.id}`} className="text-sm font-medium">
                  Nama Keahlian <span className="text-red-600">*</span>
                </label>
                <input
                  id={`skill-name-${field.id}`}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Contoh: TypeScript"
                  {...register(`skills.${index}.name`)}
                />
                {errors.skills?.[index]?.name?.message ? (
                  <p className="text-sm text-red-600">{errors.skills[index]?.name?.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor={`skill-category-${field.id}`} className="text-sm font-medium">
                  Kategori (Opsional)
                </label>
                <input
                  id={`skill-category-${field.id}`}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Contoh: Frontend"
                  {...register(`skills.${index}.category`)}
                />
                {errors.skills?.[index]?.category?.message ? (
                  <p className="text-sm text-red-600">{errors.skills[index]?.category?.message}</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => swap(index, index - 1)} disabled={index === 0}>
                Naik
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => swap(index, index + 1)}
                disabled={index === fields.length - 1}
              >
                Turun
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (window.confirm("Hapus keahlian ini?")) {
                    remove(index);
                  }
                }}
              >
                Hapus Keahlian
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => append(EMPTY_SKILL)}>
          + Tambah Keahlian
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Keahlian"}
        </Button>
      </div>
      <AutoSaveIndicator status={autoSave.status} lastSavedAt={autoSave.lastSavedAt} />

      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
      {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}
    </form>
  );
}
