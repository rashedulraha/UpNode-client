"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useMembers } from "@/hooks/use-team";
import MemberList from "@/components/team/member-list";
import InviteMemberModal from "@/components/team/invite-member-modal";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function TeamSettingsPage() {
  const { data: members = [], isLoading, error, refetch } = useMembers();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Client-side search & role filtering
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Role filter
      if (roleFilter !== "ALL" && m.role !== roleFilter) {
        return false;
      }
      // Search query filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        m.user?.email.toLowerCase().includes(query) ||
        (m.user?.name && m.user.name.toLowerCase().includes(query)) ||
        m.role.toLowerCase().includes(query)
      );
    });
  }, [members, searchQuery, roleFilter]);

  // Team Statistics
  const adminCount = members.filter((m) => m.role === "ADMIN").length;
  const engineerCount = members.filter((m) => m.role === "ENGINEER").length;
  const viewerCount = members.filter((m) => m.role === "VIEWER").length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-sans flex flex-col relative selection:bg-slate-800">
      {/* Background Noise Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Top Minimal Header Navigation Bar */}
      <header className="border-b border-slate-200 dark:border-neutral-800 bg-white/70 dark:bg-black/70 backdrop-blur-3xl px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 font-mono">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
          <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            [DASHBOARD]
          </Link>
          <span className="text-slate-300 dark:text-neutral-700">/</span>
          <span>SETTINGS</span>
          <span className="text-slate-300 dark:text-neutral-700">/</span>
          <span className="font-bold text-slate-900 dark:text-white">[TEAM_MANAGEMENT]</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="h-8 px-3 text-xs font-mono text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-black border border-slate-200 dark:border-neutral-800 transition-all cursor-pointer uppercase flex items-center shrink-0"
          >
            {isLoading ? "[SYNCING...]" : "[REFRESH]"}
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-8 space-y-7 relative z-10 font-mono">
        {/* Minimal Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 border border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-900 text-slate-800 dark:text-neutral-200 font-mono text-[10px] font-bold uppercase tracking-widest">
                ORGANIZATION // IAM
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-slate-900 dark:text-white font-mono uppercase">
              Team Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-xl leading-relaxed font-mono">
              Manage organization members, assign IAM roles (ADMIN, ENGINEER, VIEWER), and send invitations.
            </p>
          </div>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 border border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold text-xs transition-all cursor-pointer shrink-0 uppercase tracking-wider shadow-sm hover:opacity-90"
          >
            [+ INVITE_MEMBER]
          </button>
        </div>

        {/* Minimal Role Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div 
            onClick={() => setRoleFilter(roleFilter === "ADMIN" ? "ALL" : "ADMIN")}
            className={`p-4 rounded-2xl bg-white/70 dark:bg-black/60 border backdrop-blur-3xl space-y-1 shadow-sm transition-all cursor-pointer ${
              roleFilter === "ADMIN"
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-slate-200 dark:border-neutral-800 hover:border-slate-400 dark:hover:border-neutral-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-500 dark:text-neutral-500 font-bold uppercase tracking-widest">
                [ADMINISTRATORS]
              </p>
              <span className="text-[9px] px-1.5 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                FULL ACCESS
              </span>
            </div>
            <h3 className="text-3xl font-light text-slate-900 dark:text-white">{adminCount.toString().padStart(2, "0")}</h3>
          </div>

          <div 
            onClick={() => setRoleFilter(roleFilter === "ENGINEER" ? "ALL" : "ENGINEER")}
            className={`p-4 rounded-2xl bg-white/70 dark:bg-black/60 border backdrop-blur-3xl space-y-1 shadow-sm transition-all cursor-pointer ${
              roleFilter === "ENGINEER"
                ? "border-blue-500/50 bg-blue-500/5"
                : "border-slate-200 dark:border-neutral-800 hover:border-slate-400 dark:hover:border-neutral-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-500 dark:text-neutral-500 font-bold uppercase tracking-widest">
                [ENGINEERS]
              </p>
              <span className="text-[9px] px-1.5 py-0.5 border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold">
                OPS CONTROL
              </span>
            </div>
            <h3 className="text-3xl font-light text-slate-900 dark:text-white">{engineerCount.toString().padStart(2, "0")}</h3>
          </div>

          <div 
            onClick={() => setRoleFilter(roleFilter === "VIEWER" ? "ALL" : "VIEWER")}
            className={`p-4 rounded-2xl bg-white/70 dark:bg-black/60 border backdrop-blur-3xl space-y-1 shadow-sm transition-all cursor-pointer ${
              roleFilter === "VIEWER"
                ? "border-slate-400 dark:border-neutral-600 bg-slate-100 dark:bg-neutral-900"
                : "border-slate-200 dark:border-neutral-800 hover:border-slate-400 dark:hover:border-neutral-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-500 dark:text-neutral-500 font-bold uppercase tracking-widest">
                [VIEWERS]
              </p>
              <span className="text-[9px] px-1.5 py-0.5 border border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400 font-bold">
                READ ONLY
              </span>
            </div>
            <h3 className="text-3xl font-light text-slate-900 dark:text-white">{viewerCount.toString().padStart(2, "0")}</h3>
          </div>
        </div>

        {/* Search & Member Table */}
        <div className="space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="[SEARCH NAME / EMAIL / ROLE]"
                className="w-full sm:w-80 px-3.5 py-2 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:border-slate-500 dark:focus:border-neutral-500 focus:outline-none transition-all font-mono"
              />

              {/* Role Filter Pills */}
              <div className="flex items-center gap-1">
                {["ALL", "ADMIN", "ENGINEER", "VIEWER"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-2 py-1 text-[10px] font-mono border transition-all cursor-pointer uppercase ${
                      roleFilter === role
                        ? "border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                        : "border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    [{role}]
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-neutral-500 font-mono self-end sm:self-center">
              SHOWING <span className="font-bold text-slate-900 dark:text-white">{filteredMembers.length}</span> OF{" "}
              <span className="font-bold text-slate-900 dark:text-white">{members.length}</span> MEMBERS
            </div>
          </div>

          {/* Member List Component */}
          <MemberList members={filteredMembers} isLoading={isLoading} error={error as Error} />
        </div>
      </main>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
