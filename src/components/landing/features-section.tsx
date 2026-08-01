"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Shared glass card style ───────────────────────────────────────────────────
const GLASS: React.CSSProperties = {
  background: "var(--lp-surface)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "0.5px solid var(--lp-border)",
  borderTop: "0.5px solid var(--lp-border-top)",
};

// ─── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase"
      style={{
        background: "var(--lp-surface)",
        border: "0.5px solid var(--lp-border)",
        color: "var(--lp-text-dim)",
      }}
    >
      <span className="w-1 h-1 rounded-full inline-block" style={{ background: "var(--lp-text-mid)" }} />
      {children}
    </div>
  );
}

// ─── Features Section ──────────────────────────────────────────────────────────
export function FeaturesSection() {
  const [logFilter, setLogFilter] = useState<"ALL" | "ERROR" | "WARN" | "INFO">("ALL");
  const [logSearch, setLogSearch] = useState("");

  const logs = [
    { id: "LOG-9102", time: "01:14:02.891", level: "ERROR", service: "auth-vault-prod", message: "TLS handshake failed: SSL Certificate Expired (x509: certificate has expired)", latency: "0.4ms" },
    { id: "LOG-9103", time: "01:14:03.012", level: "WARN", service: "kafka-ingest-us-east", message: "Consumer lag threshold exceeded (+142,500 msgs). Auto-scaling worker pool 8→24", latency: "1.2ms" },
    { id: "LOG-9104", time: "01:14:03.140", level: "INFO", service: "bullmq-redis-cluster", message: "Queue buffer flushed. 450,000 jobs processed in 84ms", latency: "0.2ms" },
    { id: "LOG-9105", time: "01:14:03.220", level: "ERROR", service: "payment-gateway", message: "HTTP 504 Gateway Timeout on upstream provider API (retry 2/3 scheduled)", latency: "4.8ms" },
    { id: "LOG-9106", time: "01:14:03.350", level: "INFO", service: "sse-broadcast-edge", message: "Pushed incident #INC-8402 to 1,420 connected SRE sessions", latency: "0.8ms" },
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = logFilter === "ALL" || log.level === logFilter;
    const matchesSearch =
      log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.service.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.id.toLowerCase().includes(logSearch.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const cards = [
    { key: "sse", title: "Sub-Second SSE Alerts", desc: "Real-time server-sent events push incident notifications without polling overhead.", stat: "LIVE · 8.2ms" },
    { key: "bullmq", title: "Async Job Queueing", desc: "BullMQ + Redis bypasses SQL locks for maximum ingestion throughput.", stat: "64 WORKER THREADS" },
    { key: "fault", title: "Fault-Tolerant System", desc: "Isolated worker pools prevent cascading downtime during peak traffic.", stat: "CIRCUIT BREAKER ON" },
    { key: "rbac", title: "Role-Based Access", desc: "Admin, Engineer, Auditor scopes with strict tenant boundary isolation.", stat: "SOC2 TYPE II" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="features"
      className="py-24 relative"
      style={{ background: "var(--lp-bg)", borderBottom: "0.5px solid var(--lp-border)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <SectionLabel>Platform Capabilities</SectionLabel>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter leading-tight" style={{ color: "var(--lp-text-primary)" }}>
            Engineered for<br />
            <span style={{ WebkitTextStroke: "1px var(--lp-stroke)", color: "transparent" }}>
              critical infrastructure
            </span>
          </h2>
          <p className="text-sm max-w-lg mx-auto font-sans leading-relaxed" style={{ color: "var(--lp-text-mid)" }}>
            Data-dense tools designed for modern site reliability engineering — no compromise, no noise.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {cards.map((c) => (
            <motion.div
              key={c.key}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl space-y-3 transition-all"
              style={GLASS}
            >
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "var(--lp-surface-hover)", border: "0.5px solid var(--lp-border)" }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--lp-text-mid)" }} />
              </div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--lp-text-primary)" }}>{c.title}</h3>
              <p className="text-xs leading-relaxed font-sans" style={{ color: "var(--lp-text-mid)" }}>{c.desc}</p>
              <div className="font-mono text-[9px] tracking-widest uppercase flex items-center gap-1.5 pt-1" style={{ color: "var(--lp-text-dim)" }}>
                <span className="relative flex h-1 w-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ background: "var(--lp-text-mid)" }} />
                  <span className="relative inline-flex rounded-full h-1 w-1" style={{ background: "var(--lp-text-primary)" }} />
                </span>
                {c.stat}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Log Streamer Full-Width */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden"
          style={GLASS}
        >
          {/* Terminal Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "0.5px solid var(--lp-border)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--lp-border-top)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--lp-border)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--lp-border)" }} />
              </div>
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--lp-text-dim)" }}>
                upnode — log_streamer.live
              </span>
            </div>
            {/* Filter tabs */}
            <div
              className="flex items-center gap-0.5 p-0.5 font-mono text-[10px] rounded-lg"
              style={{ background: "var(--lp-surface)", border: "0.5px solid var(--lp-border)" }}
            >
              {(["ALL", "ERROR", "WARN", "INFO"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className="px-2.5 py-1 rounded transition-all cursor-pointer tracking-widest"
                  style={
                    logFilter === lvl
                      ? { background: "var(--lp-cta-bg)", color: "var(--lp-cta-text)", fontWeight: "bold" }
                      : { color: "var(--lp-text-dim)" }
                  }
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-2" style={{ borderBottom: "0.5px solid var(--lp-border)" }}>
            <input
              type="text"
              placeholder="filter logs..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="w-full bg-transparent font-mono text-[11px] focus:outline-none"
              style={{ color: "var(--lp-text-primary)" }}
            />
          </div>

          {/* Log Output */}
          <div className="p-4 font-mono text-[11px] space-y-1 max-h-44 overflow-y-auto">
            <AnimatePresence>
              {filteredLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-baseline gap-3 py-1"
                  style={{ borderBottom: "0.5px solid var(--lp-border)" }}
                >
                  <span className="shrink-0" style={{ color: "var(--lp-text-faint)" }}>{log.time}</span>
                  <span
                    className="px-1 rounded text-[9px] tracking-widest shrink-0 font-bold"
                    style={{ border: "0.5px solid var(--lp-border)", color: "var(--lp-text-primary)" }}
                  >
                    {log.level}
                  </span>
                  <span className="shrink-0 font-semibold" style={{ color: "var(--lp-text-mid)" }}>{log.service}:</span>
                  <span className="truncate" style={{ color: "var(--lp-text-primary)" }}>{log.message}</span>
                  <span className="shrink-0 ml-auto" style={{ color: "var(--lp-text-dim)" }}>{log.latency}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
