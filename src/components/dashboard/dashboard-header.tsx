"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { IncidentStreamStatus } from "@/hooks/useIncidentStream";
import { LogoutConfirmModal } from "@/components/auth/logout-confirm-modal";
import { StatusDot } from "@/components/ui/status-dot";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Plus, Search, LogOut } from "lucide-react";

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
    <header className="sticky top-0 z-40 w-full bg-card/40 backdrop-blur-2xl px-6 h-16 flex items-center justify-between gap-6 transition-all glass-card-floating">
      {/* Left: Brand Badge & Pulsating Live Status */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm tracking-tight text-foreground font-sans">
            UpNode
          </span>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40">
            v2.6
          </span>
        </div>

        {/* Minimal SSE Status Dot Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/40 border border-border/40 text-[11px] font-mono text-muted-foreground">
          <StatusDot
            variant={streamStatus.isConnected ? "LIVE" : streamStatus.isReconnecting ? "HIGH" : "OFFLINE"}
            size="sm"
          />
          <span className="uppercase tracking-wider text-[10px] font-medium">
            {streamStatus.isConnected ? "STREAM ACTIVE" : streamStatus.isReconnecting ? "RECONNECTING" : "OFFLINE"}
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
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Incident</span>
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-border/40">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-muted/40 border border-border/40 text-xs font-medium text-foreground">
            <span className="w-2 h-2 rounded-full bg-primary/60" />
            <span className="hidden lg:inline max-w-[120px] truncate text-[11px]">
              {user?.name || user?.email}
            </span>
          </div>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="p-1.5 rounded-xl bg-muted/40 hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-border/40 hover:border-destructive/20 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
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
