import Image from "next/image";
import { siCursor, siDavinciresolve, siFramer } from "simple-icons";

import site from "@/content/site.json";


function GraduationIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="m3 17 21-9 21 9-21 9L3 17Z" fill="currentColor" />
      <path d="M11 22v10c8 6 18 6 26 0V22M42 19v13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="42" cy="35" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function BackgroundSection({ content = site }: { content?: typeof site }) {
  const { experience, education, tools } = content.background;
  return (
    <section id="background" className="background-section" aria-labelledby="background-title">
      <div className="background-block background-work">
        <p className="background-label">{experience.label}</p>
        <h2 id="background-title">{experience.headline}</h2>
        <p className="background-intro">{experience.intro}</p>

        <div className="experience-list">
          {experience.items.map((item) => (
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
        <p className="background-label">{education.label}</p>
        <div className="education-list">
          {education.items.map((item) => (
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
        <p className="background-label">{tools.label}</p>
        <h2>{tools.headline}</h2>
        <p className="background-intro">{tools.intro}</p>
        <ul className="tools-grid" aria-label={tools.ariaLabel}>
          {tools.items.map((tool) => (
            <li className="tool-card" key={tool.name}>
              <span className={`tool-mark tool-mark-${tool.className}`} aria-hidden="true">
                {"logo" in tool && tool.logo ? (
                  <Image src={tool.logo} alt="" width={48} height={48} className="tool-logo" />
                ) : "mark" in tool && tool.mark ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={{ framer: siFramer.path, davinci: siDavinciresolve.path, cursor: siCursor.path }[tool.mark] || ""} /></svg>
                ) : (
                  null
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
