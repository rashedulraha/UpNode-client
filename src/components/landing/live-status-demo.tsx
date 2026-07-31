"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Sparkles,
  Zap,
  Server,
  Play,
  Pause,
} from "lucide-react";

type DemoStep = "operational" | "detected" | "analyzing" | "resolved";

interface StepConfig {
  id: DemoStep;
  label: string;
  badgeColor: string;
  statusText: string;
  statusCode: number;
  responseTime: string;
  title: string;
  description: string;
  aiRootCause?: string;
  aiFixSuggestion?: string;
}

const STEPS: StepConfig[] = [
  {
    id: "operational",
    label: "1. Normal Monitoring",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    statusText: "HEALTHY",
    statusCode: 200,
    responseTime: "14ms",
    title: "All Telemetry Nodes Operational",
    description: "Heartbeat pings active across 48 global edge nodes. Latency within SLA threshold.",
  },
  {
    id: "detected",
    label: "2. Incident Triggered",
    badgeColor: "bg-destructive/10 text-destructive border-destructive/20",
    statusText: "P1 • CRITICAL",
    statusCode: 504,
    responseTime: "2,450ms",
    title: "HTTP Ping Timeout on Payment Gateway",
    description: "Ping failure detected by BullMQ worker pool. Auto-broadcasting SSE payload to SRE teams.",
  },
  {
    id: "analyzing",
    label: "3. AI Root Cause Analysis",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    statusText: "AI DIAGNOSING",
    statusCode: 504,
    responseTime: "Scanning...",
    title: "OpenAI Telemetry Correlation",
    description: "Correlating error logs across Redis queue buffers & Postgres execution plans.",
    aiRootCause: "Database Connection Pool Exhaustion under 450,000 req/s spike.",
    aiFixSuggestion: "Scale pg.Pool max connections to 50 & activate Redis read-replica cache.",
  },
  {
    id: "resolved",
    label: "4. Auto-Mitigated",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
    statusText: "RESOLVED",
    statusCode: 200,
    responseTime: "18ms",
    title: "Service Uptime Restored",
    description: "Automated scaling applied. Timeline event generated & status page updated.",
    aiRootCause: "Mitigated: DB Pool connection limit auto-scaled.",
    aiFixSuggestion: "Completed in 1.4s with zero manual intervention.",
  },
];

export function LiveStatusDemo() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const step = STEPS[currentStepIndex];

  return (
    <div className="w-full rounded-2xl bg-card/80 backdrop-blur-xl border border-border/80 p-5 shadow-2xl shadow-black/10 dark:shadow-primary/5 space-y-4 relative overflow-hidden">
      {/* Ambient Glass Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary/15 blur-[80px] rounded-full pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
              Live Incident Lifecycle
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-normal">
                SSE Active
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground font-mono">Simulated Real-Time Incident Stream</p>
          </div>
        </div>

        {/* Auto play toggle */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border text-[11px] font-mono">
          {STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                idx === currentStepIndex
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-1"
            title={isAutoPlaying ? "Pause autoplay" : "Resume autoplay"}
          >
            {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Dynamic Animated Status Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {/* Status Badge & Code Bar */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border font-bold uppercase tracking-wider ${step.badgeColor}`}
            >
              {step.statusText}
            </span>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-muted-foreground">
                HTTP:{" "}
                <span
                  className={
                    step.statusCode === 200
                      ? "text-emerald-500 font-bold"
                      : "text-destructive font-bold"
                  }
                >
                  {step.statusCode}
                </span>
              </span>
              <span className="text-muted-foreground">
                Latency: <span className="text-foreground font-semibold">{step.responseTime}</span>
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="bg-muted/40 p-3.5 rounded-xl border border-border/60 space-y-1">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
              {step.id === "operational" && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
              {step.id === "detected" && <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />}
              {step.id === "analyzing" && <Sparkles className="w-4 h-4 text-amber-500 animate-spin shrink-0" />}
              {step.id === "resolved" && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
              {step.title}
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{step.description}</p>
          </div>

          {/* AI Root Cause & Fix Banner */}
          {step.aiRootCause && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs font-mono space-y-1.5"
            >
              <div className="flex items-center gap-1.5 text-primary font-bold text-[11px]">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <span>AI Root Cause Analysis</span>
              </div>
              <p className="text-[11px] text-foreground font-medium pl-5 border-l-2 border-primary/40">
                {step.aiRootCause}
              </p>
              {step.aiFixSuggestion && (
                <div className="text-[10px] text-muted-foreground pt-1 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-emerald-500" />
                  <span>Suggested Fix: <strong className="text-foreground">{step.aiFixSuggestion}</strong></span>
                </div>
              )}
            </motion.div>
          )}

          {/* Progress bar indicator */}
          <div className="w-full bg-muted/60 h-1 rounded-full overflow-hidden">
            <motion.div
              key={`progress-${step.id}-${isAutoPlaying}`}
              initial={{ width: "0%" }}
              animate={{ width: isAutoPlaying ? "100%" : "100%" }}
              transition={{ duration: isAutoPlaying ? 4.5 : 0, ease: "linear" }}
              className={`h-full ${
                step.id === "detected"
                  ? "bg-destructive"
                  : step.id === "analyzing"
                  ? "bg-amber-500"
                  : "bg-primary"
              }`}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
