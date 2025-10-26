import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar } from "lucide-react";

export default function ThankYouPage() {
  const calendlyUrl =
    process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-link";

  return (
    <div className="min-h-screen flex items-center justify-center grain">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              You&apos;re on the list!
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            Thank you for joining InvoiceQA&apos;s early access program. We&apos;ll
            notify you as soon as we&apos;re ready to help you catch invoice errors
            automatically.
          </p>

          <div className="glass rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">What happens next?</h2>
            <ul className="text-left space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                    1
                  </span>
                </div>
                <span>
                  Check your inbox for a confirmation email (it might take a few
                  minutes)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 dark:text-purple-400 text-sm font-semibold">
                    2
                  </span>
                </div>
                <span>
                  We&apos;ll send you early access credentials when we launch
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-pink-600 dark:text-pink-400 text-sm font-semibold">
                    3
                  </span>
                </div>
                <span>
                  Start validating invoices and catching errors before they cost you
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book a 15-min call
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
