"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Incident, IncidentSeverity, IncidentStatus } from "@/types";
import { useUpdateIncidentStatus } from "@/hooks/use-incidents";
import { AiSreInsights } from "./ai-sre-insights";
import { StatusDot } from "@/components/ui/status-dot";
import { Loader2, X, UploadCloud, Activity, FileText } from "lucide-react";
import { format } from "date-fns";

interface IncidentDetailsProps {
  incident: Incident | null;
  isLoading: boolean;
  onClose?: () => void;
  onSelectIncident?: (id: string) => void;
}

function EmptyWorkspaceDropzone({
  onSelectIncident,
}: {
  onSelectIncident?: (id: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [droppedFile, setDroppedFile] = useState<{
    name: string;
    content: string;
  } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    // 1. Check if an incident ID was dragged & dropped from Telemetry Stream
    const incidentId = e.dataTransfer.getData("text/plain");
    if (incidentId && onSelectIncident) {
      onSelectIncident(incidentId);
      return;
    }

    // 2. Check if a local log file was dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setDroppedFile({ name: file.name, content: text.slice(0, 600) });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-5 font-sans">
      {/* Interactive Drag & Drop Workspace Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 flex flex-col items-center justify-center p-8 text-center rounded-3xl border-2 border-dashed transition-all glass-card-floating relative overflow-hidden ${
          isDragOver
            ? "border-primary bg-primary/10 scale-[1.01] shadow-xl shadow-primary/10"
            : "border-border/40 bg-card/30 hover:border-primary/40 hover:bg-card/40"
        }`}
      >
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/5 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-4 shrink-0">
          <UploadCloud className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-base font-bold text-foreground tracking-tight">
            Telemetry Diagnostic Workspace
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-mono">
            Drag &amp; drop any incident card from the stream or drop log files (.log, .json) here to inspect.
          </p>
        </div>

        {/* Quick Drop Target Badge */}
        <div className="mt-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/40 text-[11px] font-mono text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>DRAG &amp; DROP ZONE ACTIVE</span>
        </div>

        {droppedFile && (
          <div className="mt-6 p-4 rounded-2xl bg-card border border-border text-left w-full max-w-md font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-primary font-semibold">
              <span className="truncate">{droppedFile.name}</span>
              <span className="text-[10px] bg-primary/20 px-2 py-0.5 rounded">PARSED</span>
            </div>
            <pre className="p-2.5 rounded-xl bg-muted/50 text-[10px] overflow-x-auto text-muted-foreground max-h-32">
              {droppedFile.content}
            </pre>
          </div>
        )}
      </div>

      {/* Telemetry Stream Metrics Card */}
      <div className="p-5 rounded-3xl bg-card/30 border border-border/30 glass-card-floating space-y-4 font-mono shrink-0">
        <div className="flex items-center justify-between border-b border-border/30 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-foreground tracking-wide uppercase">
              Telemetry Stream Metrics
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            SYSTEM NORMAL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-muted/20 border border-border/30 space-y-1">
            <span className="text-[9px] text-muted-foreground uppercase">SSE STREAM</span>
            <p className="font-bold text-foreground">Active (100ms)</p>
          </div>
          <div className="p-3 rounded-2xl bg-muted/20 border border-border/30 space-y-1">
            <span className="text-[9px] text-muted-foreground uppercase">AVG MTTD</span>
            <p className="font-bold text-foreground">&lt; 4.2s</p>
          </div>
          <div className="p-3 rounded-2xl bg-muted/20 border border-border/30 space-y-1">
            <span className="text-[9px] text-muted-foreground uppercase">EDGE NODES</span>
            <p className="font-bold text-foreground">48 Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IncidentDetails({
  incident,
  isLoading,
  onClose,
  onSelectIncident,
}: IncidentDetailsProps) {
  const updateStatusMutation = useUpdateIncidentStatus();
  const [mutationError, setMutationError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground gap-3 font-mono">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-xs">Loading telemetry diagnostics...</p>
      </div>
    );
  }

  if (!incident) {
    return <EmptyWorkspaceDropzone onSelectIncident={onSelectIncident} />;
  }

  const statusList: { status: IncidentStatus; label: string; desc: string }[] = [
    { status: "INVESTIGATING", label: "Investigating", desc: "Analyzing issue & metrics" },
    { status: "IDENTIFIED", label: "Identified", desc: "Root cause found" },
    { status: "MONITORING", label: "Monitoring", desc: "Fix deployed & watching" },
    { status: "RESOLVED", label: "Resolved", desc: "Incident fully mitigated" },
  ];

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
    <motion.div
      layoutId={`card-container-${incident.id}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col h-full bg-card/30 rounded-3xl p-6 sm:p-8 overflow-y-auto space-y-7 font-sans glass-card-floating border-[0.5px] border-border/30"
    >
      {/* Header with Organic Pulsating Status Dot & Monospaced Severity */}
      <div className="flex items-start justify-between gap-4 border-b-[0.5px] border-border/30 pb-6">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/40 border-[0.5px] border-border/30">
              <StatusDot variant={incident.status} size="sm" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
                {incident.status}
              </span>
            </div>

            <span className="text-muted-foreground/30">•</span>

            {/* Bold Uppercase Monospaced Severity Badge */}
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider border-[0.5px] ${severityStyle}`}
            >
              {incident.severity}
            </span>

            <span className="text-muted-foreground/30">•</span>

            <span className="text-[11px] font-mono text-muted-foreground/80">
              {incident.id}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight">
            {incident.title}
          </h2>
        </div>

        {onClose && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer border-[0.5px] border-border/30 shrink-0"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Mutation Error Alert */}
      {mutationError && (
        <div className="p-4 rounded-2xl bg-destructive/10 border-[0.5px] border-destructive/20 text-destructive text-xs font-mono space-y-1">
          <p className="font-semibold">Optimistic Update Failed</p>
          <p className="opacity-90">{mutationError}</p>
        </div>
      )}

      {/* Lifecycle Status Switcher with Visual Haptics */}
      <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border-[0.5px] border-border/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
            Lifecycle Status Switcher
          </span>
          {updateStatusMutation.isPending && (
            <span className="text-[11px] font-mono text-primary flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {statusList.map((item) => {
            const isActive = incident.status === item.status;
            return (
              <motion.button
                key={item.status}
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.03 }}
                disabled={updateStatusMutation.isPending}
                onClick={() => handleStatusChange(item.status)}
                className={`p-3 rounded-xl border-[0.5px] text-left transition-colors cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-primary/10 border-primary/40 text-primary font-semibold"
                    : "bg-card/40 border-border/30 text-muted-foreground hover:border-border/60 hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && <StatusDot variant={item.status} size="sm" pulse={false} />}
                </div>
                <span className="text-[10px] text-muted-foreground/70 leading-tight">
                  {item.desc}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
          Description
        </span>
        <div className="p-4 rounded-2xl bg-muted/20 border-[0.5px] border-border/30 text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans">
          {incident.description || "No description provided."}
        </div>
      </div>

      {/* AI SRE Insights Terminal UI Card */}
      <AiSreInsights incident={incident} />

      {/* Monospaced Telemetry Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-muted/20 border-[0.5px] border-border/30 space-y-1">
          <span className="text-[10px] text-muted-foreground/60 uppercase block">PROJECT</span>
          <p className="text-xs font-semibold text-foreground truncate">
            {incident.project?.name || "Project"}
          </p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-2xl bg-muted/20 border-[0.5px] border-border/30 space-y-1">
          <span className="text-[10px] text-muted-foreground/60 uppercase block">CREATED AT</span>
          <p className="text-xs font-semibold text-foreground">
            {format(new Date(incident.createdAt), "yyyy-MM-dd HH:mm")}
          </p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-2xl bg-muted/20 border-[0.5px] border-border/30 space-y-1">
          <span className="text-[10px] text-muted-foreground/60 uppercase block">LAST UPDATED</span>
          <p className="text-xs font-semibold text-foreground">
            {format(new Date(incident.updatedAt), "yyyy-MM-dd HH:mm")}
          </p>
        </div>
      </div>

      {/* Timeline Audit History with 0.5px Dividers */}
      <div className="space-y-4 pt-2">
        <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest block">
          Timeline Audit History
        </span>

        {incident.timelineEvents && incident.timelineEvents.length > 0 ? (
          <div className="relative border-l-[0.5px] border-border/40 ml-2 pl-4 space-y-4 font-mono">
            {incident.timelineEvents.map((evt) => (
              <div key={evt.id} className="relative">
                <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                <div className="p-3 rounded-2xl bg-muted/20 border-[0.5px] border-border/30 space-y-1">
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
          <div className="p-4 text-center rounded-2xl bg-muted/10 border-[0.5px] border-border/30 text-xs font-mono text-muted-foreground">
            No timeline events recorded.
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default IncidentDetails;
