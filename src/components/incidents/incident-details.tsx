"use client";

import React, { useState } from "react";
import { Incident, IncidentStatus } from "@/types";
import { useUpdateIncidentStatus } from "@/hooks/use-incidents";
import {
  AlertTriangle,
  Clock,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FolderGit2,
  Shield,
  Layers,
  ArrowRight,
  X,
  Sparkles,
  Brain,
  Wrench,
} from "lucide-react";

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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading incident details...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground gap-3 bg-card/40 rounded-2xl border border-border">
        <Layers className="w-12 h-12 text-muted-foreground/40" />
        <div>
          <p className="text-foreground font-semibold text-base">No Incident Selected</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Select an incident from the list on the left to view full diagnostic details and manage status updates.
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
      setMutationError(err.message || "Failed to update status. Version conflict may have occurred.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-2xl p-6 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-background text-primary border border-border">
              {incident.project?.name || "Project"}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-background text-muted-foreground border border-border">
              Version {incident.version}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">{incident.title}</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mutation Error Alert */}
      {mutationError && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive">Optimistic Update Failed</p>
            <p className="mt-0.5 text-destructive/80">{mutationError}</p>
          </div>
        </div>
      )}

      {/* Status Transition Control (Optimistic Update) */}
      <div className="p-4 rounded-xl bg-background border border-border space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Update Incident Lifecycle Status
          </h3>
          {updateStatusMutation.isPending && (
            <span className="text-xs text-primary flex items-center gap-1.5 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Optimistically Updating...
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
                    ? "bg-primary/15 border-primary text-primary shadow-md shadow-primary/10"
                    : "bg-card/60 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">{item.label}</span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                </div>
                <span className="text-[10px] text-muted-foreground leading-tight">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</h3>
        <div className="p-4 rounded-xl bg-background border border-border text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {incident.description || "No description provided."}
        </div>
      </div>

      {/* AI Root Cause & Fix Suggestion Card */}
      {(incident.aiRootCause || incident.aiFixSuggestion) && (
        <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-background to-purple-950/30 border border-indigo-500/30 shadow-lg shadow-indigo-500/5 space-y-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>AI Automated Root Cause & Fix Suggestion</span>
            <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
              AI Powered
            </span>
          </div>

          {incident.aiRootCause && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/90">
                <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Potential Root Cause</span>
              </div>
              <div className="p-3 rounded-xl bg-background/80 border border-indigo-500/20 text-xs text-foreground/90 leading-relaxed font-mono">
                {incident.aiRootCause}
              </div>
            </div>
          )}

          {incident.aiFixSuggestion && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/90">
                <Wrench className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Recommended Fix Suggestion</span>
              </div>
              <div className="p-3 rounded-xl bg-background/80 border border-emerald-500/20 text-xs text-foreground/90 leading-relaxed font-mono">
                {incident.aiFixSuggestion}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Incident Metadata Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-background border border-border space-y-1">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">SEVERITY LEVEL</span>
          <p className="text-xs font-bold text-foreground">{incident.severity}</p>
        </div>
        <div className="p-3 rounded-xl bg-background border border-border space-y-1">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">CREATED TIME</span>
          <p className="text-xs font-medium text-foreground">
            {new Date(incident.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-background border border-border space-y-1">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">LAST UPDATED</span>
          <p className="text-xs font-medium text-foreground">
            {new Date(incident.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Timeline Event Log History */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <History className="w-4 h-4 text-primary" />
          Audit & Status Timeline History
        </div>

        {incident.timelineEvents && incident.timelineEvents.length > 0 ? (
          <div className="relative border-l border-border ml-3 pl-4 space-y-4">
            {incident.timelineEvents.map((evt) => (
              <div key={evt.id} className="relative group">
                {/* Bullet */}
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-card" />
                <div className="p-3 rounded-xl bg-background border border-border space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-primary">{evt.status}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(evt.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-foreground">{evt.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center rounded-xl bg-background/50 border border-border text-xs text-muted-foreground">
            No recorded timeline events for this incident yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default IncidentDetails;
