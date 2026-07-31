"use client";

import React from "react";
import { Member, MemberRole } from "@/types";
import { Shield, ShieldAlert, Eye, UserX, Loader2, Mail, Calendar } from "lucide-react";
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
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-card border border-border/60 animate-pulse flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-48 bg-muted rounded" />
              </div>
            </div>
            <div className="h-6 w-20 bg-muted rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
        <p className="font-semibold">Failed to load organization members.</p>
        <p className="opacity-80">{error.message || "Please check your network connection and try again."}</p>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-muted/30 border border-border border-dashed space-y-3">
        <Mail className="w-8 h-8 text-muted-foreground mx-auto" />
        <h3 className="text-sm font-semibold text-foreground">No Team Members Found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          You haven't added any team members yet. Click the "Invite Member" button above to send invitations.
        </p>
      </div>
    );
  }

  const getRoleBadge = (role: MemberRole) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[11px] font-medium">
            <ShieldAlert className="w-3 h-3" />
            ADMIN
          </span>
        );
      case "ENGINEER":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-medium">
            <Shield className="w-3 h-3" />
            ENGINEER
          </span>
        );
      case "VIEWER":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground text-[11px] font-medium">
            <Eye className="w-3 h-3" />
            VIEWER
          </span>
        );
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
    <div className="divide-y divide-border border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
      {members.map((member) => (
        <div
          key={member.id}
          className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
        >
          {/* Left: User Info & Avatar */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0 uppercase">
              {getInitials(member.user?.name, member.user?.email)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold text-foreground truncate">
                  {member.user?.name || "Team Member"}
                </h4>
                {getRoleBadge(member.role)}
              </div>
              <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3 h-3 shrink-0" />
                {member.user?.email}
              </p>
            </div>
          </div>

          {/* Right: Joined Date & Role Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 text-xs">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3" />
              {member.user?.createdAt
                ? formatDistanceToNow(new Date(member.user.createdAt), { addSuffix: true })
                : "Joined recently"}
            </span>

            <div className="flex items-center gap-2">
              {/* Role Select Dropdown */}
              <select
                value={member.role}
                disabled={updateRoleMutation.isPending}
                onChange={(e) =>
                  updateRoleMutation.mutate({
                    memberId: member.id,
                    role: e.target.value as MemberRole,
                  })
                }
                className="bg-muted/60 hover:bg-muted border border-border rounded-lg px-2.5 py-1 text-[11px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="ENGINEER">ENGINEER</option>
                <option value="VIEWER">VIEWER</option>
              </select>

              {/* Remove Member Button */}
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to remove ${member.user?.email} from the organization?`)) {
                    removeMutation.mutate(member.id);
                  }
                }}
                disabled={removeMutation.isPending}
                title="Remove member"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {removeMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UserX className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MemberList;
