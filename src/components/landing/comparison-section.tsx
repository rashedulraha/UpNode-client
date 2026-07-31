"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";

const GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,0.025)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "0.5px solid rgba(255,255,255,0.09)",
  borderTop: "0.5px solid rgba(255,255,255,0.17)",
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
            Why UpNode?
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white leading-tight">
            Built for modern<br />
            <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.35)", color: "transparent" }}>
              reliability teams.
            </span>
          </h2>
          <p className="text-white/30 text-sm max-w-lg mx-auto font-sans leading-relaxed">
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
            style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="p-4 text-white/25">Feature</div>
            <div className="p-4 text-white/65 font-semibold" style={{ borderLeft: "0.5px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-70" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                </span>
                UpNode
              </div>
            </div>
            <div className="p-4 text-white/25" style={{ borderLeft: "0.5px solid rgba(255,255,255,0.07)" }}>
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
              className="grid grid-cols-3 hover:bg-white/[0.02] transition-colors"
              style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}
            >
              <div className="p-4 space-y-0.5">
                <div className="text-xs text-white/60 font-sans">{row.feature}</div>
                <div className="font-mono text-[9px] text-white/22 tracking-widest uppercase">{row.category}</div>
              </div>
              <div className="p-4" style={{ borderLeft: "0.5px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.15)" }}
                  >
                    <Check className="w-2.5 h-2.5 text-white/70" />
                  </div>
                  <span className="text-xs text-white/55 font-sans">{row.upnode}</span>
                </div>
              </div>
              <div className="p-4" style={{ borderLeft: "0.5px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)" }}
                  >
                    <X className="w-2.5 h-2.5 text-white/25" />
                  </div>
                  <span className="text-xs text-white/25 font-sans">{row.traditional}</span>
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
            <h3 className="text-sm font-semibold text-white/75">Ready to eliminate monitoring delays?</h3>
            <p className="font-mono text-[11px] text-white/28">
              Get started with sub-second SSE incident streaming in under 3 minutes.
            </p>
          </div>
          <Link
            href="/register"
            className="flex items-center gap-1.5 px-4 py-2.5 font-mono text-[11px] font-semibold text-black whitespace-nowrap transition-all active:scale-95 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.92)", border: "0.5px solid rgba(255,255,255,0.3)", borderRadius: "10px" }}
          >
            Start Free Trial
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
