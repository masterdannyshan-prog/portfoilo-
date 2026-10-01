import Image from "next/image";
import { ProjectCard } from "@/components/ProjectsSection";
import { CursorFillLabel } from "@/components/CursorFillLabel";
import { funProjects as existingFunProjects, type Project } from "@/data/projects";

const signSpeakProject: Project = {
  slug: "signspeak",
  title: "SignSpeak",
  headline: "Hand signs, spoken aloud",
  category: "Interactive tool",
  status: "Built with Claude Code",
  description:
    "Make a supported hand sign on camera and hear the detected word spoken aloud.",
  role: "Product design + AI-assisted build",
  year: "2026",
  image: "/images/fun/signspeak.png",
  imageAlt:
    "SignSpeak showing a tracked hand, the detected word You, and a list of supported signs",
  layout: "lead",
  href: "https://signspeak-omega.vercel.app/",
  linkLabel: "View SignSpeak project",
};

export function FunProjectsSection() {
  return (
    <section className="fun-page" aria-labelledby="fun-title">
      <header className="fun-intro">
        <p className="fun-kicker">Side quests</p>
        <h1 id="fun-title">Things I make when curiosity takes over.</h1>
        <p className="fun-summary">
          Interactive experiments, motion, posters, and thumbnails that let me
          explore new ways to tell stories and make things useful.
        </p>
      </header>

      <div className="project-grid fun-project-grid">
        <article
          id="project-signspeak"
          className="project-card fun-project-card--signspeak"
        >
          <a
            className="project-card-link"
            href={signSpeakProject.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${signSpeakProject.linkLabel}: ${signSpeakProject.title}`}
          >
            <div className="project-media fun-project-media--contain">
              <Image
                src={signSpeakProject.image}
                alt={signSpeakProject.imageAlt}
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
              <CursorFillLabel>View project</CursorFillLabel>
            </div>
            <div className="project-caption fun-project-caption">
              <h3>
                {signSpeakProject.title}
                <span className="fun-project-tag">{signSpeakProject.status}</span>
              </h3>
              <p>
                <span>{signSpeakProject.category}</span>
                <span aria-hidden="true">•</span>
                <span>{signSpeakProject.year}</span>
              </p>
            </div>
          </a>
        </article>
        {existingFunProjects.map((project) => (
          <ProjectCard project={project} key={project.slug} />
        ))}
      </div>
    </section>
  );
}
