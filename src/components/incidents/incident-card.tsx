"use client";

import React from "react";
import { motion } from "framer-motion";
import { Incident, IncidentSeverity } from "@/types";
import { format } from "date-fns";

interface IncidentCardProps {
  incident: Incident;
  isSelected: boolean;
  onClick: () => void;
}

export function IncidentCard({ incident, isSelected, onClick }: IncidentCardProps) {
  const formattedDate = format(new Date(incident.createdAt), "MMM d, HH:mm");

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return "text-rose-400 border-rose-900/60 bg-rose-950/40 font-bold";
      case "HIGH":
        return "text-amber-400 border-amber-900/60 bg-amber-950/40 font-bold";
      case "MEDIUM":
        return "text-indigo-400 border-indigo-900/60 bg-indigo-950/40 font-bold";
      case "LOW":
      default:
        return "text-neutral-400 border-neutral-800 bg-neutral-900 font-bold";
    }
  };

  const severityStyle = getSeverityBadge(incident.severity);

  return (
    <motion.div
      onClick={onClick}
      draggable={true}
      onDragStartCapture={(e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text/plain", incident.id);
        e.dataTransfer.setData("application/json", JSON.stringify(incident));
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.1 }}
      className={`p-4 sm:p-5 rounded-none border cursor-pointer space-y-3 font-mono text-xs transition-colors min-w-0 select-none ${
        isSelected
          ? "bg-neutral-900 dark:bg-neutral-900 border-white dark:border-white shadow-lg"
          : "bg-black/60 dark:bg-black/60 border-neutral-800 dark:border-neutral-800 hover:border-neutral-600 dark:hover:border-neutral-600 hover:bg-neutral-900/40"
      }`}
    >
      {/* Top Header Row: Geometric Status Indicator & Severity */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 border border-neutral-800 bg-black text-[10px] uppercase font-bold text-neutral-300">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                incident.status === "RESOLVED"
                  ? "bg-neutral-500"
                  : incident.status === "INVESTIGATING"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-white animate-pulse shadow-[0_0_6px_rgba(255,255,255,0.8)]"
              }`}
            />
            <span>[{incident.status}]</span>
          </div>

          <span className={`px-2 py-0.5 border text-[10px] uppercase ${severityStyle}`}>
            {incident.severity}
          </span>
        </div>

        <span className="text-[10px] text-neutral-500 border border-neutral-900 px-1.5 py-0.5 bg-black">
          v{incident.version}
        </span>
      </div>

      {/* Title & Description */}
      <div className="space-y-1 font-sans">
        <h3 className="font-medium text-sm text-white tracking-tight line-clamp-1">
          {incident.title}
        </h3>
        <p className="text-xs text-neutral-400 font-mono line-clamp-2 leading-relaxed">
          {incident.description}
        </p>
      </div>

      {/* Footer Info: Monospaced Telemetry ID & Timestamp */}
      <div className="flex items-center justify-between pt-2.5 border-t border-neutral-900 text-[11px] font-mono text-neutral-500">
        <span className="truncate text-neutral-300 font-medium">
          {incident.project?.name || "PROJECT"}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-neutral-500">{incident.id}</span>
          <span className="text-neutral-700">•</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default IncidentCard;
