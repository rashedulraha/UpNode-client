"use client";

import React, { useState } from "react";
import { Incident, IncidentStatus } from "@/types";
import { useUpdateIncidentStatus } from "@/hooks/use-incidents";
import { AiSreInsights } from "./ai-sre-insights";
import { StatusDot } from "@/components/ui/status-dot";
import { Loader2, X } from "lucide-react";
import { format } from "date-fns";

interface IncidentDetailsProps {
  incident: Incident | null;
  isLoading: boolean;
  onClose?: () => void;
}

export function IncidentDetails({ incident, isLoading, onClose }: IncidentDetailsProps) {
  const updateStatusMutation = useUpdateIncidentStatus();
  const [mutationError, setMutationError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-xs font-mono">Loading telemetry diagnostics...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground gap-3 bg-card/30 rounded-2xl border border-border/40">
        <span className="w-3 h-3 rounded-full bg-muted-foreground/30 animate-pulse" />
        <div>
          <p className="text-foreground font-semibold text-sm">No Incident Selected</p>
          <p className="text-xs text-muted-foreground/80 mt-1 max-w-xs font-mono">
            Select an incident from the telemetry list to view diagnostics.
          </p>
        </div>
      </div>
    );
  }

  const statusList: { status: IncidentStatus; label: string; desc: string }[] = [
    { status: "INVESTIGATING", label: "Investigating", desc: "Analyzing issue & metrics" },
    { status: "IDENTIFIED", label: "Identified", desc: "Root cause found" },
    { status: "MONITORING", label: "Monitoring", desc: "Fix deployed & watching" },
    { status: "RESOLVED", label: "Resolved", desc: "Incident fully mitigated" },
  ];

  const handleStatusChange = async (newStatus: IncidentStatus) => {
    if (newStatus === incident.status) return;
    setMutationError(null);

    try {
      await updateStatusMutation.mutateAsync({
        id: incident.id,
        status: newStatus,
        expectedVersion: incident.version,
      });
    } catch (err: any) {
      setMutationError(err.message || "Failed to update status. Version conflict occurred.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/30 rounded-3xl p-6 sm:p-8 overflow-y-auto space-y-7 font-sans glass-card-floating">
      {/* Header with Pulsating Status Dot */}
      <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <StatusDot variant={incident.status} size="md" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
              {incident.status}
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-xs font-mono text-muted-foreground uppercase">
              {incident.severity}
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-[11px] font-mono text-muted-foreground/80">
              {incident.id}
            </span>
          </div>

          <h2 className="text-xl font-bold text-foreground tracking-tight leading-tight">
            {incident.title}
          </h2>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mutation Error Alert */}
      {mutationError && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono space-y-1">
          <p className="font-semibold">Optimistic Update Failed</p>
          <p className="opacity-90">{mutationError}</p>
        </div>
      )}

      {/* Lifecycle Status Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
            Lifecycle Status
          </span>
          {updateStatusMutation.isPending && (
            <span className="text-[11px] font-mono text-primary flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" /> Updating...
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {statusList.map((item) => {
            const isActive = incident.status === item.status;
            return (
              <button
                key={item.status}
                disabled={updateStatusMutation.isPending}
                onClick={() => handleStatusChange(item.status)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-primary/10 border-primary/40 text-primary font-semibold shadow-sm"
                    : "bg-card/40 border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && <StatusDot variant={item.status} size="sm" pulse={false} />}
                </div>
                <span className="text-[10px] text-muted-foreground/70 leading-tight">
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
          Description
        </span>
        <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans">
          {incident.description || "No description provided."}
        </div>
      </div>

      {/* AI SRE Insights Terminal UI Card */}
      <AiSreInsights incident={incident} />

      {/* Monospaced Metadata Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
        <div className="p-3 sm:p-4 rounded-2xl bg-muted/20 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground/60 uppercase block">PROJECT</span>
          <p className="text-xs font-semibold text-foreground truncate">
            {incident.project?.name || "Project"}
          </p>
        </div>
        <div className="p-3 sm:p-4 rounded-2xl bg-muted/20 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground/60 uppercase block">CREATED AT</span>
          <p className="text-xs font-semibold text-foreground">
            {format(new Date(incident.createdAt), "yyyy-MM-dd HH:mm")}
          </p>
        </div>
        <div className="p-3 sm:p-4 rounded-2xl bg-muted/20 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground/60 uppercase block">LAST UPDATED</span>
          <p className="text-xs font-semibold text-foreground">
            {format(new Date(incident.updatedAt), "yyyy-MM-dd HH:mm")}
          </p>
        </div>
      </div>

      {/* Audit & Timeline Log History */}
      <div className="space-y-4 pt-2">
        <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest block">
          Timeline History
        </span>

        {incident.timelineEvents && incident.timelineEvents.length > 0 ? (
          <div className="relative border-l border-border/40 ml-2 pl-4 space-y-4 font-mono">
            {incident.timelineEvents.map((evt) => (
              <div key={evt.id} className="relative">
                <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                <div className="p-3 rounded-2xl bg-muted/20 border border-border/40 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{evt.status}</span>
                    <span className="text-[10px] text-muted-foreground/70">
                      {format(new Date(evt.createdAt), "HH:mm:ss")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans">{evt.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center rounded-2xl bg-muted/10 border border-border/40 text-xs font-mono text-muted-foreground">
            No timeline events recorded.
          </div>
        )}
      </div>
    </div>
  );
}

export default IncidentDetails;
