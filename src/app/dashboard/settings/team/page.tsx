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
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Client-side search filtering
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const query = searchQuery.toLowerCase().trim();
    return members.filter(
      (m) =>
        m.user?.email.toLowerCase().includes(query) ||
        (m.user?.name && m.user.name.toLowerCase().includes(query)) ||
        m.role.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  // Team Statistics
  const adminCount = members.filter((m) => m.role === "ADMIN").length;
  const engineerCount = members.filter((m) => m.role === "ENGINEER").length;
  const viewerCount = members.filter((m) => m.role === "VIEWER").length;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Top Minimal Header Navigation Bar */}
      <header className="border-b border-border/40 bg-card/40 backdrop-blur-2xl px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 font-sans glass-card-floating">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-muted-foreground">Settings</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-semibold text-foreground">Team Management</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="px-2.5 py-1 text-[11px] font-mono text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/60 border border-border/40 rounded-xl transition-all cursor-pointer"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-8 space-y-7">
        {/* Minimal Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Team Management
            </h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
              Manage organization members, assign IAM roles (ADMIN, ENGINEER, VIEWER), and send email invitations.
            </p>
          </div>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
          >
            + Invite Member
          </button>
        </div>

        {/* Minimal Role Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="p-4 rounded-2xl bg-card/30 border border-border/30 glass-card-floating space-y-1">
            <p className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-widest">
              ADMINISTRATORS
            </p>
            <h3 className="text-2xl font-bold text-foreground">{adminCount}</h3>
          </div>

          <div className="p-4 rounded-2xl bg-card/30 border border-border/30 glass-card-floating space-y-1">
            <p className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-widest">
              ENGINEERS
            </p>
            <h3 className="text-2xl font-bold text-foreground">{engineerCount}</h3>
          </div>

          <div className="p-4 rounded-2xl bg-card/30 border border-border/30 glass-card-floating space-y-1">
            <p className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-widest">
              VIEWERS
            </p>
            <h3 className="text-2xl font-bold text-foreground">{viewerCount}</h3>
          </div>
        </div>

        {/* Search & Member Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full sm:w-80 px-3.5 py-2 bg-card/40 border border-border/40 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all font-sans"
            />

            <div className="text-[11px] text-muted-foreground/80 font-mono self-end sm:self-center">
              Showing <span className="font-semibold text-foreground">{filteredMembers.length}</span> of{" "}
              <span className="font-semibold text-foreground">{members.length}</span> members
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
