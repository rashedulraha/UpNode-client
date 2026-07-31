"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Incident } from "@/types";
import { useUpdateIncidentStatus } from "@/hooks/use-incidents";

interface AiSreInsightsProps {
  incident: Incident;
}

export function AiSreInsights({ incident }: AiSreInsightsProps) {
  const [copied, setCopied] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplyingFix, setIsApplyingFix] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const updateStatusMutation = useUpdateIncidentStatus();

  // Root cause text (from backend or fallback heuristic)
  const rootCauseText =
    incident.aiRootCause ||
    `[ANALYSIS] Anomalous HTTP telemetry pattern detected. Connection pool exhaustion on target project "${
      incident.project?.name || "Service"
    }". High latency spikes (>1450ms) correlated with Redis key eviction failures.`;

  // Fix suggestion text (from backend or fallback heuristic)
  const fixSuggestionText =
    incident.aiFixSuggestion ||
    `upnode-cli scale-pool --target="${incident.projectId}" --max-connections=50 --flush-cache`;

  // Simulated typing animation effect for terminal output
  useEffect(() => {
    setDisplayedText("");
    setIsAnalyzing(true);
    let index = 0;

    const timer = setInterval(() => {
      if (index < rootCauseText.length) {
        setDisplayedText((prev) => prev + rootCauseText.charAt(index));
        index++;
      } else {
        setIsAnalyzing(false);
        clearInterval(timer);
      }
    }, 15);

    return () => clearInterval(timer);
  }, [incident.id, rootCauseText]);

  const handleCopyFix = () => {
    navigator.clipboard.writeText(fixSuggestionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReAnalyze = () => {
    setDisplayedText("");
    setIsAnalyzing(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < rootCauseText.length) {
        setDisplayedText((prev) => prev + rootCauseText.charAt(index));
        index++;
      } else {
        setIsAnalyzing(false);
        clearInterval(timer);
      }
    }, 15);
  };

  const handleApplyFix = async () => {
    setIsApplyingFix(true);
    try {
      await new Promise((res) => setTimeout(res, 1600));
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
    <div className="w-full rounded-2xl bg-black border border-emerald-950/60 shadow-2xl overflow-hidden font-mono text-xs text-emerald-400/90 relative group">
      {/* Claude Code Terminal Header */}
      <div className="bg-emerald-950/20 px-4 py-2 border-b border-emerald-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* macOS window dots */}
          <div className="flex items-center gap-1.5 opacity-60">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] font-mono text-emerald-500/80 font-medium ml-2">
            claude-code :: ai-sre-insights --incident={incident.id.slice(0, 8)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-emerald-500/60">
          <span className="text-emerald-400/80 font-bold uppercase tracking-wider">
            [AI AGENT CLAUDE-3.5]
          </span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 sm:p-5 space-y-4 bg-black">
        {/* Command Line Prompt */}
        <div className="flex items-center gap-2 text-[11px] text-emerald-500/70">
          <span className="text-emerald-400 font-bold">$</span>
          <span className="text-emerald-300">claude diagnose</span>
          <span className="text-emerald-600">
            --project="{incident.project?.name || "default"}"
          </span>
          <span className="text-emerald-600">
            --severity="{incident.severity}"
          </span>
        </div>

        {/* Root Cause Section with Animated Typing & Blinking Block Cursor */}
        <div className="space-y-1.5 pt-1 border-t border-emerald-900/30">
          <div className="flex items-center justify-between text-[10px] text-emerald-500 uppercase tracking-widest font-bold">
            <span>Root Cause Diagnostics</span>
            <span>
              {isAnalyzing ? "ANALYZING STREAM..." : "CONFIDENCE 98.6%"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black border border-emerald-900/40 text-emerald-300/90 leading-relaxed font-mono min-h-[4rem] text-xs relative">
            <span>{displayedText}</span>
            {isAnalyzing && (
              <span className="inline-block w-2 h-4 ml-1 bg-emerald-400 animate-pulse align-middle" />
            )}
          </div>
        </div>

        {/* Suggested Command Box */}
        <div className="space-y-2 pt-1 border-t border-emerald-900/30">
          <div className="flex items-center justify-between text-[10px] text-emerald-500 uppercase tracking-widest font-bold">
            <span>Suggested Mitigation Command</span>
            <span>CLI SCRIPT</span>
          </div>

          <div className="p-3 rounded-xl bg-black border border-emerald-900/40 space-y-3">
            <div className="text-emerald-300 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30 font-mono text-[11px] overflow-x-auto">
              <code>$ {fixSuggestionText}</code>
            </div>

            {/* No GUI Buttons: Text-based Commands with Underlined Links */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono pt-1">
              <button
                onClick={handleApplyFix}
                disabled={
                  isApplyingFix || fixApplied || incident.status === "RESOLVED"
                }
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer transition-all disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
              >
                {isApplyingFix
                  ? "> executing_patch()..."
                  : fixApplied || incident.status === "RESOLVED"
                    ? "[FIX_APPLIED_AND_RESOLVED]"
                    : "> execute_fix()"}
              </button>

              <button
                onClick={handleCopyFix}
                className="text-emerald-500/80 hover:text-emerald-300 underline underline-offset-4 cursor-pointer transition-all"
              >
                {copied ? "[COPIED_TO_CLIPBOARD]" : "> copy_command"}
              </button>

              <button
                onClick={handleReAnalyze}
                disabled={isAnalyzing}
                className="text-emerald-600 hover:text-emerald-400 underline underline-offset-4 cursor-pointer transition-all disabled:opacity-40"
              >
                {"> re-analyze_telemetry()"}
              </button>
            </div>
          </div>
        </div>

        {/* Live Command Execution Output */}
        <AnimatePresence>
          {(isApplyingFix || fixApplied) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-xl bg-black border border-emerald-900/40 text-[10px] font-mono space-y-1 text-emerald-400/80"
            >
              <p className="text-emerald-400">
                [CLI] Connecting to telemetry cluster node... OK
              </p>
              <p className="text-emerald-300">
                [CLI] Scaling postgres connection pool max: 50
              </p>
              <p className="text-emerald-500/80">
                [CLI] Flushing stale redis telemetry keys... 0.04s
              </p>
              <p className="text-emerald-300 font-bold">
                [SUCCESS] Incident status updated to RESOLVED via SSE pipeline.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AiSreInsights;
