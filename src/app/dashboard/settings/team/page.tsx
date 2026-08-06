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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col relative selection:bg-slate-800 transition-colors duration-300">
      {/* Background Noise Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Top Minimal Header Navigation Bar */}
      <header className="border-b border-[var(--border)] bg-[var(--card)] backdrop-blur-3xl px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 font-mono text-xs text-[var(--foreground)]">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Link
            href="/dashboard"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            [DASHBOARD]
          </Link>
          <span className="text-[var(--border)]">/</span>
          <span>SETTINGS</span>
          <span className="text-[var(--border)]">/</span>
          <span className="font-bold text-[var(--foreground)]">
            [TEAM_MANAGEMENT]
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="h-8 px-3 text-xs font-mono text-[var(--foreground)] bg-[var(--secondary)] border border-[var(--border)] transition-all cursor-pointer uppercase flex items-center shrink-0 hover:opacity-80"
          >
            {isLoading ? "[SYNCING...]" : "[REFRESH]"}
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-8 space-y-7 relative z-10 font-mono">
        {/* Minimal Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] font-mono text-[10px] font-bold uppercase tracking-widest">
                ORGANIZATION // IAM
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-[var(--foreground)] font-mono uppercase">
              Team Management
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] max-w-xl leading-relaxed font-mono">
              Manage organization members, assign IAM roles (ADMIN, ENGINEER,
              VIEWER), and send invitations.
            </p>
          </div>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 border border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] font-mono font-bold text-xs transition-all cursor-pointer shrink-0 uppercase tracking-wider shadow-sm hover:opacity-90"
          >
            [+ INVITE_MEMBER]
          </button>
        </div>

        {/* Minimal Role Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div
            onClick={() =>
              setRoleFilter(roleFilter === "ADMIN" ? "ALL" : "ADMIN")
            }
            className={`p-4 rounded-none bg-[var(--card)] border space-y-1 transition-all cursor-pointer ${
              roleFilter === "ADMIN"
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-[var(--border)] hover:border-[var(--primary)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest">
                [ADMINISTRATORS]
              </p>
              <span className="text-[9px] px-1.5 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold">
                FULL ACCESS
              </span>
            </div>
            <h3 className="text-3xl font-light text-[var(--foreground)]">
              {adminCount.toString().padStart(2, "0")}
            </h3>
          </div>

          <div
            onClick={() =>
              setRoleFilter(roleFilter === "ENGINEER" ? "ALL" : "ENGINEER")
            }
            className={`p-4 rounded-none bg-[var(--card)] border space-y-1 transition-all cursor-pointer ${
              roleFilter === "ENGINEER"
                ? "border-blue-500/50 bg-blue-500/5"
                : "border-[var(--border)] hover:border-[var(--primary)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest">
                [ENGINEERS]
              </p>
              <span className="text-[9px] px-1.5 py-0.5 border border-blue-500/30 bg-blue-500/10 text-blue-400 font-bold">
                OPS CONTROL
              </span>
            </div>
            <h3 className="text-3xl font-light text-[var(--foreground)]">
              {engineerCount.toString().padStart(2, "0")}
            </h3>
          </div>

          <div
            onClick={() =>
              setRoleFilter(roleFilter === "VIEWER" ? "ALL" : "VIEWER")
            }
            className={`p-4 rounded-none bg-[var(--card)] border space-y-1 transition-all cursor-pointer ${
              roleFilter === "VIEWER"
                ? "border-[var(--primary)] bg-[var(--secondary)]"
                : "border-[var(--border)] hover:border-[var(--primary)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest">
                [VIEWERS]
              </p>
              <span className="text-[9px] px-1.5 py-0.5 border border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)] font-bold">
                READ ONLY
              </span>
            </div>
            <h3 className="text-3xl font-light text-[var(--foreground)]">
              {viewerCount.toString().padStart(2, "0")}
            </h3>
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
                className="w-full sm:w-80 px-3.5 py-2 bg-[var(--background)] border border-[var(--border)] rounded-none text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none transition-all font-mono"
              />

              {/* Role Filter Pills */}
              <div className="flex items-center gap-1">
                {["ALL", "ADMIN", "ENGINEER", "VIEWER"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-2 py-1 text-[10px] font-mono border transition-all cursor-pointer uppercase ${
                      roleFilter === role
                        ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] font-bold"
                        : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    [{role}]
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[var(--muted-foreground)] font-mono self-end sm:self-center">
              SHOWING{" "}
              <span className="font-bold text-[var(--foreground)]">
                {filteredMembers.length}
              </span>{" "}
              OF{" "}
              <span className="font-bold text-[var(--foreground)]">
                {members.length}
              </span>{" "}
              MEMBERS
            </div>
          </div>

          {/* Member List Component */}
          <MemberList
            members={filteredMembers}
            isLoading={isLoading}
            error={error as Error}
          />
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
