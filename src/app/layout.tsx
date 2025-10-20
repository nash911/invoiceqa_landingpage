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

const title = "InvoiceQA — Catch costly invoice errors before they hit your books";
const description =
  "InvoiceQA helps AP teams and bookkeepers prevent wrong payments with math & tax checks, duplicate detection, bank-change defense, fraud risk signals, and fast approvals.";

export const metadata: Metadata = {
  title,
  description,
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
  openGraph: {
    title,
    description,
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "InvoiceQA preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/brand/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
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
