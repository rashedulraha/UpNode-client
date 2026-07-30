"use client";

import React, { useState } from "react";
import { Incident, IncidentSeverity, IncidentStatus } from "@/types";
import IncidentCard from "./incident-card";
import {
  AlertTriangle,
  Loader2,
  Filter,
  CheckCircle2,
  Inbox,
  RefreshCw,
} from "lucide-react";

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
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-xs text-zinc-400 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-indigo-400" />
            Filter Incidents
          </div>
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Status Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-zinc-500 font-medium pr-1 shrink-0">Status:</span>
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => onStatusFilterChange(st)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                statusFilter === st
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-zinc-950 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Severity Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-zinc-500 font-medium pr-1 shrink-0">Severity:</span>
          {severityOptions.map((sev) => (
            <button
              key={sev}
              onClick={() => onSeverityFilterChange(sev)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                severityFilter === sev
                  ? "bg-zinc-700 text-white border border-zinc-600"
                  : "bg-zinc-950 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List Stream / Cards */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse space-y-3"
              >
                <div className="flex gap-2">
                  <div className="w-16 h-5 bg-zinc-800 rounded-full" />
                  <div className="w-20 h-5 bg-zinc-800 rounded-full" />
                </div>
                <div className="w-3/4 h-5 bg-zinc-800 rounded" />
                <div className="w-1/2 h-4 bg-zinc-800/60 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-300 space-y-2 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="font-semibold text-base">Failed to load incidents</p>
            <p className="text-xs text-red-400">{error.message}</p>
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
          <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-3">
            <Inbox className="w-10 h-10 text-zinc-600 mx-auto" />
            <div>
              <p className="text-zinc-300 font-semibold text-sm">No incidents match your criteria</p>
              <p className="text-zinc-500 text-xs mt-1">
                Try clearing or adjusting filters, or create a new incident.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IncidentList;
