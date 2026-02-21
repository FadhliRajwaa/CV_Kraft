import {
  FileText,
  Zap,
  CheckCircle,
  Search,
  LayoutTemplate,
  Globe,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeaturesSection() {
  const features = [
    {
      title: "Guided Form",
      description:
        "Isi data diri dengan mudah melalui form yang terstruktur dan responsif.",
      icon: <FileText className="h-6 w-6 text-primary" aria-hidden="true" />,
    },
    {
      title: "Live Preview",
      description:
        "Lihat hasil akhir CV Anda secara real-time setiap kali ada perubahan.",
      icon: <Zap className="h-6 w-6 text-primary" aria-hidden="true" />,
    },
    {
      title: "ATS Score",
      description:
        "Dapatkan estimasi nilai kelayakan CV Anda untuk sistem ATS otomatis.",
      icon: <CheckCircle className="h-6 w-6 text-primary" aria-hidden="true" />,
    },
    {
      title: "Keyword Match",
      description:
        "Sesuaikan CV Anda dengan kata kunci yang dicari oleh sistem rekrutmen.",
      icon: <Search className="h-6 w-6 text-primary" aria-hidden="true" />,
    },
    {
      title: "Templates",
      description:
        "Pilih dari berbagai template profesional yang disesuaikan dengan kebutuhan Anda.",
      icon: <LayoutTemplate className="h-6 w-6 text-primary" aria-hidden="true" />,
    },
    {
      title: "Multi-bahasa",
      description:
        "Buat CV dalam bahasa Indonesia atau Inggris sesuai dengan preferensi Anda.",
      icon: <Globe className="h-6 w-6 text-primary" aria-hidden="true" />,
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Fitur Lengkap untuk Karir Anda
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Semua yang Anda butuhkan untuk membuat CV yang profesional, ATS-friendly, dan menonjol.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-start border-none shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
