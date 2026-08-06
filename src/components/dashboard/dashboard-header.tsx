"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { IncidentStreamStatus } from "@/hooks/useIncidentStream";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { RoleSwitcher } from "@/components/auth/role-switcher";
import {
  Plus,
  Search,
  Home,
  Users,
  User,
  Palette,
  Sliders,
  ChevronDown,
  LogOut,
  X,
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
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-14 px-4 sm:px-6 bg-[var(--card)] border-b border-[var(--border)] text-[var(--foreground)] flex items-center justify-between gap-4 shrink-0 font-mono text-xs select-none transition-colors duration-300">
      {/* Left: Brand logo & Stream indicator */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Link
          href="/"
          className="h-8 px-2.5 flex items-center justify-center text-[var(--foreground)] bg-[var(--secondary)] hover:opacity-80 transition-colors cursor-pointer border border-[var(--border)] shrink-0"
          title="Go to Home"
        >
          <Home className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-bold text-sm tracking-widest text-[var(--foreground)] uppercase">
            UPNODE
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[var(--secondary)] text-[var(--muted-foreground)] border border-[var(--border)]">
            v2.6
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[var(--border)]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              streamStatus.isConnected
                ? "bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                : "bg-amber-400"
            }`}
          />
          <span className="text-[10px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
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
        <div className="relative flex items-center h-8">
          <Search className="absolute left-3 h-3.5 w-3.5 text-[var(--muted-foreground)] pointer-events-none" />
          <input
            type="text"
            placeholder="[SEARCH ORG OR PROJECT]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 pl-8 pr-3 bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-all font-mono"
          />
        </div>
      </div>

      {/* Right: Actions & User Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
        <Link
          href="/dashboard/settings/team"
          className="h-8 px-2.5 flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--secondary)] hover:opacity-80 border border-[var(--border)] transition-colors text-xs font-mono shrink-0"
          title="Team Management & Admin Access"
        >
          <Users className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[11px] font-semibold uppercase">[TEAM & ADMIN]</span>
        </Link>

        <RoleSwitcher />
        <ThemeToggle />

        <button
          onClick={onOpenCreateModal}
          className="h-8 px-3 flex items-center gap-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm uppercase tracking-wider border border-[var(--primary)] shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">[NEW_INCIDENT]</span>
        </button>

        {/* User Account Settings Dropdown */}
        <div className="relative pl-2 border-l border-[var(--border)] shrink-0">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="h-8 px-2.5 flex items-center gap-2 bg-[var(--secondary)] border border-[var(--border)] hover:border-[var(--primary)] text-xs font-mono text-[var(--foreground)] transition-colors cursor-pointer"
            title="Account & Theme Settings"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="hidden xl:inline max-w-[120px] truncate text-[11px] font-bold">
              {user?.name || user?.email}
            </span>
            <ChevronDown className="w-3 h-3 text-[var(--muted-foreground)] shrink-0" />
          </button>

          {isUserDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-[var(--card)] border border-[var(--border)] shadow-2xl z-50 p-2 space-y-1 font-mono text-xs text-[var(--foreground)]">
                <div className="px-2 py-1 text-[9px] text-[var(--muted-foreground)] uppercase tracking-widest font-bold border-b border-[var(--border)] flex items-center justify-between">
                  <span>[ACCOUNT_SETTINGS]</span>
                  <button
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <Link
                  href="/dashboard/settings/profile"
                  onClick={() => setIsUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white uppercase transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>[MY_ACCOUNT]</span>
                </Link>

                <Link
                  href="/dashboard/settings/theme"
                  onClick={() => setIsUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white uppercase transition-colors"
                >
                  <Palette className="w-3.5 h-3.5 text-emerald-500" />
                  <span>[THEME_CONSOLE]</span>
                </Link>

                <Link
                  href="/dashboard/settings/team"
                  onClick={() => setIsUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white uppercase transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>[TEAM_MANAGEMENT]</span>
                </Link>

                <Link
                  href="/dashboard/settings/integrations"
                  onClick={() => setIsUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white uppercase transition-colors border-b border-slate-200 dark:border-neutral-800"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <span>[INTEGRATIONS]</span>
                </Link>

                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-rose-500 hover:bg-rose-500/10 uppercase transition-colors cursor-pointer text-left font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>[SIGN_OUT]</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
