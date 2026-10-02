import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { SiteHeader } from "@/components/SiteHeader";
import site from "@/content/site.json";

export type CaseStudySection = {
  title: string;
  layout?: "compact" | "rows";
};

export type CaseStudyDocument<TSection extends CaseStudySection> = {
  sourceLabel: string;
  title: string;
  description?: string;
  chapters: string[];
  liveLink: { label: string; url: string; display: string };
  footer: { label: string; backLabel: string };
  sections: TSection[];
};

function sectionId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function CaseStudyTemplate<TSection extends CaseStudySection>({
  document,
  heroMedia,
  afterHero,
  renderSection,
  siteContent = site,
}: {
  document: CaseStudyDocument<TSection>;
  heroMedia: ReactNode;
  afterHero?: ReactNode;
  renderSection: (section: TSection) => ReactNode;
  siteContent?: typeof site;
}) {
  return (
    <main className="site-shell case-study-shell">
      <SiteHeader content={siteContent} />
      <div className="case-study-page">
        <div className="case-study-layout">
          <aside className="case-study-aside">
            <Link className="case-back" href={siteContent.caseStudyChrome.backHref}>
              <ArrowLeftIcon size={15} weight="regular" aria-hidden="true" />
              <span>{siteContent.caseStudyChrome.backLabel}</span>
            </Link>
            <nav className="case-toc" aria-label={siteContent.caseStudyChrome.chaptersAriaLabel}>
              {document.chapters.map((chapter) => (
                <a href={`#${sectionId(chapter)}`} key={chapter}>{chapter}</a>
              ))}
            </nav>
          </aside>
          <article className="case-study-article">
            <header className="case-hero">
              <div className="case-hero-heading">
                <p className="case-project-label">{document.sourceLabel}</p>
                <h1>{document.title}</h1>
                {document.description ? <p className="case-section-intro">{document.description}</p> : null}
                {document.liveLink.url ? (
                  <a className="case-live-link" href={document.liveLink.url} target="_blank" rel="noopener noreferrer">
                    <span>{document.liveLink.label}</span>
                    <span className="case-live-link-url">{document.liveLink.display}</span>
                    <ArrowUpRightIcon size={17} weight="regular" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
              {heroMedia}
              {afterHero}
            </header>
            <div className="case-study-sections">
              {document.sections.map((section) => (
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
                  {renderSection(section)}
                </section>
              ))}
            </div>
            <footer className="case-study-end">
              <p>{document.footer.label}</p>
              <Link href={siteContent.caseStudyChrome.backHref}>{document.footer.backLabel}</Link>
            </footer>
          </article>
          <div className="case-study-spacer" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}
