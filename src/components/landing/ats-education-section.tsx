import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function AtsEducationSection() {
  const benefits = [
    "Dibaca dan diproses dengan benar oleh software rekrutmen",
    "Kata kunci yang relevan dengan pekerjaan mudah ditemukan",
    "Format yang bersih tanpa elemen visual yang membingungkan sistem",
    "Menekankan pengalaman dan keahlian inti yang dicari perusahaan",
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
      <div className="container px-4 md:px-6">
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary">
                Edukasi Karir
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Apa itu ATS dan Mengapa Penting?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                ATS (Applicant Tracking System) adalah perangkat lunak yang
                digunakan perusahaan untuk memindai dan menyaring CV secara
                otomatis sebelum dibaca oleh manusia.
              </p>
            </div>
            <ul className="grid gap-2 py-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="group">
                <Link href="/login">
                  Buat CV Gratis Sekarang
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-4 rounded-xl border bg-background p-8 shadow-xl">
            <div className="space-y-2 pb-4 border-b">
              <h3 className="text-2xl font-bold text-center">Simulasi ATS</h3>
              <p className="text-sm text-center text-muted-foreground">
                Bagaimana sistem membaca CV Anda
              </p>
            </div>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Kecocokan Profil</span>
                  <span className="text-sm font-bold text-green-600">85%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-2 w-[85%] rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Keterbacaan Format</span>
                  <span className="text-sm font-bold text-green-600">100%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-2 w-full rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Kata Kunci</span>
                  <span className="text-sm font-bold text-yellow-600">70%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-2 w-[70%] rounded-full bg-yellow-500"></div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-900 mt-4 border border-green-200">
              <strong>Status:</strong> CV Lolos Seleksi Awal. Lanjut ke tahap
              wawancara.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
