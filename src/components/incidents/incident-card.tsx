"use client";

import React from "react";
import { Incident, IncidentSeverity, IncidentStatus } from "@/types";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  ChevronRight,
  FolderGit2,
} from "lucide-react";

interface IncidentCardProps {
  incident: Incident;
  isSelected: boolean;
  onClick: () => void;
}

export function IncidentCard({ incident, isSelected, onClick }: IncidentCardProps) {
  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return {
          color: "bg-red-950/80 text-red-400 border-red-800/80",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400" />,
        };
      case "HIGH":
        return {
          color: "bg-orange-950/80 text-orange-400 border-orange-800/80",
          icon: <AlertCircle className="w-3.5 h-3.5 text-orange-400" />,
        };
      case "MEDIUM":
        return {
          color: "bg-amber-950/80 text-amber-400 border-amber-800/80",
          icon: <Info className="w-3.5 h-3.5 text-amber-400" />,
        };
      case "LOW":
      default:
        return {
          color: "bg-blue-950/80 text-blue-400 border-blue-800/80",
          icon: <Info className="w-3.5 h-3.5 text-blue-400" />,
        };
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case "RESOLVED":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-800/80";
      case "MONITORING":
        return "bg-indigo-950/80 text-indigo-400 border-indigo-800/80";
      case "IDENTIFIED":
        return "bg-purple-950/80 text-purple-400 border-purple-800/80";
      case "INVESTIGATING":
      default:
        return "bg-amber-950/80 text-amber-400 border-amber-800/80";
    }
  };

  const severityStyle = getSeverityBadge(incident.severity);
  const statusStyle = getStatusBadge(incident.status);

  const formattedDate = new Date(incident.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
        isSelected
          ? "bg-zinc-900 border-indigo-500 shadow-lg shadow-indigo-500/10"
          : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90"
      }`}
    >
      {/* Top Header Row: Severity & Status badges */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${severityStyle.color}`}
          >
            {severityStyle.icon}
            {incident.severity}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle}`}
          >
            {incident.status}
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-500 border border-zinc-800">
          v{incident.version}
        </span>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="font-semibold text-base text-zinc-100 line-clamp-1">{incident.title}</h3>
        <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{incident.description}</p>
      </div>

      {/* Footer Info: Project & Timestamp */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5 truncate">
          <FolderGit2 className="w-3.5 h-3.5 text-zinc-400" />
          <span className="truncate font-medium text-zinc-300">
            {incident.project?.name || "Project"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-zinc-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
        </div>
      </div>
    </div>
  );
}

export default IncidentCard;
