import Image from "next/image";

const experience = [
  { period: "May 2025 - April 2026", role: "UI/UX Designer", company: "Purple Merit", detail: "Moved from intern to full-time designer, owning product flows, interface systems, and handoff across web and mobile work." },
  { period: "August 2024 - November 2024", role: "Junior Designer", company: "Excrin Digital Lab", detail: "Designed responsive client websites and visual assets while working closely with the wider creative team." },
];

const education = [
  { period: "2023 - 2025", course: "UI/UX & Graphic Design Certification", school: "Image Creative Education" },
  { period: "2020 - 2023", course: "Bachelor of Commerce", school: "University of Madras" },
];

const tools = ["Figma", "Framer", "Photoshop", "Illustrator", "After Effects", "DaVinci Resolve", "Cursor", "Claude AI"];

export function AboutSection() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="about-grid">
        <figure className="about-portrait">
          <Image
            src="/images/profile/darshan-profile.png"
            alt="Darshan, UI/UX designer, photographed outdoors"
            fill
            sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 25vw, 28vw"
          />
          <figcaption>Darshan · Chennai, India</figcaption>
        </figure>

        <div className="about-main">
          <p className="about-label">About Darshan</p>
          <h2 id="about-title">I design products and build them too.</h2>
          <div className="about-copy">
            <p className="about-lede">
              I&apos;m Darshan, a UI/UX designer in Chennai. I turn early ideas
              into clear, useful digital products.
            </p>
            <p>
              Over the last 11 months, I&apos;ve worked across product design,
              visual systems, and frontend execution. Projects such as SiteScope
              and Ghost Frame
              show how I move from Figma to a deployed product.
            </p>
          </div>

          <div className="about-group about-education">
            <h3>Education</h3>
            <div className="about-entry-list">
              {education.map((item) => (
                <div className="about-entry" key={item.course}>
                  <h4>{item.course}</h4>
                  <p>{item.school}</p>
                  <span>{item.period}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="about-side">
          <div className="about-group about-tools">
            <h3>Tools</h3>
            <ul aria-label="Design and build tools">
              {tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
          </div>

          <div className="about-group about-experience">
            <h3>Experience</h3>
            <div className="about-entry-list">
              {experience.map((item) => (
                <div className="about-entry" key={item.company}>
                  <h4>{item.company}</h4>
                  <p>{item.role}</p>
                  <span>{item.period}</span>
                  <p className="about-entry-detail">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="about-group about-focus">
            <h3>Current focus</h3>
            <p>UI/UX Designer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
