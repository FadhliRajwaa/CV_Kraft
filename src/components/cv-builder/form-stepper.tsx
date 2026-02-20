import Link from "next/link";

const CV_FORM_STEPS = [
  { key: "personal-info", label: "Data Pribadi" },
  { key: "summary", label: "Ringkasan" },
  { key: "experiences", label: "Pengalaman" },
  { key: "educations", label: "Pendidikan" },
  { key: "skills", label: "Keahlian" },
  { key: "certifications", label: "Sertifikasi" },
  { key: "projects", label: "Proyek" },
] as const;

type FormStepperProps = {
  activeStep?: number;
  cvId: string;
};

export function FormStepper({ activeStep = 0, cvId }: FormStepperProps) {
  return (
    <nav aria-label="Form CV stepper" className="space-y-2">
      {CV_FORM_STEPS.map((step, index) => {
        const isActive = index === activeStep;

        return (
          <Link
            key={step.key}
            href={`/editor/${cvId}?section=${step.key}`}
            className={`block rounded-md border px-3 py-2 text-sm ${
              isActive ? "border-black bg-black text-white" : "border-gray-200 bg-white text-gray-700"
            }`}
          >
            {index + 1}. {step.label}
          </Link>
        );
      })}
    </nav>
  );
}
