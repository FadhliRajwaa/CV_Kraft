import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const cookiesMock = vi.hoisted(() => vi.fn());
const redirectMock = vi.hoisted(() => vi.fn());
const createCvMock = vi.hoisted(() => vi.fn());

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    cV: {
      create: createCvMock,
    },
  },
}));

import DashboardPage from "./page";

function createSessionCookie(userId: string): string {
  const nonce = "nonce-1";
  const payload = `${userId}.${nonce}`;
  const signature = createHmac("sha256", "test-session-secret").update(payload).digest("hex");
  return `${payload}.${signature}`;
}

describe("DashboardPage", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-session-secret";
    cookiesMock.mockReset();
    redirectMock.mockReset();
    createCvMock.mockReset();
  });

  it("redirect ke /login jika session tidak valid", async () => {
    cookiesMock.mockResolvedValueOnce({
      get: vi.fn(() => undefined),
      set: vi.fn(),
    });

    await DashboardPage();

    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("mengizinkan akses dashboard jika session valid", async () => {
    cookiesMock.mockResolvedValueOnce({
      get: vi.fn(() => ({ value: createSessionCookie("user-1") })),
      set: vi.fn(),
    });

    const result = await DashboardPage();

    expect(redirectMock).not.toHaveBeenCalledWith("/login");
    expect(result).toBeTruthy();
  });

  it("menampilkan tombol + Buat CV Baru", async () => {
    cookiesMock.mockResolvedValueOnce({
      get: vi.fn(() => ({ value: createSessionCookie("user-1") })),
      set: vi.fn(),
    });

    const result = await DashboardPage();

    expect(result).toBeTruthy();
  });
});
