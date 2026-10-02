import Image from "next/image";
import site from "@/content/site.json";

function ProcessArt({ kind, content }: { kind: string; content: typeof site }) {
  if (kind === "problem") {
    return (
      <div className="process-art process-art-problem" aria-hidden="true">
        <div className="research-note research-note-goal">
          <span className="research-note-label">{content.about.artLabels.businessGoal}</span>
          <span>{content.about.artLabels.simpler}</span>
        </div>
        <div className="research-note research-note-need">
          <span className="research-note-label">{content.about.artLabels.userNeed}</span>
          <span>{content.about.artLabels.nextStep}</span>
        </div>
        <div className="research-note research-note-question">
          <span className="research-note-label">{content.about.artLabels.question}</span>
          <span>{content.about.artLabels.unclear}</span>
        </div>
      </div>
    );
  }

  if (kind === "design") {
    return (
      <div className="process-art process-art-design" aria-hidden="true">
        <div className="flow-track">
          <div className="flow-screen flow-screen-start">
            <span className="flow-screen-bar" />
            <span className="flow-screen-block" />
            <span className="flow-screen-line" />
          </div>
          <span className="flow-connector" />
          <div className="flow-screen flow-screen-middle">
            <span className="flow-screen-bar" />
            <span className="flow-screen-line" />
            <span className="flow-screen-line flow-screen-line-short" />
            <span className="flow-screen-block" />
          </div>
          <span className="flow-connector" />
          <div className="flow-screen flow-screen-finish">
            <span className="flow-screen-bar" />
            <span className="flow-screen-hero" />
            <span className="flow-screen-line" />
            <span className="flow-screen-button" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="process-art process-art-refine" aria-hidden="true">
      <div className="refine-card refine-card-before">
        <span className="refine-card-label">{content.about.artLabels.before}</span>
        <span className="refine-card-title" />
        <span className="refine-card-copy" />
        <span className="refine-card-button" />
      </div>
      <div className="refine-card refine-card-after">
        <span className="refine-card-label">{content.about.artLabels.after}</span>
        <span className="refine-card-title" />
        <span className="refine-card-copy" />
        <span className="refine-card-button" />
      </div>
    </div>
  );
}

export function AboutSection({ content = site }: { content?: typeof site }) {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="about-content">
        <figure className="about-portrait">
          <Image
            src={content.about.portrait.src}
            alt={content.about.portrait.alt}
            fill
            sizes="(max-width: 760px) calc(100vw - 40px), 32vw"
          />
        </figure>

        <div className="about-details">
          <p className="about-label">{content.about.label}</p>
          <h2 id="about-title">{content.about.headline}</h2>
          <p className="about-subtitle">
            {content.about.subtitle}
          </p>

          <div className="process-grid" aria-label={content.about.processAriaLabel}>
            {content.about.process.map((step) => (
              <article className="process-card" key={step.title}>
                <ProcessArt kind={step.art} content={content} />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
