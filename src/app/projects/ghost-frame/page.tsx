import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { SiteHeader } from "@/components/SiteHeader";
import { CaseStudyVideo } from "@/components/SiteScopeHeroVideo";
import {
  ghostFrameCaseStudy,
  type GhostFrameMedia,
  type GhostFrameSection,
} from "@/data/ghost-frame-case-study";

export const metadata: Metadata = {
  title: "Ghost Frame Case Study | Darshan",
  description:
    "How Darshan shaped the UX and visual direction of Ghost Frame, a browser-based image-effects studio.",
};

const chapters = [
  "Overview",
  "The Problem",
  "Research and Product Direction",
  "Design System",
  "Design Process",
  "UX Decisions Made",
  "Motion and Interaction",
  "The Architecture Change",
  "Final Designs",
  "Limitations and Next Steps",
];

function sectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function MediaSlot({
  media,
  mediaType = "image",
}: {
  media: GhostFrameMedia;
  mediaType?: "image" | "video";
}) {
  const hasImage = Boolean(media.src && media.width && media.height);

  if (mediaType === "video" && media.src) {
    return (
      <figure className="case-annotated-figure" data-asset-key={media.assetKey} data-media-type={mediaType}>
        <CaseStudyVideo src={media.src} productName="Ghost Frame" />
        <figcaption>{media.caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="case-annotated-figure" data-asset-key={media.assetKey} data-media-type={mediaType}>
      <div
        className={`case-media-slot${hasImage ? " case-media-slot--image" : ""}`}
        role="img"
        aria-label={media.label}
        style={hasImage ? { aspectRatio: `${media.width} / ${media.height}` } : undefined}
      >
        {hasImage ? (
          <Image
            src={media.src!}
            alt=""
            fill
            sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1200px) 75vw, 960px"
          />
        ) : (
          <span>{media.label}</span>
        )}
      </div>
      <figcaption>{media.caption}</figcaption>
    </figure>
  );
}

function SectionContent({ section }: { section: GhostFrameSection }) {
  return (
    <>
      {section.flow ? (
        <ol className="case-process-flow" aria-label="Ghost Frame design process">
          {section.flow.map((step) => <li key={step}>{step}</li>)}
        </ol>
      ) : null}

      {section.paragraphs ? (
        <div className="case-section-copy">
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      ) : null}

      {section.decisions ? (
        <div className="case-annotated-list">
          {section.decisions.map((decision) => (
            <div className="case-decision" key={decision.heading}>
              <h3>{decision.heading}</h3>
              <p>{decision.explanation}</p>
              <MediaSlot media={decision.media} />
            </div>
          ))}
        </div>
      ) : null}

      {section.media?.length === 1 ? <MediaSlot media={section.media[0]} /> : null}

      {section.media && section.media.length > 1 ? (
        <div className="case-annotated-list">
          {section.media.map((media) => <MediaSlot media={media} key={media.assetKey} />)}
        </div>
      ) : null}

      {section.note ? (
        <div className="case-section-copy">
          <p>{section.note}</p>
        </div>
      ) : null}
    </>
  );
}

export default function GhostFrameCaseStudy() {
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
                <p className="case-project-label">{ghostFrameCaseStudy.sourceLabel}</p>
                <h1>{ghostFrameCaseStudy.title}</h1>
                <p className="case-section-intro">{ghostFrameCaseStudy.description}</p>
                <a
                  className="case-live-link"
                  href="https://ghost-frame-one.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Live website</span>
                  <span className="case-live-link-url">ghost-frame-one.vercel.app</span>
                  <ArrowUpRightIcon size={17} weight="regular" aria-hidden="true" />
                </a>
              </div>

              <MediaSlot media={ghostFrameCaseStudy.heroVideo} mediaType="video" />
            </header>

            <div className="case-study-sections">
              {ghostFrameCaseStudy.sections.map((section) => (
                <section
                  id={sectionId(section.title)}
                  className={`case-section${section.layout === "compact" ? " case-section--compact" : ""}`}
                  key={section.title}
                >
                  <h2>{section.title}</h2>
                  <SectionContent section={section} />
                </section>
              ))}
            </div>

            <footer className="case-study-end">
              <p>Ghost Frame case study</p>
              <Link href="/#work">Back to selected work</Link>
            </footer>
          </article>

          <div className="case-study-spacer" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}
