"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Incident, IncidentSeverity, IncidentStatus } from "@/types";
import IncidentCard from "./incident-card";

interface IncidentListProps {
  incidents: Incident[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
  statusFilter: IncidentStatus | "ALL";
  onStatusFilterChange: (status: IncidentStatus | "ALL") => void;
  severityFilter: IncidentSeverity | "ALL";
  onSeverityFilterChange: (severity: IncidentSeverity | "ALL") => void;
}

const listContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export function IncidentList({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  isLoading,
  error,
  onRefresh,
  statusFilter,
  onStatusFilterChange,
  severityFilter,
  onSeverityFilterChange,
}: IncidentListProps) {
  const statusOptions: (IncidentStatus | "ALL")[] = [
    "ALL",
    "INVESTIGATING",
    "IDENTIFIED",
    "MONITORING",
    "RESOLVED",
  ];

  const severityOptions: (IncidentSeverity | "ALL")[] = [
    "ALL",
    "CRITICAL",
    "HIGH",
    "MEDIUM",
    "LOW",
  ];

  return (
    <div className="flex flex-col h-full rounded-none bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 font-mono min-w-0 overflow-hidden text-xs shadow-sm transition-colors">
      {/* Filters & Control Header Section */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-neutral-800 space-y-3 bg-slate-50/50 dark:bg-neutral-950/40">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-900 pb-2.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            [TELEMETRY_STREAM]
          </span>
          <button
            onClick={onRefresh}
            className="px-2.5 py-1 rounded-none border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] hover:opacity-80 transition-colors cursor-pointer text-[10px] uppercase tracking-wider font-bold"
            title="Refresh stream"
          >
            {isLoading ? "[SYNCING...]" : "[REFRESH]"}
          </button>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 font-mono [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-track]:bg-transparent">
          <span className="text-[10px] text-[var(--muted-foreground)] pr-1 shrink-0 uppercase font-bold">
            STATUS:
          </span>
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => onStatusFilterChange(st)}
              className={`px-2 py-0.5 rounded-none text-[10px] transition-colors shrink-0 cursor-pointer border uppercase tracking-wider ${
                statusFilter === st
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-bold"
                  : "bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Severity Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 font-mono [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-track]:bg-transparent">
          <span className="text-[10px] text-[var(--muted-foreground)] pr-1 shrink-0 uppercase font-bold">
            SEVERITY:
          </span>
          {severityOptions.map((sev) => (
            <button
              key={sev}
              onClick={() => onSeverityFilterChange(sev)}
              className={`px-2 py-0.5 rounded-none text-[10px] transition-colors shrink-0 cursor-pointer border uppercase tracking-wider ${
                severityFilter === sev
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-bold"
                  : "bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Stream Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3 font-mono">
            <div className="text-[10px] text-slate-400 dark:text-neutral-600 uppercase tracking-widest flex items-center gap-2 animate-pulse mb-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span>[STREAM_CONNECTING_SKELETON_FETCH...]</span>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-none bg-slate-50/60 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800/80 animate-pulse space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-3.5 bg-slate-200 dark:bg-neutral-800 rounded-none" />
                    <div className="w-20 h-3.5 bg-slate-200 dark:bg-neutral-800 rounded-none" />
                  </div>
                  <div className="w-12 h-3 bg-slate-200 dark:bg-neutral-800 rounded-none" />
                </div>
                <div className="w-3/4 h-4 bg-slate-300 dark:bg-neutral-700 rounded-none" />
                <div className="flex items-center justify-between pt-1">
                  <div className="w-1/2 h-3 bg-slate-200 dark:bg-neutral-800 rounded-none" />
                  <div className="w-14 h-3 bg-slate-200 dark:bg-neutral-800 rounded-none" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-none bg-rose-50/50 dark:bg-black border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 space-y-2 text-center font-mono my-4">
            <p className="font-bold text-xs">
              [FAILED_TO_LOAD_TELEMETRY_STREAM]
            </p>
            <p className="text-[11px] text-rose-600 dark:text-rose-400">
              {error.message}
            </p>
            <button
              onClick={onRefresh}
              className="mt-2 px-3 py-1 bg-rose-600 dark:bg-rose-950 text-white dark:text-rose-200 text-[10px] font-bold uppercase border border-rose-500 hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-1"
            >
              [RETRY_STREAM]
            </button>
          </div>
        ) : incidents.length > 0 ? (
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            <AnimatePresence>
              {incidents.map((incident) => (
                <motion.div key={incident.id} variants={listItemVariants}>
                  <IncidentCard
                    incident={incident}
                    isSelected={selectedIncidentId === incident.id}
                    onClick={() => onSelectIncident(incident.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="p-10 text-center rounded-none bg-slate-50/40 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 space-y-3 font-mono text-slate-500 dark:text-neutral-500 my-4">
            <p className="text-slate-800 dark:text-neutral-300 font-bold text-xs">
              [NO_INCIDENTS_FOUND]
            </p>
            <p className="text-[11px]">
              Adjust telemetry filters or report a new incident.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default IncidentList;
