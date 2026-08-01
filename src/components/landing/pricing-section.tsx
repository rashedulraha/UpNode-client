"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const GLASS: React.CSSProperties = {
  background: "var(--lp-surface)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "0.5px solid var(--lp-border)",
  borderTop: "0.5px solid var(--lp-border-top)",
};

const GLASS_FEATURED: React.CSSProperties = {
  background: "var(--lp-surface-hover)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "0.5px solid var(--lp-stroke)",
  borderTop: "0.5px solid var(--lp-border-top)",
};

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      name: "Developer",
      desc: "For side projects & indie developers.",
      price: "0",
      unit: "/ forever",
      featured: false,
      cta: "Get Started Free",
      href: "/register",
      features: ["Up to 10,000 events/mo", "24-hour log retention", "Basic SSE alerts", "Community support"],
    },
    {
      name: "Scale Pro",
      desc: "For fast-growing SaaS & engineering teams.",
      price: billingCycle === "yearly" ? "39" : "49",
      unit: "/ month",
      featured: true,
      cta: "Start 14-Day Free Trial",
      href: "/register",
      badge: "Most Popular",
      features: ["500,000 events/mo", "30-day log retention", "Sub-second SSE push alerts", "BullMQ queue isolation", "Slack & PagerDuty sync"],
    },
    {
      name: "Enterprise",
      desc: "For high-throughput critical systems.",
      price: "Custom",
      unit: "",
      featured: false,
      cta: "Contact Sales",
      href: "mailto:enterprise@upnode.io",
      features: ["Unlimited telemetry events", "1-year custom log retention", "Dedicated BullMQ worker pods", "99.999% SLA & SOC2", "24/7 dedicated SRE support"],
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 relative"
      style={{ background: "var(--lp-bg)", borderBottom: "0.5px solid var(--lp-border)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase"
            style={{ background: "var(--lp-surface)", border: "0.5px solid var(--lp-border)", color: "var(--lp-text-dim)" }}
          >
            <span className="w-1 h-1 rounded-full inline-block" style={{ background: "var(--lp-text-mid)" }} />
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter leading-tight" style={{ color: "var(--lp-text-primary)" }}>
            Simple, predictable plans<br />
            <span style={{ WebkitTextStroke: "1px var(--lp-stroke)", color: "transparent" }}>
              for any team.
            </span>
          </h2>
          <p className="text-sm max-w-md mx-auto font-sans leading-relaxed" style={{ color: "var(--lp-text-mid)" }}>
            Zero hidden fees. Scale telemetry ingestion as your infrastructure grows.
          </p>

          {/* Toggle */}
          <div className="flex justify-center pt-2">
            <div
              className="flex items-center gap-0.5 p-0.5 font-mono text-[11px] rounded-xl"
              style={{ background: "var(--lp-surface)", border: "0.5px solid var(--lp-border)" }}
            >
              {(["monthly", "yearly"] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className="px-4 py-1.5 rounded-lg transition-all cursor-pointer tracking-widest uppercase text-[10px] flex items-center gap-2"
                  style={
                    billingCycle === cycle
                      ? { background: "var(--lp-cta-bg)", color: "var(--lp-cta-text)", borderRadius: "8px", fontWeight: "bold" }
                      : { color: "var(--lp-text-dim)" }
                  }
                >
                  {cycle}
                  {cycle === "yearly" && (
                    <span
                      className="text-[8px] font-bold px-1 py-0.5 rounded"
                      style={{ border: "0.5px solid var(--lp-border)", color: "var(--lp-text-dim)" }}
                    >
                      -20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-6 flex flex-col justify-between gap-6 relative transition-all"
              style={plan.featured ? GLASS_FEATURED : GLASS}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 right-5 px-3 py-0.5 rounded-full font-mono text-[9px] tracking-widest uppercase font-bold"
                  style={{ background: "var(--lp-cta-bg)", color: "var(--lp-cta-text)" }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3
                    className="text-base font-semibold"
                    style={{ color: plan.featured ? "var(--lp-text-primary)" : "var(--lp-text-mid)" }}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-xs font-sans" style={{ color: "var(--lp-text-dim)" }}>{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span
                    className="text-3xl font-bold tracking-tight"
                    style={{ color: "var(--lp-text-primary)" }}
                  >
                    {plan.price !== "Custom" ? `$${plan.price}` : plan.price}
                  </span>
                  {plan.unit && (
                    <span className="font-mono text-[11px]" style={{ color: "var(--lp-text-dim)" }}>{plan.unit}</span>
                  )}
                </div>

                <ul
                  className="space-y-2 pt-3"
                  style={{ borderTop: "0.5px solid var(--lp-border)" }}
                >
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 font-mono text-[11px]" style={{ color: plan.featured ? "var(--lp-text-primary)" : "var(--lp-text-mid)" }}>
                      <span className="w-1 h-1 rounded-full shrink-0 inline-block" style={{ background: plan.featured ? "var(--lp-text-primary)" : "var(--lp-text-dim)" }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={plan.href}
                className="w-full py-2.5 rounded-xl font-mono text-[11px] font-semibold tracking-wider text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                style={
                  plan.featured
                    ? { background: "var(--lp-cta-bg)", color: "var(--lp-cta-text)", border: "0.5px solid var(--lp-border-top)" }
                    : { background: "var(--lp-surface)", color: "var(--lp-text-mid)", border: "0.5px solid var(--lp-border)" }
                }
              >
                {plan.cta}
                {plan.featured && <ArrowRight className="w-3 h-3" />}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
