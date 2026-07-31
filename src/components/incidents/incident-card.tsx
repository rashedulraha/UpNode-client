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

  const getSeverityGlowBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return "text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.25)]";
      case "HIGH":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]";
      case "MEDIUM":
        return "text-indigo-400 bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]";
      case "LOW":
      default:
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
    }
  };

  const severityGlow = getSeverityGlowBadge(incident.severity);

  return (
    <motion.div
      layoutId={`card-container-${incident.id}`}
      onClick={onClick}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.965 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`p-4 sm:p-5 rounded-2xl border-[0.5px] cursor-pointer space-y-3 glass-card-floating ${
        isSelected
          ? "bg-card/75 border-primary/60 shadow-xl shadow-primary/10"
          : "bg-card/30 border-border/30 hover:border-border/60 hover:bg-card/50"
      }`}
    >
      {/* Top Header Row: Pulsating Organic Status Dot & Glowing Monospaced Severity */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/30 border-[0.5px] border-border/30">
            <StatusDot variant={incident.status} size="sm" />
            <span className="text-[10px] font-mono font-medium tracking-wider text-foreground uppercase">
              {incident.status}
            </span>
          </div>

          {/* Bold Uppercase Monospaced Severity Badge with Ambient Glow */}
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border-[0.5px] ${severityGlow}`}
          >
            {incident.severity}
          </span>
        </div>

        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-muted/40 text-muted-foreground/80 border-[0.5px] border-border/30">
          v{incident.version}
        </span>
      </div>

      {/* Title & Description */}
      <div className="space-y-1">
        <h3 className="font-semibold text-sm text-foreground tracking-tight line-clamp-1">
          {incident.title}
        </h3>
        <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
          {incident.description}
        </p>
      </div>

      {/* Footer Info: Monospaced Telemetry ID & Timestamp with 0.5px Divider */}
      <div className="flex items-center justify-between pt-2.5 border-t-[0.5px] border-border/30 text-[11px] font-mono text-muted-foreground">
        <span className="truncate text-foreground/80 font-medium">
          {incident.project?.name || "Project"}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-muted-foreground/70">{incident.id}</span>
          <span className="text-muted-foreground/30">•</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default IncidentCard;
