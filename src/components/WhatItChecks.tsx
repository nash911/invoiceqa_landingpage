import { CheckCircle } from "lucide-react";

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
    desc: "Slack/Teams micro-approvals with thresholds and short-pay/request-credit suggestions.",
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
    desc: "validates e-doc fields (e.g., UBL/Peppol where available) for smoother posting.",
  },
];

export function WhatItChecks() {
  return (
    <section id="what-it-checks" className="py-20 bg-muted/30">
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
              className="glass rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">{it.title}</h3>
                  <p className="text-sm text-muted-foreground">{it.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

