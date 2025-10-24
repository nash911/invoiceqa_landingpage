"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUTM } from "./UTMProvider";
import { LeadSubmission } from "@/types/lead";

const leadEndpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? "/api/lead";

// Make company and invoices_per_month required on the frontend
const leadSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(1, "Company is required"),
  invoices_per_month: z.preprocess(
    (val) => (val == null ? "" : val),
    z
      .string({
        required_error: "This field is required",
        invalid_type_error: "This field is required",
      })
      .min(1, "This field is required")
      .refine((val) => ["0-50", "51-200", "201-1k", "1k+"].includes(val), {
        message: "This field is required",
      })
  ),
  website: z.string().max(0, "Invalid field"), // Honeypot
});

type LeadFormValues = z.infer<typeof leadSchema>;

export function LeadForm() {
  const router = useRouter();
  const utmParams = useUTM();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dwellTime, setDwellTime] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      invoices_per_month: "",
    },
  });

  const invoicesPerMonth = watch("invoices_per_month");

  // Track dwell time
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
    // Fire analytics event
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("analytics", {
          detail: { event: "form_submit_start" },
        })
      );
    }

    if (!canSubmit) {
      toast.error("Please take a moment to review the form");
      return;
    }

    // Check honeypot
    if (data.website && data.website.length > 0) {
      // Silent fail for bots
      router.push("/thank-you");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: LeadSubmission = {
        email: data.email,
        company: data.company,
        invoices_per_month: data.invoices_per_month,
        utm: utmParams,
      };

      const response = await fetch(leadEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Safely handle non-JSON responses
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response from /api/lead:", text);
        toast.error("Unexpected server response. Please try again.");
        return;
      }

      const result = await response.json();

      if (result.ok) {
        // Fire success analytics event
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("analytics", {
              detail: { event: "form_submit_success" },
            })
          );
        }
        toast.success("Thank you for joining our early access list!");
        router.push("/thank-you");
      } else {
        toast.error(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="lead-form" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Become an Early Adopter
            </h2>
            {/*<p className="text-sm text-muted-foreground mt-2">
              We&apos;ll email you when your invite is ready.
            </p>*/}
            <p className="text-xs text-muted-foreground mt-2">
              Early adopters will get a say in our product roadmap and a special
              lifetime discount.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="glass rounded-xl p-8 space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                aria-invalid={!!errors.email}
                {...register("email")}
                disabled={isSubmitting}
                required
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">
                Company <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Your company name"
                aria-invalid={!!errors.company}
                {...register("company")}
                disabled={isSubmitting}
                required
              />
              {errors.company && (
                <p className="text-sm text-destructive">{errors.company.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoices_per_month">
                Invoices per month? <span className="text-destructive">*</span>
              </Label>
              <Select
                value={invoicesPerMonth}
                onValueChange={(value) =>
                  setValue("invoices_per_month", value as any, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger id="invoices_per_month" aria-required="true" aria-invalid={!!errors.invoices_per_month}>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-50">0–50</SelectItem>
                  <SelectItem value="51-200">51–200</SelectItem>
                  <SelectItem value="201-1k">201–1k</SelectItem>
                  <SelectItem value="1k+">1k+</SelectItem>
                </SelectContent>
              </Select>
              {errors.invoices_per_month && (
                <p className="text-xs text-muted-foreground">{errors.invoices_per_month.message}</p>
              )}
            </div>

            {/* Honeypot field - hidden from users */}
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

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting ? "Submitting..." : "Get Early Access"}
            </Button>

            {!canSubmit && dwellTime < 2 && (
              <p className="text-xs text-muted-foreground text-center">
                Please wait{" "}
                {2 - dwellTime} second{2 - dwellTime !== 1 ? "s" : ""}...
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
