import Image from "next/image";
import { siClaude, siCursor, siDavinciresolve, siFigma, siFramer } from "simple-icons";

const experience = [
  {
    period: "May 2025 - April 2026",
    role: "UI/UX Designer",
    company: "Purple Merit",
    logo: "/images/companies/purple-merit.jpg",
    detail: "Moved from intern to full-time designer, owning product flows, interface systems, and handoff across web and mobile work.",
  },
  {
    period: "August 2024 - November 2024",
    role: "Junior Designer",
    company: "Excrin Digital Lab",
    logo: "/images/companies/excrin-digital-lab.jpg",
    detail: "Designed responsive client websites and visual assets while working closely with the wider creative team.",
  },
];

const education = [
  {
    period: "2023 - 2025",
    course: "UI/UX & Graphic Design Certification",
    school: "Image Creative Education",
    detail: "Formal training in UI/UX and graphic design.",
  },
  {
    period: "2020 - 2023",
    course: "Bachelor of Commerce",
    school: "University of Madras",
    detail: "Undergraduate degree in commerce.",
  },
];

const tools = [
  { name: "Figma", use: "UI/UX design & prototyping", className: "figma", mark: siFigma.path },
  { name: "Photoshop", use: "Image editing & composites", className: "photoshop", initials: "Ps" },
  { name: "Illustrator", use: "Illustration & graphics", className: "illustrator", initials: "Ai" },
  { name: "Framer", use: "Web design & development", className: "framer", mark: siFramer.path },
  { name: "After Effects", use: "Motion graphics & video", className: "after-effects", initials: "Ae" },
  { name: "DaVinci Resolve", use: "Video editing & color", className: "davinci", mark: siDavinciresolve.path },
  { name: "Cursor", use: "AI-powered development", className: "cursor", mark: siCursor.path },
  { name: "Claude AI", use: "Research & ideation", className: "claude", mark: siClaude.path },
];

function GraduationIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="m3 17 21-9 21 9-21 9L3 17Z" fill="currentColor" />
      <path d="M11 22v10c8 6 18 6 26 0V22M42 19v13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="42" cy="35" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function BackgroundSection() {
  return (
    <section id="background" className="background-section" aria-labelledby="background-title">
      <div className="background-block background-work">
        <p className="background-label">Experience</p>
        <h2 id="background-title">Where I&apos;ve worked</h2>
        <p className="background-intro">I&apos;ve worked with teams on real products and learned at every step.</p>

        <div className="experience-list">
          {experience.map((item) => (
            <article className="experience-row" key={item.company}>
              <div className="experience-logo">
                <Image src={item.logo} alt={`${item.company} logo`} fill sizes="88px" />
              </div>
              <div className="experience-identity">
                <h3>{item.role}</h3>
                <p>{item.company}</p>
                <span>{item.period}</span>
              </div>
              <p className="experience-detail">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="background-block background-education">
        <p className="background-label">Education</p>
        <div className="education-list">
          {education.map((item) => (
            <article className="education-row" key={item.course}>
              <span className="education-icon"><GraduationIcon /></span>
              <div className="education-identity">
                <h3>{item.course}</h3>
                <p>{item.school}</p>
                <span>{item.period}</span>
              </div>
              <p className="education-detail">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="background-block background-tools">
        <p className="background-label">Tools</p>
        <h2>Tools I work with</h2>
        <p className="background-intro">A practical toolkit from design to launch.</p>
        <ul className="tools-grid" aria-label="Design and build tools">
          {tools.map((tool) => (
            <li className="tool-card" key={tool.name}>
              <span className={`tool-mark tool-mark-${tool.className}`} aria-hidden="true">
                {tool.mark ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={tool.mark} /></svg>
                ) : (
                  <span className="tool-initials">{tool.initials}</span>
                )}
              </span>
              <h3>{tool.name}</h3>
              <p>{tool.use}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
