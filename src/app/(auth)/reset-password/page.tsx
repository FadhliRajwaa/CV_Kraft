"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  passwordResetConfirmSchema,
  type PasswordResetConfirmInput,
} from "@/lib/validations/auth";

type ResetFormInput = {
  password: string;
  confirmPassword: string;
};

const resetFormSchema = passwordResetConfirmSchema
  .omit({ token: true })
  .extend({
    confirmPassword: passwordResetConfirmSchema.shape.password,
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama",
  });

function ResetPasswordForm() {
  const [serverError, setServerError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormInput>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetFormInput): Promise<void> {
    setServerError("");

    const payload: PasswordResetConfirmInput = {
      token,
      password: values.password,
    };

    const response = await fetch("/api/auth/password-reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorPayload = (await response.json().catch(() => null)) as { message?: string } | null;
      setServerError(errorPayload?.message ?? "Reset password gagal");
      return;
    }

    const successPayload = (await response.json()) as { redirectTo?: string };
    router.push(successPayload.redirectTo ?? "/login?reset=success");
  }

  if (!token) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-10">
        <section className="w-full space-y-4 rounded-lg border border-gray-200 p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Reset Password</h1>
          <p className="text-sm text-red-600">Token reset tidak valid atau kedaluwarsa.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-10">
      <section className="w-full space-y-6 rounded-lg border border-gray-200 p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold">Reset Password</h1>
          <p className="mt-1 text-sm text-gray-600">Masukkan password baru untuk akunmu.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            id="password"
            label="Password Baru"
            type="password"
            registration={register("password")}
            error={errors.password?.message}
          />

          <FormField
            id="confirmPassword"
            label="Konfirmasi Password"
            type="password"
            registration={register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Simpan Password Baru"}
          </Button>
        </form>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
