"use client";

import React, { useState } from "react";
import { Member, MemberRole } from "@/types";
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
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; email: string } | null>(null);

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;
    try {
      await removeMutation.mutateAsync(memberToRemove.id);
      setMemberToRemove(null);
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white/70 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 text-center font-mono text-xs text-slate-500 dark:text-neutral-500 animate-pulse">
        [LOADING_ORGANIZATION_MEMBERS...]
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-mono">
        <p className="font-bold">[FAILED TO LOAD MEMBERS]</p>
        <p className="opacity-80">{error.message || "Please check network connection."}</p>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white/70 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 font-mono text-xs text-slate-500 dark:text-neutral-500 italic">
        [NO MEMBERS FOUND MATCHING SEARCH CRITERIA]
      </div>
    );
  }

  const getRoleBadgeStyle = (role: MemberRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white font-bold";
      case "ENGINEER":
        return "bg-slate-100 dark:bg-neutral-900 text-slate-800 dark:text-neutral-200 border-slate-300 dark:border-neutral-700 font-semibold";
      case "VIEWER":
      default:
        return "bg-slate-100/50 dark:bg-neutral-950 text-slate-500 dark:text-neutral-500 border-slate-200 dark:border-neutral-800";
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
    <div className="rounded-2xl bg-white/80 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 overflow-hidden divide-y divide-slate-200/80 dark:divide-neutral-900 font-mono">
      {members.map((member) => (
        <div
          key={member.id}
          className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-neutral-900/60 transition-colors"
        >
          {/* Left: User Avatar & Basic Info */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-slate-900 dark:text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 uppercase">
              {getInitials(member.user?.name, member.user?.email)}
            </div>

            <div className="min-w-0 space-y-0.5 font-sans">
              <div className="flex items-center gap-2 font-mono">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate font-sans">
                  {member.user?.name || "UNNAMED"}
                </h4>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border ${getRoleBadgeStyle(
                    member.role
                  )}`}
                >
                  [{member.role}]
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 dark:text-neutral-500 truncate">
                {member.user?.email}
              </p>
            </div>
          </div>

          {/* Right: Joined Timestamp, Role Selector, Remove Action */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-end shrink-0 font-mono">
            <span className="text-[10px] text-slate-400 dark:text-neutral-500">
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
                className="bg-white dark:bg-black border border-slate-300 dark:border-neutral-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-900 dark:text-white focus:outline-none transition-all cursor-pointer uppercase"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="ENGINEER">ENGINEER</option>
                <option value="VIEWER">VIEWER</option>
              </select>

              <button
                onClick={() => {
                  setMemberToRemove({
                    id: member.id,
                    email: member.user?.email || "Team Member",
                  });
                }}
                disabled={removeMutation.isPending}
                className="px-2.5 py-1 border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-slate-600 dark:text-neutral-400 text-[11px] hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/50 hover:shadow-[0_0_12px_rgba(244,63,94,0.25)] transition-all cursor-pointer uppercase disabled:opacity-50"
              >
                {removeMutation.isPending ? "[...]" : "[REMOVE]"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MemberList;
