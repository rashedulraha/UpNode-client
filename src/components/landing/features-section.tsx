"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Database,
  Layers,
  Lock,
  Radio,
  Search,
  ShieldCheck,
  Terminal,
  Users,
} from "lucide-react";

export function FeaturesSection() {
  const [logFilter, setLogFilter] = useState<"ALL" | "ERROR" | "WARN" | "INFO">("ALL");
  const [logSearch, setLogSearch] = useState("");

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
        <motion.div
          variants={fadeInUp}
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl bg-card border border-border hover:bg-accent transition-all space-y-3"
        >
          <div className="p-2.5 rounded-xl bg-muted border border-border text-primary w-fit">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Sub-Second SSE Alerts
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Real-time server-sent events push incident notifications directly
            without polling overhead.
          </p>
          <div className="text-[11px] font-mono text-emerald-500 flex items-center gap-1.5 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
            Latency: 8.2ms
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          variants={fadeInUp}
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl bg-card border border-border hover:bg-accent transition-all space-y-3"
        >
          <div className="p-2.5 rounded-xl bg-muted border border-border text-amber-500 w-fit">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Asynchronous Job Queueing
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Powered by Redis and BullMQ. Ingestion bypasses synchronous SQL
            locks for maximum throughput.
          </p>
          <div className="text-[11px] font-mono text-amber-500 flex items-center gap-1.5 pt-1">
            <Layers className="w-3.5 h-3.5 text-amber-500" /> 64 Worker Threads
            Active
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          variants={fadeInUp}
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl bg-card border border-border hover:bg-accent transition-all space-y-3"
        >
          <div className="p-2.5 rounded-xl bg-muted border border-border text-emerald-500 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Fault-Tolerant System
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Isolated background worker pools prevent cascading service downtime
            during peak traffic events.
          </p>
          <div className="text-[11px] font-mono text-emerald-500 flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Circuit
            Breaker Active
          </div>
        </motion.div>

        {/* Card 4: Monospace Log Streamer */}
        <motion.div
          variants={fadeInUp}
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl bg-card border border-border hover:bg-accent transition-all space-y-4 md:col-span-2 lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-muted border border-border text-primary">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Monospace Log Streamer
                </h3>
                <p className="text-xs text-muted-foreground">
                  Filterable terminal log stream.
                </p>
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
                  <span className="text-muted-foreground shrink-0">
                    {log.time}
                  </span>
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
                  <span className="text-primary shrink-0 font-medium">
                    {log.service}:
                  </span>
                  <span className="text-foreground truncate">
                    {log.message}
                  </span>
                </div>
                <span className="text-muted-foreground text-[10px] shrink-0">
                  {log.latency}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card 5 */}
        <motion.div
          variants={fadeInUp}
          whileHover={{ y: -2 }}
          className="p-6 rounded-2xl bg-card border border-border hover:bg-accent transition-all space-y-3"
        >
          <div className="p-2.5 rounded-xl bg-muted border border-border text-purple-500 w-fit">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Role-Based Access Control
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Granular Admin, Engineer, and Auditor permission scopes with strict
            tenant boundary isolation.
          </p>
          <div className="text-[11px] font-mono text-purple-500 flex items-center gap-1.5 pt-1">
            <Lock className="w-3.5 h-3.5 text-purple-500" /> SOC2 Type II Certified
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
