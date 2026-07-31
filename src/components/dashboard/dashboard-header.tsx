"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { IncidentStreamStatus } from "@/hooks/useIncidentStream";
import { LogoutConfirmModal } from "@/components/auth/logout-confirm-modal";
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

import { ThemeToggle } from "@/components/ui/theme-toggle";

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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    setIsLogoutModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 transition-all">
      {/* Left: Brand Badge & Live SSE Indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-base tracking-tight text-foreground hidden sm:inline">
            UpNode
          </span>
        </div>

        {/* SSE Status Indicator */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
            streamStatus.isConnected
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
              : streamStatus.isReconnecting
                ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                : "bg-destructive/10 text-destructive border-destructive/30"
          }`}
          title={streamStatus.error || "Server-Sent Events Connection"}
        >
          {streamStatus.isConnected ? (
            <>
              <Radio className="w-3.5 h-3.5 text-emerald-500" />
              <span>LIVE SSE</span>
            </>
          ) : streamStatus.isReconnecting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>RECONNECTING</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-destructive" />
              <span>OFFLINE</span>
            </>
          )}
        </div>
      </div>

      {/* Middle: Search bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search incidents by title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground font-sans"
          />
        </div>
      </div>

      {/* Right: Actions, Theme Switcher & Profile Badge */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Incident</span>
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted border border-border text-xs font-medium text-foreground">
            <User className="w-3.5 h-3.5 text-primary" />
            <span className="hidden lg:inline max-w-[110px] truncate">
              {user?.name || user?.email}
            </span>
          </div>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="p-2 rounded-lg bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-border hover:border-destructive/20 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isSigningOut}
      />
    </header>
  );
}

export default DashboardHeader;
