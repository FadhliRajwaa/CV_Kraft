"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { AutoSaveIndicator } from "@/components/cv-builder/auto-save-indicator";
import { Button } from "@/components/ui/button";
import { useAutoSave } from "@/hooks/use-auto-save";
import { createAutoSaveFetcher } from "@/lib/cv/auto-save-helpers";
import {
  cvExperiencesSchema,
  type CvExperienceInput,
  type CvExperiencesInput,
} from "@/lib/validations/cv";

type ExperiencesFormProps = {
  cvId: string;
  initialValues: CvExperiencesInput;
};

type ExperienceFormItem = Omit<CvExperienceInput, "achievements"> & {
  achievementsText: string;
};

type ExperiencesFormValues = {
  experiences: ExperienceFormItem[];
};

const EMPTY_EXPERIENCE: ExperienceFormItem = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  achievementsText: "",
};

const EXPERIENCE_TIP =
  "Gunakan angka spesifik — contoh: 'Meningkatkan conversion rate 35%'";

export function ExperiencesForm({ cvId, initialValues }: ExperiencesFormProps) {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const defaultValues = useMemo<ExperiencesFormValues>(
    () => ({
      experiences: initialValues.experiences.map((item) => ({
        ...item,
        achievementsText: item.achievements?.join("\n") ?? "",
      })),
    }),
    [initialValues.experiences],
  );

  const {
    control,
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExperiencesFormValues>({
    mode: "onBlur",
    defaultValues,
  });

  const autoSave = useAutoSave<ExperiencesFormValues, CvExperiencesInput>({
    control,
    reset,
    storageKey: `cv:${cvId}:experiences`,
    parseDraft: (draft) => {
      const fromPayload = cvExperiencesSchema.safeParse(draft);

      if (fromPayload.success) {
        return {
          experiences: fromPayload.data.experiences.map((item) => ({
            ...item,
            achievementsText: item.achievements.join("\n"),
          })),
        };
      }

      if (!draft || typeof draft !== "object") {
        return null;
      }

      const candidate = (draft as { experiences?: unknown }).experiences;

      if (!Array.isArray(candidate)) {
        return null;
      }

      return {
        experiences: candidate.map((item): ExperienceFormItem => {
          if (!item || typeof item !== "object") {
            return EMPTY_EXPERIENCE;
          }

          return {
            company: typeof item.company === "string" ? item.company : "",
            position: typeof item.position === "string" ? item.position : "",
            startDate: typeof item.startDate === "string" ? item.startDate : "",
            endDate: typeof item.endDate === "string" ? item.endDate : "",
            isCurrent: typeof item.isCurrent === "boolean" ? item.isCurrent : false,
            description: typeof item.description === "string" ? item.description : "",
            achievementsText: typeof item.achievementsText === "string" ? item.achievementsText : "",
          };
        }),
      };
    },
    toPayload: (values) => {
      const payload: CvExperiencesInput = {
        experiences: values.experiences.map((item) => ({
          company: item.company,
          position: item.position,
          startDate: item.startDate,
          endDate: item.isCurrent ? "" : item.endDate,
          isCurrent: item.isCurrent,
          description: item.description,
          achievements: item.achievementsText
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0),
        })),
      };

      const validated = cvExperiencesSchema.safeParse(payload);
      return validated.success ? validated.data : null;
    },
    save: createAutoSaveFetcher(`/api/cv/${cvId}/experiences`),
    onUnauthorized: () => router.push("/login"),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  const watchedExperiences = useWatch({ control, name: "experiences" });

  useEffect(() => {
    (watchedExperiences ?? []).forEach((item, index) => {
      if (item?.isCurrent && item?.endDate) {
        setValue(`experiences.${index}.endDate`, "");
      }
    });
  }, [setValue, watchedExperiences]);

  async function onSubmit(values: ExperiencesFormValues): Promise<void> {
    setServerError("");
    setSuccessMessage("");

    const body: CvExperiencesInput = {
      experiences: values.experiences.map((item) => ({
        company: item.company,
        position: item.position,
        startDate: item.startDate,
        endDate: item.isCurrent ? "" : item.endDate,
        isCurrent: item.isCurrent,
        description: item.description,
        achievements: item.achievementsText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0),
      })),
    };

    const validated = cvExperiencesSchema.safeParse(body);

    if (!validated.success) {
      setServerError("Data pengalaman tidak valid");
      return;
    }

    const response = await fetch(`/api/cv/${cvId}/experiences`, {
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

      setServerError(payload?.message ?? "Gagal menyimpan pengalaman");
      return;
    }

    setSuccessMessage(payload?.message ?? "Pengalaman berhasil disimpan");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Pengalaman Kerja</h2>
        <p className="text-sm text-gray-600">
          <span className="mr-1">💡</span>
          {EXPERIENCE_TIP}
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const isCurrent = Boolean(watchedExperiences[index]?.isCurrent);
          return (
            <div key={field.id} className="space-y-3 rounded-md border border-gray-200 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor={`company-${field.id}`} className="text-sm font-medium">
                    Perusahaan <span className="text-red-600">*</span>
                  </label>
                  <input
                    id={`company-${field.id}`}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Contoh: PT Maju Jaya"
                    {...register(`experiences.${index}.company`)}
                  />
                  {errors.experiences?.[index]?.company?.message ? (
                    <p className="text-sm text-red-600">{errors.experiences[index]?.company?.message}</p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor={`position-${field.id}`} className="text-sm font-medium">
                    Posisi <span className="text-red-600">*</span>
                  </label>
                  <input
                    id={`position-${field.id}`}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Contoh: Software Engineer"
                    {...register(`experiences.${index}.position`)}
                  />
                  {errors.experiences?.[index]?.position?.message ? (
                    <p className="text-sm text-red-600">{errors.experiences[index]?.position?.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor={`startDate-${field.id}`} className="text-sm font-medium">
                    Tanggal Mulai <span className="text-red-600">*</span>
                  </label>
                  <input
                    id={`startDate-${field.id}`}
                    type="month"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    {...register(`experiences.${index}.startDate`)}
                  />
                  {errors.experiences?.[index]?.startDate?.message ? (
                    <p className="text-sm text-red-600">{errors.experiences[index]?.startDate?.message}</p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor={`endDate-${field.id}`} className="text-sm font-medium">
                    Tanggal Selesai
                  </label>
                  <input
                    id={`endDate-${field.id}`}
                    type="month"
                    disabled={isCurrent}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                    {...register(`experiences.${index}.endDate`)}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" {...register(`experiences.${index}.isCurrent`)} />
                Masih bekerja di sini
              </label>

              <div className="space-y-1.5">
                <label htmlFor={`description-${field.id}`} className="text-sm font-medium">
                  Deskripsi <span className="text-red-600">*</span>
                </label>
                <textarea
                  id={`description-${field.id}`}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Jelaskan tanggung jawab utama dan ruang lingkup peran"
                  {...register(`experiences.${index}.description`)}
                />
                {errors.experiences?.[index]?.description?.message ? (
                  <p className="text-sm text-red-600">{errors.experiences[index]?.description?.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor={`achievements-${field.id}`} className="text-sm font-medium">
                  Achievements
                </label>
                <textarea
                  id={`achievements-${field.id}`}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Satu baris satu pencapaian"
                  {...register(`experiences.${index}.achievementsText`)}
                />
                <p className="text-xs text-gray-500">Tulis beberapa poin, pisahkan dengan baris baru.</p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (window.confirm("Hapus pengalaman ini?")) {
                    remove(index);
                  }
                }}
              >
                Hapus Pengalaman
              </Button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => append(EMPTY_EXPERIENCE)}>
          + Tambah Pengalaman
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Pengalaman"}
        </Button>
      </div>
      <AutoSaveIndicator status={autoSave.status} lastSavedAt={autoSave.lastSavedAt} />

      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
      {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}
    </form>
  );
}
