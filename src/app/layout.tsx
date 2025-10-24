import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UTMProvider } from "@/components/UTMProvider";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvoiceQA — Catch costly invoice errors before they hit your books",
  description:
    "InvoiceQA helps AP teams and bookkeepers prevent wrong payments with math & tax checks, duplicate detection, bank-change defense, fraud risk signals, and fast approvals.",
  keywords: [
    "invoice validation",
    "invoice checking",
    "accounting automation",
    "invoice errors",
    "tax validation",
  ],
  authors: [{ name: "InvoiceQA" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  themeColor: "#2563eb",
  openGraph: {
    title: "InvoiceQA — Catch costly invoice errors before they hit your books",
    description:
      "InvoiceQA helps AP teams and bookkeepers prevent wrong payments with math & tax checks, duplicate detection, bank-change defense, fraud risk signals, and fast approvals.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InvoiceQA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoiceQA — Catch costly invoice errors before they hit your books",
    description:
      "InvoiceQA helps AP teams and bookkeepers prevent wrong payments with math & tax checks, duplicate detection, bank-change defense, fraud risk signals, and fast approvals.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {process.env.NODE_ENV === "production" &&
          process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
            <Script
              id="clarity-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
                `,
              }}
            />
          )}
      </head>
      <body className={`${sans.variable} ${mono.variable} antialiased`}>
        <ThemeProvider>
          <UTMProvider>{children}</UTMProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
