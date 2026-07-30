"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Database,
  FileText,
  Filter,
  Globe,
  HardDrive,
  Layers,
  Lock,
  Radio,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  Wifi,
  Zap,
} from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [ctaEmail, setCtaEmail] = useState("");
  const [logFilter, setLogFilter] = useState<"ALL" | "ERROR" | "WARN" | "INFO">("ALL");
  const [logSearch, setLogSearch] = useState("");
  const [activePipelineStep, setActivePipelineStep] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const logs = [
    {
      id: "LOG-9102",
      time: "01:14:02.891",
      level: "ERROR",
      service: "auth-vault-prod",
      message: "TLS handshake failed: SSL Certificate Expired (x509: certificate has expired)",
      latency: "0.4ms",
    },
    {
      id: "LOG-9103",
      time: "01:14:03.012",
      level: "WARN",
      service: "kafka-ingest-us-east",
      message: "Consumer lag threshold exceeded (+142,500 msgs). Auto-scaling worker pool from 8 -> 24",
      latency: "1.2ms",
    },
    {
      id: "LOG-9104",
      time: "01:14:03.140",
      level: "INFO",
      service: "bullmq-redis-cluster",
      message: "Queue buffer flushed successfully. 450,000 jobs processed in 84ms",
      latency: "0.2ms",
    },
    {
      id: "LOG-9105",
      time: "01:14:03.220",
      level: "ERROR",
      service: "payment-gateway",
      message: "HTTP 504 Gateway Timeout on upstream provider API (retry 2/3 scheduled)",
      latency: "4.8ms",
    },
    {
      id: "LOG-9106",
      time: "01:14:03.350",
      level: "INFO",
      service: "sse-broadcast-edge",
      message: "Pushed incident notification #INC-8402 to 1,420 connected SRE sessions",
      latency: "0.8ms",
    },
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = logFilter === "ALL" || log.level === logFilter;
    const matchesSearch =
      log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.service.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.id.toLowerCase().includes(logSearch.toLowerCase());
    return matchesLevel && matchesSearch;
  });

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
    <div className="min-h-screen bg-[#050608] text-zinc-100 font-sans selection:bg-indigo-500/20 selection:text-indigo-200 relative scroll-smooth">
      {/* 1. STICKY SEAMLESS HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#050608]/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Left Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative p-1.5 rounded-lg bg-white/[0.04] text-white">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span className="absolute top-0.5 right-0.5 flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-2">
              PulseScale
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-indigo-300">
                v2.6
              </span>
            </span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#platform" className="hover:text-white transition-colors">
              Platform
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              Architecture
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
          </nav>

          {/* Right Action Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black transition-all flex items-center gap-1"
            >
              <span>Sign up</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. HERO / PLATFORM SECTION */}
        <section id="platform" className="pt-16 pb-20 sm:pt-24 sm:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center border-b border-white/[0.06]">
          {/* HERO LEFT COLUMN */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-6 space-y-6"
          >
            {/* Minimal Pill Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] text-xs font-mono text-zinc-300">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Next-Gen Observability Engine</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.1]">
              Incident management <br />
              <span className="text-indigo-400 font-normal">
                designed for 2026.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeInUp} className="text-zinc-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              AI-native incident management with built-in on-call and status pages in one beautifully made product. Zero DB lockup during high-volume spikes.
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
                  className="flex-1 px-4 py-2.5 bg-white/[0.03] rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:bg-white/[0.06] transition-all font-sans"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-semibold bg-white hover:bg-zinc-200 text-black transition-all flex items-center justify-center gap-1.5 text-xs whitespace-nowrap cursor-pointer"
                >
                  <span>Start for free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Ticks */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 pt-1 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free 14-day trial
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Setup in 3 min
                </span>
              </div>
            </motion.div>

            {/* Quick Command Bar */}
            <motion.div variants={fadeInUp} className="pt-1 flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] text-[11px] font-mono text-zinc-300">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>npx create-pulsescale-app@latest</span>
              </div>
              <button
                onClick={handleCopyInstall}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : "Copy"}
              </button>
            </motion.div>
          </motion.div>

          {/* HERO RIGHT COLUMN: CLEAN SEAMLESS CARDS (NO HARSH LINE CLUTTER) */}
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
                className="p-5 rounded-2xl bg-[#0d0e12] transition-all relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/[0.04] text-rose-400">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">
                          P1 • CRITICAL
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">2m ago</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white mt-0.5">SSL Certificate Expiration</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-emerald-400 flex items-center gap-1 font-semibold">
                    <Zap className="w-3 h-3 text-indigo-400" /> 0.4ms
                  </span>
                </div>

                <div className="pt-2 space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-zinc-400 bg-white/[0.02] p-2.5 rounded-xl">
                    <span className="text-zinc-500">Target Host:</span>
                    <span className="text-zinc-300">api.auth.internal.prod</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400 bg-white/[0.02] p-2.5 rounded-xl">
                    <span className="text-zinc-500">Error Payload:</span>
                    <span className="text-rose-400 font-medium">x509: certificate expired</span>
                  </div>
                </div>
              </motion.div>

              {/* CLEAN CARD 2: KAFKA QUEUE LAG ALERT */}
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-2xl bg-[#0d0e12] transition-all relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/[0.04] text-amber-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                          P2 • HIGH LAG
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400 font-medium">Live SSE</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white mt-0.5">Kafka Consumer Queue Lag</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-indigo-300">
                    BullMQ Buffer
                  </span>
                </div>

                <div className="pt-2 space-y-1.5 text-[11px] font-mono">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/[0.02] p-2.5 rounded-xl">
                      <span className="text-zinc-500 text-[9px] block">TOPIC</span>
                      <span className="text-zinc-200 text-xs font-medium">telemetry.events.v2</span>
                    </div>
                    <div className="bg-white/[0.02] p-2.5 rounded-xl">
                      <span className="text-zinc-500 text-[9px] block">CONSUMER LAG</span>
                      <span className="text-amber-400 text-xs font-bold">+142,500 msgs</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CLEAN CARD 3: MINI METRIC STRIP */}
              <div className="p-4 rounded-xl bg-[#0d0e12] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Ingestion Throughput:</span>
                  <span className="text-indigo-300 font-bold">482,490 req/s</span>
                </div>
                <span className="text-emerald-400 font-semibold hidden sm:inline">
                  99.999% SLA Uptime
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. TRUST & INTEGRATION BAR */}
        <section className="py-12 border-b border-white/[0.06]">
          <div className="text-center space-y-6">
            <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
              Relied on by top-tier engineering teams
            </p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
            >
              {[
                { name: "PostgreSQL", icon: Database, tag: "Primary Store", color: "group-hover:text-sky-400" },
                { name: "Redis", icon: Zap, tag: "BullMQ Queue", color: "group-hover:text-rose-400" },
                { name: "Next.js", icon: Globe, tag: "App Router", color: "group-hover:text-white" },
                { name: "Docker", icon: Server, tag: "Containers", color: "group-hover:text-blue-400" },
                { name: "Kubernetes", icon: Cpu, tag: "Orchestration", color: "group-hover:text-indigo-400" },
                { name: "Kafka", icon: Layers, tag: "Event Streaming", color: "group-hover:text-amber-400" },
              ].map((tech, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="p-4 rounded-2xl bg-[#0d0e12] hover:bg-[#12131a] transition-all flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
                >
                  <tech.icon className={`w-4 h-4 text-zinc-400 transition-colors ${tech.color}`} />
                  <span className="text-xs font-medium text-zinc-300 group-hover:text-white">
                    {tech.name}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">
                    {tech.tag}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 4. ARCHITECTURE & ENGINEERING BREAKDOWN SECTION */}
        <section id="architecture" className="py-20 border-b border-white/[0.06] space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-indigo-300">High-Throughput Pipeline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Zero Main-Thread DB Lockup
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Traditional monitoring platforms lock up relational databases during telemetry spikes. PulseScale completely decouples ingestion using an asynchronous queue architecture.
            </p>
          </motion.div>

          {/* Visual Pipeline Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-3"
          >
            {[
              {
                step: 1,
                title: "Ingestion Gateway",
                tech: "Go / Edge Proxy",
                latency: "< 0.8ms",
                desc: "High-concurrency edge webhooks accept telemetry spikes up to 500,000 req/sec.",
                icon: Globe,
                textColor: "text-indigo-400",
              },
              {
                step: 2,
                title: "BullMQ / Redis Queue",
                tech: "In-Memory Buffer",
                latency: "< 0.2ms",
                desc: "Non-blocking RAM buffer queues incoming alerts into job channels instantly.",
                icon: Layers,
                textColor: "text-amber-400",
              },
              {
                step: 3,
                title: "Asynchronous Worker",
                tech: "Isolated Runners",
                latency: "< 3.5ms",
                desc: "Decoupled process pool handles deduplication, rules, and alert routing.",
                icon: Cpu,
                textColor: "text-sky-400",
              },
              {
                step: 4,
                title: "Sub-second SSE Broadcast",
                tech: "HTTP/2 Event Stream",
                latency: "< 12ms",
                desc: "Pushes real-time incident state directly to SRE dashboards with zero polling.",
                icon: Radio,
                textColor: "text-emerald-400",
              },
            ].map((item) => {
              const isActive = activePipelineStep === item.step;
              return (
                <motion.div
                  key={item.step}
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  onClick={() => setActivePipelineStep(item.step)}
                  className={`cursor-pointer p-6 rounded-2xl transition-all relative flex flex-col justify-between ${
                    isActive
                      ? "bg-[#12141c]"
                      : "bg-[#0d0e12] hover:bg-[#121318]"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-white/[0.04] text-white">
                        <item.icon className={`w-4 h-4 ${item.textColor}`} />
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] ${item.textColor}`}>
                        {item.latency}
                      </span>
                    </div>

                    <div>
                      <div className="text-[9px] font-mono uppercase text-indigo-400 font-semibold">
                        STAGE 0{item.step} • {item.tech}
                      </div>
                      <h3 className="text-sm font-semibold text-white mt-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* 5. KEY FEATURES GRID (3x2 CARDS) */}
        <section id="features" className="py-20 border-b border-white/[0.06] space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Engineered for critical infrastructure
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Data-dense tools designed for modern site reliability engineering.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* Card 1 */}
            <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-6 rounded-2xl bg-[#0d0e12] hover:bg-[#12131a] transition-all space-y-3">
              <div className="p-2.5 rounded-xl bg-white/[0.04] text-indigo-400 w-fit">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Sub-Second SSE Alerts</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Real-time server-sent events push incident notifications directly without polling overhead.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live Latency: 8.2ms
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-6 rounded-2xl bg-[#0d0e12] hover:bg-[#12131a] transition-all space-y-3">
              <div className="p-2.5 rounded-xl bg-white/[0.04] text-amber-400 w-fit">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Asynchronous Job Queueing</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Powered by Redis and BullMQ. Ingestion bypasses synchronous SQL locks for maximum throughput.
              </p>
              <div className="text-[11px] font-mono text-amber-300 flex items-center gap-1.5 pt-1">
                <Layers className="w-3.5 h-3.5 text-amber-400" /> 64 Worker Threads Active
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-6 rounded-2xl bg-[#0d0e12] hover:bg-[#12131a] transition-all space-y-3">
              <div className="p-2.5 rounded-xl bg-white/[0.04] text-emerald-400 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Fault-Tolerant System</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Isolated background worker pools prevent cascading service downtime during peak traffic events.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Circuit Breaker Active
              </div>
            </motion.div>

            {/* Card 4: Monospace Log Streamer */}
            <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-6 rounded-2xl bg-[#0d0e12] hover:bg-[#12131a] transition-all space-y-4 md:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] text-indigo-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Monospace Log Streamer</h3>
                    <p className="text-xs text-zinc-400">Filterable terminal log stream.</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg text-[10px] font-mono">
                  {(["ALL", "ERROR", "WARN", "INFO"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLogFilter(lvl)}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        logFilter === lvl
                          ? "bg-white/[0.1] text-white font-bold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Log Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white/[0.03] rounded-xl text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:bg-white/[0.06]"
                />
              </div>

              {/* Log Stream Output */}
              <div className="p-3 rounded-xl bg-white/[0.02] font-mono text-[11px] space-y-1.5 max-h-40 overflow-y-auto">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-lg bg-white/[0.02] flex items-center justify-between gap-2 text-zinc-300"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-zinc-500 shrink-0">{log.time}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 bg-white/[0.04] ${
                          log.level === "ERROR"
                            ? "text-rose-400"
                            : log.level === "WARN"
                            ? "text-amber-400"
                            : "text-indigo-300"
                        }`}
                      >
                        {log.level}
                      </span>
                      <span className="text-indigo-400 shrink-0 font-medium">{log.service}:</span>
                      <span className="text-zinc-300 truncate">{log.message}</span>
                    </div>
                    <span className="text-zinc-500 text-[10px] shrink-0">{log.latency}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 5 */}
            <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-6 rounded-2xl bg-[#0d0e12] hover:bg-[#12131a] transition-all space-y-3">
              <div className="p-2.5 rounded-xl bg-white/[0.04] text-purple-400 w-fit">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Role-Based Access Control</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Granular Admin, Engineer, and Auditor permission scopes with strict tenant boundary isolation.
              </p>
              <div className="text-[11px] font-mono text-purple-300 flex items-center gap-1.5 pt-1">
                <Lock className="w-3.5 h-3.5 text-purple-400" /> SOC2 Type II Certified
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* 6. PRICING SECTION */}
        <section id="pricing" className="py-20 border-b border-white/[0.06] space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-indigo-300">Transparent Pricing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Simple, predictable plans for any engineering team
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Zero hidden fees. Scale telemetry ingestion as your infrastructure grows.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="pt-2 flex items-center justify-center">
              <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl text-xs font-mono">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    billingCycle === "monthly"
                      ? "bg-white/[0.1] text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    billingCycle === "yearly"
                      ? "bg-white/[0.1] text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Yearly</span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-white/[0.06] px-1.5 py-0.5 rounded">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Pricing Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {/* Starter Plan */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl bg-[#0d0e12] hover:bg-[#12131a] transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">Developer</h3>
                  <p className="text-xs text-zinc-400">For side projects & indie developers.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">$0</span>
                  <span className="text-xs font-mono text-zinc-500">/ forever</span>
                </div>
                <ul className="space-y-2 text-xs text-zinc-300 font-mono pt-2 border-t border-white/[0.04]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400" /> Up to 10,000 events/mo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400" /> 24-hour log retention
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400" /> Basic SSE alerts
                  </li>
                  <li className="flex items-center gap-2 text-zinc-500">
                    <Check className="w-3.5 h-3.5 text-zinc-600" /> Community support
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-semibold text-xs transition-colors text-center block"
              >
                Get Started Free
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl bg-[#12141e] relative flex flex-col justify-between space-y-6"
            >
              <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-white text-black text-[10px] font-bold uppercase font-mono tracking-wider">
                Most Popular
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">Scale Pro</h3>
                  <p className="text-xs text-zinc-400">For fast-growing SaaS & engineering teams.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    ${billingCycle === "yearly" ? "39" : "49"}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">/ month</span>
                </div>
                <ul className="space-y-2 text-xs text-zinc-300 font-mono pt-2 border-t border-white/[0.06]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> 500,000 events/mo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> 30-day log retention
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Sub-second SSE push alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> BullMQ queue isolation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Slack & PagerDuty sync
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors text-center block"
              >
                Start 14-Day Free Trial
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl bg-[#0d0e12] hover:bg-[#12131a] transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">Enterprise</h3>
                  <p className="text-xs text-zinc-400">For high-throughput critical systems.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">Custom</span>
                </div>
                <ul className="space-y-2 text-xs text-zinc-300 font-mono pt-2 border-t border-white/[0.04]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-400" /> Unlimited telemetry events
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-400" /> 1-year custom log retention
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-400" /> Dedicated BullMQ worker pods
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-400" /> 99.999% SLA & SOC2 Compliance
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-400" /> 24/7 dedicated SRE support
                  </li>
                </ul>
              </div>

              <a
                href="mailto:enterprise@pulsescale.com"
                className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-semibold text-xs transition-colors text-center block"
              >
                Contact Sales
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* 7. CTA BANNER */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-[#0d0e12] p-8 sm:p-14 text-center space-y-6"
          >
            <div className="max-w-xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Ready to scale without database lockups?
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm">
                Deploy PulseScale in 3 minutes and monitor real-time infrastructure telemetry with zero latency penalty.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-3">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row items-stretch gap-2"
              >
                <input
                  type="email"
                  value={ctaEmail}
                  onChange={(e) => setCtaEmail(e.target.value)}
                  placeholder="Your work e-mail"
                  className="flex-1 px-4 py-2.5 bg-white/[0.03] rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:bg-white/[0.06]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-semibold bg-white hover:bg-zinc-200 text-black text-xs whitespace-nowrap cursor-pointer"
                >
                  Get Started for Free
                </button>
              </form>
            </div>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] bg-[#050608] py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-white" />
            <span className="font-semibold text-white">PulseScale</span>
            <span>© 2026 PulseScale Inc.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-zinc-300 transition-colors">Terms</a>
            <a href="#status" className="hover:text-zinc-300 transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> All Systems 99.999% Operational
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
