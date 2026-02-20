import { describe, expect, it, vi } from "vitest";

import { findOrCreateGoogleUser } from "@/lib/auth/google-oauth";

describe("findOrCreateGoogleUser", () => {
  it("mengembalikan user existing jika email sudah terdaftar", async () => {
    const deps = {
      findByEmail: vi.fn(async () => ({
        id: "user-1",
        name: "Fadhli",
        email: "fadhli@example.com",
        image: "https://example.com/avatar.png",
      })),
      createUser: vi.fn(),
    };

    const result = await findOrCreateGoogleUser(
      {
        email: "FADHLI@EXAMPLE.COM",
        name: "Fadhli",
        image: "https://example.com/avatar.png",
      },
      deps,
    );

    expect(deps.findByEmail).toHaveBeenCalledWith("fadhli@example.com");
    expect(deps.createUser).not.toHaveBeenCalled();
    expect(result.id).toBe("user-1");
  });

  it("membuat user baru jika email belum ada", async () => {
    const deps = {
      findByEmail: vi.fn(async () => null),
      createUser: vi.fn(async (data) => ({
        id: "user-2",
        name: data.name,
        email: data.email,
        image: data.image,
      })),
    };

    const result = await findOrCreateGoogleUser(
      {
        email: "new@example.com",
        name: "New User",
        image: "https://example.com/new.png",
      },
      deps,
    );

    expect(deps.createUser).toHaveBeenCalledWith({
      email: "new@example.com",
      name: "New User",
      image: "https://example.com/new.png",
      password: null,
    });
    expect(result.email).toBe("new@example.com");
  });
});
