import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { FormStepper } from "@/components/cv-builder/form-stepper";
import { PersonalInfoForm } from "@/components/cv-builder/personal-info-form";
import { SummaryForm } from "@/components/cv-builder/summary-form";
import { AUTH_SESSION_COOKIE_NAME, parseAuthSession } from "@/lib/auth/session";
import { createDefaultCvData, type CvData } from "@/lib/cv/default-data";
import { prisma } from "@/lib/prisma";

type EditorPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ section?: string }>;
};

const DEFAULT_CV_DATA = createDefaultCvData();
const DEFAULT_PERSONAL_INFO = DEFAULT_CV_DATA.personalInfo;

const SECTION_TO_STEP: Record<string, number> = {
  "personal-info": 0,
  summary: 1,
  experiences: 2,
  educations: 3,
  skills: 4,
  certifications: 5,
  projects: 6,
};

export default async function EditorPage({ params, searchParams }: EditorPageProps) {
  const { id } = await params;
  const { section = "personal-info" } = await searchParams;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;
  const session = parseAuthSession(sessionCookie);

  if (!session) {
    redirect("/login");
    return null;
  }

  const cv = await prisma.cV.findUnique({
    where: { id },
    select: {
      userId: true,
      title: true,
      data: true,
    },
  });

  if (!cv) {
    notFound();
    return null;
  }

  if (cv.userId !== session.userId) {
    redirect("/dashboard");
    return null;
  }

  const currentData =
    cv.data && typeof cv.data === "object" && !Array.isArray(cv.data)
      ? (cv.data as Partial<CvData>)
      : {};

  const personalInfo = {
    ...DEFAULT_PERSONAL_INFO,
    ...currentData.personalInfo,
  };
  const summary = currentData.summary ?? DEFAULT_CV_DATA.summary;
  const activeStep = SECTION_TO_STEP[section] ?? 0;

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl p-6 lg:p-8">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold">Editor CV</h1>
        <p className="text-sm text-gray-600">ID CV: {id}</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(280px,380px)_1fr]">
        <aside className="space-y-4 rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Form Section</h2>
          <FormStepper activeStep={activeStep} cvId={id} />
        </aside>

        <article className="rounded-lg border border-gray-200 p-6">
          {section === "summary" ? (
            <SummaryForm cvId={id} initialValues={{ summary }} />
          ) : section === "personal-info" ? (
            <PersonalInfoForm cvId={id} initialValues={personalInfo} />
          ) : (
            <p className="text-sm text-gray-600">Form untuk section ini akan tersedia di story berikutnya.</p>
          )}
        </article>
      </section>
    </main>
  );
}
