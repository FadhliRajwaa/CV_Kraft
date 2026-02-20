import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { InvalidCredentialsError, loginUser } from "@/lib/auth/login";
import { loginSchema } from "@/lib/validations/auth";

const SESSION_COOKIE_NAME = "auth_session";
const SESSION_SECRET_ENV_KEY = "SESSION_SECRET";
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const loginRateLimitStore = new Map<string, { count: number; resetAt: number }>();

function createSessionValue(userId: string): string {
  const secret = process.env[SESSION_SECRET_ENV_KEY];

  if (!secret) {
    throw new Error(`Missing ${SESSION_SECRET_ENV_KEY}`);
  }

  const nonce = randomUUID();
  const payload = `${userId}.${nonce}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");

  return `${payload}.${signature}`;
}

function buildRateLimitKey(request: Request, email: string): string {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  return `${ip}:${email}`;
}

function incrementLoginAttempts(key: string): boolean {
  const now = Date.now();
  const entry = loginRateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    loginRateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  const nextCount = entry.count + 1;
  loginRateLimitStore.set(key, {
    count: nextCount,
    resetAt: entry.resetAt,
  });

  return nextCount > RATE_LIMIT_MAX_ATTEMPTS;
}

function clearLoginAttempts(key: string): void {
  loginRateLimitStore.delete(key);
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

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

  if (incrementLoginAttempts(rateLimitKey)) {
    return NextResponse.json(
      { message: "Terlalu banyak percobaan login, coba lagi nanti" },
      { status: 429 },
    );
  }

  try {
    const user = await loginUser(parsed.data);

    clearLoginAttempts(rateLimitKey);

    const response = NextResponse.json(
      { message: "Login berhasil", user, redirectTo: "/dashboard" },
      { status: 200 },
    );

    response.cookies.set(SESSION_COOKIE_NAME, createSessionValue(user.id), SESSION_COOKIE_OPTIONS);

    return response;
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 },
      );
    }

    console.error("POST /api/auth/login failed", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
