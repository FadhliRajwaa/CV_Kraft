import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TemplatesSection } from "@/components/landing/templates-section";
import { AtsEducationSection } from "@/components/landing/ats-education-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
      <FeaturesSection />
      <TemplatesSection />
      <AtsEducationSection />
    </main>
  );
}
