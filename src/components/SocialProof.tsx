export function SocialProof() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Trusted by small accounting teams (beta)
          </p>
        </div>

        {/* Testimonial */}
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-xl p-8 text-center">
            <div className="mb-4">
              <svg
                className="w-10 h-10 mx-auto text-muted-foreground/30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <blockquote className="text-lg sm:text-xl text-muted-foreground mb-6">
              InvoiceQA caught a €2,500 calculation error before we processed
              payment. It paid for itself on day one.
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
              <div className="text-left">
                <div className="font-semibold">Sarah Mitchell</div>
                <div className="text-sm text-muted-foreground">
                  Finance Manager, TechStart GmbH
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

