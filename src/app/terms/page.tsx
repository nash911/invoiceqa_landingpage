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
            <h2 className="text-2xl font-semibold mb-4">About InvoiceQA</h2>
            <p>
              InvoiceQA is a product developed and operated by Taranuka AB, a Swedish limited company 
              (org. nr. 559379-7144). These Terms of Service govern your use of InvoiceQA and
              constitute a binding agreement between you and Taranuka AB.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using InvoiceQA, you accept and agree to be bound by
              the terms and provisions of this agreement. If you do not agree to these terms,
              please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Early Access Program</h2>
            <p>
              By joining our early access list, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The service is currently in development</li>
              <li>Features and availability may change without notice</li>
              <li>We will notify you via email when early access becomes available</li>
              <li>Early access does not guarantee immediate access to all features</li>
              <li>You may opt-out at any time by contacting us or using the unsubscribe link in our emails</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Early Adopter Lifetime Discount</h2>
            <p>
              Early adopters who join the early access program and subsequently subscribe to InvoiceQA 
              are eligible for a special lifetime discount on their subscription fees. This discount:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Applies to the subscription tier selected at the time of initial purchase</li>
              <li>Remains valid for as long as the subscription remains active without interruption</li>
              <li>Is non-transferable and applies only to the original subscriber account</li>
              <li>
                Is contingent upon InvoiceQA remaining under the ownership and operation of Taranuka AB. 
                In the event of a change of ownership, merger, acquisition, or transfer of InvoiceQA to 
                another entity, Taranuka AB and any successor entity reserve the right to modify or 
                discontinue the lifetime discount, provided that reasonable notice is given to affected 
                subscribers
              </li>
              <li>May be modified or terminated if the subscriber violates these Terms of Service</li>
              <li>Does not apply to add-ons, additional features, or services not included in the base subscription</li>
            </ul>
            <p className="mt-4">
              The specific discount percentage will be communicated to early adopters at the time of 
              product launch. Taranuka AB reserves the right to determine eligibility and discount terms 
              at its sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p>
              Subject to your compliance with these Terms, Taranuka AB grants you a limited, 
              non-exclusive, non-transferable, revocable license to use InvoiceQA for personal 
              or commercial invoice validation purposes, subject to the following restrictions:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must not modify, copy, or create derivative works of the service</li>
              <li>You must not use the service for any illegal or unauthorized purpose</li>
              <li>You must not attempt to reverse engineer, decompile, or disassemble the service</li>
              <li>You must not interfere with or disrupt the service or servers</li>
              <li>You must not use the service to transmit malicious code or harmful content</li>
              <li>You must comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Data and Privacy</h2>
            <p>
              Your use of InvoiceQA is also governed by our Privacy Policy. By using the service, 
              you consent to the collection and use of information as described in our Privacy Policy. 
              You are responsible for maintaining the confidentiality of your account credentials and 
              for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p>
              InvoiceQA is provided &quot;as is&quot; and &quot;as available&quot; without any warranties 
              of any kind, either express or implied, including but not limited to warranties of 
              merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p className="mt-4">
              While InvoiceQA is designed to assist with invoice validation, we do not guarantee the 
              accuracy, completeness, or reliability of validation results. Users are solely responsible 
              for verifying all invoice information and making final payment decisions. InvoiceQA should 
              be used as a supplementary tool and does not replace professional accounting judgment or 
              human review.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Taranuka AB, its directors, employees, 
              partners, and suppliers shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including without limitation, loss of profits, data, 
              use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your access to or use of or inability to access or use the service</li>
              <li>Any conduct or content of any third party on the service</li>
              <li>Any content obtained from the service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              <li>Errors or inaccuracies in invoice validation results</li>
            </ul>
            <p className="mt-4">
              In no event shall Taranuka AB&apos;s total liability to you for all damages, losses, 
              and causes of action exceed the amount paid by you to Taranuka AB in the twelve (12) 
              months preceding the claim, or one hundred USD ($100), whichever is greater.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Taranuka AB and its officers, 
              directors, employees, and agents from and against any claims, liabilities, damages, 
              losses, and expenses, including reasonable legal fees, arising out of or in any way 
              connected with your access to or use of InvoiceQA, your violation of these Terms, 
              or your violation of any rights of another party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Modifications to Service and Terms</h2>
            <p>
              Taranuka AB reserves the right to modify, suspend, or discontinue InvoiceQA 
              (or any part thereof) at any time, with or without notice. We may also revise 
              these Terms of Service at any time. Continued use of the service after such 
              modifications constitutes your acceptance of the revised terms. We will make 
              reasonable efforts to notify users of material changes to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p>
              Taranuka AB may terminate or suspend your access to InvoiceQA immediately, 
              without prior notice or liability, for any reason, including without limitation 
              if you breach these Terms. Upon termination, your right to use the service will 
              immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of 
              Sweden, without regard to its conflict of law provisions. Any disputes arising 
              from these Terms or your use of InvoiceQA shall be subject to the exclusive 
              jurisdiction of the courts of Sweden.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that 
              provision shall be limited or eliminated to the minimum extent necessary so that 
              these Terms shall otherwise remain in full force and effect and enforceable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement 
              between you and Taranuka AB regarding the use of InvoiceQA and supersede all 
              prior agreements and understandings, whether written or oral.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> legal@taranuka.com<br />
              <strong>Company:</strong> Taranuka AB<br />
              <strong>Website:</strong> <a href="https://www.invoiceqa.com" className="text-primary hover:underline">www.invoiceqa.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

