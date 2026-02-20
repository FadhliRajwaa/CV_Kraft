"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

function LoginForm() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error") === "google_oauth_failed";
  const resetSuccess = searchParams.get("reset") === "success";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput): Promise<void> {
    setServerError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message = (payload as { message?: string } | null)?.message;
      setServerError(message ?? "Login gagal");
      return;
    }

    const payload = (await response.json()) as { redirectTo?: string };
    router.push(payload.redirectTo ?? "/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-10">
      <section className="w-full space-y-6 rounded-lg border border-gray-200 p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold">Masuk</h1>
          <p className="mt-1 text-sm text-gray-600">Masuk untuk mengakses CV yang sudah disimpan.</p>
        </div>

        <Button asChild variant="outline" className="w-full">
          <a href="/api/auth/google">Login dengan Google</a>
        </Button>

        {resetSuccess ? (
          <p className="text-sm text-green-700">Password berhasil diperbarui. Silakan login.</p>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
          {!serverError && oauthError ? (
            <p className="text-sm text-red-600">Login Google gagal, silakan coba lagi.</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Masuk"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            <a href="/forgot-password" className="underline">
              Lupa password?
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
