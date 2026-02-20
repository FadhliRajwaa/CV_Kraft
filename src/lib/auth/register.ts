import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import type { RegisterInput } from "@/lib/validations/auth";

const BCRYPT_SALT_ROUNDS = 12;

function isPrismaUniqueEmailError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { code?: string; meta?: { target?: unknown } };

  if (maybeError.code !== "P2002") {
    return false;
  }

  const targets = maybeError.meta?.target;
  return Array.isArray(targets) ? targets.includes("email") : true;
}

export class DuplicateEmailError extends Error {
  constructor() {
    super("Email sudah terdaftar");
    this.name = "DuplicateEmailError";
  }
}

type RegisteredUser = {
  id: string;
  name: string | null;
  email: string;
};

type RegisterDeps = {
  findByEmail: (email: string) => Promise<{ id: string } | null>;
  hashPassword: (password: string, rounds: number) => Promise<string>;
  createUser: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<RegisteredUser>;
};

const defaultDeps: RegisterDeps = {
  findByEmail: (email) =>
    prisma.user.findUnique({
      where: { email },
      select: { id: true },
    }),
  hashPassword: (password, rounds) => bcrypt.hash(password, rounds),
  createUser: (data) =>
    prisma.user.create({
      data,
      select: { id: true, name: true, email: true },
    }),
};

export async function registerUser(
  input: RegisterInput,
  deps: RegisterDeps = defaultDeps,
): Promise<RegisteredUser> {
  const existingUser = await deps.findByEmail(input.email);

  if (existingUser) {
    throw new DuplicateEmailError();
  }

  const hashedPassword = await deps.hashPassword(input.password, BCRYPT_SALT_ROUNDS);

  try {
    return await deps.createUser({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });
  } catch (error) {
    if (isPrismaUniqueEmailError(error)) {
      throw new DuplicateEmailError();
    }

    throw error;
  }
}
