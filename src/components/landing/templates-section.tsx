import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function TemplatesSection() {
  const templates = [
    {
      id: "professional",
      name: "Professional",
      description: "Klasik, rapi, cocok untuk industri korporat.",
      preview: (
        <div className="w-full aspect-[1/1.414] bg-white border shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
          <div className="p-4 flex flex-col gap-3 scale-[0.6] origin-top-left w-[166%] h-[166%]">
            <div className="border-b-2 border-slate-800 pb-2 text-center">
              <div className="h-6 bg-slate-800 w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-slate-500 w-1/2 mx-auto" />
            </div>
            <div className="flex gap-4">
              <div className="w-1/3 border-r pr-4">
                <div className="h-4 bg-slate-800 w-1/2 mb-2" />
                <div className="space-y-2">
                  <div className="h-2 bg-slate-300 w-full" />
                  <div className="h-2 bg-slate-300 w-5/6" />
                  <div className="h-2 bg-slate-300 w-4/5" />
                </div>
              </div>
              <div className="w-2/3">
                <div className="h-4 bg-slate-800 w-1/3 mb-2" />
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="h-3 bg-slate-700 w-1/2" />
                      <div className="h-3 bg-slate-400 w-1/4" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-300 w-full" />
                      <div className="h-2 bg-slate-300 w-full" />
                      <div className="h-2 bg-slate-300 w-3/4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="h-3 bg-slate-700 w-2/5" />
                      <div className="h-3 bg-slate-400 w-1/4" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-300 w-full" />
                      <div className="h-2 bg-slate-300 w-4/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "modern",
      name: "Modern",
      description: "Bersih, fokus pada tipografi dan ruang kosong.",
      preview: (
        <div className="w-full aspect-[1/1.414] bg-white border shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
          <div className="p-4 flex flex-col gap-4 scale-[0.6] origin-top-left w-[166%] h-[166%]">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 flex flex-col justify-center">
                <div className="h-6 bg-slate-900 w-2/3 mb-2" />
                <div className="h-3 bg-blue-600 w-1/3" />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-1/3 space-y-4">
                <div>
                  <div className="h-4 bg-blue-600 w-1/2 mb-2" />
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-300 w-full" />
                    <div className="h-2 bg-slate-300 w-5/6" />
                  </div>
                </div>
                <div>
                  <div className="h-4 bg-blue-600 w-2/3 mb-2" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <div className="h-2 bg-slate-300 w-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <div className="h-2 bg-slate-300 w-4/5" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-2/3 space-y-4">
                <div>
                  <div className="h-4 bg-slate-900 w-1/3 mb-2" />
                  <div className="border-l-2 border-slate-200 pl-3 py-1 space-y-3">
                    <div className="relative">
                      <div className="absolute -left-[14px] top-1 w-2 h-2 rounded-full bg-blue-600" />
                      <div className="h-3 bg-slate-800 w-1/2 mb-1" />
                      <div className="h-2 bg-slate-400 w-1/3 mb-2" />
                      <div className="space-y-1">
                        <div className="h-2 bg-slate-300 w-full" />
                        <div className="h-2 bg-slate-300 w-5/6" />
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[14px] top-1 w-2 h-2 rounded-full bg-slate-300" />
                      <div className="h-3 bg-slate-800 w-2/5 mb-1" />
                      <div className="h-2 bg-slate-400 w-1/3 mb-2" />
                      <div className="space-y-1">
                        <div className="h-2 bg-slate-300 w-full" />
                        <div className="h-2 bg-slate-300 w-3/4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Sederhana, to-the-point, sangat ATS-friendly.",
      preview: (
        <div className="w-full aspect-[1/1.414] bg-white border shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
          <div className="p-4 flex flex-col gap-4 scale-[0.6] origin-top-left w-[166%] h-[166%] font-mono">
            <div className="text-center pb-3 border-b border-slate-200">
              <div className="h-5 bg-slate-900 w-1/2 mx-auto mb-2" />
              <div className="flex justify-center gap-3">
                <div className="h-2 bg-slate-500 w-16" />
                <div className="h-2 bg-slate-500 w-20" />
                <div className="h-2 bg-slate-500 w-16" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="h-3 bg-slate-800 w-1/4 mb-2 uppercase tracking-widest" />
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-slate-400 w-full" />
                  <div className="h-1.5 bg-slate-400 w-full" />
                  <div className="h-1.5 bg-slate-400 w-2/3" />
                </div>
              </div>

              <div>
                <div className="h-3 bg-slate-800 w-1/3 mb-2 uppercase tracking-widest" />
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="h-2.5 bg-slate-700 w-1/3" />
                      <div className="h-2.5 bg-slate-500 w-1/5" />
                    </div>
                    <div className="h-2 bg-slate-500 w-1/4 mb-1.5" />
                    <div className="space-y-1 pl-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-slate-400" />
                        <div className="h-1.5 bg-slate-400 w-full" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-slate-400" />
                        <div className="h-1.5 bg-slate-400 w-5/6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="h-3 bg-slate-800 w-1/4 mb-2 uppercase tracking-widest" />
                <div className="flex gap-2">
                  <div className="h-2 bg-slate-600 w-16 rounded-sm" />
                  <div className="h-2 bg-slate-600 w-20 rounded-sm" />
                  <div className="h-2 bg-slate-600 w-14 rounded-sm" />
                  <div className="h-2 bg-slate-600 w-24 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Template ATS-Friendly
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Desain yang telah diuji untuk lolos seleksi mesin ATS tanpa mengorbankan estetika profesional.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
              <div className="p-4 bg-slate-50">
                {template.preview}
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex justify-between items-center">
                  {template.name}
                  <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
