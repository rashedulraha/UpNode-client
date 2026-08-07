"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import {
	adminService,
	PlatformStats,
	PlatformUser,
} from "@/services/admin.service";
import { AdminNavTabs } from "@/components/admin/admin-nav-tabs";
import { SuperAdminSidebar } from "@/components/admin/super-admin-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
	AdminPageSkeleton,
	TableSkeletonRows,
} from "@/components/ui/skeleton-loaders";
import {
	ShieldAlert,
	Users,
	Building2,
	FolderCheck,
	Lock,
	Unlock,
	ArrowLeft,
	Loader2,
	CheckCircle2,
	AlertCircle,
	Terminal,
	RefreshCw,
	DollarSign,
	Radio,
	Sparkles,
	TrendingUp,
	Layers,
	ShieldCheck,
	Server,
} from "lucide-react";

export default function SuperAdminPage() {
	const router = useRouter();
	const { user, isLoading: isAuthLoading } = useAuth();

	const [stats, setStats] = useState<PlatformStats | null>(null);
	const [usersList, setUsersList] = useState<PlatformUser[]>([]);
	const [isLoadingData, setIsLoadingData] = useState(true);
	const [actionError, setActionError] = useState<string | null>(null);
	const [actionSuccess, setActionSuccess] = useState<string | null>(null);
	const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");
	const [confirmModal, setConfirmModal] = useState<{
		isOpen: boolean;
		targetUser: PlatformUser | null;
	}>({
		isOpen: false,
		targetUser: null,
	});

	// Guard check for SUPER_ADMIN role
	const isSuperAdmin = user?.role === "SUPER_ADMIN";

	const handleConfirmBlock = async () => {
		if (!confirmModal.targetUser) return;
		const targetUser = confirmModal.targetUser;

		try {
			setTogglingUserId(targetUser.id);
			setActionError(null);
			setActionSuccess(null);

			const result = await adminService.toggleUserBlock(targetUser.id);
			setUsersList((prev) =>
				prev.map((u) => (u.id === targetUser.id ? result.user : u)),
			);
			setActionSuccess(result.message);
			setTimeout(() => setActionSuccess(null), 4000);
		} catch (err: any) {
			setActionError(
				err?.response?.data?.error || "Failed to update user block status.",
			);
		} finally {
			setTogglingUserId(null);
			setConfirmModal({ isOpen: false, targetUser: null });
		}
	};

	useEffect(() => {
		if (!isAuthLoading) {
			if (!user || !isSuperAdmin) {
				router.replace("/dashboard");
			} else {
				fetchAdminData();
			}
		}
	}, [user, isAuthLoading, isSuperAdmin, router]);

	const fetchAdminData = async () => {
		try {
			setIsLoadingData(true);
			setActionError(null);
			const [statsRes, usersRes] = await Promise.all([
				adminService.getStats(),
				adminService.getUsers(),
			]);
			setStats(statsRes);
			setUsersList(usersRes);
		} catch (err: any) {
			setActionError(
				err?.response?.data?.error || "Failed to load platform data.",
			);
		} finally {
			setIsLoadingData(false);
		}
	};

	const handleToggleBlock = async (targetUser: PlatformUser) => {
		try {
			setTogglingUserId(targetUser.id);
			setActionError(null);
			setActionSuccess(null);

			const result = await adminService.toggleUserBlock(targetUser.id);
			setUsersList((prev) =>
				prev.map((u) => (u.id === targetUser.id ? result.user : u)),
			);
			setActionSuccess(result.message);
			setTimeout(() => setActionSuccess(null), 4000);
		} catch (err: any) {
			setActionError(
				err?.response?.data?.error || "Failed to update user block status.",
			);
		} finally {
			setTogglingUserId(null);
		}
	};

	if (isAuthLoading || (user && !isSuperAdmin)) {
		return <AdminPageSkeleton />;
	}

	const filteredUsers = usersList.filter(
		(u) =>
			u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			u.role.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="h-screen bg-[var(--background)] text-[var(--foreground)] font-mono flex flex-col overflow-hidden transition-colors duration-300">
			{/* Dashboard Header */}
			<DashboardHeader
				streamStatus={{
					isConnected: true,
					isReconnecting: false,
					error: null,
					lastEventTime: null,
				}}
				searchQuery=""
				onSearchChange={() => {}}
				onOpenCreateModal={() => {}}
				showSearch={false}
			/>

			<div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
				{/* Super Admin Left Sidebar */}
				<SuperAdminSidebar />

				{/* Main Workspace Area */}
				<main className="flex-1 h-full p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 min-w-0">
					{/* Top Alert Banners */}
					{actionError && (
						<div className="p-4 rounded-none bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3 shadow-sm">
							<AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
							<span>[ERR]: {actionError}</span>
						</div>
					)}

					{actionSuccess && (
						<div className="p-4 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3 shadow-sm">
							<CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
							<span>[SUCCESS]: {actionSuccess}</span>
						</div>
					)}

					<AdminNavTabs />

					{/* Section Header & View Mode Switcher */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] shadow-sm">
						<div className="space-y-1">
							<div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] uppercase font-bold">
								<ShieldCheck className="w-4 h-4 text-emerald-500" />
								<span>PLATFORM_METRICS_OVERVIEW // MASTER_CONTROL</span>
							</div>
							<h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[var(--foreground)]">
								Super Admin Platform Dashboard
							</h1>
							<p className="text-xs text-[var(--muted-foreground)] max-w-xl">
								Live platform telemetry, multi-tenant organization statistics,
								registered users, and recurring revenue overview.
							</p>
						</div>

						<div className="flex items-center gap-2 shrink-0">
							<button
								onClick={() => setActiveTab("overview")}
								className={`px-4 py-2 text-xs font-bold uppercase transition-all border cursor-pointer ${
									activeTab === "overview"
										? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm"
										: "bg-[var(--secondary)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]"
								}`}
							>
								[OVERVIEW]
							</button>
							<button
								onClick={() => setActiveTab("users")}
								className={`px-4 py-2 text-xs font-bold uppercase transition-all border cursor-pointer ${
									activeTab === "users"
										? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm"
										: "bg-[var(--secondary)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]"
								}`}
							>
								[USER_MANAGEMENT]
							</button>
						</div>
					</div>

					{/* 4 Required Platform Overview Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* 1. Total Organizations / Admins */}
						<div className="p-5 bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] space-y-3 relative shadow-sm hover:border-[var(--primary)]/50 transition-colors">
							<div className="flex items-center justify-between">
								<span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
									[01_ADMINS_ORGS]
								</span>
								<Building2 className="w-4 h-4 text-sky-500" />
							</div>
							<div className="space-y-1">
								<p className="text-3xl font-bold text-[var(--foreground)] font-mono">
									{stats ? (
										stats.totalOrganizations
									) : (
										<Loader2 className="w-5 h-5 animate-spin" />
									)}
								</p>
								<p className="text-[11px] font-bold text-sky-500 uppercase flex items-center gap-1.5">
									<span>{stats?.totalAdmins || 0} Registered Admins</span>
								</p>
							</div>
							<p className="text-[11px] text-[var(--muted-foreground)] leading-tight border-t border-[var(--border)] pt-2">
								Total organizations created by tenant Admin accounts.
							</p>
						</div>

						{/* 2. Total Registered Users */}
						<div className="p-5 bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] space-y-3 relative shadow-sm hover:border-[var(--primary)]/50 transition-colors">
							<div className="flex items-center justify-between">
								<span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
									[02_TOTAL_USERS]
								</span>
								<Users className="w-4 h-4 text-emerald-500" />
							</div>
							<div className="space-y-1">
								<p className="text-3xl font-bold text-[var(--foreground)] font-mono">
									{stats ? (
										stats.totalUsers
									) : (
										<Loader2 className="w-5 h-5 animate-spin" />
									)}
								</p>
								<p className="text-[11px] font-bold text-emerald-500 uppercase flex items-center gap-1.5">
									<span>Across all multi-tenants</span>
								</p>
							</div>
							<p className="text-[11px] text-[var(--muted-foreground)] leading-tight border-t border-[var(--border)] pt-2">
								Total platform-wide registered users (Admins, Engineers &
								Viewers).
							</p>
						</div>

						{/* 3. Active Projects */}
						<div className="p-5 bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] space-y-3 relative shadow-sm hover:border-[var(--primary)]/50 transition-colors">
							<div className="flex items-center justify-between">
								<span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
									[03_ACTIVE_PROJECTS]
								</span>
								<FolderCheck className="w-4 h-4 text-amber-500" />
							</div>
							<div className="space-y-1">
								<p className="text-3xl font-bold text-[var(--foreground)] font-mono">
									{stats ? (
										stats.activeProjects
									) : (
										<Loader2 className="w-5 h-5 animate-spin" />
									)}
								</p>
								<p className="text-[11px] font-bold text-amber-500 uppercase flex items-center gap-1.5">
									<span>Monitored Up-time Targets</span>
								</p>
							</div>
							<p className="text-[11px] text-[var(--muted-foreground)] leading-tight border-t border-[var(--border)] pt-2">
								Currently active projects monitored by BullMQ ping workers.
							</p>
						</div>

						{/* 4. Monthly Revenue & Subscription */}
						<div className="p-5 bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] space-y-3 relative shadow-sm hover:border-[var(--primary)]/50 transition-colors">
							<div className="flex items-center justify-between">
								<span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
									[04_REVENUE_MRR]
								</span>
								<DollarSign className="w-4 h-4 text-emerald-500" />
							</div>
							<div className="space-y-1">
								<p className="text-3xl font-bold text-emerald-500 font-mono">
									{stats ? (
										`$${stats.monthlyRevenue}/mo`
									) : (
										<Loader2 className="w-5 h-5 animate-spin" />
									)}
								</p>
								<p className="text-[11px] font-bold text-[var(--foreground)] uppercase flex items-center gap-1.5">
									<span>
										{stats?.paidSubscribers || 0} Paid Pro Subscriptions
									</span>
								</p>
							</div>
							<p className="text-[11px] text-[var(--muted-foreground)] leading-tight border-t border-[var(--border)] pt-2">
								Monthly recurring revenue from paid Admin subscriptions ($29/mo
								tier).
							</p>
						</div>
					</div>

					{/* Active Tab View Rendering */}
					{activeTab === "overview" ? (
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Platform Infrastructure Health & Engine Status */}
							<div className="lg:col-span-2 p-6 bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] space-y-5 shadow-sm">
								<div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
									<div className="space-y-1">
										<div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] uppercase font-bold">
											<Server className="w-4 h-4 text-emerald-500" />
											<span>INFRASTRUCTURE_CLUSTER // REALTIME_ENGINE</span>
										</div>
										<h2 className="text-base font-bold uppercase text-[var(--foreground)]">
											System Health & Telemetry Status
										</h2>
									</div>
									<div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[11px] font-bold uppercase">
										SYSTEM_HEALTHY
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="p-4 bg-[var(--secondary)]/60 border border-[var(--border)] space-y-1.5">
										<p className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold">
											PONG_WORKER_QUEUES
										</p>
										<p className="text-sm font-bold text-emerald-500 flex items-center gap-2">
											<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
											BullMQ Ping Worker [ACTIVE]
										</p>
										<p className="text-[11px] text-[var(--muted-foreground)]">
											Processing HTTP/TCP uptime pings every 5m.
										</p>
									</div>

									<div className="p-4 bg-[var(--secondary)]/60 border border-[var(--border)] space-y-1.5">
										<p className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold">
											DISPATCH_ALERT_QUEUES
										</p>
										<p className="text-sm font-bold text-emerald-500 flex items-center gap-2">
											<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
											Alert Dispatcher [ACTIVE]
										</p>
										<p className="text-[11px] text-[var(--muted-foreground)]">
											Webhook and Email alerts queued for execution.
										</p>
									</div>
								</div>

								<div className="p-4 bg-[var(--secondary)]/60 border border-[var(--border)] space-y-2">
									<div className="flex items-center justify-between text-xs font-bold uppercase">
										<span className="text-[var(--foreground)]">
											Database Cluster (Neon Postgres)
										</span>
										<span className="text-emerald-500">[CONNECTED]</span>
									</div>
									<div className="w-full bg-[var(--border)] h-2 rounded-none overflow-hidden">
										<div className="bg-emerald-500 h-full w-[94%]" />
									</div>
									<p className="text-[11px] text-[var(--muted-foreground)]">
										Connection pool operational. Response latency &lt; 42ms.
									</p>
								</div>
							</div>

							{/* Subscription & Revenue Breakdown */}
							<div className="p-6 bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] space-y-5 shadow-sm">
								<div className="border-b border-[var(--border)] pb-3 space-y-1">
									<div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] uppercase font-bold">
										<TrendingUp className="w-4 h-4 text-emerald-500" />
										<span>REVENUE_SUBSCRIPTION_TIERS</span>
									</div>
									<h2 className="text-base font-bold uppercase text-[var(--foreground)]">
										Plan Tier Distribution
									</h2>
								</div>

								<div className="space-y-4 text-xs">
									<div className="p-3 border border-[var(--border)] bg-[var(--secondary)]/40 space-y-1">
										<div className="flex items-center justify-between font-bold uppercase">
											<span>Pro Tier ($29/mo)</span>
											<span className="text-emerald-500 font-bold">
												{stats?.paidSubscribers || 0} Admins
											</span>
										</div>
										<p className="text-[11px] text-[var(--muted-foreground)]">
											Includes 20 Projects, Slack & Webhooks
										</p>
									</div>

									<div className="p-3 border border-[var(--border)] bg-[var(--secondary)]/40 space-y-1">
										<div className="flex items-center justify-between font-bold uppercase">
											<span>Free Plan Tier</span>
											<span className="text-[var(--foreground)]">
												{Math.max(
													0,
													(stats?.totalAdmins || 0) -
														(stats?.paidSubscribers || 0),
												)}{" "}
												Admins
											</span>
										</div>
										<p className="text-[11px] text-[var(--muted-foreground)]">
											Limited to 3 Projects & Email Alerts
										</p>
									</div>

									<div className="p-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 space-y-1">
										<p className="font-bold uppercase text-[11px]">
											Monthly Recurring Revenue (MRR)
										</p>
										<p className="text-xl font-bold">
											${stats?.monthlyRevenue || 0}.00 USD
										</p>
									</div>
								</div>
							</div>
						</div>
					) : (
						/* Global Platform Users Table */
						<div className="bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] p-6 space-y-5 shadow-sm">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
								<div className="space-y-1">
									<div className="flex items-center gap-2 text-rose-500 font-bold uppercase text-xs">
										<Users className="w-4 h-4" />
										<span>Global User Accounts Directory</span>
									</div>
									<p className="text-xs text-[var(--muted-foreground)]">
										Manage platform accounts, block malicious access, and verify
										credentials across all tenant organizations.
									</p>
								</div>

								<div className="flex items-center gap-3">
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="Search user name or email..."
										className="px-3.5 py-1.5 bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] w-full sm:w-64"
									/>
									<button
										onClick={fetchAdminData}
										className="p-2 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] hover:opacity-80 transition-all cursor-pointer"
										title="Refresh users list"
									>
										<RefreshCw
											className={`w-4 h-4 ${isLoadingData ? "animate-spin" : ""}`}
										/>
									</button>
								</div>
							</div>

							{/* Users Table */}
							<div className="overflow-x-auto">
								<table className="w-full text-left border-collapse text-xs">
									<thead>
										<tr className="border-b border-[var(--border)] text-[var(--muted-foreground)] uppercase text-[10px] tracking-wider">
											<th className="py-3 px-4 font-bold">User Name</th>
											<th className="py-3 px-4 font-bold">Email</th>
											<th className="py-3 px-4 font-bold">Platform Role</th>
											<th className="py-3 px-4 font-bold">Status</th>
											<th className="py-3 px-4 font-bold">Orgs</th>
											<th className="py-3 px-4 font-bold text-right">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
										{isLoadingData ? (
											<TableSkeletonRows rows={5} />
										) : filteredUsers.length === 0 ? (
											<tr>
												<td
													colSpan={6}
													className="py-8 text-center text-[var(--muted-foreground)]"
												>
													No accounts found matching your query.
												</td>
											</tr>
										) : (
											filteredUsers.map((u) => {
												return (
													<tr
														key={u.id}
														className="hover:bg-[var(--secondary)]/50 transition-colors"
													>
														<td className="py-3.5 px-4 font-bold text-[var(--foreground)]">
															{u.name || "N/A"}
														</td>
														<td className="py-3.5 px-4 text-[var(--muted-foreground)] font-mono">
															{u.email}
														</td>
														<td className="py-3.5 px-4 font-mono font-bold">
															<span
																className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
																	u.role === "SUPER_ADMIN"
																		? "bg-rose-500/20 text-rose-500 border-rose-500/40"
																		: "bg-[var(--secondary)] text-[var(--foreground)] border-[var(--border)]"
																}`}
															>
																{u.role}
															</span>
														</td>
														<td className="py-3.5 px-4">
															{u.isBlocked ? (
																<span className="px-2 py-0.5 bg-rose-500/20 text-rose-500 border border-rose-500/40 text-[10px] font-bold uppercase flex items-center gap-1 w-max">
																	<Lock className="w-3 h-3" />
																	BLOCKED
																</span>
															) : (
																<span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 text-[10px] font-bold uppercase flex items-center gap-1 w-max">
																	<CheckCircle2 className="w-3 h-3" />
																	ACTIVE
																</span>
															)}
														</td>
														<td className="py-3.5 px-4 font-bold">
															{u._count?.members || 0} Orgs
														</td>
														<td className="py-3.5 px-4 text-right">
															{u.role === "SUPER_ADMIN" ? (
																<span className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold">
																	[MASTER_PROTECTED]
																</span>
															) : (
																<button
																	disabled={togglingUserId === u.id}
																	onClick={() =>
																		setConfirmModal({
																			isOpen: true,
																			targetUser: u,
																		})
																	}
																	className={`px-3 py-1 border text-[11px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ml-auto ${
																		u.isBlocked
																			? "border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white"
																			: "border-rose-500/50 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white"
																	}`}
																>
																	{togglingUserId === u.id ? (
																		<Loader2 className="w-3 h-3 animate-spin" />
																	) : u.isBlocked ? (
																		<Unlock className="w-3 h-3" />
																	) : (
																		<Lock className="w-3 h-3" />
																	)}
																	<span>
																		{u.isBlocked ? "UNBLOCK" : "BLOCK"}
																	</span>
																</button>
															)}
														</td>
													</tr>
												);
											})
										)}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</main>
			</div>

			{/* Confirmation Modal */}
			<ConfirmModal
				isOpen={confirmModal.isOpen}
				title={
					confirmModal.targetUser?.isBlocked
						? "Confirm User Unblock"
						: "Confirm User Block"
				}
				description={
					confirmModal.targetUser?.isBlocked
						? `Are you sure you want to unblock access for ${confirmModal.targetUser?.email}? They will regain access to their tenant organizations.`
						: `Are you sure you want to block access for ${confirmModal.targetUser?.email}? They will be immediately logged out and forbidden from accessing the platform.`
				}
				targetName={
					confirmModal.targetUser
						? `${confirmModal.targetUser.name || "N/A"} (${confirmModal.targetUser.email})`
						: undefined
				}
				confirmText={
					confirmModal.targetUser?.isBlocked
						? "[CONFIRM_UNBLOCK]"
						: "[CONFIRM_BLOCK]"
				}
				variant={confirmModal.targetUser?.isBlocked ? "warning" : "danger"}
				isLoading={togglingUserId !== null}
				onConfirm={handleConfirmBlock}
				onClose={() => setConfirmModal({ isOpen: false, targetUser: null })}
			/>
		</div>
	);
}
