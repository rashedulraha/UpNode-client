"use client";

import React from "react";
import { motion } from "framer-motion";
import { Incident, IncidentSeverity } from "@/types";
import { StatusDot } from "@/components/ui/status-dot";
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
        return "text-rose-500 bg-rose-500/10 border-rose-500/30";
      case "HIGH":
        return "text-amber-500 bg-amber-500/10 border-amber-500/30";
      case "MEDIUM":
        return "text-indigo-500 bg-indigo-500/10 border-indigo-500/30";
      case "LOW":
      default:
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
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
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`p-4 sm:p-5 rounded-2xl border cursor-pointer space-y-3 backdrop-blur-3xl transition-all min-w-0 ${
        isSelected
          ? "bg-slate-100 dark:bg-neutral-900 border-slate-900 dark:border-white shadow-md ring-1 ring-slate-900/10 dark:ring-white/20"
          : "bg-white/80 dark:bg-black/60 border-slate-200 dark:border-neutral-800 hover:border-slate-400 dark:hover:border-neutral-600 hover:bg-slate-50 dark:hover:bg-neutral-900/80"
      }`}
    >
      {/* Top Header Row: Pulsating Status Dot & Monospaced Severity */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
            <StatusDot variant={incident.status} size="sm" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-800 dark:text-neutral-200 uppercase">
              [{incident.status}]
            </span>
          </div>

          {/* Bold Uppercase Monospaced Severity Badge */}
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${severityStyle}`}
          >
            {incident.severity}
          </span>
        </div>

        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800">
          v{incident.version}
        </span>
      </div>

      {/* Title & Description */}
      <div className="space-y-1">
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white tracking-tight line-clamp-1">
          {incident.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
          {incident.description}
        </p>
      </div>

      {/* Footer Info: Monospaced Telemetry ID & Timestamp with 1px Divider */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 dark:border-neutral-800 text-[11px] font-mono text-slate-500 dark:text-neutral-500">
        <span className="truncate text-slate-800 dark:text-neutral-300 font-medium">
          {incident.project?.name || "PROJECT"}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-400 dark:text-neutral-500">{incident.id}</span>
          <span className="text-slate-300 dark:text-neutral-700">•</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default IncidentCard;
