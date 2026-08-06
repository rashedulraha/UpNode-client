"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Zap, Shield, Sparkles, Building2 } from "lucide-react";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

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
      icon: <Zap className="w-5 h-5 text-slate-400 dark:text-neutral-400" />,
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
      icon: <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />,
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
      icon: <Building2 className="w-5 h-5 text-purple-400" />,
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
      className="py-24 relative overflow-hidden bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-sans border-b border-slate-200 dark:border-neutral-800"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 font-mono"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-widest rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            TRANSPARENT & PREDICTABLE PRICING
          </div>
          <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-slate-900 dark:text-white uppercase">
            Built to scale with your infrastructure.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 max-w-xl mx-auto font-sans leading-relaxed">
            Choose the plan that fits your monitoring scale. No hidden fees or surprise billings.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center pt-4">
            <div className="flex items-center gap-1 p-1 bg-slate-200 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 rounded-lg text-xs font-mono">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-md transition-all cursor-pointer font-bold uppercase ${
                  billingCycle === "monthly"
                    ? "bg-slate-900 dark:bg-black text-white shadow-sm"
                    : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-md transition-all cursor-pointer font-bold uppercase flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-slate-900 dark:bg-black text-white shadow-sm"
                    : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold rounded">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {plans.map((plan, i) => {
            const displayPrice = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`p-6 sm:p-8 rounded-xl flex flex-col justify-between relative transition-all duration-200 ${
                  plan.featured
                    ? "border-2 border-emerald-500/80 bg-white dark:bg-neutral-950 shadow-xl dark:shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50"
                    : "border border-slate-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/60 shadow-sm hover:border-slate-300 dark:hover:border-neutral-700"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-emerald-500 text-black text-[10px] font-mono font-bold tracking-widest uppercase rounded-full shadow-sm">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Card Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                      {plan.icon}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="py-2 border-y border-slate-100 dark:border-neutral-900 font-mono">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extralight text-slate-900 dark:text-white tracking-tight">
                        ${displayPrice}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-neutral-400">{plan.unit}</span>
                    </div>
                    {billingCycle === "yearly" && displayPrice !== "0" && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                        Billed annually (${Number(displayPrice) * 12}/yr)
                      </span>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 font-mono text-xs text-slate-700 dark:text-neutral-300">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to Action Button */}
                <div className="pt-8">
                  <Link
                    href={plan.href}
                    className={`w-full py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider rounded-md text-center flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      plan.featured
                        ? "bg-emerald-500 hover:bg-emerald-400 text-black border border-emerald-400 shadow-md"
                        : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black"
                    }`}
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
