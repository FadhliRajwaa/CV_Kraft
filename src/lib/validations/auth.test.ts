import { describe, expect, it } from "vitest";

import {
  loginSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
  registerSchema,
} from "@/lib/validations/auth";

describe("registerSchema", () => {
  it("gagal untuk email invalid", () => {
    const parsed = registerSchema.safeParse({
      name: "Fadhli",
      email: "invalid-email",
      password: "12345678",
    });

    expect(parsed.success).toBe(false);
  });

  it("gagal untuk password kurang dari 8 karakter", () => {
    const parsed = registerSchema.safeParse({
      name: "Fadhli",
      email: "fadhli@example.com",
      password: "12345",
    });

    expect(parsed.success).toBe(false);
  });

  it("sukses untuk payload valid", () => {
    const parsed = registerSchema.safeParse({
      name: "Fadhli",
      email: "FADHLI@EXAMPLE.COM",
      password: "12345678",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email).toBe("fadhli@example.com");
    }
  });
});

describe("loginSchema", () => {
  it("gagal untuk email invalid", () => {
    const parsed = loginSchema.safeParse({
      email: "invalid-email",
      password: "12345678",
    });

    expect(parsed.success).toBe(false);
  });

  it("gagal untuk password kurang dari 8 karakter", () => {
    const parsed = loginSchema.safeParse({
      email: "fadhli@example.com",
      password: "12345",
    });

    expect(parsed.success).toBe(false);
  });

  it("sukses untuk payload valid", () => {
    const parsed = loginSchema.safeParse({
      email: "FADHLI@EXAMPLE.COM",
      password: "12345678",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email).toBe("fadhli@example.com");
    }
  });
});

describe("passwordResetRequestSchema", () => {
  it("gagal untuk email invalid", () => {
    const parsed = passwordResetRequestSchema.safeParse({
      email: "invalid-email",
    });

    expect(parsed.success).toBe(false);
  });

  it("sukses untuk email valid", () => {
    const parsed = passwordResetRequestSchema.safeParse({
      email: "FADHLI@EXAMPLE.COM",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email).toBe("fadhli@example.com");
    }
  });
});

describe("passwordResetConfirmSchema", () => {
  it("gagal untuk token kosong", () => {
    const parsed = passwordResetConfirmSchema.safeParse({
      token: "",
      password: "12345678",
    });

    expect(parsed.success).toBe(false);
  });

  it("gagal untuk password kurang dari 8 karakter", () => {
    const parsed = passwordResetConfirmSchema.safeParse({
      token: "valid-token",
      password: "12345",
    });

    expect(parsed.success).toBe(false);
  });

  it("sukses untuk payload valid", () => {
    const parsed = passwordResetConfirmSchema.safeParse({
      token: "valid-token",
      password: "12345678",
    });

    expect(parsed.success).toBe(true);
  });
});
