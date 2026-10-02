import Image from "next/image";
import { ProjectCard } from "@/components/ProjectsSection";
import { CursorFillLabel } from "@/components/CursorFillLabel";
import { funProjects, type Project } from "@/data/projects";
import site from "@/content/site.json";

export function FunProjectsSection({ items = funProjects, content = site }: { items?: Project[]; content?: typeof site }) {
  return (
    <section className="fun-page" aria-labelledby="fun-title">
      <header className="fun-intro">
        <p className="fun-kicker">{content.fun.kicker}</p>
        <h1 id="fun-title">{content.fun.headline}</h1>
        <p className="fun-summary">
          {content.fun.summary}
        </p>
      </header>

      <div className="project-grid fun-project-grid">
        {items.map((project) => project.slug === "signspeak" ? (
        <article
          id="project-signspeak"
          className="project-card fun-project-card--signspeak"
          key={project.slug}
        >
          <a
            className="project-card-link"
            href={project.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.linkLabel}: ${project.title}`}
          >
            <div className="project-media fun-project-media--contain">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
              <CursorFillLabel>{content.work.buttonLabel}</CursorFillLabel>
            </div>
            <div className="project-caption fun-project-caption">
              <h3>
                {project.title}
                <span className="fun-project-tag">{project.status}</span>
              </h3>
              <p>
                <span>{project.category}</span>
                <span aria-hidden="true">•</span>
                <span>{project.year}</span>
              </p>
            </div>
          </a>
        </article>
        ) : (
          <ProjectCard project={project} buttonLabel={content.work.buttonLabel} pendingLabel={content.work.pendingLabel} key={project.slug} />
        ))}
      </div>
    </section>
  );
}
