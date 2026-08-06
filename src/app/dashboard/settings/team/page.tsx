"use client";

import React, { useState, useMemo } from "react";
import { useMembers } from "@/hooks/use-team";
import MemberList from "@/components/team/member-list";
import InviteMemberModal from "@/components/team/invite-member-modal";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { SettingsNav } from "@/components/settings/settings-nav";
import { useIncidentStream } from "@/hooks/useIncidentStream";
import {
	Users,
	UserPlus,
	Shield,
	Cpu,
	Eye,
	Search,
	RefreshCw,
} from "lucide-react";

export default function TeamSettingsPage() {
	const streamStatus = useIncidentStream();
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
			{/* Background Noise Grid Layer */}
			<div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

			{/* Sticky Dashboard Header Navbar */}
			<DashboardHeader
				streamStatus={streamStatus}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				onOpenCreateModal={() => {}}
			/>

			{/* Main Content Area */}
			<main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 relative z-10 font-mono">
				{/* Shared Settings Navigation Bar */}
				<SettingsNav />

				{/* Console Header Card */}
				<div className="p-6 rounded-none bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] space-y-4 shadow-sm">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="space-y-1.5">
							<div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
								<Users className="w-4 h-4 text-sky-400" />
								<span className="font-semibold uppercase tracking-wider">
									ORGANIZATION // IAM ACCESS
								</span>
							</div>
							<h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[var(--foreground)]">
								Team Management
							</h1>
							<p className="text-xs text-[var(--muted-foreground)] max-w-xl leading-relaxed">
								Manage organization members, assign IAM roles (ADMIN, ENGINEER,
								VIEWER), and send invitations.
							</p>
						</div>

						<div className="flex items-center gap-2.5 shrink-0">
							<button
								onClick={() => refetch()}
								className="px-3.5 py-2 rounded-none border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] hover:opacity-80 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
							>
								<RefreshCw
									className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
								/>
								<span>{isLoading ? "[SYNCING...]" : "[REFRESH]"}</span>
							</button>

							<button
								onClick={() => setIsInviteModalOpen(true)}
								className="px-4 py-2 rounded-none border border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] font-mono font-bold text-xs transition-all cursor-pointer shrink-0 uppercase tracking-wider shadow-sm hover:opacity-90 flex items-center gap-2 active:scale-95"
							>
								<UserPlus className="w-3.5 h-3.5" />
								<span>[+ INVITE_MEMBER]</span>
							</button>
						</div>
					</div>
				</div>

				{/* Dashboard Role Stats Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
					<div
						onClick={() =>
							setRoleFilter(roleFilter === "ADMIN" ? "ALL" : "ADMIN")
						}
						className={`p-5 rounded-none bg-[var(--card)]/90 backdrop-blur-xl border space-y-2 transition-all cursor-pointer shadow-sm ${
							roleFilter === "ADMIN"
								? "border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_16px_rgba(16,185,129,0.15)]"
								: "border-[var(--border)] hover:border-[var(--primary)]"
						}`}
					>
						<div className="flex items-center justify-between">
							<p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest flex items-center gap-1.5">
								<Shield className="w-3.5 h-3.5 text-emerald-400" />
								<span>ADMINISTRATORS</span>
							</p>
							<span className="text-[9px] px-2 py-0.5 rounded-none border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold uppercase">
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
						className={`p-5 rounded-none bg-[var(--card)]/90 backdrop-blur-xl border space-y-2 transition-all cursor-pointer shadow-sm ${
							roleFilter === "ENGINEER"
								? "border-sky-500/60 bg-sky-500/10 shadow-[0_0_16px_rgba(56,189,248,0.15)]"
								: "border-[var(--border)] hover:border-[var(--primary)]"
						}`}
					>
						<div className="flex items-center justify-between">
							<p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest flex items-center gap-1.5">
								<Cpu className="w-3.5 h-3.5 text-sky-400" />
								<span>ENGINEERS</span>
							</p>
							<span className="text-[9px] px-2 py-0.5 rounded-none border border-sky-500/30 bg-sky-500/10 text-sky-400 font-bold uppercase">
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
						className={`p-5 rounded-none bg-[var(--card)]/90 backdrop-blur-xl border space-y-2 transition-all cursor-pointer shadow-sm ${
							roleFilter === "VIEWER"
								? "border-amber-500/60 bg-amber-500/10 shadow-[0_0_16px_rgba(245,158,11,0.15)]"
								: "border-[var(--border)] hover:border-[var(--primary)]"
						}`}
					>
						<div className="flex items-center justify-between">
							<p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest flex items-center gap-1.5">
								<Eye className="w-3.5 h-3.5 text-amber-400" />
								<span>VIEWERS</span>
							</p>
							<span className="text-[9px] px-2 py-0.5 rounded-none border border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold uppercase">
								READ ONLY
							</span>
						</div>
						<h3 className="text-3xl font-light text-[var(--foreground)]">
							{viewerCount.toString().padStart(2, "0")}
						</h3>
					</div>
				</div>

				{/* Search & Member List Card */}
				<div className="p-6 rounded-none bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] space-y-5 font-mono shadow-sm">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<div className="flex items-center gap-3 w-full sm:w-auto">
							<div className="relative flex items-center w-full sm:w-80">
								<Search className="absolute left-3.5 h-3.5 w-3.5 text-[var(--muted-foreground)] pointer-events-none" />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="[SEARCH NAME / EMAIL / ROLE]"
									className="w-full pl-9 pr-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-none text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none transition-all font-mono shadow-inner"
								/>
							</div>

							{/* Role Filter Pills */}
							<div className="flex items-center gap-1 overflow-x-auto">
								{["ALL", "ADMIN", "ENGINEER", "VIEWER"].map((role) => (
									<button
										key={role}
										onClick={() => setRoleFilter(role)}
										className={`px-3 py-1.5 rounded-none text-[10px] font-mono border transition-all cursor-pointer uppercase ${
											roleFilter === role
												? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-sm"
												: "border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
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
