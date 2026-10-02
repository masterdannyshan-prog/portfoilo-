"use client";

import { useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import site from "@/content/site.json";

export function SiteHeader({ content = site }: { content?: typeof site }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const onWork = pathname === "/" || pathname.startsWith("/projects/");
  const onFun = pathname === "/fun";
  const [workLink, funLink, aboutLink, resumeLink] = content.header.links;
  const resumeHref = resumeLink.href;

  return (
    <header className="site-header">
      <Link className="identity" href="/" aria-label={content.header.homeAriaLabel}>
        <span className="identity-name">{content.header.name}</span>
        <span className="identity-role">{content.header.role}</span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <Link className={onWork ? "is-active" : undefined} href={workLink.href}>{workLink.label}</Link>
        <Link className={onFun ? "is-active" : undefined} href={funLink.href}>{funLink.label}</Link>
        <Link href={aboutLink.href}>{aboutLink.label}</Link>
        <a href={resumeHref} target="_blank" rel="noopener noreferrer">{resumeLink.label}</a>
      </nav>

      <div className="availability" aria-label={content.header.availabilityAriaLabel}>
        <span className="availability-mark" aria-hidden="true" />
        <span>{content.header.availability}</span>
      </div>

      <button
        className="menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((value) => !value)}
      >
        {menuOpen ? (
          <XIcon size={22} weight="regular" aria-hidden="true" />
        ) : (
          <ListIcon size={22} weight="regular" aria-hidden="true" />
        )}
      </button>

      <nav
        id="mobile-navigation"
        className={`mobile-nav${menuOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
      >
        <Link href={workLink.href} onClick={() => setMenuOpen(false)}>{workLink.label}</Link>
        <Link href={funLink.href} onClick={() => setMenuOpen(false)}>{funLink.label}</Link>
        <Link href={aboutLink.href} onClick={() => setMenuOpen(false)}>{aboutLink.label}</Link>
        <a href={resumeHref} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>{resumeLink.label}</a>
      </nav>
    </header>
  );
}
