import { CheckCircle2 } from "lucide-react";

const items = [
  {
    title: "Math & tax validation",
    desc: "catches subtotal/total mismatches; supports tax/VAT/GST and multi-currency.",
  },
  {
    title: "Vendor verification",
    desc: "extracts and checks vendor details (tax IDs, addresses); flags missing or risky data.",
  },
  {
    title: "Fuzzy duplicate detection",
    desc: "finds near-duplicates across invoice # variants, amounts, currencies, and dates.",
  },
  {
    title: "Bank-detail change defense",
    desc: "validates routing/IBAN/account formats; spots new or risky bank countries.",
  },
  {
    title: "Invoice fraud risk signals (BEC)",
    desc: "flags reply-to/domain mismatches, urgent language, and unusual payment terms.",
  },
  {
    title: "PO/receipt matching (CSV)",
    desc: "run 2-/3-way variances without a heavy ERP; price/qty/UOM/tax checks.",
  },
  {
    title: "Approval shortcuts",
    desc: "Slack/Teams micro-approvals with thresholds and “short-pay/request-credit” suggestions.",
  },
  {
    title: "Vendor statement reconciliation",
    desc: "upload a statement to find missing, over-, or short-paid invoices.",
  },
  {
    title: "FX & rounding sanity checks",
    desc: "highlights unusual FX spreads and line-vs-total rounding drift.",
  },
  {
    title: "E-invoicing readiness",
    desc: "validates e-doc fields (e.g., UBL/Peppol where available) for smoother downstream posting.",
  },
];

export function WhatItChecks() {
  return (
    <section id="what-it-checks" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          What InvoiceQA checks
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          From obvious math mistakes to subtle fraud risks — all in one review.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex gap-3 rounded-2xl border bg-background/60 p-5 shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium leading-tight">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
