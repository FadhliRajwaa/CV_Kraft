import { beforeEach, describe, expect, it, vi } from "vitest";

const loginUserMock = vi.hoisted(() => vi.fn());
const InvalidCredentialsErrorMock = vi.hoisted(
  () =>
    class InvalidCredentialsError extends Error {
      constructor() {
        super("Email atau password salah");
        this.name = "InvalidCredentialsError";
      }
    },
);

vi.mock("@/lib/auth/login", () => ({
  InvalidCredentialsError: InvalidCredentialsErrorMock,
  loginUser: loginUserMock,
}));

import { POST } from "./route";

function createLoginRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const VALID_INPUT = {
  email: "fadhli@example.com",
  password: "12345678",
};

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    loginUserMock.mockReset();
    process.env.SESSION_SECRET = "test-secret";
  });

  it("mengembalikan error validasi untuk input tidak valid", async () => {
    const request = createLoginRequest({
      email: "invalid",
      password: "123",
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.message).toBe("Data tidak valid");
  });

  it("mengembalikan error kredensial invalid", async () => {
    loginUserMock.mockRejectedValueOnce(new InvalidCredentialsErrorMock());

    const request = createLoginRequest(VALID_INPUT);
    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.message).toBe("Email atau password salah");
  });

  it("login sukses dan set cookie sesi", async () => {
    loginUserMock.mockResolvedValueOnce({
      id: "user-1",
      name: "Fadhli",
      email: "fadhli@example.com",
    });

    const request = createLoginRequest(VALID_INPUT);
    const response = await POST(request);
    const payload = await response.json();
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    expect(payload.redirectTo).toBe("/dashboard");
    expect(setCookie).toContain("auth_session=user-1.");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("Secure");
  });

  it("mengembalikan 429 jika terlalu banyak percobaan login", async () => {
    loginUserMock.mockRejectedValue(new InvalidCredentialsErrorMock());

    for (let index = 0; index < 5; index += 1) {
      const response = await POST(createLoginRequest(VALID_INPUT));
      expect(response.status).toBe(401);
    }

    const blockedResponse = await POST(createLoginRequest(VALID_INPUT));
    const payload = await blockedResponse.json();

    expect(blockedResponse.status).toBe(429);
    expect(payload.message).toBe("Terlalu banyak percobaan login, coba lagi nanti");
  });
});
