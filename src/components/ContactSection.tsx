import { ContactCta } from "@/components/ContactCta";

const resumeHref = "/Darshan-UI-UX-Designer-Resume.pdf";
const contactEmail = "darshanmass3007@gmail.com";

export function ContactSection() {
  return (
    <footer id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="contact-grid">
        <p className="contact-label">Contact</p>

        <div className="contact-content">
          <h2 id="contact-title">Let&apos;s work together.</h2>
          <p>
            I&apos;m open to product design and UI/UX roles. If my work fits your
            team, I&apos;d love to hear from you.
          </p>
          <ContactCta email={contactEmail} />
          <p className="contact-email">{contactEmail}</p>
        </div>
      </div>

      <div className="contact-bottom">
        <p>Designed and built by Darshan</p>
        <nav aria-label="Profile and resume links">
          <a href={resumeHref} target="_blank" rel="noopener noreferrer">
            Resume
          </a>
          <a
            href="https://www.linkedin.com/in/darshananandan/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://www.behance.net/darshananandan"
            target="_blank"
            rel="noopener noreferrer"
          >
            Behance
          </a>
          <a
            href="https://github.com/masterdannyshan-prog"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
