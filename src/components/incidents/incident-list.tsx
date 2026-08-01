"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Incident, IncidentSeverity, IncidentStatus } from "@/types";
import IncidentCard from "./incident-card";
import { RefreshCw } from "lucide-react";

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
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
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
    <div className="flex flex-col h-full space-y-4 font-sans min-w-0 overflow-hidden">
      {/* Filters Bar with 0.5px dividers */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card/30 space-y-3 glass-card-floating border-[0.5px] border-border/30">
        <div className="flex items-center justify-between border-b-[0.5px] border-border/30 pb-2.5">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
            Telemetry Stream
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={onRefresh}
            className="p-1.5 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-[0.5px] border-border/30"
            title="Refresh stream"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </motion.button>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono text-muted-foreground/60 pr-1 shrink-0 uppercase">Status:</span>
          {statusOptions.map((st) => (
            <motion.button
              key={st}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.04 }}
              onClick={() => onStatusFilterChange(st)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono transition-colors shrink-0 cursor-pointer border-[0.5px] ${
                statusFilter === st
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm border-primary/40"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground border-border/30"
              }`}
            >
              {st}
            </motion.button>
          ))}
        </div>

        {/* Severity Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono text-muted-foreground/60 pr-1 shrink-0 uppercase">Severity:</span>
          {severityOptions.map((sev) => (
            <motion.button
              key={sev}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.04 }}
              onClick={() => onSeverityFilterChange(sev)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono transition-colors shrink-0 cursor-pointer border-[0.5px] ${
                severityFilter === sev
                  ? "bg-muted text-foreground border-border/60 font-semibold shadow-sm"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground border-border/30"
              }`}
            >
              {sev}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Incidents Stream List with Staggered Framer Motion Animation */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
        {isLoading ? (
          <div className="space-y-3.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-card/30 border-[0.5px] border-border/30 animate-pulse space-y-3 glass-card-floating"
              >
                <div className="flex gap-2">
                  <div className="w-16 h-4 bg-muted/60 rounded-full" />
                  <div className="w-20 h-4 bg-muted/60 rounded-full" />
                </div>
                <div className="w-3/4 h-5 bg-muted/60 rounded" />
                <div className="w-1/2 h-3 bg-muted/40 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-destructive/10 border-[0.5px] border-destructive/20 text-destructive space-y-2 text-center font-mono">
            <p className="font-semibold text-sm">Failed to load telemetry stream</p>
            <p className="text-xs text-destructive/80">{error.message}</p>
          </div>
        ) : incidents.length > 0 ? (
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3.5"
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
          <div className="p-12 text-center rounded-2xl bg-card/30 border-[0.5px] border-border/30 space-y-3 glass-card-floating font-mono">
            <p className="text-foreground font-semibold text-sm">No Incidents Found</p>
            <p className="text-muted-foreground text-xs">
              Adjust telemetry filters or create a new incident.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default IncidentList;
