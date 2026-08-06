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
		<div
			className="min-h-screen selection:bg-slate-800 selection:text-white relative scroll-smooth transition-colors bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-sans"
			style={{ background: "var(--lp-bg)", color: "var(--lp-text-primary)" }}
		>
			{/* Background Noise Grid Layer matching Dashboard */}
			<div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

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
