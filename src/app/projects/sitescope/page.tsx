import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteScopeHeroVideo } from "@/components/SiteScopeHeroVideo";
import { siteScopeCaseStudy, type SiteScopeMedia, type SiteScopeSection } from "@/data/sitescope-case-study";

export const metadata: Metadata = {
  title: "SiteScope Case Study | Darshan",
  description:
    "How Darshan designed SiteScope's website audit experience and directed its implementation with Claude Code.",
};

const chapters = [
  "Overview",
  "The Problem",
  "Research Direction",
  "Design System",
  "The Process",
  "Implementation with Claude Code",
  "UX Decisions Made",
  "Final Designs",
  "Limitations and Next Steps",
];

function sectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function MediaSlot({ label }: { label: string }) {
  return (
    <div className="case-media-slot" role="img" aria-label={label}>
      <span>{label}</span>
    </div>
  );
}

function CaseMedia({ media }: { media: SiteScopeMedia }) {
  if (media.src && media.width && media.height) {
    const isProblemWorkflow = media.src.includes("problem-workflow");

    return (
      <Image
        className="case-media-image"
        src={media.src}
        width={media.width}
        height={media.height}
        alt={media.label}
        sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1200px) 75vw, 960px"
        loading={isProblemWorkflow ? "eager" : "lazy"}
        fetchPriority={isProblemWorkflow ? "high" : "auto"}
        unoptimized={isProblemWorkflow}
      />
    );
  }

  return <MediaSlot label={media.label} />;
}

function SectionContent({ section }: { section: SiteScopeSection }) {
  return (
    <>
      {section.flow ? (
        <ol className="case-process-flow" aria-label="SiteScope design and delivery process">
          {section.flow.map((step) => <li key={step}>{step}</li>)}
        </ol>
      ) : null}

      <div className="case-section-copy">
        {section.title !== "Tools Used"
          ? section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          : null}

        {section.points ? (
          <ul className="case-point-list">
            {section.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
        ) : null}

        {section.title === "Tools Used"
          ? section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          : null}
      </div>

      {section.title === "UX Decisions Made" && section.media ? (
        <div className="case-annotated-list">
          {section.media.map((item) => (
            <figure className="case-annotated-figure" key={item.label}>
              <CaseMedia media={item} />
            </figure>
          ))}
        </div>
      ) : section.media?.length === 1 ? (
        <CaseMedia media={section.media[0]} />
      ) : null}
    </>
  );
}

export default function SiteScopeCaseStudy() {
  return (
    <main className="site-shell case-study-shell">
      <SiteHeader />

      <div className="case-study-page">
        <div className="case-study-layout">
          <aside className="case-study-aside">
            <Link className="case-back" href="/#work">
              <ArrowLeftIcon size={15} weight="regular" aria-hidden="true" />
              <span>Back</span>
            </Link>

            <nav className="case-toc" aria-label="Case study chapters">
              {chapters.map((chapter) => (
                <a href={`#${sectionId(chapter)}`} key={chapter}>{chapter}</a>
              ))}
            </nav>
          </aside>

          <article className="case-study-article">
            <header className="case-hero">
              <div className="case-hero-heading">
                <p className="case-project-label">{siteScopeCaseStudy.sourceLabel}</p>
                <h1>{siteScopeCaseStudy.title}</h1>
                <a
                  className="case-live-link"
                  href="https://sitescope-opal-nine.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Live website</span>
                  <span className="case-live-link-url">sitescope-opal-nine.vercel.app</span>
                  <ArrowUpRightIcon size={17} weight="regular" aria-hidden="true" />
                </a>
              </div>

              <SiteScopeHeroVideo />

              <div className="case-try">
                <h2>Try SiteScope</h2>
                <p>Paste one of these URLs into SiteScope to try an audit. They worked well in my testing, but results and timing can vary.</p>
                <div className="case-try-links">
                  <a href="https://www.apple.com/" target="_blank" rel="noopener noreferrer">Apple</a>
                  <a href="https://www.spacex.com/" target="_blank" rel="noopener noreferrer">SpaceX</a>
                  <a href="https://unity.com/" target="_blank" rel="noopener noreferrer">Unity</a>
                </div>
              </div>
            </header>

            <div className="case-study-sections">
              {siteScopeCaseStudy.sections.map((section) => (
                <section
                  id={sectionId(section.title)}
                  className={[
                    "case-section",
                    section.layout === "rows" ? "case-section--rows" : "",
                    section.layout === "compact" ? "case-section--compact" : "",
                  ].filter(Boolean).join(" ")}
                  key={section.title}
                >
                  <h2>{section.title}</h2>
                  <SectionContent section={section} />
                </section>
              ))}
            </div>

            <footer className="case-study-end">
              <p>SiteScope case study</p>
              <Link href="/#work">Back to selected work</Link>
            </footer>
          </article>

          <div className="case-study-spacer" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}
