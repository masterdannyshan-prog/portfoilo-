"use client";

import { useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const onWork = pathname === "/" || pathname.startsWith("/projects/");
  const onFun = pathname === "/fun";
  const resumeHref = "/Darshan-UI-UX-Designer-Resume.pdf";

  return (
    <header className="site-header">
      <Link className="identity" href="/" aria-label="Darshan, home">
        <span className="identity-name">DARSHAN</span>
        <span className="identity-role">UI/UX DESIGNER + BUILDER</span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <Link className={onWork ? "is-active" : undefined} href="/#work">WORK</Link>
        <Link className={onFun ? "is-active" : undefined} href="/fun">FUN</Link>
        <Link href="/#about">ABOUT</Link>
        <a href={resumeHref} target="_blank" rel="noopener noreferrer">RESUME</a>
      </nav>

      <div className="availability" aria-label="Open to work in design roles">
        <span className="availability-mark" aria-hidden="true" />
        <span>Open to Work</span>
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
        <Link href="/#work" onClick={() => setMenuOpen(false)}>WORK</Link>
        <Link href="/fun" onClick={() => setMenuOpen(false)}>FUN</Link>
        <Link href="/#about" onClick={() => setMenuOpen(false)}>ABOUT</Link>
        <a href={resumeHref} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>RESUME</a>
      </nav>
    </header>
  );
}
