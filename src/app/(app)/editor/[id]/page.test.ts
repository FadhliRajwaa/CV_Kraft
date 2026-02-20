import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const cookiesMock = vi.hoisted(() => vi.fn());
const redirectMock = vi.hoisted(() => vi.fn());
const notFoundMock = vi.hoisted(() => vi.fn());
const findCvMock = vi.hoisted(() => vi.fn());

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
  redirect: redirectMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    cV: {
      findUnique: findCvMock,
    },
  },
}));

import EditorPage from "./page";

const TEST_SESSION_SECRET = "test-session-secret";

function createSessionCookie(userId: string): string {
  const nonce = "nonce-1";
  const payload = `${userId}.${nonce}`;
  const signature = createHmac("sha256", TEST_SESSION_SECRET).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

function mockUnauthenticated(): void {
  cookiesMock.mockResolvedValueOnce({ get: vi.fn(() => undefined) });
}

function mockAuthenticated(userId = "user-1"): void {
  cookiesMock.mockResolvedValueOnce({
    get: vi.fn(() => ({ value: createSessionCookie(userId) })),
  });
}

describe("EditorPage", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = TEST_SESSION_SECRET;
    cookiesMock.mockReset();
    redirectMock.mockReset();
    notFoundMock.mockReset();
    findCvMock.mockReset();
  });

  it("redirect ke /login jika session tidak valid", async () => {
    mockUnauthenticated();

    await EditorPage({
      params: Promise.resolve({ id: "cv-1" }),
      searchParams: Promise.resolve({}),
    });

    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("memanggil notFound jika CV tidak ditemukan", async () => {
    mockAuthenticated();
    findCvMock.mockResolvedValueOnce(null);

    await EditorPage({
      params: Promise.resolve({ id: "cv-404" }),
      searchParams: Promise.resolve({}),
    });

    expect(notFoundMock).toHaveBeenCalled();
  });

  it("redirect ke /dashboard jika CV bukan milik user", async () => {
    mockAuthenticated();
    findCvMock.mockResolvedValueOnce({
      userId: "user-2",
      title: "CV Orang Lain",
      language: "id",
      data: {},
    });

    await EditorPage({
      params: Promise.resolve({ id: "cv-2" }),
      searchParams: Promise.resolve({}),
    });

    expect(redirectMock).toHaveBeenCalledWith("/dashboard");
  });

  it("render layout editor jika session valid dan CV milik user", async () => {
    mockAuthenticated();
    findCvMock.mockResolvedValueOnce({
      userId: "user-1",
      title: "CV Tanpa Judul",
      language: "id",
      data: {},
    });

    const result = await EditorPage({
      params: Promise.resolve({ id: "cv-1" }),
      searchParams: Promise.resolve({}),
    });

    expect(redirectMock).not.toHaveBeenCalledWith("/login");
    expect(redirectMock).not.toHaveBeenCalledWith("/dashboard");
    expect(result).toBeTruthy();
  });
});
