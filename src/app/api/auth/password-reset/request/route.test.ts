import { beforeEach, describe, expect, it, vi } from "vitest";

const requestPasswordResetMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/auth/password-reset", () => ({
  requestPasswordReset: requestPasswordResetMock,
}));

import { POST } from "./route";

function createRequest(body: Record<string, unknown>, ip = "127.0.0.1"): Request {
  return new Request("http://localhost/api/auth/password-reset/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/password-reset/request", () => {
  beforeEach(() => {
    requestPasswordResetMock.mockReset();
    // @ts-expect-error override readonly
    process.env.NODE_ENV = "test";
  });

  it("mengembalikan 400 untuk payload invalid", async () => {
    const response = await POST(createRequest({ email: "invalid" }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.message).toBe("Data tidak valid");
  });

  it("mengembalikan respons netral saat sukses", async () => {
    requestPasswordResetMock.mockResolvedValueOnce(undefined);

    const response = await POST(createRequest({ email: "fadhli@example.com" }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.message).toBe("Jika email terdaftar, link reset password telah dikirim");
    expect(requestPasswordResetMock).toHaveBeenCalledWith(
      "fadhli@example.com",
      "http://localhost",
    );
  });

  it("mengembalikan 500 jika terjadi error internal", async () => {
    requestPasswordResetMock.mockRejectedValueOnce(new Error("boom"));

    const response = await POST(createRequest({ email: "fadhli@example.com" }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.message).toBe("Terjadi kesalahan pada server");
  });

  it("mengembalikan 429 jika terlalu banyak request reset", async () => {
    requestPasswordResetMock.mockResolvedValue(undefined);

    for (let index = 0; index < 3; index += 1) {
      const response = await POST(createRequest({ email: "fadhli@example.com" }, "10.0.0.1"));
      expect(response.status).toBe(200);
    }

    const blockedResponse = await POST(createRequest({ email: "fadhli@example.com" }, "10.0.0.1"));
    const payload = await blockedResponse.json();

    expect(blockedResponse.status).toBe(429);
    expect(payload.message).toBe("Terlalu banyak permintaan reset password, coba lagi nanti");
  });
});
