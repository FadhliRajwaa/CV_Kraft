"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validations/auth";

export default function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterInput): Promise<void> {
    setServerError("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message = (payload as { message?: string } | null)?.message;
      setServerError(message ?? "Registrasi gagal");
      return;
    }

    const payload = (await response.json()) as { redirectTo?: string };
    router.push(payload.redirectTo ?? "/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-10">
      <section className="w-full space-y-6 rounded-lg border border-gray-200 p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold">Buat Akun</h1>
          <p className="mt-1 text-sm text-gray-600">
            Daftar untuk mulai membuat CV ATS-friendly.
          </p>
        </div>

        <Button asChild variant="outline" className="w-full">
          <a href="/api/auth/google">Login dengan Google</a>
        </Button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            id="name"
            label="Nama"
            type="text"
            registration={register("name")}
            error={errors.name?.message}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            registration={register("email")}
            error={errors.email?.message}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            registration={register("password")}
            error={errors.password?.message}
          />

          {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Daftar"}
          </Button>
        </form>
      </section>
    </main>
  );
}
