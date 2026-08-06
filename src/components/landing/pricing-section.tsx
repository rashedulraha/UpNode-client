"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	ArrowRight,
	Check,
	Zap,
	Shield,
	Sparkles,
	Building2,
} from "lucide-react";

const GLASS: React.CSSProperties = {
	background: "var(--lp-surface)",
	backdropFilter: "blur(20px)",
	WebkitBackdropFilter: "blur(20px)",
	border: "0.5px solid var(--lp-border)",
	borderTop: "0.5px solid var(--lp-border-top)",
};

export function PricingSection() {
	const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
		"yearly",
	);

	const plans = [
		{
			name: "Developer",
			desc: "For side projects, indie developers & small tools.",
			priceMonthly: "0",
			priceYearly: "0",
			unit: "/ forever",
			featured: false,
			cta: "Get Started Free",
			href: "/login?signup=true",
			icon: <Zap className="w-5 h-5" style={{ color: "var(--lp-text-dim)" }} />,
			features: [
				"Up to 5 Projects Included",
				"10,000 Ping Telemetry Events/mo",
				"7-Day Metric Retention & History",
				"Real-Time Web & Email Alerts",
				"Community Discord & Github Support",
			],
		},
		{
			name: "Scale Pro",
			desc: "For fast-growing SaaS products & dev teams.",
			priceMonthly: "49",
			priceYearly: "39",
			unit: "/ month",
			featured: true,
			badge: "Most Popular",
			cta: "Start 14-Day Free Trial",
			href: "/login?signup=true",
			icon: (
				<Sparkles
					className="w-5 h-5 animate-pulse"
					style={{ color: "var(--lp-text-primary)" }}
				/>
			),
			features: [
				"Unlimited Projects & Monitors",
				"500,000 Telemetry Ping Events/mo",
				"90-Day High-Precision Metric History",
				"Sub-Second SSE Push & Slack Webhooks",
				"AI SRE Incident Root Cause Analysis",
				"BullMQ Isolated Queue Processing",
				"Priority 24/7 Developer Support",
			],
		},
		{
			name: "Enterprise",
			desc: "For high-throughput & mission-critical systems.",
			priceMonthly: "199",
			priceYearly: "159",
			unit: "/ month",
			featured: false,
			cta: "Contact Enterprise Sales",
			href: "mailto:enterprise@upnode.io",
			icon: (
				<Building2
					className="w-5 h-5"
					style={{ color: "var(--lp-text-mid)" }}
				/>
			),
			features: [
				"Unlimited Telemetry & Logs",
				"1-Year Custom Data Retention",
				"Dedicated BullMQ & Redis Worker Pods",
				"Custom Webhook Integration Engine",
				"99.99% Uptime Guarantee & SOC2",
				"Dedicated SRE Account Manager",
				"Custom SLA & Onboarding",
			],
		},
	];

	return (
		<section
			id="pricing"
			className="py-24 relative"
			style={{
				background: "var(--lp-bg)",
				borderBottom: "0.5px solid var(--lp-border)",
			}}
		>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 14 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="text-center space-y-4 font-sans"
				>
					{/* Section Label */}
					<div
						className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase"
						style={{
							background: "var(--lp-surface)",
							border: "0.5px solid var(--lp-border)",
							color: "var(--lp-text-dim)",
						}}
					>
						<span
							className="w-1.5 h-1.5 rounded-full inline-block"
							style={{ background: "var(--lp-text-mid)" }}
						/>
						Transparent & Predictable Pricing
					</div>

					<h2
						className="text-3xl sm:text-5xl font-bold tracking-tighter leading-tight"
						style={{ color: "var(--lp-text-primary)" }}
					>
						Built to scale with
						<br />
						<span
							style={{
								WebkitTextStroke: "1px var(--lp-stroke)",
								color: "transparent",
							}}
						>
							your infrastructure.
						</span>
					</h2>

					<p
						className="text-xs sm:text-sm max-w-xl mx-auto font-sans leading-relaxed"
						style={{ color: "var(--lp-text-dim)" }}
					>
						Choose the plan that fits your monitoring scale. No hidden fees or
						surprise billings.
					</p>

					{/* Billing Cycle Toggle */}
					<div className="flex justify-center pt-4 font-mono">
						<div
							className="inline-flex items-center gap-1 p-1 rounded-xl text-xs"
							style={{
								background: "var(--lp-surface)",
								border: "0.5px solid var(--lp-border)",
							}}
						>
							<button
								onClick={() => setBillingCycle("monthly")}
								className="px-4 py-1.5 rounded-lg transition-all cursor-pointer font-bold uppercase text-[11px]"
								style={{
									background:
										billingCycle === "monthly"
											? "var(--lp-text-primary)"
											: "transparent",
									color:
										billingCycle === "monthly"
											? "var(--lp-bg)"
											: "var(--lp-text-dim)",
								}}
							>
								Monthly Billing
							</button>
							<button
								onClick={() => setBillingCycle("yearly")}
								className="px-4 py-1.5 rounded-lg transition-all cursor-pointer font-bold uppercase text-[11px] flex items-center gap-1.5"
								style={{
									background:
										billingCycle === "yearly"
											? "var(--lp-text-primary)"
											: "transparent",
									color:
										billingCycle === "yearly"
											? "var(--lp-bg)"
											: "var(--lp-text-dim)",
								}}
							>
								<span>Annual Billing</span>
								<span
									className="px-1.5 py-0.5 text-[9px] font-bold rounded"
									style={{
										background: "var(--lp-border)",
										color:
											billingCycle === "yearly"
												? "var(--lp-bg)"
												: "var(--lp-text-mid)",
									}}
								>
									SAVE 20%
								</span>
							</button>
						</div>
					</div>
				</motion.div>

				{/* Pricing Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
					{plans.map((plan, i) => {
						const displayPrice =
							billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;

						return (
							<motion.div
								key={plan.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: i * 0.1 }}
								className="p-6 sm:p-8 rounded-3xl flex flex-col justify-between relative transition-all duration-200"
								style={{
									...GLASS,
									border: plan.featured
										? "1px solid var(--lp-text-primary)"
										: "0.5px solid var(--lp-border)",
								}}
							>
								{plan.badge && (
									<div
										className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase rounded-full shadow-sm"
										style={{
											background: "var(--lp-text-primary)",
											color: "var(--lp-bg)",
										}}
									>
										{plan.badge}
									</div>
								)}

								<div className="space-y-6">
									{/* Card Header */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<h3
												className="text-lg font-mono font-bold uppercase tracking-wider"
												style={{ color: "var(--lp-text-primary)" }}
											>
												{plan.name}
											</h3>
											{plan.icon}
										</div>
										<p
											className="text-xs font-sans leading-relaxed"
											style={{ color: "var(--lp-text-dim)" }}
										>
											{plan.desc}
										</p>
									</div>

									{/* Pricing Display */}
									<div
										className="py-3 border-y font-mono"
										style={{ borderColor: "var(--lp-border)" }}
									>
										<div className="flex items-baseline gap-1">
											<span
												className="text-4xl font-extralight tracking-tight"
												style={{ color: "var(--lp-text-primary)" }}
											>
												${displayPrice}
											</span>
											<span
												className="text-xs"
												style={{ color: "var(--lp-text-dim)" }}
											>
												{plan.unit}
											</span>
										</div>
										{billingCycle === "yearly" && displayPrice !== "0" && (
											<span
												className="text-[10px] font-mono font-semibold block mt-1"
												style={{ color: "var(--lp-text-mid)" }}
											>
												Billed annually (${Number(displayPrice) * 12}/yr)
											</span>
										)}
									</div>

									{/* Feature Checklist */}
									<ul className="space-y-2.5 font-mono text-xs">
										{plan.features.map((feature) => (
											<li
												key={feature}
												className="flex items-start gap-2.5"
												style={{ color: "var(--lp-text-mid)" }}
											>
												<Check
													className="w-4 h-4 shrink-0 mt-0.5"
													style={{ color: "var(--lp-text-primary)" }}
												/>
												<span>{feature}</span>
											</li>
										))}
									</ul>
								</div>

								{/* Call to Action Button */}
								<div className="pt-8 font-mono">
									<Link
										href={plan.href}
										className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xl text-center flex items-center justify-center gap-2 transition-all cursor-pointer"
										style={{
											background: plan.featured
												? "var(--lp-text-primary)"
												: "var(--lp-surface)",
											color: plan.featured
												? "var(--lp-bg)"
												: "var(--lp-text-primary)",
											border: plan.featured
												? "none"
												: "0.5px solid var(--lp-border)",
										}}
									>
										<span>{plan.cta}</span>
										<ArrowRight className="w-3.5 h-3.5" />
									</Link>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

export default PricingSection;
