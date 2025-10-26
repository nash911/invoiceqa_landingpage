import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <Button asChild variant="ghost">
            <Link href="/">← Back to home</Link>
          </Button>
        </div>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using InvoiceQA, you accept and agree to be bound by
              the terms and provisions of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Early Access Program</h2>
            <p>
              By joining our early access list, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The service is currently in development</li>
              <li>Features and availability may change</li>
              <li>We will notify you when early access becomes available</li>
              <li>You may opt-out at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p>
              Permission is granted to use InvoiceQA for personal or commercial
              invoice validation purposes, subject to the following restrictions:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must not modify or copy the service</li>
              <li>You must not use the service for any illegal purpose</li>
              <li>You must not attempt to reverse engineer the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p>
              InvoiceQA is provided &quot;as is&quot; without any warranties, expressed or
              implied. We do not guarantee the accuracy of invoice validation
              results and recommend human review of all invoices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
            <p>
              In no event shall InvoiceQA or its suppliers be liable for any damages
              arising out of the use or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Modifications</h2>
            <p>
              We may revise these terms at any time without notice. By using this
              service, you agree to be bound by the current version of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at
              legal@taranuka.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

