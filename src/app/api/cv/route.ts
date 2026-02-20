import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_SESSION_COOKIE_NAME, parseAuthSession } from "@/lib/auth/session";
import { createDefaultCvData } from "@/lib/cv/default-data";
import { prisma } from "@/lib/prisma";

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;
  const session = parseAuthSession(sessionCookie);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const cv = await prisma.cV.create({
      data: {
        userId: session.userId,
        title: "CV Tanpa Judul",
        data: createDefaultCvData(),
      },
      select: {
        id: true,
        title: true,
        userId: true,
      },
    });

    return NextResponse.json(
      {
        message: "CV berhasil dibuat",
        cv,
        redirectTo: `/editor/${cv.id}`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/cv failed", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
