"use client";

import React from "react";
import { Incident } from "@/types";
import { StatusDot } from "@/components/ui/status-dot";
import { format } from "date-fns";

interface IncidentCardProps {
  incident: Incident;
  isSelected: boolean;
  onClick: () => void;
}

export function IncidentCard({ incident, isSelected, onClick }: IncidentCardProps) {
  const formattedDate = format(new Date(incident.createdAt), "MMM d, HH:mm");

  return (
    <div
      onClick={onClick}
      className={`p-4 sm:p-5 rounded-2xl transition-all cursor-pointer space-y-3 glass-card-floating ${
        isSelected
          ? "bg-card/70 border-primary/60"
          : "bg-card/30 hover:bg-card/50"
      }`}
    >
      {/* Top Header Row: Pulsating Status Dot & Severity */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StatusDot variant={incident.status} size="sm" />
          <span className="text-[11px] font-medium tracking-wide text-foreground uppercase">
            {incident.status}
          </span>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-[11px] font-mono text-muted-foreground uppercase">
            {incident.severity}
          </span>
        </div>

        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-muted/40 text-muted-foreground/80 border border-border/40">
          v{incident.version}
        </span>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="font-semibold text-sm text-foreground tracking-tight line-clamp-1">
          {incident.title}
        </h3>
        <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-1 leading-relaxed">
          {incident.description}
        </p>
      </div>

      {/* Footer Info: Monospaced ID & Timestamp */}
      <div className="flex items-center justify-between pt-2.5 border-t border-border/40 text-[11px] font-mono text-muted-foreground">
        <span className="truncate text-foreground/80 font-medium">
          {incident.project?.name || "Project"}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-muted-foreground/70">{incident.id}</span>
          <span className="text-muted-foreground/40">•</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

export default IncidentCard;
