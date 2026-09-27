import { AboutSection } from "@/components/AboutSection";
import { BackgroundSection } from "@/components/BackgroundSection";
import { ContactSection } from "@/components/ContactSection";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <Hero />
      <ProjectsSection />
      <AboutSection />
      <BackgroundSection />
      <ContactSection />
    </main>
  );
}
