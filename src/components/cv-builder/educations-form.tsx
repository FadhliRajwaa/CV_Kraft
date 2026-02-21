"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";

import { AutoSaveIndicator } from "@/components/cv-builder/auto-save-indicator";
import { Button } from "@/components/ui/button";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useCvEditor } from "@/components/cv-builder/cv-editor-context";
import { createAutoSaveFetcher, createSchemaValidator } from "@/lib/cv/auto-save-helpers";
import { cvEducationsSchema, type CvEducationInput, type CvEducationsInput } from "@/lib/validations/cv";

type EducationsFormProps = {
  cvId: string;
  initialValues: CvEducationsInput;
};

const EMPTY_EDUCATION: CvEducationInput = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  gpa: "",
};

const EDUCATION_TIP = "Tambahkan institusi, gelar, dan bidang studi yang paling relevan dengan posisi target.";

export function EducationsForm({ cvId, initialValues }: EducationsFormProps) {
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
  } = useForm<CvEducationsInput>({
    mode: "onBlur",
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations",
  });

  const educationsValidator = createSchemaValidator(cvEducationsSchema);

  const autoSave = useAutoSave<CvEducationsInput, CvEducationsInput>({
    control,
    reset,
    storageKey: `cv:${cvId}:educations`,
    parseDraft: educationsValidator,
    toPayload: educationsValidator,
    save: createAutoSaveFetcher(`/api/cv/${cvId}/educations`),
    onUnauthorized: () => router.push("/login"),
    onDraftChange: (draft) => updateCvData({ educations: draft.educations.map(d => ({...d, endDate: d.endDate || undefined, gpa: d.gpa || undefined})) }),
  });

  async function onSubmit(values: CvEducationsInput): Promise<void> {
    setServerError("");
    setSuccessMessage("");

    const validated = cvEducationsSchema.safeParse(values);

    if (!validated.success) {
      setServerError("Data pendidikan tidak valid");
      return;
    }

    const response = await fetch(`/api/cv/${cvId}/educations`, {
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

      setServerError(payload?.message ?? "Gagal menyimpan pendidikan");
      return;
    }

    setSuccessMessage(payload?.message ?? "Pendidikan berhasil disimpan");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Pendidikan</h2>
        <p className="text-sm text-gray-600">
          <span className="mr-1">💡</span>
          {EDUCATION_TIP}
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-3 rounded-md border border-gray-200 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor={`institution-${field.id}`} className="text-sm font-medium">
                  Institusi <span className="text-red-600">*</span>
                </label>
                <input
                  id={`institution-${field.id}`}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Contoh: Universitas Indonesia"
                  {...register(`educations.${index}.institution`)}
                />
                {errors.educations?.[index]?.institution?.message ? (
                  <p className="text-sm text-red-600">{errors.educations[index]?.institution?.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor={`degree-${field.id}`} className="text-sm font-medium">
                  Gelar <span className="text-red-600">*</span>
                </label>
                <input
                  id={`degree-${field.id}`}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Contoh: S1"
                  {...register(`educations.${index}.degree`)}
                />
                {errors.educations?.[index]?.degree?.message ? (
                  <p className="text-sm text-red-600">{errors.educations[index]?.degree?.message}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor={`fieldOfStudy-${field.id}`} className="text-sm font-medium">
                Bidang Studi <span className="text-red-600">*</span>
              </label>
              <input
                id={`fieldOfStudy-${field.id}`}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Contoh: Ilmu Komputer"
                {...register(`educations.${index}.fieldOfStudy`)}
              />
              {errors.educations?.[index]?.fieldOfStudy?.message ? (
                <p className="text-sm text-red-600">{errors.educations[index]?.fieldOfStudy?.message}</p>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1.5">
                <label htmlFor={`startDate-${field.id}`} className="text-sm font-medium">
                  Tanggal Mulai <span className="text-red-600">*</span>
                </label>
                <input
                  id={`startDate-${field.id}`}
                  type="month"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  {...register(`educations.${index}.startDate`)}
                />
                {errors.educations?.[index]?.startDate?.message ? (
                  <p className="text-sm text-red-600">{errors.educations[index]?.startDate?.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor={`endDate-${field.id}`} className="text-sm font-medium">
                  Tanggal Selesai
                </label>
                <input
                  id={`endDate-${field.id}`}
                  type="month"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  {...register(`educations.${index}.endDate`)}
                />
                {errors.educations?.[index]?.endDate?.message ? (
                  <p className="text-sm text-red-600">{errors.educations[index]?.endDate?.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor={`gpa-${field.id}`} className="text-sm font-medium">
                  IPK (Opsional)
                </label>
                <input
                  id={`gpa-${field.id}`}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Contoh: 3.75"
                  {...register(`educations.${index}.gpa`)}
                />
                {errors.educations?.[index]?.gpa?.message ? (
                  <p className="text-sm text-red-600">{errors.educations[index]?.gpa?.message}</p>
                ) : null}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (window.confirm("Hapus pendidikan ini?")) {
                  remove(index);
                }
              }}
            >
              Hapus Pendidikan
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => append(EMPTY_EDUCATION)}>
          + Tambah Pendidikan
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Pendidikan"}
        </Button>
      </div>
      <AutoSaveIndicator status={autoSave.status} lastSavedAt={autoSave.lastSavedAt} />

      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
      {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}
    </form>
  );
}
