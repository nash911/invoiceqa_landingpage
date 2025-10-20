"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import type { MouseEvent } from "react";
import { trackEvent } from "@/lib/analytics";

const navItems: { label: string; href: string; event: string }[] = [
  { label: "How it works", href: "#how-it-works", event: "nav_how_it_works_click" },
  { label: "What it checks", href: "#what-it-checks", event: "nav_what_it_checks_click" },
  { label: "Contact", href: "#lead-form", event: "nav_contact_click" },
];

export function Header() {
  const handleAnchorClick = useCallback((href: string, eventName: string) => {
    return (event: MouseEvent<HTMLAnchorElement>) => {
      trackEvent(eventName);

      if (href.startsWith("#")) {
        event.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="InvoiceQA home">
          <Image
            src="/brand/logo.svg"
            alt="InvoiceQA"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-base font-semibold tracking-tight">InvoiceQA</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={handleAnchorClick(item.href, item.event)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
