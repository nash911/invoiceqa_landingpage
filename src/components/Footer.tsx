import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
          <span className="text-base font-semibold text-foreground">InvoiceQA</span>
          <p className="max-w-sm">
            Modern safeguards for AP and bookkeeping teams.
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
          <a
            href="mailto:hello@invoiceqa.com"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </a>
          <Link
            href="/terms"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
        </nav>
      </div>
      <div className="border-t bg-background/60">
        <p className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground">
          © 2025 Taranuka AB. InvoiceQA is a product of Taranuka AB.
        </p>
      </div>
    </footer>
  );
}
