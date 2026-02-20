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

export const cvExperienceItemSchema = z
  .object({
    company: z.string().trim().min(1, "Perusahaan wajib diisi").max(120, "Nama perusahaan terlalu panjang"),
    position: z.string().trim().min(1, "Posisi wajib diisi").max(120, "Posisi terlalu panjang"),
    startDate: z.string().trim().min(1, "Tanggal mulai wajib diisi"),
    endDate: z.string().trim().default(""),
    isCurrent: z.boolean().default(false),
    description: z.string().trim().min(1, "Deskripsi wajib diisi").max(2000, "Deskripsi terlalu panjang"),
    achievements: z
      .array(z.string().trim().min(1, "Achievement tidak boleh kosong").max(300, "Achievement terlalu panjang"))
      .max(20, "Achievement maksimal 20 poin")
      .default([]),
  })
  .refine(
    (item) => {
      if (item.isCurrent || item.endDate === "") {
        return true;
      }

      return item.startDate <= item.endDate;
    },
    {
      message: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai",
      path: ["endDate"],
    },
  );

export const cvExperiencesSchema = z.object({
  experiences: z.array(cvExperienceItemSchema).max(50, "Pengalaman maksimal 50 entri"),
});

export type CvPersonalInfoInput = z.input<typeof cvPersonalInfoSchema>;
export type CvPersonalInfoOutput = z.output<typeof cvPersonalInfoSchema>;
export type CvSummaryInput = z.input<typeof cvSummarySchema>;
export type CvExperienceInput = z.input<typeof cvExperienceItemSchema>;
export type CvExperiencesInput = z.input<typeof cvExperiencesSchema>;
