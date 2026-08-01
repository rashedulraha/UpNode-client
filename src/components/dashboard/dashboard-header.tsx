"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { IncidentStreamStatus } from "@/hooks/useIncidentStream";
import { StatusDot } from "@/components/ui/status-dot";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Plus, Search, Home, Users } from "lucide-react";

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
    <header className="h-16 px-4 sm:px-6 bg-card/40 backdrop-blur-2xl border-b border-border/40 flex items-center justify-between gap-4 shrink-0 font-sans glass-card-floating">
      {/* Left: Brand logo & Stream indicator */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer border border-border/30 shrink-0"
          title="Go to Home"
        >
          <Home className="w-4 h-4 text-primary" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-bold text-base tracking-tight text-foreground">
            UpNode
          </span>
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/30">
            v2.6
          </span>
        </div>

        {/* Super Admin Mode Switcher */}
        {isSuperAdmin && onViewModeChange && (
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 font-mono text-[11px] ml-2">
            <button
              onClick={() => onViewModeChange("super_admin")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold uppercase tracking-wider ${
                viewMode === "super_admin"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              [ROOT_CONTROL]
            </button>
            <button
              onClick={() => onViewModeChange("org")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold uppercase tracking-wider ${
                viewMode === "org"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              [ORG_DASHBOARD]
            </button>
          </div>
        )}

        <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-border/40">
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
          <span className="text-[10px] font-mono font-semibold tracking-wider text-muted-foreground uppercase">
            {streamStatus.isConnected
              ? "STREAM ACTIVE"
              : streamStatus.isReconnecting
                ? "RECONNECTING"
                : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Middle: Clean Minimal Search Input */}
      <div className="flex-1 max-w-sm hidden md:block">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none opacity-60" />
          <input
            type="text"
            placeholder="Search incidents or projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-muted/40 border border-border/40 rounded-xl text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all text-foreground font-sans"
          />
        </div>
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Incident</span>
        </button>

        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-border/40">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-muted/40 border border-border/40 text-xs font-medium text-foreground">
            <span className="w-2 h-2 rounded-full bg-primary/60" />
            <span className="hidden lg:inline max-w-[120px] truncate text-[11px]">
              {user?.name || user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
