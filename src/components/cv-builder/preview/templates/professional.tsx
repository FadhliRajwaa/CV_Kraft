import type { TemplateProps } from "./types";
import { CV_SECTION_LABELS } from "@/lib/validations/cv";

export function ProfessionalTemplate({ data, language }: TemplateProps) {
  const { personalInfo, summary, experiences, educations, skills, certifications, projects, sectionOrder } = data;

  const getLabel = (key: keyof typeof CV_SECTION_LABELS) => CV_SECTION_LABELS[key][language];

  const SectionHeader = ({ title }: { title: string }) => (
    <h2 className="mb-2 mt-4 border-b-2 border-black pb-1 text-base font-bold uppercase tracking-wider text-black">
      {title}
    </h2>
  );

  return (
    <div className="mx-auto w-[210mm] min-h-[297mm] bg-white p-[20mm] font-serif text-[11pt] text-black shadow-lg print:shadow-none">
      {/* HEADER */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wide">{personalInfo.fullName || "John Doe"}</h1>
        <div className="mt-1 flex flex-wrap justify-center gap-x-3 text-sm">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span>•</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.address && (
            <>
              <span>•</span>
              <span>{personalInfo.address}</span>
            </>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap justify-center gap-x-3 text-sm">
          {personalInfo.linkedIn && <a href={personalInfo.linkedIn}>{personalInfo.linkedIn.replace(/^https?:\/\//, '')}</a>}
          {personalInfo.portfolio && (
            <>
              {personalInfo.linkedIn && <span>•</span>}
              <a href={personalInfo.portfolio}>{personalInfo.portfolio.replace(/^https?:\/\//, '')}</a>
            </>
          )}
        </div>
      </div>

      {/* DYNAMIC SECTIONS */}
      {sectionOrder.map((sectionKey) => {
        if (sectionKey === "personal-info") return null;

        if (sectionKey === "summary" && summary) {
          return (
            <div key="summary" className="mb-4">
              <SectionHeader title={getLabel("summary")} />
              <p className="text-justify leading-relaxed">{summary}</p>
            </div>
          );
        }

        if (sectionKey === "experiences" && experiences.length > 0) {
          return (
            <div key="experiences" className="mb-4">
              <SectionHeader title={getLabel("experiences")} />
              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between font-bold">
                      <span>{exp.position}</span>
                      <span>
                        {exp.startDate} - {exp.isCurrent ? (language === "id" ? "Sekarang" : "Present") : exp.endDate}
                      </span>
                    </div>
                    <div className="font-semibold italic">{exp.company}</div>
                    {exp.description && <p className="mt-1 text-sm">{exp.description}</p>}
                    {exp.achievements.length > 0 && (
                      <ul className="ml-5 mt-1 list-disc text-sm">
                        {exp.achievements.map((ach, i) => (
                          <li key={i}>{ach}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (sectionKey === "educations" && educations.length > 0) {
          return (
            <div key="educations" className="mb-4">
              <SectionHeader title={getLabel("educations")} />
              <div className="space-y-3">
                {educations.map((edu, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between font-bold">
                      <span>{edu.institution}</span>
                      <span>
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <div>
                      {edu.degree} {language === "id" ? "dalam" : "in"} {edu.fieldOfStudy}
                      {edu.gpa && ` • IPK: ${edu.gpa}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (sectionKey === "skills" && skills.length > 0) {
          return (
            <div key="skills" className="mb-4">
              <SectionHeader title={getLabel("skills")} />
              <ul className="ml-5 list-disc">
                {skills.map((skill, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{skill.category}:</span> {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        if (sectionKey === "certifications" && certifications.length > 0) {
          return (
            <div key="certifications" className="mb-4">
              <SectionHeader title={getLabel("certifications")} />
              <div className="space-y-2">
                {certifications.map((cert, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between">
                      <span className="font-bold">{cert.name}</span>
                      <span>{cert.issueDate}</span>
                    </div>
                    <div>{cert.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (sectionKey === "projects" && projects.length > 0) {
          return (
            <div key="projects" className="mb-4">
              <SectionHeader title={getLabel("projects")} />
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={idx}>
                    <div className="font-bold">{proj.name}</div>
                    <p className="mt-1 text-sm">{proj.description}</p>
                    {proj.technologies.length > 0 && (
                      <div className="mt-1 text-sm italic">
                        {language === "id" ? "Teknologi:" : "Technologies:"} {proj.technologies.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
