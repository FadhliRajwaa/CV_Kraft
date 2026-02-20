import { NextResponse } from "next/server";

import { requestPasswordReset } from "@/lib/auth/password-reset";
import { passwordResetRequestSchema } from "@/lib/validations/auth";

const PASSWORD_RESET_REQUEST_MAX_ATTEMPTS = 3;
const PASSWORD_RESET_REQUEST_WINDOW_MS = 60 * 60_000;
const passwordResetRateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getBaseUrl(request: Request): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (appUrl) {
    return appUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing NEXT_PUBLIC_APP_URL");
  }

  return new URL(request.url).origin;
}

function buildRateLimitKey(request: Request, email: string): string {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  return `${ip}:${email}`;
}

function incrementResetAttempts(key: string): boolean {
  const now = Date.now();
  const entry = passwordResetRateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    passwordResetRateLimitStore.set(key, {
      count: 1,
      resetAt: now + PASSWORD_RESET_REQUEST_WINDOW_MS,
    });
    return false;
  }

  const nextCount = entry.count + 1;
  passwordResetRateLimitStore.set(key, {
    count: nextCount,
    resetAt: entry.resetAt,
  });

  return nextCount > PASSWORD_RESET_REQUEST_MAX_ATTEMPTS;
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  const parsed = passwordResetRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Data tidak valid",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const rateLimitKey = buildRateLimitKey(request, parsed.data.email);
  if (incrementResetAttempts(rateLimitKey)) {
    return NextResponse.json(
      { message: "Terlalu banyak permintaan reset password, coba lagi nanti" },
      { status: 429 },
    );
  }

  try {
    await requestPasswordReset(parsed.data.email, getBaseUrl(request));

    return NextResponse.json(
      {
        message: "Jika email terdaftar, link reset password telah dikirim",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/auth/password-reset/request failed", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
