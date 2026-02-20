import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  AUTH_SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  parseAuthSession,
} from "@/lib/auth/session";
import { createDefaultCvData } from "@/lib/cv/default-data";
import { prisma } from "@/lib/prisma";

async function createCv(): Promise<void> {
  "use server";

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;
  const session = parseAuthSession(sessionCookie);

  if (!session) {
    redirect("/login");
  }

  const cv = await prisma.cV.create({
    data: {
      userId: session.userId,
      title: "CV Tanpa Judul",
      data: createDefaultCvData(),
    },
    select: { id: true },
  });

  redirect(`/editor/${cv.id}`);
}

async function logout(): Promise<void> {
  "use server";

  const cookieStore = await cookies();
  cookieStore.set(AUTH_SESSION_COOKIE_NAME, "", {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });

  redirect("/");
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;
  const session = parseAuthSession(sessionCookie);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center p-8">
      <section className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <form action={createCv}>
          <Button type="submit">+ Buat CV Baru</Button>
        </form>
        <form action={logout}>
          <Button type="submit" variant="outline">
            Logout
          </Button>
        </form>
      </section>
    </main>
  );
}
