"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";

const GLASS: React.CSSProperties = {
  background: "var(--lp-surface)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "0.5px solid var(--lp-border)",
  borderTop: "0.5px solid var(--lp-border-top)",
};

interface FeatureRow {
  feature: string;
  category: string;
  upnode: string;
  traditional: string;
}

const COMPARISON_DATA: FeatureRow[] = [
  { feature: "Incident Alert Telemetry", category: "Real-Time Updates", upnode: "Sub-15ms SSE", traditional: "1–5 min polling" },
  { feature: "Root Cause Diagnostics", category: "AI Diagnostics", upnode: "AI Auto-Diagnosis", traditional: "Manual log grepping" },
  { feature: "Traffic Spike Resilience", category: "Architecture", upnode: "Non-blocking BullMQ Redis", traditional: "Direct SQL (DB Lockup)" },
  { feature: "Incident Lifecycle", category: "Automation", upnode: "Auto-synced status page", traditional: "Manual email updates" },
  { feature: "Setup & Onboarding", category: "Developer Experience", upnode: "3-min zero config", traditional: "Heavy YAML daemons" },
  { feature: "Billing Predictability", category: "Pricing", upnode: "Flat SRE pricing", traditional: "Per-host metered surprises" },
];

export function ComparisonSection() {
  return (
    <section
      id="why-upnode"
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
            Why UpNode?
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter leading-tight" style={{ color: "var(--lp-text-primary)" }}>
            Built for modern<br />
            <span style={{ WebkitTextStroke: "1px var(--lp-stroke)", color: "transparent" }}>
              reliability teams.
            </span>
          </h2>
          <p className="text-sm max-w-lg mx-auto font-sans leading-relaxed" style={{ color: "var(--lp-text-mid)" }}>
            See how UpNode's AI-native, zero-lockup architecture compares against traditional monitoring platforms.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden"
          style={GLASS}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-3 font-mono text-[10px] tracking-widest uppercase"
            style={{ borderBottom: "0.5px solid var(--lp-border)", background: "var(--lp-surface)" }}
          >
            <div className="p-4" style={{ color: "var(--lp-text-dim)" }}>Feature</div>
            <div className="p-4 font-semibold" style={{ borderLeft: "0.5px solid var(--lp-border)", color: "var(--lp-text-primary)" }}>
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: "var(--lp-text-mid)" }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "var(--lp-text-primary)" }} />
                </span>
                UpNode
              </div>
            </div>
            <div className="p-4" style={{ borderLeft: "0.5px solid var(--lp-border)", color: "var(--lp-text-dim)" }}>
              Traditional
            </div>
          </div>

          {/* Rows */}
          {COMPARISON_DATA.map((row, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="grid grid-cols-3 transition-colors"
              style={{ borderBottom: "0.5px solid var(--lp-border)" }}
            >
              <div className="p-4 space-y-0.5">
                <div className="text-xs font-sans" style={{ color: "var(--lp-text-primary)" }}>{row.feature}</div>
                <div className="font-mono text-[9px] tracking-widest uppercase" style={{ color: "var(--lp-text-dim)" }}>{row.category}</div>
              </div>
              <div className="p-4" style={{ borderLeft: "0.5px solid var(--lp-border)" }}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                    style={{ background: "var(--lp-surface-hover)", border: "0.5px solid var(--lp-border)" }}
                  >
                    <Check className="w-2.5 h-2.5" style={{ color: "var(--lp-text-primary)" }} />
                  </div>
                  <span className="text-xs font-sans" style={{ color: "var(--lp-text-mid)" }}>{row.upnode}</span>
                </div>
              </div>
              <div className="p-4" style={{ borderLeft: "0.5px solid var(--lp-border)" }}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                    style={{ background: "var(--lp-surface)", border: "0.5px solid var(--lp-border)" }}
                  >
                    <X className="w-2.5 h-2.5" style={{ color: "var(--lp-text-dim)" }} />
                  </div>
                  <span className="text-xs font-sans" style={{ color: "var(--lp-text-dim)" }}>{row.traditional}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl"
          style={GLASS}
        >
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-semibold" style={{ color: "var(--lp-text-primary)" }}>Ready to eliminate monitoring delays?</h3>
            <p className="font-mono text-[11px]" style={{ color: "var(--lp-text-dim)" }}>
              Get started with sub-second SSE incident streaming in under 3 minutes.
            </p>
          </div>
          <Link
            href="/register"
            className="flex items-center gap-1.5 px-4 py-2.5 font-mono text-[11px] font-semibold whitespace-nowrap transition-all active:scale-95 cursor-pointer"
            style={{ background: "var(--lp-cta-bg)", color: "var(--lp-cta-text)", border: "0.5px solid var(--lp-border-top)", borderRadius: "10px" }}
          >
            Start Free Trial
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
