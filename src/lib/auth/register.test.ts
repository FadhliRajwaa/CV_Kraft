import { describe, expect, it, vi } from "vitest";

import { DuplicateEmailError, registerUser } from "@/lib/auth/register";

const VALID_INPUT = {
  name: "Fadhli",
  email: "fadhli@example.com",
  password: "12345678",
};

describe("registerUser", () => {
  it("membuat user baru dengan password yang sudah di-hash", async () => {
    const deps = {
      findByEmail: vi.fn(async () => null),
      hashPassword: vi.fn(async () => "hashed-password"),
      createUser: vi.fn(async (data) => ({
        id: "user-1",
        name: data.name,
        email: data.email,
      })),
    };

    const result = await registerUser(VALID_INPUT, deps);

    expect(deps.hashPassword).toHaveBeenCalledWith("12345678", 12);
    expect(deps.createUser).toHaveBeenCalledWith({
      name: "Fadhli",
      email: "fadhli@example.com",
      password: "hashed-password",
    });
    expect(result.email).toBe("fadhli@example.com");
  });

  it("melempar DuplicateEmailError jika email sudah ada", async () => {
    const deps = {
      findByEmail: vi.fn(async () => ({ id: "existing-user" })),
      hashPassword: vi.fn(async () => "should-not-run"),
      createUser: vi.fn(async () => ({
        id: "should-not-run",
        name: "",
        email: "",
      })),
    };

    await expect(registerUser(VALID_INPUT, deps)).rejects.toBeInstanceOf(
      DuplicateEmailError,
    );

    expect(deps.hashPassword).not.toHaveBeenCalled();
    expect(deps.createUser).not.toHaveBeenCalled();
  });

  it("melempar DuplicateEmailError jika terjadi unique constraint email saat create", async () => {
    const deps = {
      findByEmail: vi.fn(async () => null),
      hashPassword: vi.fn(async () => "hashed-password"),
      createUser: vi.fn(async () => {
        throw { code: "P2002", meta: { target: ["email"] } };
      }),
    };

    await expect(registerUser(VALID_INPUT, deps)).rejects.toBeInstanceOf(
      DuplicateEmailError,
    );
  });
});
