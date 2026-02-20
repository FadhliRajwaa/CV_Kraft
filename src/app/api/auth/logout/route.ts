import { NextResponse } from "next/server";

import {
  AUTH_SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/auth/session";

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json(
    { message: "Logout berhasil", redirectTo: "/" },
    { status: 200 },
  );

  response.cookies.set(AUTH_SESSION_COOKIE_NAME, "", {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });

  return response;
}
