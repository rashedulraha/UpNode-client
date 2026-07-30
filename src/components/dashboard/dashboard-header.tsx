"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { IncidentStreamStatus } from "@/hooks/useIncidentStream";
import {
  Activity,
  Radio,
  Plus,
  LogOut,
  User,
  Search,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";

interface DashboardHeaderProps {
  streamStatus: IncidentStreamStatus;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCreateModal: () => void;
}

export function DashboardHeader({
  streamStatus,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
}: DashboardHeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      {/* Brand & Live SSE Connection Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white hidden sm:inline">UpNode</span>
        </div>

        {/* SSE Status Indicator */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            streamStatus.isConnected
              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
              : streamStatus.isReconnecting
              ? "bg-amber-950/60 text-amber-400 border-amber-800/60"
              : "bg-red-950/60 text-red-400 border-red-800/60"
          }`}
          title={streamStatus.error || "Server-Sent Events Connection"}
        >
          {streamStatus.isConnected ? (
            <>
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>LIVE SSE</span>
            </>
          ) : streamStatus.isReconnecting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>RECONNECTING</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
              <span>OFFLINE</span>
            </>
          )}
        </div>
      </div>

      {/* Middle: Search input */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search incidents by title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-zinc-200"
          />
        </div>
      </div>

      {/* Right: Create Button & User Dropdown */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Incident</span>
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-xs font-medium text-zinc-200">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline max-w-[120px] truncate">{user?.name || user?.email}</span>
          </div>
          <button
            onClick={() => signOut()}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
