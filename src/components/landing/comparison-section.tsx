"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Zap,
  Sparkles,
  ShieldAlert,
  Clock,
  Database,
  DollarSign,
  Activity,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface FeatureRow {
  feature: string;
  category: string;
  upnode: string;
  upnodeHighlight: boolean;
  traditional: string;
  traditionalBad: boolean;
}

const COMPARISON_DATA: FeatureRow[] = [
  {
    feature: "Incident Alert Telemetry",
    category: "Real-Time Updates",
    upnode: "Sub-15ms Server-Sent Events (SSE)",
    upnodeHighlight: true,
    traditional: "1 to 5-minute Polling Delays",
    traditionalBad: true,
  },
  {
    feature: "Root Cause Diagnostics",
    category: "AI Diagnostics",
    upnode: "AI-Native Auto Diagnosis & Fix Suggestions",
    upnodeHighlight: true,
    traditional: "Manual Log Searching & Grepping",
    traditionalBad: true,
  },
  {
    feature: "Traffic Spike Resilience",
    category: "Architecture",
    upnode: "Non-blocking BullMQ Redis Buffer",
    upnodeHighlight: true,
    traditional: "Direct SQL Writes (Causes DB Lockups)",
    traditionalBad: true,
  },
  {
    feature: "Incident Lifecycle & Timeline",
    category: "Automation",
    upnode: "Automated Timeline & Status Page Sync",
    upnodeHighlight: true,
    traditional: "Manual Incident Updates & Email Creation",
    traditionalBad: true,
  },
  {
    feature: "Setup & Onboarding Time",
    category: "Developer Experience",
    upnode: "3-Minute Zero Config Setup",
    upnodeHighlight: true,
    traditional: "Heavy Daemon Install & Complex YAMLs",
    traditionalBad: true,
  },
  {
    feature: "Billing & Cost Predictability",
    category: "Pricing",
    upnode: "Transparent Flat SRE Pricing",
    upnodeHighlight: true,
    traditional: "Per-Host & Metered Data Surprises",
    traditionalBad: true,
  },
];

export function ComparisonSection() {
  return (
    <section id="why-upnode" className="py-20 border-b border-border relative overflow-hidden">
      {/* Soft Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Built for Modern Reliability Teams</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Why <span className="text-primary font-normal">UpNode</span>?
          </h2>

          <p className="text-muted-foreground text-sm leading-relaxed">
            See how UpNode’s AI-native, zero-lockup architecture compares against traditional monitoring platforms.
          </p>
        </div>

        {/* Comparison Table Component */}
        <div className="w-full rounded-2xl bg-card/75 backdrop-blur-xl border border-border/80 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/50 text-foreground font-mono">
                  <th className="p-4 font-semibold text-muted-foreground w-1/3">Feature</th>
                  <th className="p-4 font-bold text-primary w-1/3 bg-primary/5 border-x border-primary/20">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span>UpNode (AI-Native)</span>
                    </div>
                  </th>
                  <th className="p-4 font-semibold text-muted-foreground w-1/3">
                    Traditional Monitoring
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {COMPARISON_DATA.map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Feature Title */}
                    <td className="p-4 font-semibold text-foreground space-y-0.5">
                      <div className="text-xs">{row.feature}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{row.category}</div>
                    </td>

                    {/* UpNode Cell */}
                    <td className="p-4 font-medium text-foreground bg-primary/5 border-x border-primary/20">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-primary">{row.upnode}</span>
                      </div>
                    </td>

                    {/* Traditional Cell */}
                    <td className="p-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-destructive/10 text-destructive border border-destructive/20 shrink-0">
                          <X className="w-3.5 h-3.5" />
                        </div>
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA banner below table */}
        <div className="p-6 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-foreground">Ready to eliminate monitoring delays?</h3>
            <p className="text-xs text-muted-foreground font-mono">
              Get started with sub-second SSE incident streaming in under 3 minutes.
            </p>
          </div>

          <Link
            href="/register"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
