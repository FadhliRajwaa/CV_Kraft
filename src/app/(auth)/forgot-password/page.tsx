"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  passwordResetRequestSchema,
  type PasswordResetRequestInput,
} from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetRequestInput>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: PasswordResetRequestInput): Promise<void> {
    setServerError("");
    setSuccessMessage("");

    const response = await fetch("/api/auth/password-reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      setServerError(payload?.message ?? "Permintaan reset password gagal");
      return;
    }

    setSuccessMessage(payload?.message ?? "Jika email terdaftar, link reset password telah dikirim");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-10">
      <section className="w-full space-y-6 rounded-lg border border-gray-200 p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold">Lupa Password</h1>
          <p className="mt-1 text-sm text-gray-600">
            Masukkan email akunmu. Kami akan kirim link untuk reset password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            id="email"
            label="Email"
            type="email"
            registration={register("email")}
            error={errors.email?.message}
          />

          {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
          {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Kirim Link Reset"}
          </Button>
        </form>
      </section>
    </main>
  );
}
