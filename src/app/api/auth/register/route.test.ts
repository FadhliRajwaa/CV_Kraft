import { beforeEach, describe, expect, it, vi } from "vitest";

const registerUserMock = vi.hoisted(() => vi.fn());
const DuplicateEmailErrorMock = vi.hoisted(
  () =>
    class DuplicateEmailError extends Error {
      constructor() {
        super("Email sudah terdaftar");
        this.name = "DuplicateEmailError";
      }
    },
);

vi.mock("@/lib/auth/register", () => ({
  DuplicateEmailError: DuplicateEmailErrorMock,
  registerUser: registerUserMock,
}));

import { POST } from "./route";

function createRegisterRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const VALID_INPUT = {
  name: "Fadhli",
  email: "fadhli@example.com",
  password: "12345678",
};

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    registerUserMock.mockReset();
    process.env.SESSION_SECRET = "test-secret";
  });

  it("mengembalikan error validasi untuk input tidak valid", async () => {
    const request = createRegisterRequest({
      name: "",
      email: "invalid",
      password: "123",
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.message).toBe("Data tidak valid");
  });

  it("mengembalikan error duplicate email", async () => {
    registerUserMock.mockRejectedValueOnce(new DuplicateEmailErrorMock());

    const request = createRegisterRequest(VALID_INPUT);
    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.message).toBe("Email sudah terdaftar");
  });

  it("membuat user baru dan set cookie sesi", async () => {
    registerUserMock.mockResolvedValueOnce({
      id: "user-1",
      name: "Fadhli",
      email: "fadhli@example.com",
    });

    const request = createRegisterRequest(VALID_INPUT);
    const response = await POST(request);
    const payload = await response.json();
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(201);
    expect(payload.redirectTo).toBe("/dashboard");
    expect(setCookie).toContain("auth_session=user-1.");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("Secure");
  });
});
