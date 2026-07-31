"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight, Check, Copy } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LogLine {
  id: number;
  ts: string;
  level: "OK" | "WARN" | "ERR" | "AI";
  msg: string;
}

// ─── Animated Log Stream ───────────────────────────────────────────────────────
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

function nowTS(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function MonitoringCard() {
  const [logs, setLogs] = useState<LogLine[]>(() =>
    LOG_POOL.slice(0, 5).map((l, i) => ({ ...l, id: i, ts: nowTS() }))
  );
  const [pointer, setPointer] = useState(5);
  const [cursor, setCursor] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 520);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setPointer((p) => {
        const next = p % LOG_POOL.length;
        const entry: LogLine = {
          ...LOG_POOL[next],
          id: Date.now(),
          ts: nowTS(),
        };
        setLogs((prev) => [...prev.slice(-11), entry]);
        return next + 1;
      });
    }, 1800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const levelStyle: Record<string, string> = {
    OK: "text-white/60",
    WARN: "text-white/55",
    ERR: "text-white/90 font-bold",
    AI: "text-white/75 italic",
  };

  const levelLabel: Record<string, string> = {
    OK: " OK ",
    WARN: "WARN",
    ERR: " ERR",
    AI: " AI ",
  };

  const levelBorder: Record<string, string> = {
    OK: "border-white/8",
    WARN: "border-white/20",
    ERR: "border-white/35",
    AI: "border-white/25",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
      className="relative w-full max-w-2xl mx-auto"
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(28px) saturate(1.2)",
          WebkitBackdropFilter: "blur(28px) saturate(1.2)",
          border: "0.5px solid rgba(255,255,255,0.10)",
          borderTop: "0.5px solid rgba(255,255,255,0.20)",
        }}
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Terminal Header */}
        <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase">
              upnode — system_health.log
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white/90" />
            </span>
            <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
              LIVE
            </span>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="relative z-10 flex items-center gap-6 px-4 py-2.5 border-b border-white/[0.06] overflow-x-auto">
          {[
            { label: "UPTIME", value: "99.98%" },
            { label: "NODES", value: "48" },
            { label: "LATENCY_P99", value: "14ms" },
            { label: "INCIDENTS", value: "0 OPEN" },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-[9px] text-white/30 tracking-widest">
                {m.label}
              </span>
              <span className="font-mono text-[11px] text-white/80 font-semibold tracking-tight">
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* Log body */}
        <div className="relative z-10 h-48 overflow-hidden px-0 py-2 font-mono text-[11px] leading-5">
          <div className="px-4 space-y-0.5">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-baseline gap-3 border-l pl-2 ${levelBorder[log.level]} ${levelStyle[log.level]}`}
                >
                  <span className="shrink-0 text-white/20">{log.ts}</span>
                  <span
                    className={`shrink-0 px-1 rounded text-[9px] tracking-widest uppercase border ${
                      log.level === "ERR"
                        ? "border-white/30 text-white/60"
                        : log.level === "AI"
                        ? "border-white/25 text-white/55"
                        : "border-white/8 text-white/25"
                    }`}
                  >
                    {levelLabel[log.level]}
                  </span>
                  <span className="truncate">{log.msg}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {/* Blinking cursor line */}
            <div className="flex items-center gap-2 pl-2 text-white/30">
              <span className="text-white/15">{nowTS()}</span>
              <span
                className="inline-block w-[7px] h-[13px] bg-white/50 align-middle"
                style={{ opacity: cursor ? 1 : 0, transition: "opacity 0.1s" }}
              />
            </div>
            <div ref={bottomRef} />
          </div>
          {/* Fade gradient at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))" }}
          />
        </div>

        {/* Footer bar */}
        <div className="relative z-10 flex items-center justify-between px-4 py-2 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            {["edge", "db", "ai_sre", "queue"].map((svc, i) => (
              <div key={svc} className="flex items-center gap-1.5">
                <span className="relative flex h-1 w-1">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50 opacity-60"
                    style={{ animationDuration: `${1.6 + i * 0.3}s` }}
                  />
                  <span className="relative inline-flex rounded-full h-1 w-1 bg-white/80" />
                </span>
                <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase">
                  {svc}
                </span>
              </div>
            ))}
          </div>
          <span className="font-mono text-[9px] text-white/20 tracking-widest">
            sse://upnode.io:443
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Scanning Line Background ──────────────────────────────────────────────────
function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.11) 50%, rgba(255,255,255,0.06) 80%, transparent)",
        }}
        initial={{ top: "-2px" }}
        animate={{ top: "110%" }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />
    </div>
  );
}

// ─── Dot Grid Background ───────────────────────────────────────────────────────
function DotGrid() {
  return (
    <div
      className="absolute inset-0 -z-20 pointer-events-none opacity-[0.16]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage:
          "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)",
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
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <section
      id="platform"
      className="relative pt-20 pb-24 sm:pt-32 sm:pb-36 overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Deep background radial */}
      <div
        className="absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #111 0%, #000 100%)",
        }}
      />

      <DotGrid />
      <ScanLine />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-10">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
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
          <span className="font-mono text-[10px] text-white/45 tracking-widest uppercase">
            Next-Gen Observability Engine — v2.0
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.0] text-white"
            style={{ fontFamily: "var(--font-sans), Inter, system-ui" }}
          >
            Incident
            <br />
            <span className="text-white/25">intelligence,</span>
            <br />
            <span
              className="relative inline-block"
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.45)",
                color: "transparent",
              }}
            >
              reimagined.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-white/38 max-w-lg mx-auto leading-relaxed font-sans"
          >
            AI-native monitoring with real-time incident routing, automated root-cause analysis,
            and self-healing playbooks — all in one austere, fast platform.
          </motion.p>
        </motion.div>

        {/* CTA Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="flex flex-col items-center gap-4 w-full max-w-md"
        >
          <form
            onSubmit={handleStart}
            className="flex flex-col sm:flex-row items-stretch gap-2 w-full"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              className="flex-1 px-4 py-2.5 text-xs font-mono text-white/70 placeholder:text-white/20 focus:outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.10)",
                borderTop: "0.5px solid rgba(255,255,255,0.16)",
                borderRadius: "10px",
              }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold font-mono tracking-wide whitespace-nowrap cursor-pointer transition-colors"
              style={{
                background: "rgba(255,255,255,0.96)",
                color: "#000",
                border: "0.5px solid rgba(255,255,255,0.3)",
                borderRadius: "10px",
              }}
            >
              {isAuthenticated ? "Go to Dashboard" : "Start free"}
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </form>

          {/* Trust micro-copy */}
          <div className="flex flex-wrap justify-center items-center gap-4 font-mono text-[10px] text-white/22 tracking-widest uppercase">
            {["14-day trial", "No credit card", "Setup in 3 min"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="w-[3px] h-[3px] rounded-full bg-white/25 inline-block" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Install command bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex items-center gap-2"
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] text-white/30"
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
            className="p-1.5 font-mono text-[10px] text-white/25 hover:text-white/55 cursor-pointer transition-colors"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
            }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </motion.button>
        </motion.div>

        {/* Glassmorphic Monitoring Card */}
        <div className="w-full mt-2">
          <MonitoringCard />
        </div>

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="w-full flex flex-wrap justify-center items-center gap-8 pt-6"
          style={{
            borderTop: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          {[
            { label: "Global Edge Nodes", value: "48" },
            { label: "Avg MTTD", value: "< 4s" },
            { label: "Incidents Resolved", value: "99.97%" },
            { label: "Engineers Trust", value: "2,400+" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span className="font-mono text-lg font-bold text-white/75 tracking-tight">
                {s.value}
              </span>
              <span className="font-mono text-[9px] text-white/22 tracking-widest uppercase">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
