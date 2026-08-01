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
    <div className="flex flex-col h-full space-y-4 font-mono min-w-0 overflow-hidden text-xs">
      {/* Filters Bar with Sharp Square Borders */}
      <div className="p-4 sm:p-5 rounded-none bg-neutral-950/80 border border-neutral-800 space-y-3 backdrop-blur-3xl shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5">
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
            [TELEMETRY_STREAM]
          </span>
          <button
            onClick={onRefresh}
            className="px-2.5 py-1 rounded-none border border-neutral-800 bg-black text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer text-[10px] uppercase tracking-wider"
            title="Refresh stream"
          >
            {isLoading ? "[SYNCING...]" : "[REFRESH]"}
          </button>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono">
          <span className="text-[10px] text-neutral-500 pr-1 shrink-0 uppercase">STATUS:</span>
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => onStatusFilterChange(st)}
              className={`px-2 py-0.5 rounded-none text-[10px] transition-colors shrink-0 cursor-pointer border uppercase tracking-wider ${
                statusFilter === st
                  ? "bg-neutral-900 text-white border-neutral-400 font-bold"
                  : "bg-black text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Severity Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono">
          <span className="text-[10px] text-neutral-500 pr-1 shrink-0 uppercase">SEVERITY:</span>
          {severityOptions.map((sev) => (
            <button
              key={sev}
              onClick={() => onSeverityFilterChange(sev)}
              className={`px-2 py-0.5 rounded-none text-[10px] transition-colors shrink-0 cursor-pointer border uppercase tracking-wider ${
                severityFilter === sev
                  ? "bg-neutral-900 text-white border-neutral-400 font-bold"
                  : "bg-black text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Stream List */}
      <div className="flex-1 overflow-y-auto space-y-3 px-1 py-1">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-none bg-black border border-neutral-900 animate-pulse space-y-3 font-mono"
              >
                <div className="flex gap-2">
                  <div className="w-16 h-3 bg-neutral-900" />
                  <div className="w-20 h-3 bg-neutral-900" />
                </div>
                <div className="w-3/4 h-4 bg-neutral-900" />
                <div className="w-1/2 h-3 bg-neutral-900" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-none bg-black border border-rose-900/60 text-rose-300 space-y-2 text-center font-mono">
            <p className="font-semibold text-xs">[FAILED_TO_LOAD_TELEMETRY_STREAM]</p>
            <p className="text-[11px] text-rose-400">{error.message}</p>
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
          <div className="p-12 text-center rounded-none bg-black border border-neutral-800 space-y-3 font-mono text-neutral-500">
            <p className="text-neutral-300 font-semibold text-xs">[NO_INCIDENTS_FOUND]</p>
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
