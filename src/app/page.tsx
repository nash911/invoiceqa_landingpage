import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WhatItChecks } from "@/components/WhatItChecks";
import { HowItWorks } from "@/components/HowItWorks";
import { LeadForm } from "@/components/LeadForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhatItChecks />
        <HowItWorks />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}

