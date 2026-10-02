import { ContactCta } from "@/components/ContactCta";
import site from "@/content/site.json";

export function ContactSection({ content = site }: { content?: typeof site }) {
  return (
    <footer id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="contact-grid">
        <p className="contact-label">{content.contact.label}</p>

        <div className="contact-content">
          <h2 id="contact-title">{content.contact.headline}</h2>
          <p>{content.contact.description}</p>
          <ContactCta email={content.contact.email} label={content.contact.buttonLabel} />
          <p className="contact-email">{content.contact.email}</p>
        </div>
      </div>

      <div className="contact-bottom">
        <p>{content.contact.credit}</p>
        <nav aria-label="Profile and resume links">
          {content.contact.links.map((link) => (
            <a href={link.href} target="_blank" rel="noopener noreferrer" key={link.label}>{link.label}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
