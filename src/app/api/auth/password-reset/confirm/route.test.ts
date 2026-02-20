import { beforeEach, describe, expect, it, vi } from "vitest";

const confirmPasswordResetMock = vi.hoisted(() => vi.fn());
const InvalidResetTokenErrorMock = vi.hoisted(
  () =>
    class InvalidResetTokenError extends Error {
      constructor() {
        super("Token reset tidak valid atau kedaluwarsa");
        this.name = "InvalidResetTokenError";
      }
    },
);

vi.mock("@/lib/auth/password-reset", () => ({
  InvalidResetTokenError: InvalidResetTokenErrorMock,
  confirmPasswordReset: confirmPasswordResetMock,
}));

import { POST } from "./route";

function createRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/auth/password-reset/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/password-reset/confirm", () => {
  beforeEach(() => {
    confirmPasswordResetMock.mockReset();
  });

  it("mengembalikan 400 untuk payload invalid", async () => {
    const response = await POST(createRequest({ token: "", password: "123" }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.message).toBe("Data tidak valid");
  });

  it("mengembalikan 400 untuk token invalid/expired", async () => {
    confirmPasswordResetMock.mockRejectedValueOnce(new InvalidResetTokenErrorMock());

    const response = await POST(
      createRequest({ token: "valid-token", password: "12345678" }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.message).toBe("Token reset tidak valid atau kedaluwarsa");
  });

  it("mengembalikan redirect login saat sukses", async () => {
    confirmPasswordResetMock.mockResolvedValueOnce(undefined);

    const response = await POST(
      createRequest({ token: "valid-token", password: "12345678" }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.redirectTo).toBe("/login?reset=success");
  });
});
