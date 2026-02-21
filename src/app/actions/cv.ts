"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { AUTH_SESSION_COOKIE_NAME, parseAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function duplicateCv(cvId: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;
  const session = parseAuthSession(sessionCookie);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const cv = await prisma.cV.findUnique({
    where: { id: cvId, userId: session.userId },
  });

  if (!cv) {
    throw new Error("CV not found");
  }

  const duplicatedCv = await prisma.cV.create({
    data: {
      userId: session.userId,
      title: `${cv.title} (Copy)`,
      templateId: cv.templateId,
      language: cv.language,
      data: cv.data as object,
      atsScore: cv.atsScore,
    },
  });

  revalidatePath("/dashboard");
  return duplicatedCv.id;
}

export async function deleteCv(cvId: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;
  const session = parseAuthSession(sessionCookie);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const cv = await prisma.cV.findUnique({
    where: { id: cvId, userId: session.userId },
  });

  if (!cv) {
    throw new Error("CV not found");
  }

  await prisma.cV.delete({
    where: { id: cvId },
  });

  revalidatePath("/dashboard");
  return true;
}

export async function getCvData(cvId: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;
  const session = parseAuthSession(sessionCookie);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const cv = await prisma.cV.findUnique({
    where: { id: cvId, userId: session.userId },
    select: { data: true, language: true, title: true }
  });

  if (!cv) {
    throw new Error("CV not found");
  }

  return { data: cv.data, language: cv.language, title: cv.title };
}
