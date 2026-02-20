import { CV_SECTION_KEYS } from "@/lib/validations/cv";

export type CvData = {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedIn: string;
    portfolio: string;
  };
  summary: string;
  experiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
    achievements: string[];
  }>;
  educations: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: Array<{
    name: string;
    category: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    url: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url: string;
  }>;
  sectionOrder: string[];
};

export function createDefaultCvData(): CvData {
  return {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      linkedIn: "",
      portfolio: "",
    },
    summary: "",
    experiences: [],
    educations: [],
    skills: [],
    certifications: [],
    projects: [],
    sectionOrder: [...CV_SECTION_KEYS],
  };
}
