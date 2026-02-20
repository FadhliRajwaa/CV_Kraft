import { describe, expect, it } from "vitest";

import { cvPersonalInfoSchema, cvSummarySchema } from "@/lib/validations/cv";

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
