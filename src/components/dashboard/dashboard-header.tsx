"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { IncidentStreamStatus } from "@/hooks/useIncidentStream";
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
    <header className="h-14 px-4 sm:px-6 bg-white dark:bg-black border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between gap-4 shrink-0 font-mono text-xs z-30 select-none transition-colors">
      {/* Left: Brand logo & Stream indicator */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Link
          href="/"
          className="p-1.5 rounded-none text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-black hover:bg-slate-200 dark:hover:bg-neutral-900 transition-colors cursor-pointer border border-slate-200 dark:border-neutral-800 shrink-0"
          title="Go to Home"
        >
          <Home className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-bold text-sm tracking-widest text-slate-900 dark:text-white uppercase">
            UPNODE
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-none bg-slate-100 dark:bg-black text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800">
            v2.6
          </span>
        </div>

        {/* Super Admin Mode Switcher */}
        {isSuperAdmin && onViewModeChange && (
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-black rounded-none border border-slate-200 dark:border-neutral-800 font-mono text-[11px] ml-1 sm:ml-2">
            <button
              onClick={() => onViewModeChange("super_admin")}
              className={`px-2.5 py-1 rounded-none transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px] ${
                viewMode === "super_admin"
                  ? "bg-rose-600 text-white border border-rose-500 shadow-sm"
                  : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              [ROOT_CONTROL]
            </button>
            <button
              onClick={() => onViewModeChange("org")}
              className={`px-2.5 py-1 rounded-none transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px] ${
                viewMode === "org"
                  ? "bg-slate-900 dark:bg-neutral-900 text-white border border-slate-900 dark:border-neutral-600 shadow-sm"
                  : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              [ORG_DASHBOARD]
            </button>
          </div>
        )}

        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-neutral-800">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              streamStatus.isConnected
                ? "bg-emerald-500 dark:bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                : "bg-amber-400"
            }`}
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
          <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400 dark:text-neutral-500 pointer-events-none" />
          <input
            type="text"
            placeholder="[SEARCH ORG OR PROJECT]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-slate-500 dark:focus:border-neutral-500 transition-all font-mono"
          />
        </div>
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90 rounded-none text-xs font-mono font-bold transition-all cursor-pointer shadow-sm uppercase tracking-wider border border-slate-900 dark:border-white"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">[NEW_INCIDENT]</span>
        </button>

        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-none bg-slate-100 dark:bg-black border border-slate-200 dark:border-neutral-800 text-xs font-mono text-slate-800 dark:text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-white animate-pulse" />
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
