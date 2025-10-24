"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function HowItWorks() {
  const handleTabClick = (tab: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("analytics", {
          detail: { event: "howitworks_tab_click", tab },
        })
      );
    }
  };

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Two ways to review: Web App or Browser Plugin.
          </p>
        </div>

        <Tabs defaultValue="webapp" className="max-w-8xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="webapp" onClick={() => handleTabClick("webapp")}>
              Web App
            </TabsTrigger>
            <TabsTrigger
              value="plugin"
              onClick={() => handleTabClick("browser_plugin")}
            >
              Browser Plugin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webapp" className="mt-8">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-2xl font-semibold mb-6">
                  Web App — clean reviews, fast approvals
                </h3>
                <ol className="space-y-4 text-base leading-relaxed">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm flex items-center justify-center font-semibold">
                      1
                    </span>
                    <div>
                      <strong>Upload or email invoices</strong> — drag-drop PDFs
                      or forward from your AP inbox.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm flex items-center justify-center font-semibold">
                      2
                    </span>
                    <div>
                      <strong>Auto-extract & check</strong> — math/tax,
                      duplicates, bank changes, and fraud risk in seconds.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm flex items-center justify-center font-semibold">
                      3
                    </span>
                    <div>
                      <strong>Fix exceptions fast</strong> — suggested short-pay
                      or credit-request templates.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm flex items-center justify-center font-semibold">
                      4
                    </span>
                    <div>
                      <strong>Approve & export</strong> — CSV/JSON export or
                      copy-paste into your accounting system.
                    </div>
                  </li>
                </ol>
              </div>
              <div className="glass rounded-2xl p-4">
                {/* Replaced the Image GIF with an autoplaying, muted, looped MP4 for a seamless demo */}
                <video
                  src="/webapp_demo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-auto rounded-xl"
                  aria-label="Web App demo video"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plugin" className="mt-8">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-2xl font-semibold mb-6">
                  Browser Plugin — catch issues right inside your inbox
                </h3>
                <ol className="space-y-4 text-base leading-relaxed">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm flex items-center justify-center font-semibold">
                      1
                    </span>
                    <div>
                      <strong>Review in Gmail/Outlook Web</strong> — the plugin
                      highlights risks on the PDF/email.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm flex items-center justify-center font-semibold">
                      2
                    </span>
                    <div>
                      <strong>One-click capture</strong> — send the invoice to
                      InvoiceQA without leaving your inbox.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm flex items-center justify-center font-semibold">
                      3
                    </span>
                    <div>
                      <strong>Inline checks</strong> — see duplicates, bank
                      changes, and math/tax flags in the sidebar.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm flex items-center justify-center font-semibold">
                      4
                    </span>
                    <div>
                      <strong>Approve or escalate</strong> — push to approvers or
                      export instantly.
                    </div>
                  </li>
                </ol>
              </div>
              <div className="glass rounded-2xl p-4">
                {/* Replaced the GIF with an autoplaying, muted, looped MP4 for the plugin demo */}
                <video
                  src="/plugin_demo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-auto rounded-xl"
                  aria-label="Browser Plugin demo video"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
