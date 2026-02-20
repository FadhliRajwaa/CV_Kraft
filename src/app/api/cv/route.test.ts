import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const createCvMock = vi.hoisted(() => vi.fn());
const cookiesMock = vi.hoisted(() => vi.fn());

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    cV: {
      create: createCvMock,
    },
  },
}));

import { POST } from "./route";

function createSessionCookie(userId: string): string {
  const nonce = "nonce-1";
  const payload = `${userId}.${nonce}`;
  const signature = createHmac("sha256", "test-session-secret").update(payload).digest("hex");
  return `${payload}.${signature}`;
}

function createCookieStore(cookieValue?: string): { get: (name: string) => { value: string } | undefined } {
  return {
    get: (name: string) =>
      name === "auth_session" && cookieValue ? { value: cookieValue.replace("auth_session=", "") } : undefined,
  };
}

describe("POST /api/cv", () => {
  beforeEach(() => {
    createCvMock.mockReset();
    cookiesMock.mockReset();
    process.env.SESSION_SECRET = "test-session-secret";
  });

  it("mengembalikan 401 jika tidak terautentikasi", async () => {
    cookiesMock.mockResolvedValueOnce(createCookieStore());

    const response = await POST();
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.message).toBe("Unauthorized");
  });

  it("membuat CV baru untuk user terautentikasi", async () => {
    createCvMock.mockResolvedValueOnce({
      id: "cv-1",
      title: "CV Tanpa Judul",
      userId: "user-1",
    });
    cookiesMock.mockResolvedValueOnce(createCookieStore(createSessionCookie("user-1")));

    const response = await POST();
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.redirectTo).toBe("/editor/cv-1");
    expect(createCvMock).toHaveBeenCalledTimes(1);
    expect(createCvMock.mock.calls[0]?.[0]).toMatchObject({
      data: {
        userId: "user-1",
        title: "CV Tanpa Judul",
      },
    });
  });

  it("mengembalikan 500 jika gagal create CV", async () => {
    createCvMock.mockRejectedValueOnce(new Error("boom"));
    cookiesMock.mockResolvedValueOnce(createCookieStore(createSessionCookie("user-1")));

    const response = await POST();
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.message).toBe("Terjadi kesalahan pada server");
  });
});
