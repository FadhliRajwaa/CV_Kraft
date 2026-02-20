import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import type { LoginInput } from "@/lib/validations/auth";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Email atau password salah");
    this.name = "InvalidCredentialsError";
  }
}

type AuthenticatedUser = {
  id: string;
  name: string | null;
  email: string;
  password: string | null;
};

type LoginDeps = {
  findByEmail: (email: string) => Promise<AuthenticatedUser | null>;
  comparePassword: (plain: string, hashed: string) => Promise<boolean>;
};

const DUMMY_PASSWORD_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEeOQ6QfQvQ4wQ2X2gYdExgkt1PyfuzMdG";

const defaultDeps: LoginDeps = {
  findByEmail: (email) =>
    prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    }),
  comparePassword: (plain, hashed) => bcrypt.compare(plain, hashed),
};

type LoginResult = {
  id: string;
  name: string | null;
  email: string;
};

export async function loginUser(
  input: LoginInput,
  deps: LoginDeps = defaultDeps,
): Promise<LoginResult> {
  const user = await deps.findByEmail(input.email);

  const passwordHash = user?.password ?? DUMMY_PASSWORD_HASH;
  const passwordValid = await deps.comparePassword(input.password, passwordHash);

  if (!user || !user.password || !passwordValid) {
    throw new InvalidCredentialsError();
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
