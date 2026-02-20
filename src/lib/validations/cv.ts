import { z } from "zod";

const optionalUrlField = z.union([z.literal(""), z.url("URL tidak valid")]).default("");

export const cvPersonalInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Nama lengkap wajib diisi")
    .max(120, "Nama lengkap terlalu panjang"),
  email: z
    .string()
    .trim()
    .email("Email tidak valid")
    .max(254, "Email terlalu panjang")
    .transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .trim()
    .min(1, "Nomor telepon wajib diisi")
    .max(30, "Nomor telepon terlalu panjang"),
  address: z.string().trim().max(200, "Alamat terlalu panjang").optional().default(""),
  linkedIn: optionalUrlField,
  portfolio: optionalUrlField,
});

export const cvSummarySchema = z.object({
  summary: z
    .string()
    .trim()
    .min(1, "Ringkasan wajib diisi")
    .max(1000, "Ringkasan terlalu panjang"),
});

export type CvPersonalInfoInput = z.input<typeof cvPersonalInfoSchema>;
export type CvPersonalInfoOutput = z.output<typeof cvPersonalInfoSchema>;
export type CvSummaryInput = z.input<typeof cvSummarySchema>;
