const experience = [
  {
    period: "May 2025 - April 2026",
    role: "UI/UX Designer",
    company: "Purple Merit",
    detail:
      "Moved from intern to full-time designer, owning product flows, interface systems, and handoff across web and mobile work.",
  },
  {
    period: "August 2024 - November 2024",
    role: "Junior Designer",
    company: "Excrin Digital Lab",
    detail:
      "Designed responsive client websites and visual assets while working closely with the wider creative team.",
  },
];

const education = [
  {
    period: "2023 - 2025",
    course: "UI/UX & Graphic Design Certification",
    school: "Image Creative Education",
  },
  {
    period: "2020 - 2023",
    course: "Bachelor of Commerce",
    school: "University of Madras",
  },
];

const tools = [
  "Figma",
  "Framer",
  "Photoshop",
  "Illustrator",
  "After Effects",
  "DaVinci Resolve",
  "Cursor",
  "Claude AI",
];

export function BackgroundSection() {
  return (
    <section
      id="background"
      className="background-section"
      aria-labelledby="background-title"
    >
      <h2 id="background-title">Experience, education, and tools.</h2>

      <div className="background-grid">
        <div className="background-group background-experience">
          <h3>Experience</h3>
          <div className="background-list">
            {experience.map((item) => (
              <article className="background-entry" key={item.company}>
                <p className="background-period">{item.period}</p>
                <h4>{item.role}</h4>
                <p className="background-place">{item.company}</p>
                <p className="background-detail">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="background-group background-education">
          <h3>Education</h3>
          <div className="background-list">
            {education.map((item) => (
              <article className="background-entry" key={item.course}>
                <p className="background-period">{item.period}</p>
                <h4>{item.course}</h4>
                <p className="background-place">{item.school}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="background-group background-tools">
          <h3>Tools</h3>
          <ul aria-label="Design and build tools">
            {tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
