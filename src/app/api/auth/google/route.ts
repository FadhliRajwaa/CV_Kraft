import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { findOrCreateGoogleUser } from "@/lib/auth/google-oauth";

const GOOGLE_OAUTH_STATE_COOKIE = "google_oauth_state";
const SESSION_COOKIE_NAME = "auth_session";
const SESSION_SECRET_ENV_KEY = "SESSION_SECRET";
const GOOGLE_CLIENT_ID_ENV_KEY = "GOOGLE_CLIENT_ID";
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

function createSessionValue(userId: string): string {
  const secret = process.env[SESSION_SECRET_ENV_KEY];

  if (!secret) {
    throw new Error(`Missing ${SESSION_SECRET_ENV_KEY}`);
  }

  const nonce = randomUUID();
  const payload = `${userId}.${nonce}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");

  return `${payload}.${signature}`;
}

function getBaseUrl(request: Request): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (appUrl) {
    return appUrl;
  }

  return new URL(request.url).origin;
}

function getGoogleClientId(): string {
  const clientId = process.env[GOOGLE_CLIENT_ID_ENV_KEY];

  if (!clientId) {
    throw new Error(`Missing ${GOOGLE_CLIENT_ID_ENV_KEY}`);
  }

  return clientId;
}

function createOAuthState(): string {
  return randomUUID();
}

function getCookieValue(cookieHeader: string | null, key: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  for (const rawPart of cookieHeader.split(";")) {
    const part = rawPart.trim();
    const separatorIndex = part.indexOf("=");

    if (separatorIndex < 0) {
      continue;
    }

    const name = part.slice(0, separatorIndex);
    const value = part.slice(separatorIndex + 1);

    if (name === key) {
      return value;
    }
  }

  return null;
}

async function exchangeCodeForToken(code: string, redirectUri: string): Promise<string> {
  const clientId = getGoogleClientId();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }).toString(),
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to exchange Google OAuth code");
  }

  const payload = (await tokenResponse.json()) as { access_token?: string };
  if (!payload.access_token) {
    throw new Error("Missing Google access token");
  }

  return payload.access_token;
}

async function fetchGoogleProfile(accessToken: string): Promise<{
  email: string;
  name?: string;
  picture?: string;
}> {
  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!profileResponse.ok) {
    throw new Error("Failed to fetch Google profile");
  }

  const payload = (await profileResponse.json()) as {
    email?: string;
    name?: string;
    picture?: string;
  };

  if (!payload.email) {
    throw new Error("Google profile missing email");
  }

  return {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
}

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const callbackCode = url.searchParams.get("code");
  const callbackState = url.searchParams.get("state");

  if (!callbackCode) {
    const state = createOAuthState();
    const baseUrl = getBaseUrl(request);
    const redirectUri = `${baseUrl}/api/auth/google`;

    const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleUrl.searchParams.set("client_id", getGoogleClientId());
    googleUrl.searchParams.set("redirect_uri", redirectUri);
    googleUrl.searchParams.set("response_type", "code");
    googleUrl.searchParams.set("scope", "openid email profile");
    googleUrl.searchParams.set("state", state);
    googleUrl.searchParams.set("prompt", "select_account");

    const response = NextResponse.redirect(googleUrl.toString());
    response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: 600,
    });
    return response;
  }

  const stateFromCookie = getCookieValue(
    request.headers.get("cookie"),
    GOOGLE_OAUTH_STATE_COOKIE,
  );

  if (!callbackState || !stateFromCookie || callbackState !== stateFromCookie) {
    return NextResponse.json({ message: "State OAuth tidak valid" }, { status: 400 });
  }

  try {
    const baseUrl = getBaseUrl(request);
    const redirectUri = `${baseUrl}/api/auth/google`;
    const accessToken = await exchangeCodeForToken(callbackCode, redirectUri);
    const profile = await fetchGoogleProfile(accessToken);
    const user = await findOrCreateGoogleUser({
      email: profile.email,
      name: profile.name,
      image: profile.picture,
    });

    const response = NextResponse.redirect(`${baseUrl}/dashboard`);
    response.cookies.set(SESSION_COOKIE_NAME, createSessionValue(user.id), SESSION_COOKIE_OPTIONS);
    response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, "", { ...SESSION_COOKIE_OPTIONS, maxAge: 0 });
    return response;
  } catch (error) {
    console.error("GET /api/auth/google failed", error);
    return NextResponse.redirect(`${getBaseUrl(request)}/login?error=google_oauth_failed`);
  }
}
