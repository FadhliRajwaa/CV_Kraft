import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AUTH_SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  parseAuthSession,
} from "@/lib/auth/session";
import { createDefaultCvData } from "@/lib/cv/default-data";
import { prisma } from "@/lib/prisma";
import { CvCard } from "@/components/dashboard/cv-card";
import { Card, CardContent } from "@/components/ui/card";

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

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true },
  });

  if (!user) {
    redirect("/login");
  }

  const cvs = await prisma.cV.findMany({
    where: { userId: session.userId },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      templateId: true,
      atsScore: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-muted/40 pb-8">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="text-xl font-bold md:text-2xl">Dashboard</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Selamat datang kembali, {user.name || user.email}
            </p>
          </div>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Keluar
            </Button>
          </form>
        </div>
      </header>
      <div className="px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <form action={createCv} className="h-full">
            <button type="submit" className="w-full h-full text-left group">
              <Card className="h-full flex flex-col items-center justify-center p-6 border-dashed border-2 bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors min-h-[220px]">
                <CardContent className="flex flex-col items-center justify-center p-0 text-muted-foreground group-hover:text-accent-foreground">
                  <PlusCircle className="h-10 w-10 mb-4" />
                  <p className="font-medium text-lg">Buat CV Baru</p>
                </CardContent>
              </Card>
            </button>
          </form>

          {cvs.map((cv) => (
            <CvCard key={cv.id} cv={cv} />
          ))}
        </div>

        {cvs.length === 0 && (
          <div className="mt-8 text-center text-muted-foreground">
            <p>Anda belum memiliki CV. Klik &quot;Buat CV Baru&quot; untuk memulai.</p>
          </div>
        )}
      </div>
    </main>
  );
}
