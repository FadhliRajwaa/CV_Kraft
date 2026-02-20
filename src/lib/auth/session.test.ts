import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";

import { parseAuthSession } from "@/lib/auth/session";

function createCookieValue(userId: string, nonce: string, secret: string): string {
  const payload = `${userId}.${nonce}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

describe("parseAuthSession", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-session-secret";
  });

  it("mengembalikan userId saat cookie valid", () => {
    const cookieValue = createCookieValue("user-1", "nonce-1", "test-session-secret");

    const session = parseAuthSession(cookieValue);

    expect(session).toEqual({ userId: "user-1" });
  });

  it("mengembalikan null saat cookie tidak valid", () => {
    const session = parseAuthSession("invalid-cookie");

    expect(session).toBeNull();
  });

  it("mengembalikan null saat signature tidak cocok", () => {
    const cookieValue = createCookieValue("user-1", "nonce-1", "wrong-secret");

    const session = parseAuthSession(cookieValue);

    expect(session).toBeNull();
  });
});
