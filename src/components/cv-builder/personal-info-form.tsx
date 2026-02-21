"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AutoSaveIndicator } from "@/components/cv-builder/auto-save-indicator";
import { Button } from "@/components/ui/button";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useCvEditor } from "@/components/cv-builder/cv-editor-context";
import { createAutoSaveFetcher, createSchemaValidator } from "@/lib/cv/auto-save-helpers";
import { cvPersonalInfoSchema, type CvPersonalInfoInput } from "@/lib/validations/cv";

type PersonalInfoFormProps = {
  cvId: string;
  initialValues: CvPersonalInfoInput;
};

type FieldConfig = {
  name: keyof CvPersonalInfoInput;
  label: string;
  type: string;
  placeholder: string;
  tip: string;
  required?: boolean;
};

const FIELD_CONFIGS: FieldConfig[] = [
  {
    name: "fullName",
    label: "Nama Lengkap",
    type: "text",
    placeholder: "Contoh: Fadhli Ahmad",
    tip: "Gunakan nama lengkap resmi sesuai identitas profesional.",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "contoh@email.com",
    tip: "Gunakan email aktif yang sering kamu cek.",
    required: true,
  },
  {
    name: "phone",
    label: "Telepon",
    type: "tel",
    placeholder: "08xxxxxxxxxx",
    tip: "Tulis nomor yang mudah dihubungi recruiter.",
    required: true,
  },
  {
    name: "address",
    label: "Alamat (Opsional)",
    type: "text",
    placeholder: "Contoh: Jakarta, Indonesia",
    tip: "Cukup tulis kota/domisi jika tidak ingin alamat detail.",
  },
  {
    name: "linkedIn",
    label: "LinkedIn (Opsional)",
    type: "url",
    placeholder: "https://linkedin.com/in/username",
    tip: "Masukkan URL profil LinkedIn publik kamu.",
  },
  {
    name: "portfolio",
    label: "Portfolio (Opsional)",
    type: "url",
    placeholder: "https://portfolio-kamu.com",
    tip: "Tambahkan link portfolio terbaik yang relevan.",
  },
];

export function PersonalInfoForm({ cvId, initialValues }: PersonalInfoFormProps) {
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
  } = useForm<CvPersonalInfoInput>({
    resolver: zodResolver(cvPersonalInfoSchema),
    mode: "onBlur",
    defaultValues: initialValues,
  });

  const personalInfoValidator = createSchemaValidator(cvPersonalInfoSchema);

  const autoSave = useAutoSave<CvPersonalInfoInput, CvPersonalInfoInput>({
    control,
    reset,
    storageKey: `cv:${cvId}:personal-info`,
    parseDraft: personalInfoValidator,
    toPayload: personalInfoValidator,
    save: createAutoSaveFetcher(`/api/cv/${cvId}/personal-info`),
    onUnauthorized: () => router.push("/login"),
    onDraftChange: (draft) => updateCvData({ personalInfo: draft }),
  });

  async function onSubmit(values: CvPersonalInfoInput): Promise<void> {
    setServerError("");
    setSuccessMessage("");

    const response = await fetch(`/api/cv/${cvId}/personal-info`, {
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

      setServerError(payload?.message ?? "Gagal menyimpan data pribadi");
      return;
    }

    setSuccessMessage(payload?.message ?? "Data pribadi berhasil disimpan");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <h2 className="text-lg font-semibold">Data Pribadi</h2>

      {FIELD_CONFIGS.map((field) => (
        <div key={field.name} className="space-y-1.5">
          <label htmlFor={field.name} className="text-sm font-medium">
            {field.label}
            {field.required ? <span className="text-red-600"> *</span> : null}
            <span className="ml-2 text-xs text-gray-500" title={field.tip}>
              💡
            </span>
          </label>

          <input
            id={field.name}
            type={field.type}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder={field.placeholder}
            {...register(field.name)}
          />

          {errors[field.name]?.message ? (
            <p className="text-sm text-red-600">{errors[field.name]?.message}</p>
          ) : null}
        </div>
      ))}

      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
      {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}

      <div className="space-y-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Data Pribadi"}
        </Button>
        <AutoSaveIndicator status={autoSave.status} lastSavedAt={autoSave.lastSavedAt} />
      </div>
    </form>
  );
}
