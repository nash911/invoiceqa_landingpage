import { Search, FileText, Zap, Brain, Upload } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Math & Tax Validation",
    description:
      "Flags math & tax mismatches before posting, ensuring accuracy in every calculation.",
  },
  {
    icon: FileText,
    title: "Vendor Verification",
    description:
      "Validates vendor VAT / tax IDs and duplicate invoice numbers to prevent fraud.",
  },
  {
    icon: Zap,
    title: "Gmail & Drive Integration",
    description:
      "Works right from Gmail & Google Drive (extension) or simple upload for seamless workflow.",
  },
  {
    icon: Brain,
    title: "Multi-language Support",
    description:
      "Multi-language & multi-currency normalization handles invoices from anywhere.",
  },
  {
    icon: Upload,
    title: "Export Ready",
    description:
      "Export results to CSV/JSON (Xero/QuickBooks-friendly) for easy integration.",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to validate invoices
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive invoice checking that saves time and prevents costly
            errors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

