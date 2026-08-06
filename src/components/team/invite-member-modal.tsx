"use client";

import React, { useState } from "react";
import { useInviteMember } from "@/hooks/use-team";
import { MemberRole } from "@/types";
import {
	X,
	Mail,
	Shield,
	Loader2,
	UserPlus,
	AlertCircle,
	CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InviteMemberModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<MemberRole>("ADMIN");
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	const inviteMutation = useInviteMember();

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMsg(null);
		setSuccessMsg(null);

		if (!email || !email.includes("@")) {
			setErrorMsg("Please enter a valid work email address.");
			return;
		}

		inviteMutation.mutate(
			{ email, role },
			{
				onSuccess: (newMember) => {
					setSuccessMsg(
						`Successfully invited ${newMember.user?.email || email} as ${role}!`,
					);
					setEmail("");
					setTimeout(() => {
						setSuccessMsg(null);
						onClose();
					}, 1200);
				},
				onError: (err: any) => {
					const message =
						err.response?.data?.message ||
						err.message ||
						"Failed to send invitation. Please try again.";
					setErrorMsg(message);
				},
			},
		);
	};

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm font-mono select-none">
				<motion.div
					initial={{ opacity: 0, scale: 0.96 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.96 }}
					transition={{ duration: 0.15 }}
					className="w-full max-w-md bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] rounded-none shadow-2xl overflow-hidden"
				>
					{/* Modal Header */}
					<div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--secondary)]">
						<div className="flex items-center gap-2">
							<UserPlus className="w-4 h-4 text-[var(--foreground)]" />
							<h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
								[INVITE_TEAM_MEMBER]
							</h3>
						</div>

						<button
							onClick={onClose}
							className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
						>
							<X className="w-4 h-4" />
						</button>
					</div>

					{/* Modal Body / Form */}
					<form
						onSubmit={handleSubmit}
						className="p-5 space-y-4 font-mono text-xs"
					>
						{errorMsg && (
							<div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-start gap-2 text-[11px]">
								<AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
								<p>{errorMsg}</p>
							</div>
						)}

						{successMsg && (
							<div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-start gap-2 text-[11px]">
								<CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
								<p>{successMsg}</p>
							</div>
						)}

						{/* Email Field */}
						<div className="space-y-1.5">
							<label className="block text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
								[WORK_EMAIL_ADDRESS]
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="colleague@organization.com"
									required
									className="w-full pl-9 pr-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-none text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none transition-all font-mono"
								/>
							</div>
						</div>

						{/* Role Field */}
						<div className="space-y-1.5">
							<label className="block text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
								[ORGANIZATION_ROLE]
							</label>
							<div className="relative">
								<Shield className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
								<select
									value={role}
									onChange={(e) => setRole(e.target.value as MemberRole)}
									className="w-full pl-9 pr-3 py-2 bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none transition-all cursor-pointer font-mono uppercase"
								>
									<option value="ADMIN">
										ADMIN - Full administrative access & billing
									</option>
									<option value="ENGINEER">
										ENGINEER - Create, edit, and resolve incidents
									</option>
									<option value="VIEWER">
										VIEWER - Read-only dashboard access
									</option>
								</select>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
							<button
								type="button"
								onClick={onClose}
								className="px-3.5 py-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all cursor-pointer uppercase"
							>
								[CANCEL]
							</button>

							<button
								type="submit"
								disabled={inviteMutation.isPending}
								className="px-4 py-2 border border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] font-mono font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider"
							>
								{inviteMutation.isPending ? (
									<>
										<Loader2 className="w-3.5 h-3.5 animate-spin" />
										[SENDING...]
									</>
								) : (
									<>
										<UserPlus className="w-3.5 h-3.5" />
										[SEND_INVITATION]
									</>
								)}
							</button>
						</div>
					</form>
				</motion.div>
			</div>
		</AnimatePresence>
	);
}

export default InviteMemberModal;
