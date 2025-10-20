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
    desc: "catches subtotal/total mismatches; supports tax/VAT/GST and multi-currency.",
  },
  {
    icon: Building2,
    title: "Vendor verification",
    desc: "extracts and checks vendor details (tax IDs, addresses); flags missing or risky data.",
  },
  {
    icon: Copy,
    title: "Fuzzy duplicate detection",
    desc: "finds near-duplicates across invoice # variants, amounts, currencies, and dates.",
  },
  {
    icon: Landmark,
    title: "Bank-detail change defense",
    desc: "validates routing/IBAN/account formats; spots new or risky bank countries.",
  },
  {
    icon: ShieldAlert,
    title: "Invoice fraud risk signals (BEC)",
    desc: "flags reply-to/domain mismatches, urgent language, and unusual payment terms.",
  },
  {
    icon: FileCheck,
    title: "PO/receipt matching (CSV)",
    desc: "run 2-/3-way variances without a heavy ERP; price/qty/UOM/tax checks.",
  },
  {
    icon: MessageSquare,
    title: "Approval shortcuts",
    desc: "Slack/Teams micro-approvals with thresholds and short-pay/request-credit suggestions.",
  },
  {
    icon: FileSpreadsheet,
    title: "Vendor statement reconciliation",
    desc: "upload a statement to find missing, over-, or short-paid invoices.",
  },
  {
    icon: TrendingUp,
    title: "FX & rounding sanity checks",
    desc: "highlights unusual FX spreads and line-vs-total rounding drift.",
  },
  {
    icon: FileCode,
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <it.icon className="w-5 h-5 text-white" />
                </div>
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

