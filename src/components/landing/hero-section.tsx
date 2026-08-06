"use client";

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Check, Copy, LayoutDashboard, Activity, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

// ─── Interactive Tech Visual (Huly.io Inspired Subtle Borderless Element) ────
function InteractiveTechVisual() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-5xl mx-auto mt-10 sm:mt-14 h-[240px] sm:h-[320px] flex items-center justify-center cursor-default group"
    >
      {/* Background Central Ambient Light Portal (Huly.io Style Glow) */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out"
        style={{
          opacity: isHovered ? 0.85 : 0.18,
          filter: isHovered ? "blur(50px)" : "blur(75px)",
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(56, 189, 248, 0.28) 0%, rgba(168, 85, 247, 0.18) 50%, transparent 100%)",
        }}
      />

      {/* Central Vertical Energy Pillar Line */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] pointer-events-none transition-all duration-700 ease-out"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.7) 25%, rgba(192, 132, 252, 0.9) 50%, rgba(56, 189, 248, 0.7) 75%, transparent)",
          opacity: isHovered ? 0.95 : 0.25,
          boxShadow: isHovered ? "0 0 25px rgba(56, 189, 248, 0.8)" : "none",
        }}
      />

      {/* Floating Borderless Wireframe Telemetry Elements */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-around px-4 sm:px-12 transition-all duration-700 ease-out"
        style={{
          opacity: isHovered ? 1 : 0.25,
          transform: isHovered ? "scale(1.02) translateY(-2px)" : "scale(0.98) translateY(0px)",
        }}
      >
        {/* Left Telemetry Wireframe Card (Subtle & Borderless) */}
        <div
          className="hidden md:flex flex-col gap-2.5 p-4 font-mono text-[10px] backdrop-blur-xs transition-all duration-500 rounded-xl"
          style={{
            color: "var(--lp-text-dim)",
            background: isHovered ? "rgba(255, 255, 255, 0.02)" : "transparent",
            border: isHovered ? "0.5px solid rgba(56, 189, 248, 0.25)" : "0.5px solid transparent",
          }}
        >
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span style={{ color: "var(--lp-text-faint)" }}>EDGE_TELEMETRY // AP-SOUTH</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-200 dark:text-neutral-200">
            Latency: 11ms • P99: 14ms
          </div>
          <div className="w-36 h-1 bg-slate-800/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-700"
              style={{ width: isHovered ? "88%" : "40%" }}
            />
          </div>
        </div>

        {/* Center Glowing Orbital Pulse Node */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-700"
            style={{
              boxShadow: isHovered ? "0 0 35px rgba(56, 189, 248, 0.4)" : "none",
              border: isHovered ? "0.5px solid rgba(56, 189, 248, 0.6)" : "0.5px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div className="w-8 h-8 rounded-full bg-cyan-400/40 animate-ping opacity-40" />
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />
          </div>
        </div>

        {/* Right Telemetry Wireframe Card (Subtle & Borderless) */}
        <div
          className="hidden md:flex flex-col gap-2.5 p-4 font-mono text-[10px] backdrop-blur-xs transition-all duration-500 rounded-xl"
          style={{
            color: "var(--lp-text-dim)",
            background: isHovered ? "rgba(255, 255, 255, 0.02)" : "transparent",
            border: isHovered ? "0.5px solid rgba(192, 132, 252, 0.25)" : "0.5px solid transparent",
          }}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span style={{ color: "var(--lp-text-faint)" }}>AI_SRE // AUTO_HEAL</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-200 dark:text-neutral-200">
            Pool Exhaustion Mitigated
          </div>
          <div className="text-[9px] text-purple-400 font-mono">
            [STATUS: ZERO_DB_LOCKUP]
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Background Scan Line ───────────────────────────────────────────────────
function ScanLine() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <motion.div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--lp-scan-line) 20%, var(--lp-border) 50%, var(--lp-scan-line) 80%, transparent)",
        }}
        initial={{ top: "-2px" }}
        animate={{ top: "110%" }}
        transition={{
          duration: 9,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 4,
        }}
      />
    </div>
  );
}

// ─── Dot Grid Background ────────────────────────────────────────────────────
function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        backgroundImage:
          "radial-gradient(circle, var(--lp-dot) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        opacity: 0.15,
        maskImage:
          "radial-gradient(ellipse 75% 65% at 50% 50%, black 35%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 75% 65% at 50% 50%, black 35%, transparent 100%)",
      }}
    />
  );
}

// ─── Main Hero Section Component ───────────────────────────────────────────
export function HeroSection() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push(
        email ? `/register?email=${encodeURIComponent(email)}` : "/register",
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("npx create-upnode-app@latest");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.11, delayChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      id="platform"
      className="relative pt-14 pb-12 sm:pt-20 sm:pb-16 overflow-hidden"
      style={{ background: "var(--lp-bg)" }}
    >
      {/* Radial Background Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(ellipse 80% 55% at 50% 0%, var(--lp-bg-alt) 0%, var(--lp-bg) 100%)",
        }}
      />

      <DotGrid />
      <ScanLine />

      {/* Main Centered Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 flex flex-col items-center w-full"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase"
              style={{
                background: "var(--lp-surface)",
                border: "0.5px solid var(--lp-border)",
                borderTop: "0.5px solid var(--lp-border-top)",
                color: "var(--lp-text-dim)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "var(--lp-text-mid)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: "var(--lp-text-primary)" }}
                />
              </span>
              Next-Gen Observability Engine — v2.0
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants} className="max-w-3xl">
            <h1
              className="text-4xl sm:text-6xl lg:text-[4rem] font-bold tracking-tighter leading-[1.08] text-center"
              style={{
                color: "var(--lp-text-primary)",
                fontFamily: "var(--font-sans), Inter, system-ui",
              }}
            >
              Incident{" "}
              <span style={{ color: "var(--lp-text-dim)" }}>
                intelligence,
              </span>{" "}
              <span
                style={{
                  WebkitTextStroke: "1px var(--lp-border-top)",
                  color: "transparent",
                }}
              >
                reimagined.
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base leading-relaxed font-sans max-w-xl text-center"
            style={{ color: "var(--lp-text-mid)" }}
          >
            AI-native monitoring with real-time incident routing, automated
            root-cause analysis, and self-healing playbooks.
          </motion.p>

          {/* CTA form or Logged-in Button */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-3 w-full max-w-md"
          >
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 px-6 py-3 text-xs font-semibold font-mono whitespace-nowrap cursor-pointer shadow-md"
                style={{
                  background: "var(--lp-cta-bg)",
                  color: "var(--lp-cta-text)",
                  border: "0.5px solid var(--lp-border-top)",
                  borderRadius: "9px",
                }}
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <form onSubmit={handleStart} className="flex gap-2 w-full max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work email"
                  className="flex-1 min-w-0 px-3.5 py-2.5 text-xs font-mono focus:outline-none transition-all"
                  style={{
                    background: "var(--lp-surface)",
                    color: "var(--lp-text-mid)",
                    border: "0.5px solid var(--lp-border)",
                    borderTop: "0.5px solid var(--lp-border-top)",
                    borderRadius: "9px",
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold font-mono whitespace-nowrap cursor-pointer"
                  style={{
                    background: "var(--lp-cta-bg)",
                    color: "var(--lp-cta-text)",
                    border: "0.5px solid var(--lp-border-top)",
                    borderRadius: "9px",
                  }}
                >
                  Start free
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </form>
            )}

            <div
              className="flex flex-wrap items-center justify-center gap-3 font-mono text-[9px] tracking-widest uppercase"
              style={{ color: "var(--lp-text-faint)" }}
            >
              {["14-day trial", "No credit card", "3 min setup"].map((t) => (
                <span key={t} className="flex items-center gap-1">
                  <span
                    className="w-[3px] h-[3px] rounded-full inline-block"
                    style={{ background: "var(--lp-text-faint)" }}
                  />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Install command */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-2"
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 font-mono text-[10px]"
              style={{
                background: "var(--lp-surface)",
                border: "0.5px solid var(--lp-border)",
                borderRadius: "8px",
                color: "var(--lp-text-dim)",
              }}
            >
              <span style={{ color: "var(--lp-text-faint)" }}>$</span>
              <span>npx create-upnode-app@latest</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleCopy}
              className="p-1.5 cursor-pointer transition-colors"
              style={{
                background: "var(--lp-surface)",
                border: "0.5px solid var(--lp-border)",
                borderRadius: "8px",
                color: "var(--lp-text-dim)",
              }}
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Monitoring Card ──────────────────────────────────────── */}
          <div className="w-full pt-2">
            <MonitoringCard />
          </div>
        </div>
      </div>
    </section>
  );
}
