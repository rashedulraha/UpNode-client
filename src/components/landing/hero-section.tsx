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

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { LiveStatusDemo } from "./live-status-demo";
import { DataFlowAnimation } from "./data-flow-animation";

export function HeroSection() {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push(email ? `/register?email=${encodeURIComponent(email)}` : "/register");
    }
  };

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
      className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border overflow-hidden space-y-12"
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

      {/* MAIN HERO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
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
              onSubmit={handleStart}
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
                className="px-5 py-2.5 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all flex items-center justify-center gap-1.5 text-xs whitespace-nowrap cursor-pointer shadow-md shadow-primary/20"
              >
                <span>{isAuthenticated ? "Go to Dashboard" : "Start for free"}</span>
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

        {/* HERO RIGHT COLUMN: LIVE STATUS DEMO COMPONENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-6 relative"
        >
          <LiveStatusDemo />
        </motion.div>
      </div>

      {/* REAL-TIME DATA FLOW ANIMATION PIPELINE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pt-4"
      >
        <DataFlowAnimation />
      </motion.div>
    </section>
  );
}
