"use client";

import { Moon, Sun, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const scrollToSection = (id: string, eventName: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Fire analytics event
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("analytics", {
          detail: { event: eventName },
        })
      );
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" aria-label="Go to home" className="inline-block">
              <Image
                src="/brand/logo.svg"
                alt="InvoiceQA"
                width={180}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() =>
                scrollToSection("what-it-checks", "nav_what_it_checks_click")
              }
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              What it checks
            </button>
            <button
              onClick={() => scrollToSection("how-it-works", "nav_how_it_works_click")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("about", "nav_about_click")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <a
              href="mailto:taranukaab@gmail.com"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("analytics", {
                      detail: { event: "nav_contact_click" },
                    })
                  );
                }
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>Contact</span>
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </nav>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
