"use client";

import Image from "next/image";
import { useState } from "react";
import { trackDemoOpen, trackEvent } from "@/lib/analytics";

const webAppSteps = [
  "Upload or email invoices — drag-drop PDFs or forward from your AP inbox.",
  "Auto-extract & check — math/tax, duplicates, bank changes, and fraud risk in seconds.",
  "Fix exceptions fast — suggested short-pay or credit-request templates.",
  "Approve & export — CSV/JSON export or copy-paste into your accounting system.",
];

const pluginSteps = [
  "Review in Gmail/Outlook Web — the plugin highlights risks on the PDF/email.",
  "One-click capture — send the invoice to InvoiceQA without leaving your inbox.",
  "Inline checks — see duplicates, bank changes, and math/tax flags in the sidebar.",
  "Approve or escalate — push to approvers or export instantly.",
];

type TabValue = "webapp" | "browser_plugin";

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<TabValue>("webapp");

  const handleTabChange = (value: TabValue) => {
    setActiveTab(value);
    trackEvent("howitworks_tab_click", { tab: value });
  };

  const steps = activeTab === "webapp" ? webAppSteps : pluginSteps;
  const imageSrc =
    activeTab === "webapp"
      ? "/placeholder-webapp.png"
      : "/placeholder-extension.png";
  const imageAlt =
    activeTab === "webapp"
      ? "InvoiceQA web app preview"
      : "InvoiceQA browser plugin preview";

  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              How it works
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Two ways to review: Web App for deep dives or the Browser Plugin for in-inbox triage.
            </p>
          </div>
          <button
            type="button"
            onClick={trackDemoOpen}
            className="self-start text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Demo preview (coming soon)
          </button>
        </div>

        <div className="mt-8">
          <div className="inline-flex rounded-full border bg-background p-1 text-sm font-medium shadow-sm">
            <button
              type="button"
              onClick={() => handleTabChange("webapp")}
              className={`rounded-full px-5 py-2 transition-colors ${
                activeTab === "webapp"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Web App
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("browser_plugin")}
              className={`rounded-full px-5 py-2 transition-colors ${
                activeTab === "browser_plugin"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Browser Plugin
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <h3 className="text-xl font-semibold md:text-2xl">
              {activeTab === "webapp"
                ? "Web App — clean reviews, fast approvals"
                : "Browser Plugin — catch issues right inside your inbox"}
            </h3>
            <ol className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="font-semibold text-primary">{index + 1}.</span>
                  <span className="text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl border bg-muted/30 p-4">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1200}
              height={800}
              className="h-auto w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
