"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { ArchitectureSection } from "@/components/landing/architecture-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CtaSection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary relative scroll-smooth">
      <LandingNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <IntegrationsSection />
        <ArchitectureSection />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
      </main>

      <LandingFooter />
    </div>
  );
}
