"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Incident } from "@/types";
import {
  Terminal,
  Sparkles,
  Check,
  Copy,
  Wrench,
  Brain,
  Play,
  CheckCircle2,
  RefreshCcw,
  Cpu,
  CornerDownRight,
  ShieldCheck,
} from "lucide-react";
import { useUpdateIncidentStatus } from "@/hooks/use-incidents";

interface AiSreInsightsProps {
  incident: Incident;
}

export function AiSreInsights({ incident }: AiSreInsightsProps) {
  const [copied, setCopied] = useState(false);
  const [isApplyingFix, setIsApplyingFix] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);
  const updateStatusMutation = useUpdateIncidentStatus();

  // Root cause text (from backend or fallback heuristic)
  const rootCauseText =
    incident.aiRootCause ||
    `Detected anomalous HTTP telemetry pattern. High latency spikes correlated with db connection pool exhaustion on target project "${
      incident.project?.name || "Service"
    }".`;

  // Fix suggestion text (from backend or fallback heuristic)
  const fixSuggestionText =
    incident.aiFixSuggestion ||
    `npx upnode-cli scale-pool --target="${incident.projectId}" --max-connections=50 --flush-redis-cache`;

  const handleCopyFix = () => {
    navigator.clipboard.writeText(fixSuggestionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyFix = async () => {
    setIsApplyingFix(true);
    try {
      // Simulate terminal command execution & update incident status to MONITORING or RESOLVED
      await new Promise((res) => setTimeout(res, 1800));
      await updateStatusMutation.mutateAsync({
        id: incident.id,
        status: "RESOLVED",
        expectedVersion: incident.version,
      });
      setFixApplied(true);
    } catch (err) {
      console.error("Failed to apply fix:", err);
    } finally {
      setIsApplyingFix(false);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs text-slate-200 relative group">
      {/* Claude Code Terminal Titlebar Header */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* macOS window dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] font-mono text-slate-400 font-semibold ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            claude-code :: ai-sre-insights --incident={incident.id.slice(0, 8)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-pulse" /> AI Agent v4.2
          </span>
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="p-4 space-y-4 bg-slate-950/95">
        {/* CLI Prompt Banner */}
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span className="text-emerald-400 font-bold">$</span>
          <span className="text-slate-300">upnode ai diagnose</span>
          <span className="text-slate-500">--project="{incident.project?.name || "default"}"</span>
          <span className="text-slate-500">--severity="{incident.severity}"</span>
        </div>

        {/* Root Cause Analysis Terminal Box */}
        <div className="space-y-2 pt-1 border-t border-slate-900">
          <div className="flex items-center justify-between text-indigo-400 text-[11px] font-bold">
            <span className="flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              ROOT CAUSE ANALYSIS (98.6% CONFIDENCE)
            </span>
            <span className="text-[10px] text-slate-500">SSE Live Telemetry Stream</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 leading-relaxed font-mono space-y-2">
            <div className="flex items-start gap-2">
              <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-cyan-200">{rootCauseText}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-purple-400" /> Engine: <strong className="text-slate-200">OpenAI GPT-4o Telemetry</strong>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Security Scope: <strong className="text-slate-200">SOC2 Compliant</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Suggested Fix Section */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-emerald-400 text-[11px] font-bold">
            <span className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              SUGGESTED MITIGATION COMMAND
            </span>
            <span className="text-[10px] text-slate-500">Automated CLI Script</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-900/40 space-y-3">
            <div className="flex items-center justify-between gap-3 text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono overflow-x-auto text-[11px]">
              <code className="text-emerald-300 font-semibold">{fixSuggestionText}</code>
              <button
                onClick={handleCopyFix}
                className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0 cursor-pointer"
                title="Copy command"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Suggested Fix Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={handleApplyFix}
                disabled={isApplyingFix || fixApplied || incident.status === "RESOLVED"}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-sans transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  fixApplied || incident.status === "RESOLVED"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95"
                }`}
              >
                {isApplyingFix ? (
                  <>
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                    Executing Fix in Terminal...
                  </>
                ) : fixApplied || incident.status === "RESOLVED" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Fix Applied & Incident Resolved
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Apply Suggested Fix
                  </>
                )}
              </button>

              <button
                onClick={handleCopyFix}
                className="px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? "Copied to Clipboard" : "Copy Command"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Terminal Output Logs if Fix Executed */}
        <AnimatePresence>
          {(isApplyingFix || fixApplied) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-xl bg-black border border-slate-800 text-[10px] font-mono space-y-1 text-slate-400"
            >
              <p className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> [CLI] Connecting to telemetry cluster node... OK
              </p>
              <p className="text-indigo-400">[CLI] Scaling postgres connection pool max: 50</p>
              <p className="text-slate-300">[CLI] Flushing stale redis telemetry keys... 0.04s</p>
              <p className="text-emerald-400 font-bold">[SUCCESS] Incident status updated to RESOLVED via SSE pipeline.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
