import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import dynamic from "next/dynamic";
import { CvEditorProvider } from "@/components/cv-builder/cv-editor-context";
import { FormStepper } from "@/components/cv-builder/form-stepper";
import { LivePreview } from "@/components/cv-builder/preview/live-preview";
import { ATSScoreCard } from "@/components/cv-builder/ats-score-card";

const DownloadPdfButton = dynamic(
  () => import("@/components/cv-builder/download-pdf-button"),
  { loading: () => <button disabled className="px-4 py-2 bg-gray-200 text-gray-500 rounded-md text-sm font-medium">Menyiapkan PDF...</button> }
);
import { CertificationsForm } from "@/components/cv-builder/certifications-form";
import { EducationsForm } from "@/components/cv-builder/educations-form";
import { ExperiencesForm } from "@/components/cv-builder/experiences-form";
import { LanguageSelector } from "@/components/cv-builder/language-selector";
import { PersonalInfoForm } from "@/components/cv-builder/personal-info-form";
import { ProjectsForm } from "@/components/cv-builder/projects-form";
import { SkillsForm } from "@/components/cv-builder/skills-form";
import { SummaryForm } from "@/components/cv-builder/summary-form";
import { TemplateSelector } from "@/components/cv-builder/template-selector";
import { AUTH_SESSION_COOKIE_NAME, parseAuthSession } from "@/lib/auth/session";
import { createDefaultCvData, type CvData } from "@/lib/cv/default-data";
import { prisma } from "@/lib/prisma";
import { CV_SECTION_KEYS } from "@/lib/validations/cv";

type EditorPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ section?: string }>;
};

type SectionKey = (typeof CV_SECTION_KEYS)[number];

const DEFAULT_CV_DATA = createDefaultCvData();
const DEFAULT_PERSONAL_INFO = DEFAULT_CV_DATA.personalInfo;

function arrayOrDefault<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? value : fallback;
}

function sanitizeSectionOrder(value: unknown): SectionKey[] {
  if (!Array.isArray(value)) {
    return [...CV_SECTION_KEYS];
  }

  const candidate = value.filter((item): item is SectionKey =>
    typeof item === "string" && (CV_SECTION_KEYS as readonly string[]).includes(item),
  );

  const isComplete = candidate.length === CV_SECTION_KEYS.length;
  const isUnique = new Set(candidate).size === CV_SECTION_KEYS.length;

  if (!isComplete || !isUnique) {
    return [...CV_SECTION_KEYS];
  }

  return candidate;
}

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
      templateId: true,
      language: true,
      data: true,
    },
  });

  if (!cv) {
    notFound();
    return null;
  }

  if (cv.userId !== session.userId) {
    redirect("/dashboard");
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
  const experiences = arrayOrDefault(currentData.experiences, DEFAULT_CV_DATA.experiences);
  const educations = arrayOrDefault(currentData.educations, DEFAULT_CV_DATA.educations);
  const skills = arrayOrDefault(currentData.skills, DEFAULT_CV_DATA.skills);
  const certifications = arrayOrDefault(currentData.certifications, DEFAULT_CV_DATA.certifications);
  const projects = arrayOrDefault(currentData.projects, DEFAULT_CV_DATA.projects);
  const orderedSections = sanitizeSectionOrder(currentData.sectionOrder);
  const language = cv.language === "en" ? "en" : "id";
  const templateId = (cv.templateId as "professional" | "modern" | "minimal") || "professional";

  const initialData: CvData = {
    ...DEFAULT_CV_DATA,
    ...currentData,
    personalInfo,
    summary,
    experiences,
    educations,
    skills,
    certifications,
    projects,
    sectionOrder: orderedSections,
  };

  function renderSectionForm(): React.ReactNode {
    switch (section) {
      case "personal-info":
        return <PersonalInfoForm cvId={id} initialValues={personalInfo} />;
      case "summary":
        return <SummaryForm cvId={id} initialValues={{ summary }} />;
      case "experiences":
        return <ExperiencesForm cvId={id} initialValues={{ experiences }} />;
      case "educations":
        return <EducationsForm cvId={id} initialValues={{ educations }} />;
      case "skills":
        return <SkillsForm cvId={id} initialValues={{ skills }} />;
      case "certifications":
        return <CertificationsForm cvId={id} initialValues={{ certifications }} />;
      case "projects":
        return <ProjectsForm cvId={id} initialValues={{ projects }} />;
      default:
        return <p className="text-sm text-gray-600">Form untuk section ini akan tersedia di story berikutnya.</p>;
    }
  }

  return (
    <CvEditorProvider
      initialData={initialData}
      initialLanguage={language}
      initialTemplateId={templateId}
    >
      <main className="mx-auto min-h-screen w-full max-w-7xl p-6 lg:p-8">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Editor CV</h1>
          <p className="text-sm text-gray-600">ID CV: {id}</p>
        </div>
        <div>
          <DownloadPdfButton />
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[280px_minmax(400px,500px)_1fr]">
        <aside className="space-y-4 rounded-lg border border-gray-200 p-4">
          <ATSScoreCard />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Form Section</h2>
          <LanguageSelector cvId={id} value={language} />
          <TemplateSelector cvId={id} value={templateId} />
          <FormStepper activeSection={section} cvId={id} language={language} orderedSections={orderedSections} />
        </aside>

        <article className="space-y-6 rounded-lg border border-gray-200 p-6">
          {renderSectionForm()}
        </article>

        <section className="sticky top-6 hidden h-[calc(100vh-120px)] lg:block">
          <LivePreview />
        </section>
      </section>
    </main>
    </CvEditorProvider>
  );
}
