import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Zap } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Buat CV ATS-Friendly dalam 15 Menit — Gratis!
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Tingkatkan peluang lolos screening dengan CV yang dioptimalkan untuk sistem ATS (Applicant Tracking System).
              </p>
            </div>

            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/login">Mulai Buat CV →</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div className="font-medium">100% Gratis</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div className="font-medium">ATS Score</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Download className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div className="font-medium">Download PDF</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-[1/1.4] max-w-[400px] rounded-xl border bg-background p-6 shadow-2xl flex flex-col gap-4 overflow-hidden" aria-hidden="true">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Zap className="w-32 h-32" aria-hidden="true" />
              </div>

              {/* Mockup Header */}
              <div className="border-b pb-4">
                <div className="h-6 w-1/2 bg-muted rounded-md mb-2"></div>
                <div className="h-4 w-1/3 bg-muted/50 rounded-md"></div>
                <div className="flex gap-2 mt-3">
                  <div className="h-3 w-16 bg-muted/30 rounded"></div>
                  <div className="h-3 w-16 bg-muted/30 rounded"></div>
                  <div className="h-3 w-16 bg-muted/30 rounded"></div>
                </div>
              </div>

              {/* Mockup Body Content */}
              <div className="space-y-6 flex-1">
                {/* Summary */}
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-primary/20 rounded mb-2"></div>
                  <div className="h-2 w-full bg-muted rounded"></div>
                  <div className="h-2 w-full bg-muted rounded"></div>
                  <div className="h-2 w-3/4 bg-muted rounded"></div>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <div className="h-4 w-32 bg-primary/20 rounded mb-2"></div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3 w-40 bg-muted/80 rounded"></div>
                      <div className="h-3 w-20 bg-muted/50 rounded"></div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded"></div>
                    <div className="h-2 w-5/6 bg-muted rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3 w-36 bg-muted/80 rounded"></div>
                      <div className="h-3 w-20 bg-muted/50 rounded"></div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded"></div>
                    <div className="h-2 w-4/5 bg-muted rounded"></div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-primary/20 rounded mb-2"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-5 w-16 bg-muted/40 rounded-full"></div>
                    <div className="h-5 w-20 bg-muted/40 rounded-full"></div>
                    <div className="h-5 w-14 bg-muted/40 rounded-full"></div>
                    <div className="h-5 w-24 bg-muted/40 rounded-full"></div>
                    <div className="h-5 w-16 bg-muted/40 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
