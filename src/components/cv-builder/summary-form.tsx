"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { AutoSaveIndicator } from "@/components/cv-builder/auto-save-indicator";
import { Button } from "@/components/ui/button";
import { useAutoSave } from "@/hooks/use-auto-save";
import { createAutoSaveFetcher, createSchemaValidator } from "@/lib/cv/auto-save-helpers";
import { cvSummarySchema, type CvSummaryInput } from "@/lib/validations/cv";

type SummaryFormProps = {
  cvId: string;
  initialValues: CvSummaryInput;
};

const SUMMARY_TIP =
  "Tulis 2-3 kalimat yang merangkum pengalaman, keahlian utama, dan tujuan karir Anda";

export function SummaryForm({ cvId, initialValues }: SummaryFormProps) {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CvSummaryInput>({
    resolver: zodResolver(cvSummarySchema),
    mode: "onBlur",
    defaultValues: initialValues,
  });

  const summaryValue = useWatch({ control, name: "summary" }) ?? "";

  const summaryValidator = createSchemaValidator(cvSummarySchema);

  const autoSave = useAutoSave<CvSummaryInput, CvSummaryInput>({
    control,
    reset,
    storageKey: `cv:${cvId}:summary`,
    parseDraft: summaryValidator,
    toPayload: summaryValidator,
    save: createAutoSaveFetcher(`/api/cv/${cvId}/summary`),
    onUnauthorized: () => router.push("/login"),
  });

  async function onSubmit(values: CvSummaryInput): Promise<void> {
    setServerError("");
    setSuccessMessage("");

    const response = await fetch(`/api/cv/${cvId}/summary`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      if (response.status === 401) {
        router.push("/login");
        return;
      }

      setServerError(payload?.message ?? "Gagal menyimpan ringkasan");
      return;
    }

    setSuccessMessage(payload?.message ?? "Ringkasan berhasil disimpan");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <h2 className="text-lg font-semibold">Ringkasan Profesional</h2>

      <p className="text-sm text-gray-600">
        <span className="mr-1">💡</span>
        {SUMMARY_TIP}
      </p>

      <div className="space-y-1.5">
        <label htmlFor="summary" className="text-sm font-medium">
          Ringkasan <span className="text-red-600">*</span>
        </label>
        <textarea
          id="summary"
          rows={6}
          maxLength={1000}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Contoh: Software engineer dengan pengalaman ..."
          {...register("summary")}
        />
        <p className="text-xs text-gray-500">{summaryValue.length} karakter (rekomendasi: 150-300)</p>
        {errors.summary?.message ? <p className="text-sm text-red-600">{errors.summary.message}</p> : null}
      </div>

      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
      {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}

      <div className="space-y-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Ringkasan"}
        </Button>
        <AutoSaveIndicator status={autoSave.status} lastSavedAt={autoSave.lastSavedAt} />
      </div>
    </form>
  );
}
