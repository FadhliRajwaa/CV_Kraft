import { z } from "zod";

const emailField = z.email("Email tidak valid").transform((value) => value.toLowerCase());
const passwordField = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .max(72, "Password terlalu panjang");

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi"),
  email: emailField,
  password: passwordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const passwordResetRequestSchema = z.object({
  email: emailField,
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().trim().min(1, "Token reset tidak valid"),
  password: passwordField,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>;
