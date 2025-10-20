"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

export function Hero() {
  const scrollToElement = (selector: string, eventName?: string) => {
    if (eventName) {
      trackEvent(eventName);
    }

    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-background" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 md:flex-row md:items-stretch">
        <div className="flex w-full flex-col items-start gap-6 text-center md:w-1/2 md:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Never pay a wrong invoice again.
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              InvoiceQA flags errors, fraud risks, and approval blockers before you post to the ledger.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={() => scrollToElement("#lead-form", "hero_cta_click")}
              className="w-full sm:w-auto"
            >
              Join the early access list
            </Button>
            <button
              type="button"
              onClick={() => scrollToElement("#how-it-works")}
              className="w-full text-sm font-medium text-primary underline-offset-4 hover:underline sm:w-auto"
            >
              See how it works
            </button>
          </div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            No sales spam. Early access only.
          </p>
        </div>
        <div className="flex w-full justify-center md:w-1/2 md:justify-end">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-muted/40 p-6 shadow-sm">
            <div className="absolute -top-10 right-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-6 -left-10 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="relative">
              <Image
                src="/placeholder-hero.png"
                alt="InvoiceQA review workspace"
                width={640}
                height={512}
                className="h-auto w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
