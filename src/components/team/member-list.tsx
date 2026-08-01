"use client";

import React from "react";
import { Member, MemberRole } from "@/types";
import { Loader2 } from "lucide-react";
import { useRemoveMember, useUpdateMemberRole } from "@/hooks/use-team";
import { formatDistanceToNow } from "date-fns";

interface MemberListProps {
  members: Member[];
  isLoading: boolean;
  error: Error | null;
}

export function MemberList({ members, isLoading, error }: MemberListProps) {
  const removeMutation = useRemoveMember();
  const updateRoleMutation = useUpdateMemberRole();

  if (isLoading) {
    return (
      <div className="space-y-2 p-6 rounded-2xl bg-card/30 border border-border/30 text-center font-mono text-xs text-muted-foreground animate-pulse">
        Loading organization members...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
        <p className="font-semibold">Failed to load organization members.</p>
        <p className="opacity-80">{error.message || "Please check your network connection."}</p>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-card/30 border border-border/30 font-mono text-xs text-muted-foreground">
        No team members found matching your search.
      </div>
    );
  }

  const getRoleBadgeStyle = (role: MemberRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "ENGINEER":
        return "bg-primary/10 text-primary border-primary/30";
      case "VIEWER":
      default:
        return "bg-muted/40 text-muted-foreground border-border/40";
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.substring(0, 2).toUpperCase();
    }
    if (email) return email.substring(0, 2).toUpperCase();
    return "TM";
  };

  return (
    <div className="rounded-2xl bg-card/30 border border-border/30 overflow-hidden glass-card-floating divide-y divide-border/30 font-sans">
      {members.map((member) => (
        <div
          key={member.id}
          className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
        >
          {/* Left: User Avatar & Basic Info */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono font-bold text-xs flex items-center justify-center shrink-0 uppercase">
              {getInitials(member.user?.name, member.user?.email)}
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-foreground truncate">
                  {member.user?.name || "Team Member"}
                </h4>
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider border ${getRoleBadgeStyle(
                    member.role
                  )}`}
                >
                  {member.role}
                </span>
              </div>
              <p className="text-[11px] font-mono text-muted-foreground/80 truncate">
                {member.user?.email}
              </p>
            </div>
          </div>

          {/* Right: Joined Timestamp, Role Selector, Remove Action */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-end shrink-0">
            <span className="text-[10px] font-mono text-muted-foreground/60">
              {member.user?.createdAt
                ? formatDistanceToNow(new Date(member.user.createdAt), { addSuffix: true })
                : "Joined recently"}
            </span>

            <div className="flex items-center gap-2">
              <select
                value={member.role}
                disabled={updateRoleMutation.isPending}
                onChange={(e) =>
                  updateRoleMutation.mutate({
                    memberId: member.id,
                    role: e.target.value as MemberRole,
                  })
                }
                className="bg-muted/30 hover:bg-muted/60 border border-border/40 rounded-xl px-2.5 py-1 text-[11px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="ENGINEER">ENGINEER</option>
                <option value="VIEWER">VIEWER</option>
              </select>

              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to remove ${member.user?.email}?`)) {
                    removeMutation.mutate(member.id);
                  }
                }}
                disabled={removeMutation.isPending}
                className="px-2.5 py-1 text-[11px] font-mono text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {removeMutation.isPending ? "..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MemberList;
