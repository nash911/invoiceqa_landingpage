"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export function Hero() {
  const scrollToForm = () => {
    const formElement = document.getElementById("lead-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // Fire analytics event
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("analytics", {
          detail: { event: "hero_cta_click" },
        })
      );
    }
  };

  const scrollToHowItWorks = () => {
    const section = document.getElementById("how-it-works");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grain pt-16">
      {/* Animated gradient blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column: Copy */}
          <div className="text-center lg:text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Never pay a wrong invoice again.
              </span>
            </h1>
            <h2 className="text-xl sm:text-2xl text-muted-foreground">
              InvoiceQA flags errors, fraud risks, and approval blockers before
              you post to the ledger.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={scrollToForm}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Become an Early Adopter
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={scrollToHowItWorks}
                className="hover:bg-muted"
              >
                See how it works
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {/* No sales spam. Early access only. */}
              We&apos;ll only email you when your invite is ready.
            </p>
          </div>

          {/* Right column: Enhanced Invoice Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="glass rounded-xl shadow-2xl p-6 max-w-md w-full">
              <div className="space-y-4">
                {/* Invoice preview with more details */}
                <div className="bg-background/50 rounded-lg p-4 border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Invoice #INV-2024-0417
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Vendor: Acme Corp Ltd
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      <div>Date: 2024-04-15</div>
                      <div className="mt-1">Due: 2024-05-15</div>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-xs text-muted-foreground border-b pb-1">
                      <span>Description</span>
                      <span>Amount</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">Professional Services</span>
                      <span>$1,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">Software License</span>
                      <span>$250.00</span>
                    </div>
                    <div className="flex justify-between border-t pt-1.5">
                      <span>Subtotal</span>
                      <span>$1,250.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (21%)</span>
                      <span>$262.50</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-1.5 mt-1">
                      <span>Total</span>
                      <span>$1,512.50</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Validation results */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">
                    Validation Results
                  </div>
                  <div className="space-y-1.5">
                    <ValidationItem
                      status="success"
                      text="Math totals verified"
                    />
                    <ValidationItem
                      status="success"
                      text="VAT calculation correct"
                    />
                    <ValidationItem
                      status="success"
                      text="Vendor VAT ID valid (NL...)"
                    />
                    <ValidationItem
                      status="success"
                      text="No duplicate found"
                    />
                    <ValidationItem
                      status="success"
                      text="Bank details verified"
                    />
                    <ValidationItem
                      status="warning"
                      text="Due date in 30 days"
                    />
                    <ValidationItem
                      status="success"
                      text="No fraud risk detected"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValidationItem({
  status,
  text,
}: {
  status: "success" | "warning";
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={`w-2 h-2 rounded-full ${
          status === "success" ? "bg-green-500" : "bg-amber-500"
        }`}
      />
      <span className="text-muted-foreground">{text}</span>
    </div>
  );
}
