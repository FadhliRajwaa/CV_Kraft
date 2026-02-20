import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { DuplicateEmailError, registerUser } from "@/lib/auth/register";
import { AUTH_SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validations/auth";

const SESSION_SECRET_ENV_KEY = "SESSION_SECRET";
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

function createRegistrationSessionValue(userId: string): string {
  const secret = process.env[SESSION_SECRET_ENV_KEY];

  if (!secret) {
    throw new Error(`Missing ${SESSION_SECRET_ENV_KEY}`);
  }

  const nonce = randomUUID();
  const payload = `${userId}.${nonce}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");

  return `${payload}.${signature}`;
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Data tidak valid",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const user = await registerUser(parsed.data);

    const response = NextResponse.json(
      { message: "Registrasi berhasil", user, redirectTo: "/dashboard" },
      { status: 201 },
    );

    response.cookies.set(
      AUTH_SESSION_COOKIE_NAME,
      createRegistrationSessionValue(user.id),
      SESSION_COOKIE_OPTIONS,
    );

    return response;
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 },
      );
    }

    console.error("POST /api/auth/register failed", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
