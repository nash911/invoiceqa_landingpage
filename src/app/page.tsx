import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { LeadForm } from "@/components/LeadForm";
import { Footer } from "@/components/Footer";
import { WhatItChecks } from "@/components/WhatItChecks";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Hero />
        <HowItWorks />
        <WhatItChecks />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
