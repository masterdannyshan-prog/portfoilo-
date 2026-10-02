"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";

export function ContactCta({ email, label }: { email: string; label: string }) {
  return (
    <a
      className="contact-cta"
      href={`mailto:${email}`}
    >
      <span className="contact-cta-content">
        {label}
        <ArrowUpRightIcon size={18} weight="regular" aria-hidden="true" />
      </span>
    </a>
  );
}
