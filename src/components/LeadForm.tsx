"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUTM } from "./UTMProvider";
import type { LeadSubmission } from "@/types/lead";
import { trackEvent } from "@/lib/analytics";

const leadEndpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? "/api/lead";

const leadSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.string().optional(),
  accounting_system: z.string().optional(),
  invoices_per_month: z.string().optional(),
  country: z.string().optional(),
  website: z.string().max(0, "Invalid field"),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export function LeadForm() {
  const utmParams = useUTM();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dwellTime, setDwellTime] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const optionalValues = watch([
    "role",
    "accounting_system",
    "invoices_per_month",
    "country",
  ]);

  const optionalHasValue = useMemo(
    () => optionalValues.some((value) => value && value.length > 0),
    [optionalValues]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setDwellTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (dwellTime >= 2) {
      setCanSubmit(true);
    }
  }, [dwellTime]);

  const onSubmit = async (data: LeadFormValues) => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    trackEvent("form_submit_start");

    if (data.website && data.website.length > 0) {
      setIsSuccess(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: LeadSubmission = {
        email: data.email,
        role: data.role,
        accounting_system: data.accounting_system,
        invoices_per_month: data.invoices_per_month,
        country: data.country,
        utm: utmParams,
      };

      const response = await fetch(leadEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const result = isJson ? await response.json() : null;

      const success =
        (result && (result.ok || result.duplicate)) ||
        (!isJson && response.ok);

      if (success) {
        setIsSuccess(true);
        trackEvent("form_submit_success");
        reset();
      } else {
        setErrorMessage(result?.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Lead form submission error", error);
      setErrorMessage("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="lead-form" className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="rounded-3xl border bg-muted/40 p-10">
            <h2 className="text-3xl font-semibold tracking-tight">You&apos;re on the list!</h2>
            <p className="mt-4 text-muted-foreground">
              We’ll email you when your invite is ready. Want a sneak peek?
              <a
                href="#how-it-works"
                onClick={(event) => {
                  event.preventDefault();
                  document
                    .querySelector("#how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="ml-2 font-medium text-primary underline-offset-4 hover:underline"
              >
                See how it works
              </a>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lead-form" className="py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-3xl border bg-background/60 p-8 shadow-sm sm:p-12">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Join the early access list
            </h2>
            <p className="mt-2 text-muted-foreground">
              Drop your email now; share the details once you’re ready.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                disabled={isSubmitting}
                {...register("email")}
                onFocus={() => setShowOptional(true)}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {!showOptional && !optionalHasValue && (
              <button
                type="button"
                onClick={() => setShowOptional(true)}
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Tell us more (optional)
              </button>
            )}

            {(showOptional || optionalHasValue) && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role">Role (optional)</Label>
                  <Select
                    onValueChange={(value) => setValue("role", value)}
                    value={watch("role")}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AP">AP</SelectItem>
                      <SelectItem value="Bookkeeper">Bookkeeper</SelectItem>
                      <SelectItem value="Controller">Controller</SelectItem>
                      <SelectItem value="CFO">CFO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accounting_system">Accounting system (optional)</Label>
                  <Select
                    onValueChange={(value) => setValue("accounting_system", value)}
                    value={watch("accounting_system")}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="accounting_system">
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QuickBooks">QuickBooks</SelectItem>
                      <SelectItem value="Xero">Xero</SelectItem>
                      <SelectItem value="NetSuite">NetSuite</SelectItem>
                      <SelectItem value="SAP">SAP</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoices_per_month">Invoices/month (optional)</Label>
                  <Select
                    onValueChange={(value) => setValue("invoices_per_month", value)}
                    value={watch("invoices_per_month")}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="invoices_per_month">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50">0–50</SelectItem>
                      <SelectItem value="51-200">51–200</SelectItem>
                      <SelectItem value="201-1k">201–1k</SelectItem>
                      <SelectItem value="1k+">1k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country (optional)</Label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="US / UK / CA / AU / NZ"
                    disabled={isSubmitting}
                    {...register("country")}
                  />
                </div>
              </div>
            )}

            <div className="hidden" aria-hidden="true">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !canSubmit}
              >
                {isSubmitting ? "Submitting..." : "Join the early access list"}
              </Button>
              <p className="text-xs text-muted-foreground">
                We’ll email you when your invite is ready.
              </p>
              {!canSubmit && dwellTime < 2 && (
                <p className="text-xs text-muted-foreground">
                  Preparing form… please wait {2 - dwellTime} second
                  {2 - dwellTime !== 1 ? "s" : ""}.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
