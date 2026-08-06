"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Incident, IncidentSeverity, IncidentStatus } from "@/types";
import { useUpdateIncidentStatus } from "@/hooks/use-incidents";
import { AiSreInsights } from "./ai-sre-insights";

interface IncidentDetailsProps {
  incident: Incident | null;
  isLoading: boolean;
  onClose?: () => void;
  onSelectIncident?: (id: string) => void;
}

function EmptyWorkspaceDropzone({
  onSelectIncident,
}: {
  onSelectIncident?: (id: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [droppedFile, setDroppedFile] = useState<{
    name: string;
    content: string;
  } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    // 1. Check if an incident ID was dragged & dropped from Telemetry Stream
    const incidentId = e.dataTransfer.getData("text/plain");
    if (incidentId && onSelectIncident) {
      onSelectIncident(incidentId);
      return;
    }

    // 2. Check if a local log file was dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setDroppedFile({ name: file.name, content: text.slice(0, 600) });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-5 font-mono text-xs">
      {/* Interactive DND Workspace Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 flex flex-col items-center justify-center p-8 text-center rounded-none border transition-all backdrop-blur-3xl relative overflow-hidden ${
          isDragOver
            ? "border-slate-900 dark:border-neutral-400 bg-slate-100 dark:bg-neutral-900 scale-[1.005] shadow-2xl"
            : "border-slate-200 dark:border-neutral-800 bg-white dark:bg-black hover:border-slate-400 dark:hover:border-neutral-700"
        }`}
      >
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/10 dark:bg-neutral-900/40 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="p-4 rounded-none bg-slate-900 dark:bg-black border border-slate-900 dark:border-neutral-800 font-mono text-white dark:text-neutral-200 mb-4 shrink-0 shadow-lg">
          <span className="text-sm font-bold">⌘_AI_DIAGNOSTIC_WORKSPACE</span>
        </div>

        <div className="space-y-2 max-w-sm font-mono">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            [TELEMETRY_DIAGNOSTIC_WORKSPACE]
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-neutral-500 leading-relaxed">
            DRAG &amp; DROP ANY INCIDENT CARD FROM STREAM OR LOCAL LOG FILES (.LOG, .JSON) HERE FOR INSTANT AI ANALYSIS.
          </p>
        </div>

        {/* Quick Drop Target Badge */}
        <div className="mt-6 flex items-center gap-2 px-3 py-1 border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black text-[10px] font-mono text-slate-700 dark:text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-white animate-pulse" />
          <span>DND_WORKSPACE_ACTIVE</span>
        </div>

        {droppedFile && (
          <div className="mt-6 p-4 rounded-none bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 text-left w-full max-w-md font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-900 dark:text-neutral-200 font-bold">
              <span className="truncate">LOG_PARSED: {droppedFile.name}</span>
              <span className="text-[10px] border border-slate-300 dark:border-neutral-700 px-2 py-0.5 rounded-none bg-slate-100 dark:bg-neutral-900">READY</span>
            </div>
            <pre className="p-2.5 rounded-none bg-slate-950 text-[10px] text-emerald-400 overflow-x-auto max-h-32 border border-slate-800">
              {droppedFile.content}
            </pre>
          </div>
        )}
      </div>

      {/* Telemetry Stream Metrics Card */}
      <div className="p-5 rounded-none bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 backdrop-blur-3xl space-y-4 font-mono shrink-0 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-900 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              [SYSTEM_STREAM_METRICS]
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
            OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-none bg-slate-50 dark:bg-black border border-slate-200 dark:border-neutral-900 space-y-1">
            <span className="text-[9px] text-slate-500 dark:text-neutral-500 uppercase">SSE STREAM</span>
            <p className="font-bold text-slate-900 dark:text-white">Active (100ms)</p>
          </div>
          <div className="p-3 rounded-none bg-slate-50 dark:bg-black border border-slate-200 dark:border-neutral-900 space-y-1">
            <span className="text-[9px] text-slate-500 dark:text-neutral-500 uppercase">AVG MTTD</span>
            <p className="font-bold text-slate-900 dark:text-white">&lt; 4.2s</p>
          </div>
          <div className="p-3 rounded-none bg-slate-50 dark:bg-black border border-slate-200 dark:border-neutral-900 space-y-1">
            <span className="text-[9px] text-slate-500 dark:text-neutral-500 uppercase">EDGE NODES</span>
            <p className="font-bold text-slate-900 dark:text-white">48 Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IncidentDetails({
  incident,
  isLoading,
  onClose,
  onSelectIncident,
}: IncidentDetailsProps) {
  const updateStatusMutation = useUpdateIncidentStatus();
  const [mutationError, setMutationError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full space-y-4 font-mono text-xs select-none">
        <div className="flex-1 p-6 rounded-none bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-44 h-5 bg-slate-200 dark:bg-neutral-800 rounded-none" />
            <div className="w-20 h-5 bg-slate-200 dark:bg-neutral-800 rounded-none" />
          </div>
          <div className="w-3/4 h-6 bg-slate-300 dark:bg-neutral-700 rounded-none" />
          <div className="w-full h-32 bg-slate-100 dark:bg-neutral-900 rounded-none border border-slate-200 dark:border-neutral-800" />
          <div className="space-y-2 pt-2">
            <div className="w-full h-4 bg-slate-200 dark:bg-neutral-800 rounded-none" />
            <div className="w-5/6 h-4 bg-slate-200 dark:bg-neutral-800 rounded-none" />
          </div>
        </div>
        <div className="p-5 rounded-none bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 animate-pulse space-y-3">
          <div className="w-36 h-4 bg-slate-200 dark:bg-neutral-800 rounded-none" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-12 bg-slate-100 dark:bg-neutral-900 rounded-none border border-slate-200 dark:border-neutral-800" />
            <div className="h-12 bg-slate-100 dark:bg-neutral-900 rounded-none border border-slate-200 dark:border-neutral-800" />
            <div className="h-12 bg-slate-100 dark:bg-neutral-900 rounded-none border border-slate-200 dark:border-neutral-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!incident) {
    return <EmptyWorkspaceDropzone onSelectIncident={onSelectIncident} />;
  }

  const statusList: { status: IncidentStatus; label: string; desc: string }[] = [
    { status: "INVESTIGATING", label: "Investigating", desc: "Analyzing issue & metrics" },
    { status: "IDENTIFIED", label: "Identified", desc: "Root cause found" },
    { status: "MONITORING", label: "Monitoring", desc: "Fix deployed & watching" },
    { status: "RESOLVED", label: "Resolved", desc: "Incident fully mitigated" },
  ];

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return "text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 font-bold";
      case "HIGH":
        return "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 font-bold";
      case "MEDIUM":
        return "text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/40 font-bold";
      case "LOW":
      default:
        return "text-slate-700 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 font-bold";
    }
  };

  const severityStyle = getSeverityBadge(incident.severity);

  const handleStatusChange = async (newStatus: IncidentStatus) => {
    if (newStatus === incident.status) return;
    setMutationError(null);

    try {
      await updateStatusMutation.mutateAsync({
        id: incident.id,
        status: newStatus,
        expectedVersion: incident.version,
      });
    } catch (err: any) {
      setMutationError(err.message || "Failed to update status. Version conflict occurred.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex flex-col h-full bg-white dark:bg-black rounded-none p-6 sm:p-8 overflow-y-auto space-y-7 font-mono text-xs backdrop-blur-3xl border border-slate-200 dark:border-neutral-800 min-w-0 shadow-xl select-none"
    >
      {/* Header with Geometric Status Indicator & Severity */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-neutral-900 pb-6">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  incident.status === "RESOLVED"
                    ? "bg-slate-400 dark:bg-neutral-500"
                    : "bg-emerald-500 dark:bg-white animate-pulse"
                }`}
              />
              <span className="font-bold uppercase text-slate-800 dark:text-neutral-200">
                [{incident.status}]
              </span>
            </div>

            <span className="text-slate-300 dark:text-neutral-700">•</span>

            <span className={`px-2 py-0.5 border text-[10px] uppercase ${severityStyle}`}>
              {incident.severity}
            </span>

            <span className="text-slate-300 dark:text-neutral-700">•</span>

            <span className="text-[11px] text-slate-500 dark:text-neutral-500">
              {incident.id}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-light text-slate-900 dark:text-white tracking-tight leading-tight font-mono uppercase">
            {incident.title}
          </h2>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-2.5 py-1 border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white font-mono text-[11px] uppercase cursor-pointer"
          >
            [CLOSE]
          </button>
        )}
      </div>

      {mutationError && (
        <div className="p-3 border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-neutral-950 text-rose-800 dark:text-rose-300 font-mono text-xs">
          [ERR]: {mutationError}
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
          [INCIDENT_SUMMARY]
        </h3>
        <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed font-mono">
          {incident.description}
        </p>
      </div>

      {/* AI SRE DIAGNOSTICS CENTERPIECE */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
          [AI_SRE_ROOT_CAUSE_DIAGNOSTICS]
        </h3>
        <AiSreInsights incident={incident} />
      </div>

      {/* Status Update Lifecycle Pipeline */}
      <div className="space-y-3 font-mono">
        <h3 className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
          [INCIDENT_STATUS_LIFECYCLE]
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {statusList.map((item) => {
            const isActive = incident.status === item.status;
            return (
              <button
                key={item.status}
                onClick={() => handleStatusChange(item.status)}
                className={`p-3 border text-left transition-all cursor-pointer rounded-none uppercase ${
                  isActive
                    ? "bg-slate-900 dark:bg-neutral-900 text-white border-slate-900 dark:border-neutral-400 font-bold shadow-sm"
                    : "bg-slate-50 dark:bg-black text-slate-700 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="text-[11px] font-bold">[{item.label}]</div>
                <div className="text-[9px] text-slate-500 dark:text-neutral-500 mt-1 line-clamp-1">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default IncidentDetails;
