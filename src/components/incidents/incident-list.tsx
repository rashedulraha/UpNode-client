"use client";

import React from "react";
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
    <div className="flex flex-col h-full space-y-4">
      {/* Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card/30 backdrop-blur-2xl frosted-border glass-card border border-border/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
            Filter Telemetry
          </span>
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Refresh stream"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono text-muted-foreground/60 pr-1 shrink-0 uppercase">Status:</span>
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => onStatusFilterChange(st)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all shrink-0 cursor-pointer ${
                statusFilter === st
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Severity Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono text-muted-foreground/60 pr-1 shrink-0 uppercase">Severity:</span>
          {severityOptions.map((sev) => (
            <button
              key={sev}
              onClick={() => onSeverityFilterChange(sev)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all shrink-0 cursor-pointer ${
                severityFilter === sev
                  ? "bg-muted text-foreground border border-border/60 font-semibold"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Stream List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-card/30 border border-border/40 animate-pulse space-y-3"
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
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive space-y-2 text-center font-mono">
            <p className="font-semibold text-sm">Failed to load telemetry stream</p>
            <p className="text-xs text-destructive/80">{error.message}</p>
          </div>
        ) : incidents.length > 0 ? (
          incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              isSelected={selectedIncidentId === incident.id}
              onClick={() => onSelectIncident(incident.id)}
            />
          ))
        ) : (
          <div className="p-12 text-center rounded-2xl bg-card/40 border border-border/40 space-y-3">
            <p className="text-foreground font-semibold text-sm">No Incidents Found</p>
            <p className="text-muted-foreground text-xs font-mono">
              Adjust telemetry filters or create a new incident.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default IncidentList;
