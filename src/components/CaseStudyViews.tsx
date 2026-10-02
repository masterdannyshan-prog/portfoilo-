import Image from "next/image";
import { CaseStudyTemplate } from "@/components/CaseStudyTemplate";
import { CaseStudyVideo } from "@/components/SiteScopeHeroVideo";
import defaultSite from "@/content/site.json";
import {
  siteScopeCaseStudy,
  type SiteScopeMedia,
  type SiteScopeSection,
} from "@/data/sitescope-case-study";
import {
  ghostFrameCaseStudy,
  type GhostFrameMedia,
  type GhostFrameSection,
} from "@/data/ghost-frame-case-study";

type SiteScopeDocument = typeof siteScopeCaseStudy;
type GhostFrameDocument = typeof ghostFrameCaseStudy;

export type StandardCaseStudyMedia = {
  assetKey: string;
  mediaType?: "image" | "video";
  label: string;
  caption?: string;
  src?: string;
  width?: number;
  height?: number;
};

export type StandardCaseStudySection = {
  title: string;
  layout?: "compact" | "rows";
  paragraphs?: string[];
  points?: string[];
  flow?: string[];
  decisions?: {
    heading: string;
    explanation: string;
    media: StandardCaseStudyMedia;
  }[];
  media?: StandardCaseStudyMedia[];
  note?: string;
};

export type StandardCaseStudyDocument = {
  slug: string;
  variant: "standard";
  metadata?: { title?: string; description?: string };
  sourceLabel: string;
  title: string;
  description?: string;
  chapters: string[];
  liveLink: { label: string; url: string; display: string };
  heroMedia: StandardCaseStudyMedia;
  footer: { label: string; backLabel: string };
  sections: StandardCaseStudySection[];
};

function SiteScopeMediaSlot({ label }: { label: string }) {
  return (
    <div className="case-media-slot" role="img" aria-label={label}>
      <span>{label}</span>
    </div>
  );
}

function SiteScopeMediaView({ media }: { media: SiteScopeMedia }) {
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
  return <SiteScopeMediaSlot label={media.label} />;
}

function SiteScopeSectionContent({ section }: { section: SiteScopeSection }) {
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
              <SiteScopeMediaView media={item} />
            </figure>
          ))}
        </div>
      ) : section.media?.length === 1 ? (
        <SiteScopeMediaView media={section.media[0]} />
      ) : null}
    </>
  );
}

export function SiteScopeCaseStudyView({
  document = siteScopeCaseStudy,
  siteContent = defaultSite,
}: {
  document?: SiteScopeDocument;
  siteContent?: typeof defaultSite;
}) {
  return (
    <CaseStudyTemplate
      document={document}
      siteContent={siteContent}
      heroMedia={<CaseStudyVideo src={document.heroVideo.src} productName={document.heroVideo.productName} />}
      afterHero={(
        <div className="case-try">
          <h2>{document.tryBox.title}</h2>
          <p>{document.tryBox.description}</p>
          <div className="case-try-links">
            {document.tryBox.links.map((link) => (
              <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.label}>{link.label}</a>
            ))}
          </div>
        </div>
      )}
      renderSection={(section) => <SiteScopeSectionContent section={section} />}
    />
  );
}

function GhostFrameMediaSlot({
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

function GhostFrameSectionContent({ section }: { section: GhostFrameSection }) {
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
              <GhostFrameMediaSlot media={decision.media} />
            </div>
          ))}
        </div>
      ) : null}
      {section.media?.length === 1 ? <GhostFrameMediaSlot media={section.media[0]} /> : null}
      {section.media && section.media.length > 1 ? (
        <div className="case-annotated-list">
          {section.media.map((media) => <GhostFrameMediaSlot media={media} key={media.assetKey} />)}
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

export function GhostFrameCaseStudyView({
  document = ghostFrameCaseStudy,
  siteContent = defaultSite,
}: {
  document?: GhostFrameDocument;
  siteContent?: typeof defaultSite;
}) {
  return (
    <CaseStudyTemplate
      document={document}
      siteContent={siteContent}
      heroMedia={<GhostFrameMediaSlot media={document.heroVideo} mediaType="video" />}
      renderSection={(section) => <GhostFrameSectionContent section={section} />}
    />
  );
}

function StandardMediaView({ media, productName }: { media: StandardCaseStudyMedia; productName: string }) {
  const hasImage = Boolean(media.src && media.width && media.height);
  if (media.mediaType === "video" && media.src) {
    return (
      <figure className="case-annotated-figure" data-asset-key={media.assetKey} data-media-type="video">
        <CaseStudyVideo src={media.src} productName={productName} />
        {media.caption ? <figcaption>{media.caption}</figcaption> : null}
      </figure>
    );
  }
  return (
    <figure className="case-annotated-figure" data-asset-key={media.assetKey} data-media-type="image">
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
        ) : <span>{media.label}</span>}
      </div>
      {media.caption ? <figcaption>{media.caption}</figcaption> : null}
    </figure>
  );
}

function StandardSectionContent({ section, productName }: { section: StandardCaseStudySection; productName: string }) {
  return (
    <>
      {section.flow ? (
        <ol className="case-process-flow" aria-label={`${productName} design process`}>
          {section.flow.map((step) => <li key={step}>{step}</li>)}
        </ol>
      ) : null}
      {section.paragraphs ? (
        <div className="case-section-copy">
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      ) : null}
      {section.points ? (
        <ul className="case-point-list">
          {section.points.map((point) => <li key={point}>{point}</li>)}
        </ul>
      ) : null}
      {section.decisions ? (
        <div className="case-annotated-list">
          {section.decisions.map((decision) => (
            <div className="case-decision" key={decision.heading}>
              <h3>{decision.heading}</h3>
              <p>{decision.explanation}</p>
              <StandardMediaView media={decision.media} productName={productName} />
            </div>
          ))}
        </div>
      ) : null}
      {section.media?.length === 1 ? <StandardMediaView media={section.media[0]} productName={productName} /> : null}
      {section.media && section.media.length > 1 ? (
        <div className="case-annotated-list">
          {section.media.map((media) => <StandardMediaView media={media} productName={productName} key={media.assetKey} />)}
        </div>
      ) : null}
      {section.note ? <div className="case-section-copy"><p>{section.note}</p></div> : null}
    </>
  );
}

export function StandardCaseStudyView({
  document,
  siteContent = defaultSite,
}: {
  document: StandardCaseStudyDocument;
  siteContent?: typeof defaultSite;
}) {
  return (
    <CaseStudyTemplate
      document={document}
      siteContent={siteContent}
      heroMedia={<StandardMediaView media={document.heroMedia} productName={document.title} />}
      renderSection={(section) => <StandardSectionContent section={section} productName={document.title} />}
    />
  );
}
