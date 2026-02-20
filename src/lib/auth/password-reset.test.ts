import { describe, expect, it, vi } from "vitest";

import {
  InvalidResetTokenError,
  confirmPasswordReset,
  requestPasswordReset,
} from "@/lib/auth/password-reset";

function createMockDeps() {
  return {
    findUserByEmail: vi.fn(async () => null),
    invalidateActiveTokens: vi.fn(async () => undefined),
    createResetToken: vi.fn(async () => undefined),
    findTokenByHash: vi.fn(async () => null),
    updatePasswordAndConsumeToken: vi.fn(async () => undefined),
    hashPassword: vi.fn(async () => "hashed-password"),
    sendResetEmail: vi.fn(async () => undefined),
    createRandomToken: vi.fn(() => "random-token"),
    now: vi.fn(() => new Date("2026-02-20T10:00:00.000Z")),
  };
}

describe("requestPasswordReset", () => {
  it("tidak melakukan apa pun jika email tidak terdaftar", async () => {
    const deps = createMockDeps();

    await requestPasswordReset("fadhli@example.com", "http://localhost:3000", deps);

    expect(deps.invalidateActiveTokens).not.toHaveBeenCalled();
    expect(deps.createResetToken).not.toHaveBeenCalled();
    expect(deps.sendResetEmail).not.toHaveBeenCalled();
  });

  it("membuat token reset ter-hash dan kirim email reset", async () => {
    const deps = {
      ...createMockDeps(),
      findUserByEmail: vi.fn(async () => ({ id: "user-1", email: "fadhli@example.com" })),
      createRandomToken: vi.fn(() => "plain-reset-token"),
    };

    await requestPasswordReset("fadhli@example.com", "http://localhost:3000", deps);

    expect(deps.invalidateActiveTokens).toHaveBeenCalledWith(
      "user-1",
      new Date("2026-02-20T10:00:00.000Z"),
    );
    expect(deps.createResetToken).toHaveBeenCalledTimes(1);
    expect(deps.createResetToken).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-1" }),
    );
    expect(deps.createResetToken).not.toHaveBeenCalledWith(
      expect.objectContaining({ tokenHash: "plain-reset-token" }),
    );
    expect(deps.sendResetEmail).toHaveBeenCalledWith({
      to: "fadhli@example.com",
      resetUrl: "http://localhost:3000/reset-password?token=plain-reset-token",
    });
  });
});

describe("confirmPasswordReset", () => {
  it("melempar InvalidResetTokenError jika token tidak ditemukan", async () => {
    const deps = createMockDeps();

    await expect(
      confirmPasswordReset({ token: "plain-reset-token", password: "12345678" }, deps),
    ).rejects.toBeInstanceOf(InvalidResetTokenError);
  });

  it("melempar InvalidResetTokenError jika token sudah expired", async () => {
    const deps = {
      ...createMockDeps(),
      findTokenByHash: vi.fn(async () => ({
        id: "token-1",
        userId: "user-1",
        usedAt: null,
        expiresAt: new Date("2026-02-20T09:00:00.000Z"),
      })),
    };

    await expect(
      confirmPasswordReset({ token: "plain-reset-token", password: "12345678" }, deps),
    ).rejects.toBeInstanceOf(InvalidResetTokenError);
  });

  it("update password dan konsumsi token jika token valid", async () => {
    const deps = {
      ...createMockDeps(),
      findTokenByHash: vi.fn(async () => ({
        id: "token-1",
        userId: "user-1",
        usedAt: null,
        expiresAt: new Date("2026-02-20T11:00:00.000Z"),
      })),
    };

    await confirmPasswordReset({ token: "plain-reset-token", password: "12345678" }, deps);

    expect(deps.hashPassword).toHaveBeenCalledWith("12345678", 12);
    expect(deps.updatePasswordAndConsumeToken).toHaveBeenCalledWith({
      userId: "user-1",
      tokenId: "token-1",
      passwordHash: "hashed-password",
      usedAt: new Date("2026-02-20T10:00:00.000Z"),
    });
  });
});
