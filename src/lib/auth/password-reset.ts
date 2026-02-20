import { createHash, randomBytes } from "node:crypto";

import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";

const RESET_TOKEN_TTL_MS = 15 * 60_000;
const RESET_EMAIL_REQUEST_TIMEOUT_MS = 5_000;
const BCRYPT_SALT_ROUNDS = 12;

export class InvalidResetTokenError extends Error {
  constructor() {
    super("Token reset tidak valid atau kedaluwarsa");
    this.name = "InvalidResetTokenError";
  }
}

type PasswordResetDeps = {
  findUserByEmail: (email: string) => Promise<{ id: string; email: string } | null>;
  invalidateActiveTokens: (userId: string, now: Date) => Promise<void>;
  createResetToken: (input: { userId: string; tokenHash: string; expiresAt: Date }) => Promise<void>;
  findTokenByHash: (
    tokenHash: string,
  ) => Promise<{ id: string; userId: string; expiresAt: Date; usedAt: Date | null } | null>;
  updatePasswordAndConsumeToken: (input: {
    userId: string;
    tokenId: string;
    passwordHash: string;
    usedAt: Date;
  }) => Promise<void>;
  hashPassword: (password: string, rounds: number) => Promise<string>;
  sendResetEmail: (input: { to: string; resetUrl: string }) => Promise<void>;
  createRandomToken: () => string;
  now: () => Date;
};

function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function sendResetEmail(input: { to: string; resetUrl: string }): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  if (!resendApiKey || !emailFrom) {
    console.info("Password reset email service not configured", {
      to: input.to,
      resetUrl: input.resetUrl,
    });
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to: input.to,
        subject: "Reset password akun CVKraft",
        html: `<p>Klik link berikut untuk reset password Anda:</p><p><a href="${input.resetUrl}">${input.resetUrl}</a></p>`,
      }),
      signal: AbortSignal.timeout(RESET_EMAIL_REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error("Failed to send password reset email");
    }
  } catch (error) {
    console.error("sendResetEmail failed", error);
  }
}

const defaultDeps: PasswordResetDeps = {
  findUserByEmail: (email) =>
    prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    }),
  invalidateActiveTokens: async (userId, now) => {
    await prisma.passwordResetToken.updateMany({
      where: {
        userId,
        usedAt: null,
        expiresAt: { gt: now },
      },
      data: { usedAt: now },
    });
  },
  createResetToken: async (input) => {
    await prisma.passwordResetToken.create({ data: input });
  },
  findTokenByHash: (tokenHash) =>
    prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: { id: true, userId: true, expiresAt: true, usedAt: true },
    }),
  updatePasswordAndConsumeToken: async (input) => {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: input.userId },
        data: { password: input.passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: input.tokenId },
        data: { usedAt: input.usedAt },
      }),
    ]);
  },
  hashPassword: (password, rounds) => bcrypt.hash(password, rounds),
  sendResetEmail,
  createRandomToken: () => randomBytes(32).toString("hex"),
  now: () => new Date(),
};

export async function requestPasswordReset(
  email: string,
  appBaseUrl: string,
  deps: PasswordResetDeps = defaultDeps,
): Promise<void> {
  const user = await deps.findUserByEmail(email);

  if (!user) {
    return;
  }

  const token = deps.createRandomToken();
  const tokenHash = hashResetToken(token);
  const now = deps.now();
  const expiresAt = new Date(now.getTime() + RESET_TOKEN_TTL_MS);

  await deps.invalidateActiveTokens(user.id, now);
  await deps.createResetToken({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  const resetUrl = `${appBaseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  await deps.sendResetEmail({ to: user.email, resetUrl });
}

export async function confirmPasswordReset(
  input: { token: string; password: string },
  deps: PasswordResetDeps = defaultDeps,
): Promise<void> {
  const tokenHash = hashResetToken(input.token);
  const resetToken = await deps.findTokenByHash(tokenHash);
  const now = deps.now();

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= now) {
    throw new InvalidResetTokenError();
  }

  const passwordHash = await deps.hashPassword(input.password, BCRYPT_SALT_ROUNDS);

  await deps.updatePasswordAndConsumeToken({
    userId: resetToken.userId,
    tokenId: resetToken.id,
    passwordHash,
    usedAt: now,
  });
}
