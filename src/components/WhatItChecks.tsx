"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calculator,
  Building2,
  Copy,
  Landmark,
  ShieldAlert,
  FileCheck,
  MessageSquare,
  FileSpreadsheet,
  TrendingUp,
  FileCode,
} from "lucide-react";

const items = [
  {
    icon: Calculator,
    title: "Math & tax validation",
    technicalDesc:
      "catches subtotal/total mismatches; supports tax/VAT/GST and multi-currency",
    benefit: "so you can avoid overpayments and tax compliance issues.",
  },
  {
    icon: Building2,
    title: "Vendor verification",
    technicalDesc:
      "extracts and checks vendor details (tax IDs, addresses); flags missing or risky data",
    benefit: "so you can verify you're paying legitimate suppliers.",
  },
  {
    icon: Copy,
    title: "Fuzzy duplicate detection",
    technicalDesc:
      "finds near-duplicates across invoice # variants, amounts, currencies, and dates",
    benefit: "so you can prevent paying the same invoice twice.",
  },
  {
    icon: Landmark,
    title: "Bank-detail change defense",
    technicalDesc:
      "validates routing/IBAN/account formats; spots new or risky bank countries",
    benefit:
      "so you can confidently pay suppliers without fear of payment diversion fraud.",
  },
  {
    icon: ShieldAlert,
    title: "Invoice fraud risk signals (BEC)",
    technicalDesc:
      "flags reply-to/domain mismatches, urgent language, and unusual payment terms",
    benefit:
      "so you can catch business email compromise attacks before they cost you.",
  },
  {
    icon: FileCheck,
    title: "PO/receipt matching (CSV)",
    technicalDesc:
      "run 2-/3-way variances without a heavy ERP; price/qty/UOM/tax checks",
    benefit:
      "so you can ensure you only pay for what you actually ordered and received.",
  },
  {
    icon: MessageSquare,
    title: "Approval shortcuts",
    technicalDesc:
      "Slack/Teams micro-approvals with thresholds and short-pay/request-credit suggestions",
    benefit: "so you can accelerate approvals and keep your team in the flow.",
  },
  {
    icon: FileSpreadsheet,
    title: "Vendor statement reconciliation",
    technicalDesc:
      "upload a statement to find missing, over-, or short-paid invoices",
    benefit:
      "so you can maintain accurate vendor relationships and avoid disputes.",
  },
  {
    icon: TrendingUp,
    title: "FX & rounding sanity checks",
    technicalDesc:
      "highlights unusual FX spreads and line-vs-total rounding drift",
    benefit: "so you can spot currency manipulation and calculation errors.",
  },
  {
    icon: FileCode,
    title: "E-invoicing readiness",
    technicalDesc:
      "validates e-doc fields (e.g., UBL/Peppol where available) for smoother posting",
    benefit:
      "so you can seamlessly transition to modern e-invoicing standards.",
  },
];

export function WhatItChecks() {
  const [clickedCard, setClickedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const isInView =
        rect.top < window.innerHeight && rect.bottom > 0;

      // Reset clicked card when scrolling out of view
      if (!isInView && clickedCard) {
        setClickedCard(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [clickedCard]);

  const handleCardClick = (title: string) => {
    setClickedCard((prev) => (prev === title ? null : title));
  };

  const isExpanded = (title: string) => {
    return clickedCard === title || hoveredCard === title;
  };

  return (
    <section
      ref={sectionRef}
      id="what-it-checks"
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What InvoiceQA checks
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From obvious math mistakes to subtle fraud risks — all in one
            review.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((it) => (
            <div
              key={it.title}
              className="glass rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleCardClick(it.title)}
              onMouseEnter={() => setHoveredCard(it.title)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <it.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{it.title}</h3>
                  <div
                    className={`text-sm text-muted-foreground transition-all duration-300 overflow-hidden ${
                      isExpanded(it.title)
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="mb-2">{it.technicalDesc}</p>
                  </div>
                  <p className="text-sm text-foreground/80 font-medium">
                    {it.benefit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
