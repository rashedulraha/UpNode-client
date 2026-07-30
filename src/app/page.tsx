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
  CreditCard,
  Terminal,
  Users,
  Wifi,

} from "lucide-react";

import { ThemeToggle } from "@/components/ui/theme-toggle";

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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary relative scroll-smooth">
      {/* 1. STICKY BLURRED NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-base tracking-tight text-foreground flex items-center gap-2">
              UpNode
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                v2.6
              </span>
            </span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-muted-foreground">
            <a href="#platform" className="hover:text-foreground transition-colors">
              Platform
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#architecture" className="hover:text-foreground transition-colors">
              Architecture
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>

          {/* Right Action Links */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Sign up</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono text-muted-foreground">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Next-Gen Observability Engine</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Incident management <br />
              <span className="text-primary font-normal">
                designed for 2026.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeInUp} className="text-muted-foreground text-sm sm:text-base max-w-xl font-normal leading-relaxed">
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
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Free 14-day trial
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Setup in 3 min
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
                        <span className="text-[10px] font-mono text-muted-foreground">2m ago</span>
                      </div>
                      <h4 className="text-xs font-semibold text-foreground mt-0.5">SSL Certificate Expiration</h4>
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
                    <span className="text-destructive font-medium">x509: certificate expired</span>
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
                        <span className="text-[10px] font-mono text-primary font-medium">Live SSE</span>
                      </div>
                      <h4 className="text-xs font-semibold text-foreground mt-0.5">Kafka Consumer Queue Lag</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-primary border border-border">
                    BullMQ Buffer
                  </span>
                </div>

                <div className="pt-2 space-y-1.5 text-[11px] font-mono">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted/50 p-2.5 rounded-xl border border-border">
                      <span className="text-muted-foreground text-[9px] block">TOPIC</span>
                      <span className="text-foreground text-xs font-medium">telemetry.events.v2</span>
                    </div>
                    <div className="bg-muted/50 p-2.5 rounded-xl border border-border">
                      <span className="text-muted-foreground text-[9px] block">CONSUMER LAG</span>
                      <span className="text-amber-500 text-xs font-bold">+142,500 msgs</span>
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

        {/* 3. TRUST & INTEGRATION BAR */}
        <section className="py-12 border-b border-border">
          <div className="text-center space-y-6">
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
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
                { name: "PostgreSQL", icon: Database, tag: "Primary Store", color: "group-hover:text-sky-500" },
                { name: "Redis", icon: Database, tag: "BullMQ Queue", color: "group-hover:text-rose-500" },
                { name: "Next.js", icon: Globe, tag: "App Router", color: "group-hover:text-primary" },
                { name: "Docker", icon: Server, tag: "Containers", color: "group-hover:text-blue-500" },
                { name: "Kubernetes", icon: Cpu, tag: "Orchestration", color: "group-hover:text-primary" },
                { name: "Kafka", icon: Layers, tag: "Event Streaming", color: "group-hover:text-amber-500" },
              ].map((tech, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="p-4 rounded-2xl bg-card border border-border hover:bg-accent transition-all flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
                >
                  <tech.icon className={`w-4 h-4 text-muted-foreground transition-colors ${tech.color}`} />
                  <span className="text-xs font-medium text-foreground group-hover:text-foreground">
                    {tech.name}
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {tech.tag}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 4. ARCHITECTURE & ENGINEERING BREAKDOWN SECTION */}
        <section id="architecture" className="py-20 border-b border-border space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary">High-Throughput Pipeline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Zero Main-Thread DB Lockup
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
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
                textColor: "text-primary",
              },
              {
                step: 2,
                title: "BullMQ / Redis Queue",
                tech: "In-Memory Buffer",
                latency: "< 0.2ms",
                desc: "Non-blocking RAM buffer queues incoming alerts into job channels instantly.",
                icon: Layers,
                textColor: "text-amber-500",
              },
              {
                step: 3,
                title: "Asynchronous Worker",
                tech: "Isolated Runners",
                latency: "< 3.5ms",
                desc: "Decoupled process pool handles deduplication, rules, and alert routing.",
                icon: Cpu,
                textColor: "text-sky-500",
              },
              {
                step: 4,
                title: "Sub-second SSE Broadcast",
                tech: "HTTP/2 Event Stream",
                latency: "< 12ms",
                desc: "Pushes real-time incident state directly to SRE dashboards with zero polling.",
                icon: Radio,
                textColor: "text-emerald-500",
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
                      ? "bg-card border-2 border-primary"
                      : "bg-card border border-border hover:border-primary/50"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-muted border border-border text-foreground">
                        <item.icon className={`w-4 h-4 ${item.textColor}`} />
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded bg-muted border border-border ${item.textColor}`}>
                        {item.latency}
                      </span>
                    </div>

                    <div>
                      <div className="text-[9px] font-mono uppercase text-primary font-semibold">
                        STAGE 0{item.step} • {item.tech}
                      </div>
                      <h3 className="text-sm font-semibold text-foreground mt-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
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
        <section id="features" className="py-20 border-b border-border space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Engineered for critical infrastructure
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
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
            <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-6 rounded-2xl bg-card border border-border hover:bg-accent transition-all space-y-3">
              <div className="p-2.5 rounded-xl bg-muted border border-border text-primary w-fit">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Sub-Second SSE Alerts</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Real-time server-sent events push incident notifications directly without polling overhead.
              </p>
              <div className="text-[11px] font-mono text-emerald-500 flex items-center gap-1.5 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live Latency: 8.2ms
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-6 rounded-2xl bg-card border border-border hover:bg-accent transition-all space-y-3">
              <div className="p-2.5 rounded-xl bg-muted border border-border text-amber-500 w-fit">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Asynchronous Job Queueing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Powered by Redis and BullMQ. Ingestion bypasses synchronous SQL locks for maximum throughput.
              </p>
              <div className="text-[11px] font-mono text-amber-500 flex items-center gap-1.5 pt-1">
                <Layers className="w-3.5 h-3.5 text-amber-500" /> 64 Worker Threads Active
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-6 rounded-2xl bg-card border border-border hover:bg-accent transition-all space-y-3">
              <div className="p-2.5 rounded-xl bg-muted border border-border text-emerald-500 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Fault-Tolerant System</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Isolated background worker pools prevent cascading service downtime during peak traffic events.
              </p>
              <div className="text-[11px] font-mono text-emerald-500 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Circuit Breaker Active
              </div>
            </motion.div>

            {/* Card 4: Monospace Log Streamer */}
            <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-6 rounded-2xl bg-card border border-border hover:bg-accent transition-all space-y-4 md:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-muted border border-border text-primary">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Monospace Log Streamer</h3>
                    <p className="text-xs text-muted-foreground">Filterable terminal log stream.</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-[10px] font-mono border border-border">
                  {(["ALL", "ERROR", "WARN", "INFO"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLogFilter(lvl)}
                      className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        logFilter === lvl
                          ? "bg-primary text-primary-foreground font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Log Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-muted border border-border rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Log Stream Output */}
              <div className="p-3 rounded-xl bg-muted/50 border border-border font-mono text-[11px] space-y-1.5 max-h-40 overflow-y-auto">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-lg bg-card border border-border flex items-center justify-between gap-2 text-foreground"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-muted-foreground shrink-0">{log.time}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 border border-border ${
                          log.level === "ERROR"
                            ? "text-destructive bg-destructive/10"
                            : log.level === "WARN"
                            ? "text-amber-500 bg-amber-500/10"
                            : "text-primary bg-primary/10"
                        }`}
                      >
                        {log.level}
                      </span>
                      <span className="text-primary shrink-0 font-medium">{log.service}:</span>
                      <span className="text-foreground truncate">{log.message}</span>
                    </div>
                    <span className="text-muted-foreground text-[10px] shrink-0">{log.latency}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 5 */}
            <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-6 rounded-2xl bg-card border border-border hover:bg-accent transition-all space-y-3">
              <div className="p-2.5 rounded-xl bg-muted border border-border text-purple-500 w-fit">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Role-Based Access Control</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Granular Admin, Engineer, and Auditor permission scopes with strict tenant boundary isolation.
              </p>
              <div className="text-[11px] font-mono text-purple-500 flex items-center gap-1.5 pt-1">
                <Lock className="w-3.5 h-3.5 text-purple-500" /> SOC2 Type II Certified
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* 6. PRICING SECTION */}
        <section id="pricing" className="py-20 border-b border-border space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono">
              <CreditCard className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary">Transparent Pricing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Simple, predictable plans for any engineering team
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Zero hidden fees. Scale telemetry ingestion as your infrastructure grows.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="pt-2 flex items-center justify-center">
              <div className="flex items-center gap-1 bg-muted border border-border p-1 rounded-xl text-xs font-mono">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    billingCycle === "yearly"
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>Yearly</span>
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
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
              className="p-6 rounded-2xl bg-card border border-border hover:bg-accent transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground">Developer</h3>
                  <p className="text-xs text-muted-foreground">For side projects & indie developers.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">$0</span>
                  <span className="text-xs font-mono text-muted-foreground">/ forever</span>
                </div>
                <ul className="space-y-2 text-xs text-muted-foreground font-mono pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary" /> Up to 10,000 events/mo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary" /> 24-hour log retention
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary" /> Basic SSE alerts
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground/60">
                    <Check className="w-3.5 h-3.5 text-muted-foreground/40" /> Community support
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full py-2.5 rounded-xl bg-muted border border-border hover:bg-accent text-foreground font-semibold text-xs transition-colors text-center block"
              >
                Get Started Free
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl bg-card border-2 border-primary relative flex flex-col justify-between space-y-6 shadow-sm"
            >
              <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase font-mono tracking-wider">
                Most Popular
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground">Scale Pro</h3>
                  <p className="text-xs text-muted-foreground">For fast-growing SaaS & engineering teams.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    ${billingCycle === "yearly" ? "39" : "49"}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">/ month</span>
                </div>
                <ul className="space-y-2 text-xs text-muted-foreground font-mono pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> 500,000 events/mo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> 30-day log retention
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Sub-second SSE push alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> BullMQ queue isolation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Slack & PagerDuty sync
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-colors text-center block"
              >
                Start 14-Day Free Trial
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl bg-card border border-border hover:bg-accent transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground">Enterprise</h3>
                  <p className="text-xs text-muted-foreground">For high-throughput critical systems.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">Custom</span>
                </div>
                <ul className="space-y-2 text-xs text-muted-foreground font-mono pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-500" /> Unlimited telemetry events
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-500" /> 1-year custom log retention
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-500" /> Dedicated BullMQ worker pods
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-500" /> 99.999% SLA & SOC2 Compliance
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-500" /> 24/7 dedicated SRE support
                  </li>
                </ul>
              </div>

              <a
                href="mailto:enterprise@pulsescale.com"
                className="w-full py-2.5 rounded-xl bg-muted border border-border hover:bg-accent text-foreground font-semibold text-xs transition-colors text-center block"
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
            className="rounded-3xl bg-card border border-border p-8 sm:p-14 text-center space-y-6"
          >
            <div className="max-w-xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                Ready to scale without database lockups?
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm">
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
                  className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground text-xs whitespace-nowrap cursor-pointer"
                >
                  Get Started for Free
                </button>
              </form>
            </div>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">UpNode</span>
            <span>© 2026 UpNode Inc.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#status" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All Systems 99.999% Operational
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
