"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, CreditCard } from "lucide-react";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const fadeInUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <section id="pricing" className="py-20 border-b border-border space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono">
          <CreditCard className="w-3.5 h-3.5 text-primary" />
          <span className="text-primary">Transparent Pricing</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          Simple, predictable plans for any engineering team
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Zero hidden fees. Scale telemetry ingestion as your infrastructure
          grows.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="pt-2 flex items-center justify-center">
          <div className="flex items-center gap-1 bg-muted border border-border p-1 rounded-xl text-xs font-mono">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-primary text-primary-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-primary text-primary-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Yearly</span>
              <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Pricing Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {/* Starter Plan */}
        <motion.div
          variants={fadeInUp}
          whileHover={{ y: -3 }}
          className="p-6 rounded-2xl bg-card/75 backdrop-blur-xl border border-border/80 hover:border-primary/40 shadow-md shadow-black/5 dark:shadow-black/20 transition-all flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                Developer
              </h3>
              <p className="text-xs text-muted-foreground">
                For side projects & indie developers.
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">$0</span>
              <span className="text-xs font-mono text-muted-foreground">
                / forever
              </span>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground font-mono pt-2 border-t border-border">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary" /> Up to 10,000
                events/mo
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary" /> 24-hour log
                retention
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary" /> Basic SSE
                alerts
              </li>
              <li className="flex items-center gap-2 text-muted-foreground/60">
                <Check className="w-3.5 h-3.5 text-muted-foreground/40" />{" "}
                Community support
              </li>
            </ul>
          </div>

          <Link
            href="/register"
            className="w-full py-2.5 rounded-xl bg-muted/80 border border-border hover:bg-accent text-foreground font-semibold text-xs transition-colors text-center block"
          >
            Get Started Free
          </Link>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          variants={fadeInUp}
          whileHover={{ y: -3 }}
          className="p-6 rounded-2xl bg-card/90 backdrop-blur-xl border-2 border-primary relative flex flex-col justify-between space-y-6 shadow-xl shadow-primary/10 transition-all"
        >
          <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase font-mono tracking-wider shadow-sm">
            Most Popular
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                Scale Pro
              </h3>
              <p className="text-xs text-muted-foreground">
                For fast-growing SaaS & engineering teams.
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">
                ${billingCycle === "yearly" ? "39" : "49"}
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                / month
              </span>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground font-mono pt-2 border-t border-border">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> 500,000
                events/mo
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> 30-day log
                retention
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Sub-second
                SSE push alerts
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> BullMQ queue
                isolation
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Slack &
                PagerDuty sync
              </li>
            </ul>
          </div>

          <Link
            href="/register"
            className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-md shadow-primary/20 transition-all text-center block"
          >
            Start 14-Day Free Trial
          </Link>
        </motion.div>

        {/* Enterprise Plan */}
        <motion.div
          variants={fadeInUp}
          whileHover={{ y: -3 }}
          className="p-6 rounded-2xl bg-card/75 backdrop-blur-xl border border-border/80 hover:border-primary/40 shadow-md shadow-black/5 dark:shadow-black/20 transition-all flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                Enterprise
              </h3>
              <p className="text-xs text-muted-foreground">
                For high-throughput critical systems.
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">Custom</span>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground font-mono pt-2 border-t border-border">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-500" /> Unlimited
                telemetry events
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-500" /> 1-year custom
                log retention
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-500" /> Dedicated
                BullMQ worker pods
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-500" /> 99.999% SLA &
                SOC2 Compliance
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-500" /> 24/7 dedicated
                SRE support
              </li>
            </ul>
          </div>

          <a
            href="mailto:enterprise@pulsescale.com"
            className="w-full py-2.5 rounded-xl bg-muted/80 border border-border hover:bg-accent text-foreground font-semibold text-xs transition-colors text-center block"
          >
            Contact Sales
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
