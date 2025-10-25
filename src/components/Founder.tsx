"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function Founder() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Left: Founder photo */}
          <div className="flex justify-center md:justify-start">
            <div className="glass rounded-2xl p-2">
              <div
                className="relative w-[280px] sm:w-[320px] md:w-[360px] rounded-xl border border-border/50 shadow-sm overflow-hidden"
                aria-label="Founder photo"
              >
                {/* 3:4 aspect ratio container */}
                <div className="pt-[133%]" />
                <Image
                  src="/Avinash_Midsummer-Full.jpg"
                  alt="Photo of Avinash Ranganath"
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 320px, 280px"
                  quality={85}
                  loading="lazy"
                  fetchPriority="low"
                  className="absolute inset-0 h-full w-full object-cover object-center rounded-xl"
                  priority={false}
                />
                {/* Subtle overlay for depth */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent" />
              </div>
            </div>
          </div>

          {/* Right: Text content */}
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Built by someone who saw the problem differently
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              By{" "}
              <a
                href="https://avinashranganath.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                Avinash Ranganath
              </a>
            </p>
            <div className="space-y-4 text-muted-foreground leading-8 text-justify">
              <p>
                InvoiceQA is built by an engineer who specializes in teaching
                machines to catch what humans miss. After years of building
                intelligent systems across different industries, one pattern kept
                emerging: finance teams were still manually checking invoices,
                wasting hours on work that automation should handle.
              </p>
              <p>
                The solution isn&apos;t better accounting software — it&apos;s
                better intelligence. InvoiceQA applies the same techniques used to
                detect fraud, spot anomalies, and validate complex data in other
                domains, now focused entirely on your invoices.
              </p>
              <p>
                Currently building as a one-person company and validating demand.
                Early adopters will have direct input into what gets built next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
