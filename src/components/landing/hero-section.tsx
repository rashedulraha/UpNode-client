"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Check, Copy, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface LogLine {
  id: string;
  ts: string;
  level: "OK" | "WARN" | "ERR" | "AI";
  msg: string;
}

const LOG_POOL: Omit<LogLine, "id" | "ts">[] = [
  { level: "OK",   msg: "heartbeat.ping  node=us-east-1a  latency=11ms" },
  { level: "OK",   msg: "heartbeat.ping  node=eu-west-2b  latency=14ms" },
  { level: "OK",   msg: "ssl.cert        expires=89d       status=valid" },
  { level: "WARN", msg: "latency.spike   node=ap-south-1  p99=312ms" },
  { level: "OK",   msg: "db.pool         active=24/50      idle=26" },
  { level: "ERR",  msg: "http.timeout    endpoint=/checkout  code=504" },
  { level: "AI",   msg: "sre.analyze     root_cause=pool_exhaustion" },
  { level: "OK",   msg: "auto.scale      pg_pool.max=50   applied=true" },
  { level: "OK",   msg: "status.page     incident=closed  ttm=92s" },
  { level: "OK",   msg: "heartbeat.ping  node=sa-east-1c  latency=9ms" },
  { level: "WARN", msg: "cpu.high        node=eu-central  usage=87%" },
  { level: "OK",   msg: "redis.hit_rate  ratio=0.94       keys=124k" },
];

let _uid = 0;
function uid() { return String(++_uid); }

function nowTS(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

// ─── Monitoring Card ───────────────────────────────────────────────────────────
function MonitoringCard() {
  const [logs, setLogs] = useState<LogLine[]>(() =>
    LOG_POOL.slice(0, 9).map((l) => ({ ...l, id: uid(), ts: nowTS() }))
  );
  const poolIdxRef = useRef(9);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 520);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const idx = poolIdxRef.current % LOG_POOL.length;
      poolIdxRef.current += 1;
      const entry: LogLine = { ...LOG_POOL[idx], id: uid(), ts: nowTS() };
      setLogs((prev) => [...prev.slice(-14), entry]);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const levelBadgeStyle: Record<string, { color: string; borderColor: string }> = {
    OK:   { color: "#4ade80", borderColor: "rgba(74, 222, 128, 0.35)" },
    WARN: { color: "#fbbf24", borderColor: "rgba(251, 191, 36, 0.35)" },
    ERR:  { color: "#f87171", borderColor: "rgba(248, 113, 113, 0.4)" },
    AI:   { color: "#38bdf8", borderColor: "rgba(56, 189, 248, 0.35)" },
  };

  const levelMsgStyle: Record<string, { color?: string; fontStyle?: string; fontWeight?: string }> = {
    OK:   { color: "var(--lp-text-primary)" },
    WARN: { color: "var(--lp-text-primary)" },
    ERR:  { color: "#f87171", fontWeight: "600" },
    AI:   { color: "#c084fc", fontStyle: "italic" },
  };

  const levelLabel: Record<string, string> = {
    OK: " OK ", WARN: "WARN", ERR: " ERR", AI: " AI ",
  };

  return (
    <div
      className="relative w-full py-2"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        initial={{ opacity: 0, x: 24, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        style={{
          transform: "rotateY(-7deg) rotateX(3deg)",
          transformStyle: "preserve-3d",
        }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full"
      >
        {/* Terminal Card Container - Static Clean Theme Frame */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "var(--lp-surface)",
            backdropFilter: "blur(28px) saturate(1.2)",
            WebkitBackdropFilter: "blur(28px) saturate(1.2)",
            border: "0.5px solid var(--lp-border)",
            borderTop: "0.5px solid var(--lp-border-top)",
          }}
        >
          {/* Terminal Header */}
          <div
            className="relative z-10 flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: "0.5px solid var(--lp-border)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {[1,2,3].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ background: "var(--lp-border-top)" }} />
                ))}
              </div>
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--lp-text-faint)" }}>
                upnode — system_health.log
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "var(--lp-text-mid)" }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: "var(--lp-text-primary)" }} />
              </span>
              <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: "var(--lp-text-dim)" }}>LIVE</span>
            </div>
          </div>

          {/* Metrics strip */}
          <div className="relative z-10 flex items-center gap-4 px-4 py-2.5 overflow-x-auto"
            style={{ borderBottom: "0.5px solid var(--lp-border)" }}>
            {[
              { label: "UPTIME", value: "99.98%" },
              { label: "NODES",  value: "48" },
              { label: "P99",    value: "14ms" },
              { label: "OPEN",   value: "0 INC" },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-1.5 shrink-0">
                <span className="font-mono text-[9px] tracking-widest" style={{ color: "var(--lp-text-faint)" }}>{m.label}</span>
                <span className="font-mono text-[10px] font-semibold" style={{ color: "var(--lp-text-mid)" }}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* Log body - Increased height to match left column */}
          <div className="relative z-10 h-[340px] sm:h-[350px] overflow-hidden py-3">
            <div className="px-4 space-y-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-baseline gap-2.5 py-0.5 border-l pl-2.5 font-mono text-[10px]"
                  style={{
                    borderLeftColor: "var(--lp-border)",
                  }}
                >
                  <span className="shrink-0" style={{ color: "var(--lp-text-faint)" }}>{log.ts}</span>
                  <span
                    className="shrink-0 px-1 rounded text-[8px] tracking-widest uppercase font-bold"
                    style={{
                      color: levelBadgeStyle[log.level].color,
                      border: `0.5px solid ${levelBadgeStyle[log.level].borderColor}`,
                    }}
                  >
                    {levelLabel[log.level]}
                  </span>
                  <span
                    className="truncate"
                    style={{
                      color: levelMsgStyle[log.level].color || "var(--lp-text-primary)",
                      fontStyle: levelMsgStyle[log.level].fontStyle || "normal",
                      fontWeight: levelMsgStyle[log.level].fontWeight || "normal",
                    }}
                  >
                    {log.msg}
                  </span>
                </div>
              ))}

              {/* Blinking cursor */}
              <div className="flex items-center gap-2 pl-2.5 font-mono text-[10px]" style={{ color: "var(--lp-text-dim)" }}>
                <span style={{ color: "var(--lp-text-faint)" }}>{nowTS()}</span>
                <span
                  className="inline-block w-[6px] h-[12px] align-middle"
                  style={{ background: "var(--lp-text-mid)", opacity: cursor ? 1 : 0, transition: "opacity 0.1s" }}
                />
              </div>
            </div>
            {/* Fade bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
              style={{ background: `linear-gradient(to bottom, transparent, var(--lp-bg))` }} />
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center justify-between px-4 py-2.5"
            style={{ borderTop: "0.5px solid var(--lp-border)" }}>
            <div className="flex items-center gap-3">
              {["edge","db","ai_sre","queue"].map((svc, i) => (
                <div key={svc} className="flex items-center gap-1">
                  <span className="relative flex h-1 w-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-55"
                      style={{ background: "var(--lp-text-mid)", animationDuration: `${1.6 + i * 0.35}s` }} />
                    <span className="relative inline-flex rounded-full h-1 w-1" style={{ background: "var(--lp-text-mid)" }} />
                  </span>
                  <span className="font-mono text-[8px] tracking-widest uppercase ml-1" style={{ color: "var(--lp-text-faint)" }}>{svc}</span>
                </div>
              ))}
            </div>
            <span className="font-mono text-[8px] tracking-widest" style={{ color: "var(--lp-text-faint)" }}>sse://upnode.io:443</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Scanning Line ─────────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <motion.div
        className="absolute left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(to right, transparent, var(--lp-scan-line) 20%, var(--lp-border) 50%, var(--lp-scan-line) 80%, transparent)` }}
        initial={{ top: "-2px" }}
        animate={{ top: "110%" }}
        transition={{ duration: 9, ease: "linear", repeat: Infinity, repeatDelay: 4 }}
      />
    </div>
  );
}

// ─── Dot Grid ──────────────────────────────────────────────────────────────────
function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        backgroundImage: "radial-gradient(circle, var(--lp-dot) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        opacity: 0.15,
        maskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, black 35%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, black 35%, transparent 100%)",
      }}
    />
  );
}

// ─── Main Hero Section ─────────────────────────────────────────────────────────
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

  const handleCopy = () => {
    navigator.clipboard.writeText("npx create-upnode-app@latest");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.60, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <section id="platform" className="relative pt-14 pb-10 sm:pt-20 sm:pb-14"
      style={{ background: "var(--lp-bg)" }}>

      {/* Radial gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0,
        background: "radial-gradient(ellipse 80% 55% at 50% 0%, var(--lp-bg-alt) 0%, var(--lp-bg) 100%)" }} />

      <DotGrid />
      <ScanLine />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* ── LEFT: Text & CTA ───────────────────────────────────────────── */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible"
            className="space-y-5 pt-2">

            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase"
                style={{ background: "var(--lp-surface)", border: "0.5px solid var(--lp-border)", borderTop: "0.5px solid var(--lp-border-top)", color: "var(--lp-text-dim)" }}>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: "var(--lp-text-mid)" }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{ background: "var(--lp-text-primary)" }} />
                </span>
                Next-Gen Observability Engine — v2.0
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants}>
              <h1 className="text-[2.6rem] sm:text-5xl lg:text-[3.5rem] font-bold tracking-tighter leading-[1.08]"
                style={{ color: "var(--lp-text-primary)", fontFamily: "var(--font-sans), Inter, system-ui" }}>
                Incident{" "}
                <span style={{ color: "var(--lp-text-dim)" }}>intelligence,</span>
                <br />
                <span style={{ WebkitTextStroke: "1px var(--lp-border-top)", color: "transparent" }}>
                  reimagined.
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-[13px] leading-relaxed font-sans max-w-xs"
              style={{ color: "var(--lp-text-mid)" }}>
              AI-native monitoring with real-time incident routing, automated root-cause analysis, and self-healing playbooks.
            </motion.p>

            {/* CTA form or Logged-in Button */}
            <motion.div variants={itemVariants} className="space-y-2.5 max-w-xs">
              {isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold font-mono whitespace-nowrap cursor-pointer shadow-md"
                  style={{
                    background: "var(--lp-cta-bg)", color: "var(--lp-cta-text)",
                    border: "0.5px solid var(--lp-border-top)", borderRadius: "9px",
                  }}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Go to Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              ) : (
                <form onSubmit={handleStart} className="flex gap-2">
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Work email"
                    className="flex-1 min-w-0 px-3 py-2 text-xs font-mono focus:outline-none transition-all"
                    style={{
                      background: "var(--lp-surface)", color: "var(--lp-text-mid)",
                      border: "0.5px solid var(--lp-border)", borderTop: "0.5px solid var(--lp-border-top)",
                      borderRadius: "9px",
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-semibold font-mono whitespace-nowrap cursor-pointer"
                    style={{
                      background: "var(--lp-cta-bg)", color: "var(--lp-cta-text)",
                      border: "0.5px solid var(--lp-border-top)", borderRadius: "9px",
                    }}
                  >
                    Start free
                    <ArrowRight className="w-3 h-3" />
                  </motion.button>
                </form>
              )}

              <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] tracking-widest uppercase"
                style={{ color: "var(--lp-text-faint)" }}>
                {["14-day trial", "No credit card", "3 min setup"].map((t) => (
                  <span key={t} className="flex items-center gap-1">
                    <span className="w-[3px] h-[3px] rounded-full inline-block" style={{ background: "var(--lp-text-faint)" }} />
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Install command */}
            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 font-mono text-[10px]"
                style={{ background: "var(--lp-surface)", border: "0.5px solid var(--lp-border)", borderRadius: "8px", color: "var(--lp-text-dim)" }}>
                <span style={{ color: "var(--lp-text-faint)" }}>$</span>
                <span>npx create-upnode-app@latest</span>
              </div>
              <motion.button whileTap={{ scale: 0.94 }} onClick={handleCopy}
                className="p-1.5 cursor-pointer transition-colors"
                style={{ background: "var(--lp-surface)", border: "0.5px solid var(--lp-border)", borderRadius: "8px", color: "var(--lp-text-dim)" }}>
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-5"
              style={{ borderTop: "0.5px solid var(--lp-border)", paddingTop: "12px" }}>
              {[
                { label: "Edge Nodes", value: "48" },
                { label: "Avg MTTD",   value: "< 4s" },
                { label: "Resolved",   value: "99.97%" },
                { label: "Engineers",  value: "2,400+" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-sm font-bold tracking-tight" style={{ color: "var(--lp-text-mid)" }}>{s.value}</span>
                  <span className="font-mono text-[8px] tracking-widest uppercase" style={{ color: "var(--lp-text-faint)" }}>{s.label}</span>
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
