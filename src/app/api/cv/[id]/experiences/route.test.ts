import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const cookiesMock = vi.hoisted(() => vi.fn());
const findCvMock = vi.hoisted(() => vi.fn());
const updateCvMock = vi.hoisted(() => vi.fn());

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    cV: {
      findUnique: findCvMock,
      update: updateCvMock,
    },
  },
}));

import { PATCH } from "./route";

const TEST_SESSION_SECRET = "test-session-secret";
const CV_ID = "cv-1";
const USER_ID = "user-1";
const ROUTE_CONTEXT = { params: Promise.resolve({ id: CV_ID }) };

function createSessionCookie(userId: string): string {
  const nonce = "nonce-1";
  const payload = `${userId}.${nonce}`;
  const signature = createHmac("sha256", TEST_SESSION_SECRET).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

function createRequest(body: Record<string, unknown>): Request {
  return new Request(`http://localhost/api/cv/${CV_ID}/experiences`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mockUnauthenticated(): void {
  cookiesMock.mockResolvedValueOnce({ get: vi.fn(() => undefined) });
}

function mockAuthenticated(userId = USER_ID): void {
  cookiesMock.mockResolvedValueOnce({
    get: vi.fn(() => ({ value: createSessionCookie(userId) })),
  });
}

const VALID_PAYLOAD = {
  experiences: [
    {
      company: "PT Maju Jaya",
      position: "Software Engineer",
      startDate: "2022-01",
      endDate: "2024-12",
      isCurrent: false,
      description: "Mengembangkan fitur aplikasi web.",
      achievements: ["Meningkatkan conversion rate 35%"],
    },
  ],
};

describe("PATCH /api/cv/[id]/experiences", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = TEST_SESSION_SECRET;
    cookiesMock.mockReset();
    findCvMock.mockReset();
    updateCvMock.mockReset();
  });

  it("mengembalikan 401 jika tidak terautentikasi", async () => {
    mockUnauthenticated();

    const response = await PATCH(createRequest({}), ROUTE_CONTEXT);
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.message).toBe("Unauthorized");
  });

  it("mengembalikan 403 jika CV bukan milik user", async () => {
    mockAuthenticated();
    findCvMock.mockResolvedValueOnce({ userId: "user-2", data: {} });

    const response = await PATCH(createRequest(VALID_PAYLOAD), ROUTE_CONTEXT);
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload.message).toBe("Forbidden");
  });

  it("mengembalikan 400 jika payload tidak valid", async () => {
    mockAuthenticated();

    const response = await PATCH(
      createRequest({
        experiences: [
          {
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            isCurrent: false,
            description: "",
            achievements: [""],
          },
        ],
      }),
      ROUTE_CONTEXT,
    );

    expect(response.status).toBe(400);
    expect(findCvMock).not.toHaveBeenCalled();
    expect(updateCvMock).not.toHaveBeenCalled();
  });

  it("mengupdate CV.data.experiences jika payload valid", async () => {
    mockAuthenticated();
    findCvMock.mockResolvedValueOnce({
      userId: USER_ID,
      data: {
        summary: "existing",
      },
    });
    updateCvMock.mockResolvedValueOnce({ id: CV_ID });

    const response = await PATCH(createRequest(VALID_PAYLOAD), ROUTE_CONTEXT);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.message).toBe("Pengalaman berhasil disimpan");
    expect(updateCvMock).toHaveBeenCalledTimes(1);
    expect(updateCvMock.mock.calls[0]?.[0]).toMatchObject({
      where: { id: CV_ID },
      data: {
        data: {
          summary: "existing",
          experiences: VALID_PAYLOAD.experiences,
        },
      },
    });
  });
});
