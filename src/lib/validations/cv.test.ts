import { describe, expect, it } from "vitest";

import {
  cvCertificationsSchema,
  cvEducationsSchema,
  cvExperiencesSchema,
  cvPersonalInfoSchema,
  cvProjectsSchema,
  cvSkillsSchema,
  cvSummarySchema,
} from "@/lib/validations/cv";

describe("cvPersonalInfoSchema", () => {
  it("sukses untuk payload valid", () => {
    const parsed = cvPersonalInfoSchema.safeParse({
      fullName: "Fadhli",
      email: " FADHLI@EXAMPLE.COM ",
      phone: "08123456789",
      address: "Jakarta",
      linkedIn: "https://linkedin.com/in/fadhli",
      portfolio: "https://fadhli.dev",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email).toBe("fadhli@example.com");
    }
  });

  it("gagal jika fullName kosong", () => {
    const parsed = cvPersonalInfoSchema.safeParse({
      fullName: "",
      email: "fadhli@example.com",
      phone: "08123456789",
    });

    expect(parsed.success).toBe(false);
  });

  it("gagal jika email invalid", () => {
    const parsed = cvPersonalInfoSchema.safeParse({
      fullName: "Fadhli",
      email: "not-an-email",
      phone: "08123456789",
    });

    expect(parsed.success).toBe(false);
  });

  it("gagal jika phone kosong", () => {
    const parsed = cvPersonalInfoSchema.safeParse({
      fullName: "Fadhli",
      email: "fadhli@example.com",
      phone: "",
    });

    expect(parsed.success).toBe(false);
  });

  it("gagal jika URL optional tidak valid", () => {
    const parsed = cvPersonalInfoSchema.safeParse({
      fullName: "Fadhli",
      email: "fadhli@example.com",
      phone: "08123456789",
      linkedIn: "linkedin-profile",
    });

    expect(parsed.success).toBe(false);
  });

  it("sukses jika URL optional kosong", () => {
    const parsed = cvPersonalInfoSchema.safeParse({
      fullName: "Fadhli",
      email: "fadhli@example.com",
      phone: "08123456789",
      linkedIn: "",
      portfolio: "",
    });

    expect(parsed.success).toBe(true);
  });
});

describe("cvSummarySchema", () => {
  it("sukses untuk summary valid", () => {
    const parsed = cvSummarySchema.safeParse({
      summary: "Software engineer yang fokus pada pengembangan web modern.",
    });

    expect(parsed.success).toBe(true);
  });

  it("gagal jika summary kosong", () => {
    const parsed = cvSummarySchema.safeParse({
      summary: "",
    });

    expect(parsed.success).toBe(false);
  });
});

describe("cvExperiencesSchema", () => {
  it("sukses untuk payload experiences valid", () => {
    const parsed = cvExperiencesSchema.safeParse({
      experiences: [
        {
          company: "PT Maju Jaya",
          position: "Software Engineer",
          startDate: "2022-01",
          endDate: "2024-12",
          isCurrent: false,
          description: "Mengembangkan fitur aplikasi web untuk internal perusahaan.",
          achievements: ["Meningkatkan performa halaman hingga 35%"],
        },
      ],
    });

    expect(parsed.success).toBe(true);
  });

  it("gagal jika field required pengalaman kosong", () => {
    const parsed = cvExperiencesSchema.safeParse({
      experiences: [
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: "",
          achievements: [],
        },
      ],
    });

    expect(parsed.success).toBe(false);
  });

  it("gagal jika achievement berisi string kosong", () => {
    const parsed = cvExperiencesSchema.safeParse({
      experiences: [
        {
          company: "PT Maju Jaya",
          position: "Software Engineer",
          startDate: "2022-01",
          endDate: "",
          isCurrent: true,
          description: "Menangani pengembangan modul pembayaran.",
          achievements: [""],
        },
      ],
    });

    expect(parsed.success).toBe(false);
  });

  it("gagal jika endDate lebih awal dari startDate", () => {
    const parsed = cvExperiencesSchema.safeParse({
      experiences: [
        {
          company: "PT Maju Jaya",
          position: "Software Engineer",
          startDate: "2024-06",
          endDate: "2023-12",
          isCurrent: false,
          description: "Menangani pengembangan modul pembayaran.",
          achievements: ["Meningkatkan reliabilitas sistem 20%"],
        },
      ],
    });

    expect(parsed.success).toBe(false);
  });
});

describe("cvEducationsSchema", () => {
  it("sukses untuk payload education valid", () => {
    const parsed = cvEducationsSchema.safeParse({
      educations: [
        {
          institution: "Universitas Indonesia",
          degree: "S1",
          fieldOfStudy: "Ilmu Komputer",
          startDate: "2018-08",
          endDate: "2022-06",
          gpa: "3.75",
        },
      ],
    });

    expect(parsed.success).toBe(true);
  });

  it("gagal jika field required pendidikan kosong", () => {
    const parsed = cvEducationsSchema.safeParse({
      educations: [
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          gpa: "",
        },
      ],
    });

    expect(parsed.success).toBe(false);
  });

  it("gagal jika endDate lebih awal dari startDate", () => {
    const parsed = cvEducationsSchema.safeParse({
      educations: [
        {
          institution: "Universitas Indonesia",
          degree: "S1",
          fieldOfStudy: "Ilmu Komputer",
          startDate: "2022-08",
          endDate: "2021-06",
          gpa: "3.75",
        },
      ],
    });

    expect(parsed.success).toBe(false);
  });
});

describe("cvSkillsSchema", () => {
  it("sukses untuk payload skills valid", () => {
    const parsed = cvSkillsSchema.safeParse({
      skills: [
        { name: "TypeScript", category: "Programming Language" },
        { name: "React", category: "Frontend" },
      ],
    });

    expect(parsed.success).toBe(true);
  });

  it("gagal jika nama skill kosong", () => {
    const parsed = cvSkillsSchema.safeParse({
      skills: [{ name: "", category: "Frontend" }],
    });

    expect(parsed.success).toBe(false);
  });
});

describe("cvCertificationsSchema", () => {
  it("sukses untuk payload certifications valid", () => {
    const parsed = cvCertificationsSchema.safeParse({
      certifications: [
        {
          name: "AWS Certified Cloud Practitioner",
          issuer: "Amazon Web Services",
          issueDate: "2025-01",
          url: "https://example.com/cert/aws-cp",
        },
      ],
    });

    expect(parsed.success).toBe(true);
  });

  it("gagal jika tanggal sertifikasi tidak valid", () => {
    const parsed = cvCertificationsSchema.safeParse({
      certifications: [
        {
          name: "AWS Certified Cloud Practitioner",
          issuer: "Amazon Web Services",
          issueDate: "2025",
          url: "",
        },
      ],
    });

    expect(parsed.success).toBe(false);
  });
});

describe("cvProjectsSchema", () => {
  it("sukses untuk payload projects valid", () => {
    const parsed = cvProjectsSchema.safeParse({
      projects: [
        {
          name: "CVKraft",
          description: "Platform untuk membuat CV ATS-friendly.",
          url: "https://example.com/cvkraft",
          technologies: ["Next.js", "TypeScript", "Prisma"],
        },
      ],
    });

    expect(parsed.success).toBe(true);
  });

  it("gagal jika deskripsi proyek kosong", () => {
    const parsed = cvProjectsSchema.safeParse({
      projects: [
        {
          name: "CVKraft",
          description: "",
          url: "",
          technologies: [],
        },
      ],
    });

    expect(parsed.success).toBe(false);
  });
});
