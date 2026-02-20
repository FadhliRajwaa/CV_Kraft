import { beforeEach, describe, expect, it, vi } from "vitest";

const findOrCreateGoogleUserMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/auth/google-oauth", () => ({
  findOrCreateGoogleUser: findOrCreateGoogleUserMock,
}));

import { GET } from "./route";

function createRequest(path: string, cookie?: string): Request {
  const headers = cookie ? { cookie } : undefined;
  return new Request(`http://localhost${path}`, { method: "GET", headers });
}

describe("GET /api/auth/google", () => {
  beforeEach(() => {
    findOrCreateGoogleUserMock.mockReset();
    process.env.GOOGLE_CLIENT_ID = "google-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "google-client-secret";
    process.env.SESSION_SECRET = "session-secret";
  });

  it("redirect ke Google consent screen saat belum ada code", async () => {
    const response = await GET(createRequest("/api/auth/google"));

    expect(response.status).toBe(307);
    const location = response.headers.get("location") ?? "";
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(location).toContain("accounts.google.com/o/oauth2/v2/auth");
    expect(location).toContain("client_id=google-client-id");
    expect(location).toContain("redirect_uri=http%3A%2F%2Flocalhost%2Fapi%2Fauth%2Fgoogle");
    expect(setCookie).toContain("google_oauth_state=");
  });

  it("mengembalikan 400 jika state callback tidak valid", async () => {
    const response = await GET(
      createRequest("/api/auth/google?code=abc&state=callback-state", "google_oauth_state=stored-state"),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.message).toBe("State OAuth tidak valid");
  });

  it("callback sukses: create/login user dan redirect ke dashboard", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: "google-access-token" }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            email: "fadhli@example.com",
            name: "Fadhli",
            picture: "https://example.com/avatar.png",
          }),
          { status: 200 },
        ),
      );

    vi.stubGlobal("fetch", fetchMock);

    findOrCreateGoogleUserMock.mockResolvedValueOnce({
      id: "user-1",
      email: "fadhli@example.com",
      name: "Fadhli",
      image: "https://example.com/avatar.png",
    });

    const response = await GET(
      createRequest("/api/auth/google?code=abc&state=stored-state", "google_oauth_state=stored-state"),
    );

    const location = response.headers.get("location") ?? "";
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(307);
    expect(location).toBe("http://localhost/dashboard");
    expect(findOrCreateGoogleUserMock).toHaveBeenCalledWith({
      email: "fadhli@example.com",
      name: "Fadhli",
      image: "https://example.com/avatar.png",
    });
    expect(setCookie).toContain("auth_session=user-1.");

    vi.unstubAllGlobals();
  });
});
