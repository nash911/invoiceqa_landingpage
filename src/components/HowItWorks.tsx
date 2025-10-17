import { Upload, CheckCircle, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload or Connect",
    description:
      "Upload invoices directly or connect your Gmail/Google Drive for automatic processing.",
  },
  {
    icon: CheckCircle,
    title: "Instant Validation",
    description:
      "Our AI checks math, taxes, vendor IDs, due dates, and flags any issues in seconds.",
  },
  {
    icon: Download,
    title: "Export & Integrate",
    description:
      "Download validated results as CSV/JSON and integrate seamlessly with your accounting software.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to error-free invoices
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 -z-10 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {index + 1}. {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

