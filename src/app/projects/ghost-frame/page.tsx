import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { SiteHeader } from "@/components/SiteHeader";
import { ghostFrameCaseStudyText } from "@/data/ghost-frame-case-study";

export const metadata: Metadata = {
  title: "Ghost Frame Case Study | Darshan",
  description:
    "Darshan's complete design and build case study for Ghost Frame, a browser-based image effects studio.",
};

const sectionTitles = [
  "Overview",
  "My Role",
  "Timeline",
  "The Problem",
  "Product Structure",
  "Architecture Pivot",
  "Information Architecture",
  "Visual System",
  "Landing Page",
  "Effects Page",
  "Editor",
  "Effects Library",
  "Responsive Design",
  "Why Canvas API",
  "Supabase",
  "What I'd Do Differently",
  "What Worked",
  "Building With Claude Code",
  "Outcome",
] as const;

type SectionTitle = (typeof sectionTitles)[number];
type CaseSection = { title: SectionTitle; lines: string[] };

function sectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const groups = ghostFrameCaseStudyText.trim().split(/\n{3,}/);
const sections: CaseSection[] = sectionTitles.map((title, index) => ({
  title,
  lines: groups[index].split("\n"),
}));
const closingLine = groups[sectionTitles.length];

const chapters = [
  "Overview",
  "The Problem",
  "Architecture Pivot",
  "Visual System",
  "Landing Page",
  "Effects Page",
  "Editor",
  "Why Canvas API",
  "Outcome",
] as const satisfies readonly SectionTitle[];

const compactSections = new Set<SectionTitle>(["My Role", "Timeline"]);
const rowSections = new Set<SectionTitle>([
  "Product Structure",
  "Architecture Pivot",
  "Visual System",
  "Effects Library",
  "What I'd Do Differently",
  "What Worked",
  "Building With Claude Code",
]);

// Indices refer to lines in the original, unchanged Ghost Frame text.
const pointRanges = new Map<SectionTitle, readonly [number, number]>([
  ["Product Structure", [1, 8]],
  ["Architecture Pivot", [2, 5]],
  ["Visual System", [2, 8]],
  ["Editor", [3, 5]],
  ["Effects Library", [1, 7]],
  ["Building With Claude Code", [3, 8]],
]);

const mediaAfter = new Map<SectionTitle, string[]>([
  ["The Problem", ["Problem context or reference imagery"]],
  ["Architecture Pivot", ["Architecture before and after"]],
  ["Visual System", ["Ghost Frame typography and interface system"]],
  ["Landing Page", ["Landing page video and before-and-after interaction"]],
  ["Effects Page", ["Effects gallery and blinds animation"]],
  ["Editor", ["Editor canvas and controls", "Effect categories and sliders"]],
  ["Why Canvas API", ["Canvas processing or effect comparison"]],
]);

function MediaSlot({ label, square = false }: { label: string; square?: boolean }) {
  return (
    <div
      className={`case-media-slot${square ? " case-media-slot--square" : ""}`}
      role="img"
      aria-label={label}
    >
      <span>{label}</span>
    </div>
  );
}

function SectionLines({ section }: { section: CaseSection }) {
  const blocks = [];
  const pointRange = pointRanges.get(section.title);

  for (let index = 0; index < section.lines.length; index += 1) {
    const line = section.lines[index];

    if (pointRange && index === pointRange[0]) {
      blocks.push(
        <ul className="case-point-list" key={`${section.title}-points`}>
          {section.lines.slice(pointRange[0], pointRange[1]).map((point) => (
            <li key={point}>{point.replace(/^- /, "")}</li>
          ))}
        </ul>,
      );
      index = pointRange[1] - 1;
      continue;
    }

    blocks.push(<p key={`${section.title}-${index}`}>{line}</p>);
  }

  return <div className="case-section-copy">{blocks}</div>;
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
                <a href={`#${sectionId(chapter)}`} key={chapter}>
                  {chapter}
                </a>
              ))}
            </nav>
          </aside>

          <article className="case-study-article">
            <header className="case-hero">
              <div className="case-hero-heading">
                <p className="case-project-label">Product design + build</p>
                <h1>Ghost Frame</h1>
              </div>

              <div className="case-media-slot">
                <Image
                  src="/images/projects/ghost-frame-cover.png"
                  alt="Ghost Frame image effects project cover"
                  width={1600}
                  height={900}
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </header>

            <div className="case-study-sections">
              {sections.map((section) => {
                const media = mediaAfter.get(section.title) ?? [];
                const sectionClasses = [
                  "case-section",
                  rowSections.has(section.title) ? "case-section--rows" : "",
                  compactSections.has(section.title) ? "case-section--compact" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <section
                    id={sectionId(section.title)}
                    className={sectionClasses}
                    key={section.title}
                  >
                    <h2>{section.title}</h2>
                    <SectionLines section={section} />

                    {media.length === 1 ? <MediaSlot label={media[0]} /> : null}

                    {media.length > 1 ? (
                      <div className="case-media-pair">
                        {media.map((label) => (
                          <MediaSlot label={label} square key={label} />
                        ))}
                      </div>
                    ) : null}
                  </section>
                );
              })}
            </div>

            <footer className="case-study-end">
              <p>{closingLine}</p>
              <Link href="/#work">Back to selected work</Link>
            </footer>
          </article>

          <div className="case-study-spacer" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}
