"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { IncidentStreamStatus } from "@/hooks/useIncidentStream";
import { StatusDot } from "@/components/ui/status-dot";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Plus, Search, Home } from "lucide-react";

interface DashboardHeaderProps {
  streamStatus: IncidentStreamStatus;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCreateModal: () => void;
  isSuperAdmin?: boolean;
  viewMode?: "super_admin" | "org";
  onViewModeChange?: (mode: "super_admin" | "org") => void;
}

export function DashboardHeader({
  streamStatus,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  isSuperAdmin,
  viewMode,
  onViewModeChange,
}: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 px-4 sm:px-6 bg-white/80 dark:bg-black/80 backdrop-blur-3xl border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between gap-4 shrink-0 font-sans z-30">
      {/* Left: Brand logo & Stream indicator */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Link
          href="/"
          className="p-1.5 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer border border-slate-200 dark:border-neutral-800 shrink-0"
          title="Go to Home"
        >
          <Home className="w-4 h-4 text-slate-900 dark:text-white" />
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-bold font-mono text-base tracking-tight text-slate-900 dark:text-white">
            UpNode
          </span>
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800">
            v2.6
          </span>
        </div>

        {/* Super Admin Mode Switcher */}
        {isSuperAdmin && onViewModeChange && (
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 font-mono text-[11px] ml-1 sm:ml-2">
            <button
              onClick={() => onViewModeChange("super_admin")}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px] sm:text-[11px] ${
                viewMode === "super_admin"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              [ROOT_CONTROL]
            </button>
            <button
              onClick={() => onViewModeChange("org")}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px] sm:text-[11px] ${
                viewMode === "org"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              [ORG_DASHBOARD]
            </button>
          </div>
        )}

        <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-neutral-800 font-mono">
          <StatusDot
            variant={
              streamStatus.isConnected
                ? "OPERATIONAL"
                : streamStatus.isReconnecting
                  ? "DEGRADED"
                  : "OFFLINE"
            }
            size="sm"
          />
          <span className="text-[10px] font-semibold tracking-wider text-slate-500 dark:text-neutral-400 uppercase">
            {streamStatus.isConnected
              ? "STREAM ACTIVE"
              : streamStatus.isReconnecting
                ? "RECONNECTING"
                : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Middle: Clean Minimal Search Input */}
      <div className="flex-1 max-w-xs sm:max-w-sm hidden md:block font-mono">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-3.5 w-3.5 text-slate-400 dark:text-neutral-500 pointer-events-none" />
          <input
            type="text"
            placeholder="[SEARCH INCIDENTS OR PROJECTS]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-slate-500 dark:focus:border-neutral-500 transition-all font-mono"
          />
        </div>
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-sm uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">[NEW_INCIDENT]</span>
        </button>

        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs font-mono text-slate-800 dark:text-neutral-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xl:inline max-w-[120px] truncate text-[11px] font-bold">
              {user?.name || user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
