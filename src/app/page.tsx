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

import { ComparisonSection } from "@/components/landing/comparison-section";

export default function Home() {
  return (
    <div className="min-h-screen selection:bg-primary selection:text-primary-foreground relative scroll-smooth transition-colors" style={{ background: "var(--lp-bg)", color: "var(--lp-text-primary)" }}>
      <LandingNavbar />

      <main className="relative z-10 w-full">
        <HeroSection />
        <IntegrationsSection />
        <ArchitectureSection />
        <FeaturesSection />
        <ComparisonSection />
        <PricingSection />
        <CtaSection />
      </main>

      <LandingFooter />
    </div>
  );
}
