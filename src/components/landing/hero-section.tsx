"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Layers,
  ShieldAlert,
  Terminal,
} from "lucide-react";

export function HeroSection() {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("npx create-pulsescale-app@latest");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    <section
      id="platform"
      className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center border-b border-border overflow-hidden"
    >
      {/* Background Grid Pattern & Subtle Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-40 dark:opacity-20">
        <svg
          className="h-full w-full stroke-foreground/10 [mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="hero-grid-pattern"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
              x="-1"
              y="-1"
            >
              <path d="M.5 36V.5H36" fill="none" strokeDasharray="0" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#hero-grid-pattern)" />
        </svg>
      </div>

      {/* Soft Radial Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* HERO LEFT COLUMN */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="lg:col-span-6 space-y-6"
      >
        {/* Minimal Pill Badge */}
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono text-muted-foreground"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Next-Gen Observability Engine</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]"
        >
          Incident management <br />
          <span className="text-primary font-normal">designed for 2026.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          className="text-muted-foreground text-sm sm:text-base max-w-xl font-normal leading-relaxed"
        >
          AI-native incident management with built-in on-call and status pages in
          one beautifully made product. Zero DB lockup during high-volume
          spikes.
        </motion.p>

        {/* Input Block */}
        <motion.div variants={fadeInUp} className="pt-2 max-w-md space-y-3">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row items-stretch gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your work e-mail"
              className="flex-1 px-4 py-2.5 bg-card border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all font-sans"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all flex items-center justify-center gap-1.5 text-xs whitespace-nowrap cursor-pointer"
            >
              <span>Start for free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Ticks */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-1 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Free
              14-day trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No credit
              card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Setup in 3
              min
            </span>
          </div>
        </motion.div>

        {/* Quick Command Bar */}
        <motion.div variants={fadeInUp} className="pt-1 flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-[11px] font-mono text-muted-foreground">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>npx create-pulsescale-app@latest</span>
          </div>
          <button
            onClick={handleCopyInstall}
            className="px-2.5 py-1.5 rounded-lg bg-card border border-border hover:bg-accent text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : "Copy"}
          </button>
        </motion.div>
      </motion.div>

      {/* HERO RIGHT COLUMN: CLEAN SEAMLESS CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-6 relative"
      >
        <div className="space-y-3">
          {/* CLEAN CARD 1: SSL CERTIFICATE ERROR */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl bg-card border border-border transition-all relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-destructive font-semibold">
                      P1 • CRITICAL
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      2m ago
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-foreground mt-0.5">
                    SSL Certificate Expiration
                  </h4>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-emerald-500 flex items-center gap-1 font-semibold border border-border">
                <Activity className="w-3 h-3 text-primary" /> 0.4ms
              </span>
            </div>

            <div className="pt-2 space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between text-muted-foreground bg-muted/50 p-2.5 rounded-xl border border-border">
                <span className="text-muted-foreground">Target Host:</span>
                <span className="text-foreground">api.auth.internal.prod</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground bg-muted/50 p-2.5 rounded-xl border border-border">
                <span className="text-muted-foreground">Error Payload:</span>
                <span className="text-destructive font-medium">
                  x509: certificate expired
                </span>
              </div>
            </div>
          </motion.div>

          {/* CLEAN CARD 2: KAFKA QUEUE LAG ALERT */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl bg-card border border-border transition-all relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-amber-500 font-semibold">
                      P2 • HIGH LAG
                    </span>
                    <span className="text-[10px] font-mono text-primary font-medium">
                      Live SSE
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-foreground mt-0.5">
                    Kafka Consumer Queue Lag
                  </h4>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-primary border border-border">
                BullMQ Buffer
              </span>
            </div>

            <div className="pt-2 space-y-1.5 text-[11px] font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/50 p-2.5 rounded-xl border border-border">
                  <span className="text-muted-foreground text-[9px] block">
                    TOPIC
                  </span>
                  <span className="text-foreground text-xs font-medium">
                    telemetry.events.v2
                  </span>
                </div>
                <div className="bg-muted/50 p-2.5 rounded-xl border border-border">
                  <span className="text-muted-foreground text-[9px] block">
                    CONSUMER LAG
                  </span>
                  <span className="text-amber-500 text-xs font-bold">
                    +142,500 msgs
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CLEAN CARD 3: MINI METRIC STRIP */}
          <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Ingestion Throughput:</span>
              <span className="text-primary font-bold">482,490 req/s</span>
            </div>
            <span className="text-emerald-500 font-semibold hidden sm:inline">
              99.999% SLA Uptime
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
