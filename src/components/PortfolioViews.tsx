import { AboutSection } from "@/components/AboutSection";
import { BackgroundSection } from "@/components/BackgroundSection";
import { ContactSection } from "@/components/ContactSection";
import { FunProjectsSection } from "@/components/FunProjectsSection";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SiteHeader } from "@/components/SiteHeader";
import publishedSite from "@/content/site.json";
import { projects, funProjects, type Project } from "@/data/projects";

export function HomeView({ site = publishedSite, work = projects }: { site?: typeof publishedSite; work?: Project[] }) {
  return (
    <main className="site-shell">
      <SiteHeader content={site} />
      <Hero content={site} />
      <ProjectsSection items={work} content={site} />
      <AboutSection content={site} />
      <BackgroundSection content={site} />
      <ContactSection content={site} />
    </main>
  );
}

export function FunView({ site = publishedSite, fun = funProjects }: { site?: typeof publishedSite; fun?: Project[] }) {
  return (
    <main className="site-shell">
      <SiteHeader content={site} />
      <FunProjectsSection items={fun} content={site} />
    </main>
  );
}
