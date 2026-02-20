import { createHmac, timingSafeEqual } from "node:crypto";

export const AUTH_SESSION_COOKIE_NAME = "auth_session";
const SESSION_SECRET_ENV_KEY = "SESSION_SECRET";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

export type AuthSession = {
  userId: string;
};

export function parseAuthSession(cookieValue: string | undefined): AuthSession | null {
  if (!cookieValue) {
    return null;
  }

  const parts = cookieValue.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [userId, nonce, signature] = parts;
  if (!userId || !nonce || !signature) {
    return null;
  }

  const secret = process.env[SESSION_SECRET_ENV_KEY];
  if (!secret) {
    return null;
  }

  const payload = `${userId}.${nonce}`;
  const expectedSignature = createHmac("sha256", secret).update(payload).digest("hex");

  const actualBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (actualBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null;
  }

  return { userId };
}
