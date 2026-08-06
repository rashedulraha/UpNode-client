"use client";

import React, { useState } from "react";
import { Member, MemberRole } from "@/types";
import { useRemoveMember, useUpdateMemberRole } from "@/hooks/use-team";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface MemberListProps {
	members: Member[];
	isLoading: boolean;
	error: Error | null;
}

export function MemberList({ members, isLoading, error }: MemberListProps) {
	const removeMutation = useRemoveMember();
	const updateRoleMutation = useUpdateMemberRole();

	// Confirmation Modal State
	const [modalAction, setModalAction] = useState<
		| {
				type: "remove_member";
				memberId: string;
				email: string;
		  }
		| {
				type: "change_role";
				memberId: string;
				email: string;
				currentRole: MemberRole;
				newRole: MemberRole;
		  }
		| null
	>(null);

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [actionError, setActionError] = useState<string | null>(null);

	const handleConfirmAction = async () => {
		if (!modalAction) return;

		try {
			setIsSubmitting(true);
			setActionError(null);

			if (modalAction.type === "remove_member") {
				await removeMutation.mutateAsync(modalAction.memberId);
			} else if (modalAction.type === "change_role") {
				await updateRoleMutation.mutateAsync({
					memberId: modalAction.memberId,
					role: modalAction.newRole,
				});
			}

			setModalAction(null);
		} catch (err: any) {
			setActionError(err.message || "Operation failed. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="p-6 rounded-none bg-[var(--card)] border border-[var(--border)] text-center font-mono text-xs text-[var(--muted-foreground)] animate-pulse">
				[LOADING_ORGANIZATION_MEMBERS...]
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 rounded-none bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-mono">
				<p className="font-bold">[FAILED TO LOAD MEMBERS]</p>
				<p className="opacity-80">
					{error.message || "Please check network connection."}
				</p>
			</div>
		);
	}

	if (!members || members.length === 0) {
		return (
			<div className="p-8 text-center rounded-none bg-[var(--card)] border border-[var(--border)] font-mono text-xs text-[var(--muted-foreground)] italic">
				[NO MEMBERS FOUND MATCHING SEARCH CRITERIA]
			</div>
		);
	}

	const getRoleBadgeStyle = (role: MemberRole) => {
		switch (role) {
			case "ADMIN":
				return "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold";
			case "ENGINEER":
				return "border border-blue-500/30 bg-blue-500/10 text-blue-400 font-semibold";
			case "VIEWER":
			default:
				return "border border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)]";
		}
	};

	const getInitials = (name?: string, email?: string) => {
		if (name) {
			const parts = name.trim().split(" ");
			if (parts.length >= 2)
				return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
			return name.substring(0, 2).toUpperCase();
		}
		if (email) return email.substring(0, 2).toUpperCase();
		return "TM";
	};

	return (
		<>
			<div className="rounded-none bg-[var(--card)] border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)] font-mono shadow-sm">
				{members.map((member) => (
					<div
						key={member.id}
						className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[var(--secondary)] transition-colors"
					>
						{/* Left: User Avatar & Basic Info */}
						<div className="flex items-center gap-3.5 min-w-0">
							<div className="w-9 h-9 rounded-none bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] font-mono font-bold text-xs flex items-center justify-center shrink-0 uppercase">
								{getInitials(member.user?.name, member.user?.email)}
							</div>

							<div className="min-w-0 space-y-0.5 font-sans">
								<div className="flex items-center gap-2 font-mono">
									<h4 className="text-xs font-bold text-slate-900 dark:text-white truncate font-sans">
										{member.user?.name || "UNNAMED"}
									</h4>
									<span
										className={`px-2 py-0.5 rounded-none text-[10px] uppercase tracking-wider ${getRoleBadgeStyle(
											member.role,
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
									? formatDistanceToNow(new Date(member.user.createdAt), {
											addSuffix: true,
										})
									: "Joined recently"}
							</span>

							<div className="flex items-center gap-2">
								<select
									value={member.role}
									disabled={updateRoleMutation.isPending}
									onChange={(e) => {
										const newRole = e.target.value as MemberRole;
										if (newRole !== member.role) {
											setModalAction({
												type: "change_role",
												memberId: member.id,
												email: member.user?.email || "Team Member",
												currentRole: member.role,
												newRole,
											});
										}
									}}
									className="bg-white dark:bg-black border border-slate-300 dark:border-neutral-800 rounded-none px-2.5 py-1 text-[11px] font-mono text-slate-900 dark:text-white focus:outline-none transition-all cursor-pointer uppercase"
								>
									<option value="ADMIN">ADMIN</option>
									<option value="ENGINEER">ENGINEER</option>
									<option value="VIEWER">VIEWER</option>
								</select>

								<button
									onClick={() => {
										setModalAction({
											type: "remove_member",
											memberId: member.id,
											email: member.user?.email || "Team Member",
										});
									}}
									disabled={removeMutation.isPending}
									className="px-2.5 py-1 border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-slate-600 dark:text-neutral-400 text-[11px] hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/50 hover:shadow-[0_0_12px_rgba(244,63,94,0.25)] transition-all cursor-pointer uppercase disabled:opacity-50"
								>
									[REMOVE]
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* CONFIRMATION ACTION MODAL */}
			<AnimatePresence>
				{modalAction && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md font-mono">
						<motion.div
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.96 }}
							className="w-full max-w-md p-6 border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black shadow-2xl space-y-6 relative rounded-none"
						>
							<div className="space-y-2">
								<span className="text-[10px] text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 font-bold uppercase tracking-wider rounded-none">
									[CONFIRMATION_REQUIRED]
								</span>

								<h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide font-sans">
									{modalAction.type === "remove_member" &&
										`Remove "${modalAction.email}"?`}
									{modalAction.type === "change_role" &&
										`Update Role for "${modalAction.email}"?`}
								</h3>

								<p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed font-mono">
									{modalAction.type === "remove_member" &&
										"Removing this member will immediately revoke their access to organization projects, telemetry streams, and alert integrations."}
									{modalAction.type === "change_role" &&
										`Reassigning role from [${modalAction.currentRole}] to [${modalAction.newRole}]. Access privileges and IAM permissions will be updated instantly.`}
								</p>

								{actionError && (
									<p className="text-xs text-rose-600 dark:text-rose-400 pt-1">
										[ERR]: {actionError}
									</p>
								)}
							</div>

							<div className="flex items-center justify-end gap-3 pt-2 text-xs font-mono">
								<button
									onClick={() => {
										setModalAction(null);
										setActionError(null);
									}}
									disabled={isSubmitting}
									className="px-4 py-2 border border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-black text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white uppercase cursor-pointer rounded-none disabled:opacity-50"
								>
									[CANCEL]
								</button>
								<button
									onClick={handleConfirmAction}
									disabled={isSubmitting}
									className={`px-4 py-2 border uppercase cursor-pointer disabled:opacity-50 font-bold rounded-none ${
										modalAction.type === "remove_member"
											? "border-rose-600 bg-rose-600 dark:bg-rose-950/60 text-white dark:text-rose-200 hover:bg-rose-700 dark:hover:bg-rose-900 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]"
											: "border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
									}`}
								>
									{isSubmitting ? "[PROCESSING...]" : "[CONFIRM]"}
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}

export default MemberList;
