import Image from "next/image";

const process = [
  {
    title: "Think through the problem",
    description: "Find the right problems, talk to users, and turn ambiguity into clarity.",
    art: "problem",
  },
  {
    title: "Design the experience",
    description: "Create intuitive, polished experiences that people enjoy using.",
    art: "design",
  },
  {
    title: "Build & refine",
    description: "Bring designs to life, iterate fast, and ship real products.",
    art: "build",
  },
] as const;

function ProcessArt({ kind }: { kind: (typeof process)[number]["art"] }) {
  if (kind === "problem") {
    return (
      <div className="process-art process-art-problem" aria-hidden="true">
        <div className="process-note">
          <span>User needs</span>
          <span>Business goals</span>
          <span>Technical scope</span>
        </div>
        <svg className="process-bulb" viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <path d="M27 50c0-7-11-10-11-25C16 11 27 2 40 2s24 9 24 23c0 15-11 18-11 25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M28 53h24M30 61h20M34 68h12M40 32v20m-9-15 9 7 9-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 21 0 19m8-9-4-4m71 15 5-2m-8-9 4-4M40 0v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (kind === "design") {
    return (
      <div className="process-art process-art-design" aria-hidden="true">
        <div className="process-screen">
          <div className="process-screen-top"><i /><i /><i /></div>
          <div className="process-screen-body">
            <span className="process-screen-image" />
            <span className="process-screen-lines"><i /><i /><i /></span>
          </div>
          <div className="process-screen-footer"><i /><i /></div>
        </div>
        <svg className="process-cursor" viewBox="0 0 34 38" fill="none" aria-hidden="true">
          <path d="M2 2v29l8-7 7 12 6-4-7-12 12-2L2 2Z" fill="currentColor" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className="process-art process-art-build" aria-hidden="true">
      <div className="process-terminal">
        <span className="process-terminal-dots"><i /><i /><i /></span>
        <code>
          <span>const idea = design()</span>
          <span>.build()</span>
          <span>.ship();</span>
        </code>
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
          <figcaption>Design.<br />Build.<br />Iterate.<br />Repeat.</figcaption>
        </figure>

        <div className="about-details">
          <p className="about-label">About Darshan</p>
          <h2 id="about-title">I design products<br className="about-desktop-break" /> and build them too.</h2>
          <p className="about-subtitle">From early ideas to usable, shipped experiences.</p>

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
