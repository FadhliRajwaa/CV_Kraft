import { describe, expect, it } from "vitest";

import { POST } from "./route";

describe("POST /api/auth/logout", () => {
  it("menghapus cookie sesi dan mengembalikan redirect ke landing", async () => {
    const response = await POST();
    const payload = await response.json();
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    expect(payload.redirectTo).toBe("/");
    expect(setCookie).toContain("auth_session=");
    expect(setCookie).toContain("Max-Age=0");
  });
});
