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
      <div className="flex flex-col items-center justify-center h-full p-8 text-zinc-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Loading incident details...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-zinc-500 gap-3 bg-zinc-900/40 rounded-2xl border border-zinc-800/60">
        <Layers className="w-12 h-12 text-zinc-700" />
        <div>
          <p className="text-zinc-300 font-semibold text-base">No Incident Selected</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs">
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
    <div className="flex flex-col h-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-950 text-indigo-400 border border-zinc-800">
              {incident.project?.name || "Project"}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-500 border border-zinc-800">
              Version {incident.version}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{incident.title}</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mutation Error Alert */}
      {mutationError && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">Optimistic Update Failed</p>
            <p className="mt-0.5 text-red-400">{mutationError}</p>
          </div>
        </div>
      )}

      {/* Status Transition Control (Optimistic Update) */}
      <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Update Incident Lifecycle Status
          </h3>
          {updateStatusMutation.isPending && (
            <span className="text-xs text-indigo-400 flex items-center gap-1.5 font-medium">
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
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-600/10"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">{item.label}</span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <span className="text-[10px] text-zinc-500 leading-tight">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Description</h3>
        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {incident.description || "No description provided."}
        </div>
      </div>

      {/* Incident Metadata Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">SEVERITY LEVEL</span>
          <p className="text-xs font-bold text-zinc-200">{incident.severity}</p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">CREATED TIME</span>
          <p className="text-xs font-medium text-zinc-300">
            {new Date(incident.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">LAST UPDATED</span>
          <p className="text-xs font-medium text-zinc-300">
            {new Date(incident.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Timeline Event Log History */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <History className="w-4 h-4 text-indigo-400" />
          Audit & Status Timeline History
        </div>

        {incident.timelineEvents && incident.timelineEvents.length > 0 ? (
          <div className="relative border-l border-zinc-800 ml-3 pl-4 space-y-4">
            {incident.timelineEvents.map((evt) => (
              <div key={evt.id} className="relative group">
                {/* Bullet */}
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-zinc-900" />
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-300">{evt.status}</span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(evt.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300">{evt.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center rounded-xl bg-zinc-950/40 border border-zinc-800/60 text-xs text-zinc-500">
            No recorded timeline events for this incident yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default IncidentDetails;
