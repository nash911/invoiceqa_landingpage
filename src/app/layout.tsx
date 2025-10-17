import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UTMProvider } from "@/components/UTMProvider";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvoiceQA - Catch costly invoice errors automatically",
  description:
    "Before you pay, InvoiceQA checks totals, taxes, vendor IDs, and due dates in seconds. Join the early access list.",
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
    title: "InvoiceQA - Catch costly invoice errors automatically",
    description:
      "Before you pay, InvoiceQA checks totals, taxes, vendor IDs, and due dates in seconds.",
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
    title: "InvoiceQA - Catch costly invoice errors automatically",
    description:
      "Before you pay, InvoiceQA checks totals, taxes, vendor IDs, and due dates in seconds.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <UTMProvider>{children}</UTMProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
