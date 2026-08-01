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
          ? "bg-slate-900 dark:bg-neutral-900 text-white border-slate-900 dark:border-white shadow-lg"
          : "bg-white dark:bg-black border-slate-200 dark:border-neutral-800 hover:border-slate-400 dark:hover:border-neutral-600 hover:bg-slate-50 dark:hover:bg-neutral-900/40"
      }`}
    >
      {/* Top Header Row: Geometric Status Indicator & Severity */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 border text-[10px] uppercase font-bold ${
              isSelected
                ? "bg-slate-800 dark:bg-black border-slate-700 dark:border-neutral-800 text-white"
                : "bg-slate-100 dark:bg-black border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-300"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                incident.status === "RESOLVED"
                  ? "bg-slate-400 dark:bg-neutral-500"
                  : incident.status === "INVESTIGATING"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-emerald-400 dark:bg-white animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]"
              }`}
            />
            <span>[{incident.status}]</span>
          </div>

          <span className={`px-2 py-0.5 border text-[10px] uppercase ${severityStyle}`}>
            {incident.severity}
          </span>
        </div>

        <span
          className={`text-[10px] border px-1.5 py-0.5 ${
            isSelected
              ? "border-slate-700 dark:border-neutral-800 bg-slate-800 dark:bg-black text-slate-300 dark:text-neutral-400"
              : "border-slate-200 dark:border-neutral-900 bg-slate-50 dark:bg-black text-slate-500 dark:text-neutral-500"
          }`}
        >
          v{incident.version}
        </span>
      </div>

      {/* Title & Description */}
      <div className="space-y-1 font-sans">
        <h3
          className={`font-semibold text-sm tracking-tight line-clamp-1 ${
            isSelected ? "text-white" : "text-slate-900 dark:text-white"
          }`}
        >
          {incident.title}
        </h3>
        <p
          className={`text-xs font-mono line-clamp-2 leading-relaxed ${
            isSelected ? "text-slate-200 dark:text-neutral-300" : "text-slate-600 dark:text-neutral-400"
          }`}
        >
          {incident.description}
        </p>
      </div>

      {/* Footer Info: Monospaced Telemetry ID & Timestamp */}
      <div
        className={`flex items-center justify-between pt-2.5 border-t text-[11px] font-mono ${
          isSelected
            ? "border-slate-800 dark:border-neutral-800 text-slate-300 dark:text-neutral-400"
            : "border-slate-100 dark:border-neutral-900 text-slate-500 dark:text-neutral-500"
        }`}
      >
        <span
          className={`truncate font-medium ${
            isSelected ? "text-white" : "text-slate-800 dark:text-neutral-300"
          }`}
        >
          {incident.project?.name || "PROJECT"}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <span>{incident.id}</span>
          <span className="opacity-40">•</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default IncidentCard;
