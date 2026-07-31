"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,0.025)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "0.5px solid rgba(255,255,255,0.09)",
  borderTop: "0.5px solid rgba(255,255,255,0.17)",
};

const GLASS_FEATURED: React.CSSProperties = {
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "0.5px solid rgba(255,255,255,0.22)",
  borderTop: "0.5px solid rgba(255,255,255,0.38)",
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
      featureColor: "text-white/35",
      dotColor: "bg-white/30",
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
      featureColor: "text-white/55",
      dotColor: "bg-white/60",
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
      featureColor: "text-white/35",
      dotColor: "bg-white/30",
      features: ["Unlimited telemetry events", "1-year custom log retention", "Dedicated BullMQ worker pods", "99.999% SLA & SOC2", "24/7 dedicated SRE support"],
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 relative"
      style={{ background: "#000", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] text-white/35 tracking-widest uppercase"
            style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.09)" }}
          >
            <span className="w-1 h-1 rounded-full bg-white/30" />
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white leading-tight">
            Simple, predictable plans<br />
            <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.35)", color: "transparent" }}>
              for any team.
            </span>
          </h2>
          <p className="text-white/30 text-sm max-w-md mx-auto font-sans leading-relaxed">
            Zero hidden fees. Scale telemetry ingestion as your infrastructure grows.
          </p>

          {/* Toggle */}
          <div className="flex justify-center pt-2">
            <div
              className="flex items-center gap-0.5 p-0.5 font-mono text-[11px] rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.09)" }}
            >
              {(["monthly", "yearly"] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer tracking-widest uppercase text-[10px] flex items-center gap-2`}
                  style={
                    billingCycle === cycle
                      ? { background: "rgba(255,255,255,0.88)", color: "#000", borderRadius: "8px" }
                      : { color: "rgba(255,255,255,0.30)" }
                  }
                >
                  {cycle}
                  {cycle === "yearly" && (
                    <span
                      className="text-[8px] font-bold text-white/50 px-1 py-0.5 rounded"
                      style={{ border: "0.5px solid rgba(255,255,255,0.15)" }}
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
                  className="absolute -top-3 right-5 px-3 py-0.5 rounded-full font-mono text-[9px] tracking-widest uppercase text-black font-bold"
                  style={{ background: "rgba(255,255,255,0.90)" }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3
                    className="text-base font-semibold"
                    style={{ color: plan.featured ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.60)" }}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-xs text-white/28 font-sans">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span
                    className="text-3xl font-bold tracking-tight"
                    style={{ color: plan.featured ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.60)" }}
                  >
                    {plan.price !== "Custom" ? `$${plan.price}` : plan.price}
                  </span>
                  {plan.unit && (
                    <span className="font-mono text-[11px] text-white/22">{plan.unit}</span>
                  )}
                </div>

                <ul
                  className="space-y-2 pt-3"
                  style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
                >
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 font-mono text-[11px] ${plan.featureColor}`}>
                      <span className={`w-1 h-1 rounded-full shrink-0 ${plan.dotColor}`} />
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
                    ? { background: "rgba(255,255,255,0.92)", color: "#000", border: "0.5px solid rgba(255,255,255,0.3)" }
                    : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.45)", border: "0.5px solid rgba(255,255,255,0.10)" }
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
