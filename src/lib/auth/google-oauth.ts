import { prisma } from "@/lib/prisma";

type GoogleProfileInput = {
  email: string;
  name?: string | null;
  image?: string | null;
};

type OAuthUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

type GoogleOAuthDeps = {
  findByEmail: (email: string) => Promise<OAuthUser | null>;
  createUser: (data: {
    email: string;
    name: string | null;
    image: string | null;
    password: null;
  }) => Promise<OAuthUser>;
};

const defaultDeps: GoogleOAuthDeps = {
  findByEmail: (email) =>
    prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, image: true },
    }),
  createUser: (data) =>
    prisma.user.create({
      data,
      select: { id: true, name: true, email: true, image: true },
    }),
};

export async function findOrCreateGoogleUser(
  input: GoogleProfileInput,
  deps: GoogleOAuthDeps = defaultDeps,
): Promise<OAuthUser> {
  const normalizedEmail = input.email.toLowerCase();
  const existingUser = await deps.findByEmail(normalizedEmail);

  if (existingUser) {
    return existingUser;
  }

  return deps.createUser({
    email: normalizedEmail,
    name: input.name ?? null,
    image: input.image ?? null,
    password: null,
  });
}
