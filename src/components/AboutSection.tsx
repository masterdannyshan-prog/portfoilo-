import Image from "next/image";

const process = [
  {
    title: "Understand the problem",
    description: "I define the goal, explore users’ needs, and map out what the product needs to do.",
    art: "problem",
  },
  {
    title: "Shape the experience",
    description: "I organize the flows, structure the content, and create interfaces that feel easy to use.",
    art: "design",
  },
  {
    title: "Refine the details",
    description: "I review the design, improve what feels unclear, and make each screen consistent and polished.",
    art: "refine",
  },
] as const;

function ProcessArt({ kind }: { kind: (typeof process)[number]["art"] }) {
  if (kind === "problem") {
    return (
      <div className="process-art process-art-problem" aria-hidden="true">
        <div className="research-note research-note-goal">
          <span className="research-note-label">Business goal</span>
          <span>Make it simpler</span>
        </div>
        <div className="research-note research-note-need">
          <span className="research-note-label">User need</span>
          <span>Find the next step</span>
        </div>
        <div className="research-note research-note-question">
          <span className="research-note-label">Question</span>
          <span>What feels unclear?</span>
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
        <span className="refine-card-label">Before</span>
        <span className="refine-card-title" />
        <span className="refine-card-copy" />
        <span className="refine-card-button" />
      </div>
      <div className="refine-card refine-card-after">
        <span className="refine-card-label">After</span>
        <span className="refine-card-title" />
        <span className="refine-card-copy" />
        <span className="refine-card-button" />
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="about-content">
        <figure className="about-portrait">
          <Image
            src="/images/profile/darshan-profile.png"
            alt="Darshan, UI/UX designer, photographed outdoors"
            fill
            sizes="(max-width: 760px) calc(100vw - 40px), 32vw"
          />
        </figure>

        <div className="about-details">
          <p className="about-label">About Darshan</p>
          <h2 id="about-title">I design products and bring them to life.</h2>
          <p className="about-subtitle">
            I take ideas through research, UX decisions, and Figma design, then work with AI-assisted development to turn them into usable, launched products.
          </p>

          <div className="process-grid" aria-label="How Darshan works">
            {process.map((step) => (
              <article className="process-card" key={step.title}>
                <ProcessArt kind={step.art} />
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
