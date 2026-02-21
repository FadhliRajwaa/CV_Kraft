import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_SESSION_COOKIE_NAME, parseAuthSession } from "@/lib/auth/session";
import { calculateAtsScore } from "@/lib/cv/ats-calculator";
import type { CvData } from "@/lib/cv/default-data";
import { prisma } from "@/lib/prisma";
import { cvPersonalInfoSchema } from "@/lib/validations/cv";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext): Promise<NextResponse> {
  const { id } = await params;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;
  const session = parseAuthSession(sessionCookie);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = cvPersonalInfoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Data tidak valid",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const cv = await prisma.cV.findUnique({
    where: { id },
    select: {
      userId: true,
      data: true,
    },
  });

  if (!cv) {
    return NextResponse.json({ message: "CV tidak ditemukan" }, { status: 404 });
  }

  if (cv.userId !== session.userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const currentData =
    cv.data && typeof cv.data === "object" && !Array.isArray(cv.data)
      ? (cv.data as Record<string, unknown>)
      : {};

  const newData = { ...currentData, personalInfo: parsed.data };
  const atsScore = calculateAtsScore(newData as CvData).total;

  await prisma.cV.update({
    where: { id },
    data: {
      data: newData,
      atsScore,
    },
  });

  return NextResponse.json({ message: "Data pribadi berhasil disimpan" }, { status: 200 });
}
