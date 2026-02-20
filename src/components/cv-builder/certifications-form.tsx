"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";

import { AutoSaveIndicator } from "@/components/cv-builder/auto-save-indicator";
import { Button } from "@/components/ui/button";
import { useAutoSave } from "@/hooks/use-auto-save";
import { createAutoSaveFetcher, createSchemaValidator } from "@/lib/cv/auto-save-helpers";
import {
  cvCertificationsSchema,
  type CvCertificationInput,
  type CvCertificationsInput,
} from "@/lib/validations/cv";

type CertificationsFormProps = {
  cvId: string;
  initialValues: CvCertificationsInput;
};

const EMPTY_CERTIFICATION: CvCertificationInput = {
  name: "",
  issuer: "",
  issueDate: "",
  url: "",
};

const CERTIFICATION_TIP = "Tambahkan sertifikasi yang masih relevan dengan peran yang dituju.";

export function CertificationsForm({ cvId, initialValues }: CertificationsFormProps) {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CvCertificationsInput>({
    mode: "onBlur",
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  const certificationsValidator = createSchemaValidator(cvCertificationsSchema);

  const autoSave = useAutoSave<CvCertificationsInput, CvCertificationsInput>({
    control,
    reset,
    storageKey: `cv:${cvId}:certifications`,
    parseDraft: certificationsValidator,
    toPayload: certificationsValidator,
    save: createAutoSaveFetcher(`/api/cv/${cvId}/certifications`),
    onUnauthorized: () => router.push("/login"),
  });

  async function onSubmit(values: CvCertificationsInput): Promise<void> {
    setServerError("");
    setSuccessMessage("");

    const validated = cvCertificationsSchema.safeParse(values);

    if (!validated.success) {
      setServerError("Data sertifikasi tidak valid");
      return;
    }

    const response = await fetch(`/api/cv/${cvId}/certifications`, {
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

      setServerError(payload?.message ?? "Gagal menyimpan sertifikasi");
      return;
    }

    setSuccessMessage(payload?.message ?? "Sertifikasi berhasil disimpan");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Sertifikasi</h2>
        <p className="text-sm text-gray-600">
          <span className="mr-1">💡</span>
          {CERTIFICATION_TIP}
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-3 rounded-md border border-gray-200 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor={`cert-name-${field.id}`} className="text-sm font-medium">
                  Nama Sertifikasi <span className="text-red-600">*</span>
                </label>
                <input
                  id={`cert-name-${field.id}`}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Contoh: AWS Certified Cloud Practitioner"
                  {...register(`certifications.${index}.name`)}
                />
                {errors.certifications?.[index]?.name?.message ? (
                  <p className="text-sm text-red-600">{errors.certifications[index]?.name?.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor={`cert-issuer-${field.id}`} className="text-sm font-medium">
                  Penerbit <span className="text-red-600">*</span>
                </label>
                <input
                  id={`cert-issuer-${field.id}`}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Contoh: Amazon Web Services"
                  {...register(`certifications.${index}.issuer`)}
                />
                {errors.certifications?.[index]?.issuer?.message ? (
                  <p className="text-sm text-red-600">{errors.certifications[index]?.issuer?.message}</p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor={`cert-date-${field.id}`} className="text-sm font-medium">
                  Tanggal <span className="text-red-600">*</span>
                </label>
                <input
                  id={`cert-date-${field.id}`}
                  type="month"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  {...register(`certifications.${index}.issueDate`)}
                />
                {errors.certifications?.[index]?.issueDate?.message ? (
                  <p className="text-sm text-red-600">{errors.certifications[index]?.issueDate?.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor={`cert-url-${field.id}`} className="text-sm font-medium">
                  URL (Opsional)
                </label>
                <input
                  id={`cert-url-${field.id}`}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="https://example.com/certificate"
                  {...register(`certifications.${index}.url`)}
                />
                {errors.certifications?.[index]?.url?.message ? (
                  <p className="text-sm text-red-600">{errors.certifications[index]?.url?.message}</p>
                ) : null}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (window.confirm("Hapus sertifikasi ini?")) {
                  remove(index);
                }
              }}
            >
              Hapus Sertifikasi
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => append(EMPTY_CERTIFICATION)}>
          + Tambah Sertifikasi
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Sertifikasi"}
        </Button>
      </div>
      <AutoSaveIndicator status={autoSave.status} lastSavedAt={autoSave.lastSavedAt} />

      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
      {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}
    </form>
  );
}
