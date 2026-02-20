import { describe, expect, it, vi } from "vitest";

import { InvalidCredentialsError, loginUser } from "@/lib/auth/login";

const VALID_INPUT = {
  email: "fadhli@example.com",
  password: "12345678",
};

describe("loginUser", () => {
  it("mengembalikan user jika kredensial valid", async () => {
    const deps = {
      findByEmail: vi.fn(async () => ({
        id: "user-1",
        name: "Fadhli",
        email: "fadhli@example.com",
        password: "hashed-password",
      })),
      comparePassword: vi.fn(async () => true),
    };

    const result = await loginUser(VALID_INPUT, deps);

    expect(deps.comparePassword).toHaveBeenCalledWith("12345678", "hashed-password");
    expect(result).toEqual({
      id: "user-1",
      name: "Fadhli",
      email: "fadhli@example.com",
    });
  });

  it("melempar InvalidCredentialsError jika email tidak ditemukan", async () => {
    const deps = {
      findByEmail: vi.fn(async () => null),
      comparePassword: vi.fn(async () => false),
    };

    await expect(loginUser(VALID_INPUT, deps)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
    expect(deps.comparePassword).toHaveBeenCalledTimes(1);
  });

  it("melempar InvalidCredentialsError jika password salah", async () => {
    const deps = {
      findByEmail: vi.fn(async () => ({
        id: "user-1",
        name: "Fadhli",
        email: "fadhli@example.com",
        password: "hashed-password",
      })),
      comparePassword: vi.fn(async () => false),
    };

    await expect(loginUser(VALID_INPUT, deps)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });
});
