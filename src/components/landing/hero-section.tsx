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
  { level: "OK", msg: "heartbeat.ping  node=us-east-1a  latency=11ms" },
  { level: "OK", msg: "heartbeat.ping  node=eu-west-2b  latency=14ms" },
  { level: "OK", msg: "ssl.cert        expires=89d       status=valid" },
  { level: "WARN", msg: "latency.spike   node=ap-south-1  p99=312ms" },
  { level: "OK", msg: "db.pool         active=24/50      idle=26" },
  { level: "ERR", msg: "http.timeout    endpoint=/checkout  code=504" },
  { level: "AI", msg: "sre.analyze     root_cause=pool_exhaustion" },
  { level: "OK", msg: "auto.scale      pg_pool.max=50   applied=true" },
  { level: "OK", msg: "status.page     incident=closed  ttm=92s" },
  { level: "OK", msg: "heartbeat.ping  node=sa-east-1c  latency=9ms" },
  { level: "WARN", msg: "cpu.high        node=eu-central  usage=87%" },
  { level: "OK", msg: "redis.hit_rate  ratio=0.94       keys=124k" },
];

let _uid = 0;
function uid() {
  return String(++_uid);
}

function nowTS(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

const INITIAL_LOGS: LogLine[] = LOG_POOL.slice(0, 9).map((l, i) => ({
  ...l,
  id: `init-${i}`,
  ts: "2026-08-06 05:12:00",
}));

// ─── Theme-Aware Borderless & Backgroundless Live Monitoring ──────────────────
function MonitoringCard() {
  const [logs, setLogs] = useState<LogLine[]>(INITIAL_LOGS);
  const poolIdxRef = useRef(9);
  const [cursor, setCursor] = useState(true);
  const [hoveredLogId, setHoveredLogId] = useState<string | null>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);

  useEffect(() => {
    setLogs(
      LOG_POOL.slice(0, 9).map((l) => ({ ...l, id: uid(), ts: nowTS() })),
    );
  }, []);

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

  const levelBadgeStyle: Record<
    string,
    { color: string; bg: string; border: string }
  > = {
    OK: {
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.12)",
      border: "rgba(16, 185, 129, 0.3)",
    },
    WARN: {
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.12)",
      border: "rgba(245, 158, 11, 0.3)",
    },
    ERR: {
      color: "#ef4444",
      bg: "rgba(239, 68, 68, 0.14)",
      border: "rgba(239, 68, 68, 0.35)",
    },
    AI: {
      color: "#38bdf8",
      bg: "rgba(56, 189, 248, 0.14)",
      border: "rgba(56, 189, 248, 0.35)",
    },
  };

  const levelLabel: Record<string, string> = {
    OK: " OK ",
    WARN: "WARN",
    ERR: " ERR",
    AI: " AI ",
  };

  return (
    <div
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      className="relative w-full py-2 cursor-default group"
    >
      <div className="relative w-full bg-transparent border-none">
        <div className="flex items-center justify-between px-2 py-2 mb-1">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[10px] tracking-widest uppercase font-semibold"
              style={{ color: "var(--lp-text-dim)" }}
            >
              upnode // telemetry.stream
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-[9px] tracking-widest uppercase font-bold text-emerald-500">
              LIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 px-2 py-1.5 mb-2 overflow-x-auto">
          {[
            { label: "UPTIME", value: "99.98%", color: "#10b981" },
            { label: "NODES", value: "48", color: "var(--lp-text-primary)" },
            { label: "P99", value: "14ms", color: "#38bdf8" },
            { label: "OPEN", value: "0 INC", color: "#a855f7" },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-1.5 shrink-0">
              <span
                className="font-mono text-[9px] tracking-widest"
                style={{ color: "var(--lp-text-faint)" }}
              >
                {m.label}
              </span>
              <span
                className="font-mono text-[10px] font-bold"
                style={{ color: m.color }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>

        <div
          className="relative h-[340px] sm:h-[350px] overflow-hidden py-1 transition-all duration-500"
          style={{
            opacity: isCardHovered ? 1 : 0.45,
          }}
        >
          <div className="space-y-1.5">
            {logs.map((log) => {
              const isHovered = hoveredLogId === log.id;
              const badge = levelBadgeStyle[log.level];

              return (
                <div
                  key={log.id}
                  onMouseEnter={() => setHoveredLogId(log.id)}
                  onMouseLeave={() => setHoveredLogId(null)}
                  className="flex items-baseline gap-2.5 py-1 px-2.5 font-mono text-[10px] rounded-lg transition-all duration-300"
                  style={{
                    background: isHovered
                      ? "var(--lp-surface-hover)"
                      : "transparent",
                  }}
                >
                  <span
                    className="shrink-0 transition-colors duration-300"
                    style={{
                      color: isHovered
                        ? "var(--lp-text-primary)"
                        : "var(--lp-text-faint)",
                    }}
                    suppressHydrationWarning
                  >
                    {log.ts}
                  </span>
                  <span
                    className="shrink-0 px-1.5 py-0.5 rounded text-[8px] tracking-widest uppercase font-bold transition-all duration-300"
                    style={{
                      color: badge.color,
                      backgroundColor: isHovered ? badge.bg : "transparent",
                      border: `0.5px solid ${badge.border}`,
                    }}
                  >
                    {levelLabel[log.level]}
                  </span>
                  <span
                    className="truncate transition-colors duration-300"
                    style={{
                      color: isHovered
                        ? "var(--lp-text-primary)"
                        : "var(--lp-text-mid)",
                      fontWeight: isHovered ? "600" : "400",
                    }}
                  >
                    {log.msg}
                  </span>
                </div>
              );
            })}

            <div
              className="flex items-center gap-2 px-2.5 py-1 font-mono text-[10px]"
              style={{ color: "var(--lp-text-dim)" }}
            >
              <span style={{ color: "var(--lp-text-faint)" }}>{nowTS()}</span>
              <span
                className="inline-block w-[6px] h-[12px] align-middle bg-emerald-500"
                style={{
                  opacity: cursor ? 1 : 0,
                  transition: "opacity 0.1s",
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 py-2 mt-1">
          <div className="flex items-center gap-3">
            {["edge", "db", "ai_sre", "queue"].map((svc, i) => (
              <div key={svc} className="flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-55"
                    style={{
                      animationDuration: `${1.6 + i * 0.35}s`,
                    }}
                  />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span
                  className="font-mono text-[8px] tracking-widest uppercase ml-1"
                  style={{ color: "var(--lp-text-faint)" }}
                >
                  {svc}
                </span>
              </div>
            ))}
          </div>
          <span
            className="font-mono text-[8px] tracking-widest"
            style={{ color: "var(--lp-text-faint)" }}
          >
            sse://upnode.io:443
          </span>
        </div>
      </div>
    </div>
  );
}

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 space-y-5 pt-2"
          >
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

            <motion.div variants={itemVariants}>
              <h1
                className="text-[2.6rem] sm:text-5xl lg:text-[3.4rem] font-bold tracking-tighter leading-[1.08]"
                style={{
                  color: "var(--lp-text-primary)",
                  fontFamily: "var(--font-sans), Inter, system-ui",
                }}
              >
                Incident{" "}
                <span style={{ color: "var(--lp-text-dim)" }}>
                  intelligence,
                </span>
                <br />
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

            <motion.p
              variants={itemVariants}
              className="text-[13px] leading-relaxed font-sans max-w-md"
              style={{ color: "var(--lp-text-mid)" }}
            >
              AI-native monitoring with real-time incident routing, automated
              root-cause analysis, and self-healing playbooks.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="space-y-2.5 max-w-sm"
            >
              {isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold font-mono whitespace-nowrap cursor-pointer shadow-md"
                  style={{
                    background: "var(--lp-cta-bg)",
                    color: "var(--lp-cta-text)",
                    border: "0.5px solid var(--lp-border-top)",
                    borderRadius: "9px",
                  }}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Go to Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              ) : (
                <form onSubmit={handleStart} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Work email"
                    className="flex-1 min-w-0 px-3 py-2 text-xs font-mono focus:outline-none transition-all"
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
                    className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-semibold font-mono whitespace-nowrap cursor-pointer"
                    style={{
                      background: "var(--lp-cta-bg)",
                      color: "var(--lp-cta-text)",
                      border: "0.5px solid var(--lp-border-top)",
                      borderRadius: "9px",
                    }}
                  >
                    Start free
                    <ArrowRight className="w-3 h-3" />
                  </motion.button>
                </form>
              )}

              <div
                className="flex flex-wrap items-center gap-3 font-mono text-[9px] tracking-widest uppercase"
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

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
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
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-5 pt-3"
              style={{
                borderTop: "0.5px solid var(--lp-border)",
              }}
            >
              {[
                { label: "Edge Nodes", value: "48" },
                { label: "Avg MTTD", value: "< 4s" },
                { label: "Resolved", value: "99.97%" },
                { label: "Engineers", value: "2,400+" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span
                    className="font-mono text-sm font-bold tracking-tight"
                    style={{ color: "var(--lp-text-mid)" }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="font-mono text-[8px] tracking-widest uppercase"
                    style={{ color: "var(--lp-text-faint)" }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="lg:col-span-6 w-full pt-2">
            <MonitoringCard />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
