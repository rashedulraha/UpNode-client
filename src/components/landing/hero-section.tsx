"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Check, Copy } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
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

// Monotonic counter — module-scoped, never resets, never collides
let _uid = 0;
function uid() { return String(++_uid); }

function nowTS(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

// ─── Monitoring Card (right column) ───────────────────────────────────────────
function MonitoringCard() {
  const [logs, setLogs] = useState<LogLine[]>(() =>
    LOG_POOL.slice(0, 5).map((l, i) => ({ ...l, id: uid(), ts: nowTS() }))
  );
  const poolIdxRef = useRef(5);
  const [cursor, setCursor] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // blinking cursor
  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 520);
    return () => clearInterval(t);
  }, []);

  // stream new log lines
  useEffect(() => {
    const t = setInterval(() => {
      const idx = poolIdxRef.current % LOG_POOL.length;
      poolIdxRef.current += 1;
      const entry: LogLine = { ...LOG_POOL[idx], id: uid(), ts: nowTS() };
      setLogs((prev) => [...prev.slice(-10), entry]);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const levelStyle: Record<string, string> = {
    OK:   "text-white/55",
    WARN: "text-white/55",
    ERR:  "text-white/85 font-bold",
    AI:   "text-white/70 italic",
  };
  const levelLabel: Record<string, string> = {
    OK: " OK ", WARN: "WARN", ERR: " ERR", AI: " AI ",
  };
  const levelBorderColor: Record<string, string> = {
    OK:   "rgba(255,255,255,0.08)",
    WARN: "rgba(255,255,255,0.22)",
    ERR:  "rgba(255,255,255,0.38)",
    AI:   "rgba(255,255,255,0.25)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="relative w-full"
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(28px) saturate(1.2)",
          WebkitBackdropFilter: "blur(28px) saturate(1.2)",
          border: "0.5px solid rgba(255,255,255,0.10)",
          borderTop: "0.5px solid rgba(255,255,255,0.22)",
        }}
      >
        {/* Noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Terminal Header */}
        <div
          className="relative z-10 flex items-center justify-between px-4 py-2.5"
          style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/15" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
            <span className="font-mono text-[10px] text-white/28 tracking-widest uppercase">
              upnode — system_health.log
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white/90" />
            </span>
            <span className="font-mono text-[9px] text-white/35 tracking-widest uppercase">LIVE</span>
          </div>
        </div>

        {/* Metrics strip */}
        <div
          className="relative z-10 flex items-center gap-4 px-4 py-2 overflow-x-auto"
          style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}
        >
          {[
            { label: "UPTIME", value: "99.98%" },
            { label: "NODES", value: "48" },
            { label: "P99", value: "14ms" },
            { label: "OPEN", value: "0 INC" },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-1.5 shrink-0">
              <span className="font-mono text-[9px] text-white/25 tracking-widest">{m.label}</span>
              <span className="font-mono text-[10px] text-white/75 font-semibold">{m.value}</span>
            </div>
          ))}
        </div>

        {/* Log body */}
        <div className="relative z-10 h-52 overflow-hidden py-2">
          <div className="px-4 space-y-px">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`flex items-baseline gap-2.5 py-px border-l pl-2 font-mono text-[10px] ${levelStyle[log.level]}`}
                style={{ borderLeftColor: levelBorderColor[log.level] }}
              >
                <span className="shrink-0 text-white/18">{log.ts}</span>
                <span
                  className="shrink-0 px-1 rounded text-[8px] tracking-widest uppercase"
                  style={{ border: "0.5px solid rgba(255,255,255,0.12)" }}
                >
                  {levelLabel[log.level]}
                </span>
                <span className="truncate">{log.msg}</span>
              </div>
            ))}

            {/* Blinking cursor */}
            <div className="flex items-center gap-2 pl-2 font-mono text-[10px] text-white/25">
              <span className="text-white/12">{nowTS()}</span>
              <span
                className="inline-block w-[6px] h-[12px] bg-white/45 align-middle"
                style={{ opacity: cursor ? 1 : 0, transition: "opacity 0.1s" }}
              />
            </div>
            <div ref={bottomRef} />
          </div>

          {/* Fade out bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))" }}
          />
        </div>

        {/* Footer */}
        <div
          className="relative z-10 flex items-center justify-between px-4 py-2"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-3">
            {["edge", "db", "ai_sre", "queue"].map((svc, i) => (
              <div key={svc} className="flex items-center gap-1">
                <span className="relative flex h-1 w-1">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50 opacity-55"
                    style={{ animationDuration: `${1.6 + i * 0.35}s` }}
                  />
                  <span className="relative inline-flex rounded-full h-1 w-1 bg-white/75" />
                </span>
                <span className="font-mono text-[8px] text-white/25 tracking-widest uppercase ml-1">{svc}</span>
              </div>
            ))}
          </div>
          <span className="font-mono text-[8px] text-white/18 tracking-widest">sse://upnode.io:443</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Scanning Line Background ──────────────────────────────────────────────────
function ScanLine() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <motion.div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.11) 50%, rgba(255,255,255,0.06) 80%, transparent)",
          zIndex: 0,
        }}
        initial={{ top: "-2px" }}
        animate={{ top: "110%" }}
        transition={{ duration: 9, ease: "linear", repeat: Infinity, repeatDelay: 4 }}
      />
    </div>
  );
}

// ─── Dot Grid Background ───────────────────────────────────────────────────────
function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.50) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        opacity: 0.14,
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
    <section
      id="platform"
      className="relative py-20 sm:py-28"
      style={{ background: "#000" }}
    >
      {/* Radial gradient sky */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 55% at 50% 0%, #111 0%, #000 100%)",
          zIndex: 0,
        }}
      />

      <DotGrid />
      <ScanLine />

      {/* ─── Two-Column Layout ─────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT COLUMN: Text & CTA ──────────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Live badge */}
            <motion.div variants={itemVariants}>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] text-white/45 tracking-widest uppercase"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(255,255,255,0.10)",
                  borderTop: "0.5px solid rgba(255,255,255,0.20)",
                }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                </span>
                Next-Gen Observability Engine — v2.0
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="space-y-2">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] text-white"
                style={{ fontFamily: "var(--font-sans), Inter, system-ui" }}
              >
                Incident
                <br />
                <span className="text-white/25">intelligence,</span>
                <br />
                <span
                  style={{
                    WebkitTextStroke: "1px rgba(255,255,255,0.45)",
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
              className="text-sm text-white/38 leading-relaxed font-sans max-w-sm"
            >
              AI-native monitoring with real-time incident routing, automated root-cause
              analysis, and self-healing playbooks — all in one fast, austere platform.
            </motion.p>

            {/* CTA form */}
            <motion.div variants={itemVariants} className="space-y-3 max-w-sm">
              <form onSubmit={handleStart} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work email"
                  className="flex-1 min-w-0 px-3.5 py-2.5 text-xs font-mono text-white/70 placeholder:text-white/20 focus:outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.10)",
                    borderTop: "0.5px solid rgba(255,255,255,0.18)",
                    borderRadius: "10px",
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold font-mono text-black whitespace-nowrap cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    border: "0.5px solid rgba(255,255,255,0.3)",
                    borderRadius: "10px",
                  }}
                >
                  {isAuthenticated ? "Dashboard" : "Start free"}
                  <ArrowRight className="w-3 h-3" />
                </motion.button>
              </form>

              {/* Trust copy */}
              <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] text-white/22 tracking-widest uppercase">
                {["14-day trial", "No credit card", "3 min setup"].map((t) => (
                  <span key={t} className="flex items-center gap-1">
                    <span className="w-[3px] h-[3px] rounded-full bg-white/25 inline-block" />
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Install command */}
            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] text-white/30"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                }}
              >
                <span className="text-white/18">$</span>
                <span>npx create-upnode-app@latest</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={handleCopy}
                className="p-1.5 text-white/25 hover:text-white/55 cursor-pointer transition-colors"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                }}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </motion.button>
            </motion.div>

            {/* Bottom stats row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6 pt-2"
              style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
            >
              {[
                { label: "Edge Nodes", value: "48" },
                { label: "Avg MTTD", value: "< 4s" },
                { label: "Resolved", value: "99.97%" },
                { label: "Engineers", value: "2,400+" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-base font-bold text-white/70 tracking-tight">{s.value}</span>
                  <span className="font-mono text-[8px] text-white/22 tracking-widest uppercase">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN: Monitoring Card ────────────────────────────── */}
          <div className="w-full">
            <MonitoringCard />
          </div>
        </div>
      </div>
    </section>
  );
}
