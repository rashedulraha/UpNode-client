"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useMembers } from "@/hooks/use-team";
import MemberList from "@/components/team/member-list";
import InviteMemberModal from "@/components/team/invite-member-modal";
import { Users, UserPlus, Search, ChevronRight, Shield, ShieldAlert, Eye, RefreshCw } from "lucide-react";
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
      {/* Top Header Navigation Bar */}
      <header className="border-b border-border bg-card/50 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-muted-foreground">Settings</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-foreground">Team Management</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => refetch()}
            title="Refresh member list"
            className="p-2 rounded-xl bg-muted/60 hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-8 space-y-8">
        {/* Page Title Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <Users className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Team Management
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Manage organization members, assign IAM roles (ADMIN, ENGINEER, VIEWER), and send email invitations.
            </p>
          </div>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        {/* Quick Role Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                Administrators
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{adminCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                Engineers
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{engineerCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Shield className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                Viewers
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{viewerCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-muted border border-border text-muted-foreground">
              <Eye className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Member List Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or role..."
                className="w-full pl-10 pr-3.5 py-2 bg-card border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="text-xs text-muted-foreground font-mono self-end sm:self-center">
              Showing <span className="font-semibold text-foreground">{filteredMembers.length}</span> of{" "}
              <span className="font-semibold text-foreground">{members.length}</span> members
            </div>
          </div>

          {/* Member List */}
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
