"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailX, CheckCircle, AlertCircle } from "lucide-react";

type PageState = "form" | "loading" | "success" | "error";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [pageState, setPageState] = useState<PageState>("form");
  const [errorMessage, setErrorMessage] = useState("");

  // Prefill email from URL query parameter
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  // Simple email validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleUnsubscribe = async () => {
    if (!isValidEmail) return;

    setPageState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setPageState("success");
      } else {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setPageState("error");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setPageState("error");
    }
  };

  // Success / Goodbye page
  if (pageState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center grain">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              You&apos;ve been unsubscribed
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              We&apos;re sorry to see you go. You won&apos;t receive any more emails from us
              at <span className="font-medium text-foreground">{email}</span>.
            </p>

            <div className="glass rounded-xl p-6 mb-8">
              <p className="text-muted-foreground">
                Changed your mind? You can always sign up again on our website.
              </p>
            </div>

            <Button asChild variant="outline" size="lg">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Form page (default and error states)
  return (
    <div className="min-h-screen flex items-center justify-center grain">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center">
              <MailX className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Unsubscribe
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            Enter your email address below to unsubscribe from our mailing list.
          </p>

          <div className="glass rounded-xl p-6 mb-6">
            <div className="space-y-4">
              <div className="text-left">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (pageState === "error") setPageState("form");
                  }}
                  className="mt-1.5"
                  disabled={pageState === "loading"}
                />
              </div>

              {pageState === "error" && errorMessage && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Button
                onClick={handleUnsubscribe}
                disabled={!isValidEmail || pageState === "loading"}
                className="w-full"
                variant="destructive"
                size="lg"
              >
                {pageState === "loading" ? "Unsubscribing..." : "Unsubscribe"}
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Having trouble?{" "}
            <a
              href="mailto:support@invoiceqa.com"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

