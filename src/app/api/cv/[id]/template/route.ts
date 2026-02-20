import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_SESSION_COOKIE_NAME, parseAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { isTemplateId } from "@/lib/templates/registry";

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
  const templateId = typeof body?.templateId === "string" ? body.templateId : "";

  if (!isTemplateId(templateId)) {
    return NextResponse.json({ message: "templateId tidak valid" }, { status: 400 });
  }

  const cv = await prisma.cV.findUnique({
    where: { id },
    select: {
      userId: true,
      updatedAt: true,
    },
  });

  if (!cv) {
    return NextResponse.json({ message: "CV tidak ditemukan" }, { status: 404 });
  }

  if (cv.userId !== session.userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const updateResult = await prisma.cV.updateMany({
    where: {
      id,
      userId: session.userId,
      updatedAt: cv.updatedAt,
    },
    data: {
      templateId,
      updatedAt: new Date(),
    },
  });

  if (updateResult.count === 0) {
    return NextResponse.json({ message: "Data berubah, coba simpan ulang" }, { status: 409 });
  }

  return NextResponse.json({ message: "Template CV berhasil disimpan" }, { status: 200 });
}
