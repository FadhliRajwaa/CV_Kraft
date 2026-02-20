import { NextResponse } from "next/server";

import { InvalidResetTokenError, confirmPasswordReset } from "@/lib/auth/password-reset";
import { passwordResetConfirmSchema } from "@/lib/validations/auth";

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  const parsed = passwordResetConfirmSchema.safeParse(body);

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
    await confirmPasswordReset(parsed.data);

    return NextResponse.json(
      {
        message: "Password berhasil diperbarui",
        redirectTo: "/login?reset=success",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof InvalidResetTokenError) {
      return NextResponse.json(
        { message: "Token reset tidak valid atau kedaluwarsa" },
        { status: 400 },
      );
    }

    console.error("POST /api/auth/password-reset/confirm failed", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
