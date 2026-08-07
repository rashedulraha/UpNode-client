"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { adminService, PlatformUser } from "@/services/admin.service";
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
	Lock,
	Unlock,
	ArrowLeft,
	Loader2,
	CheckCircle2,
	AlertCircle,
	Terminal,
	RefreshCw,
	Radio,
	LogIn,
} from "lucide-react";

export default function UserManagementPage() {
	const router = useRouter();
	const { user, isLoading: isAuthLoading } = useAuth();

	const [usersList, setUsersList] = useState<PlatformUser[]>([]);
	const [isLoadingData, setIsLoadingData] = useState(true);
	const [actionError, setActionError] = useState<string | null>(null);
	const [actionSuccess, setActionSuccess] = useState<string | null>(null);
	const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
	const [impersonatingUserId, setImpersonatingUserId] = useState<string | null>(
		null,
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [confirmModal, setConfirmModal] = useState<{
		isOpen: boolean;
		type: "block" | "impersonate";
		targetUser: PlatformUser | null;
	}>({
		isOpen: false,
		type: "block",
		targetUser: null,
	});

	const isSuperAdmin = user?.role === "SUPER_ADMIN";

	const handleConfirmAction = async () => {
		if (!confirmModal.targetUser) return;
		const targetUser = confirmModal.targetUser;

		if (confirmModal.type === "impersonate") {
			try {
				setImpersonatingUserId(targetUser.id);
				setActionError(null);
				const result = await adminService.impersonateUser(targetUser.id);

				sessionStorage.setItem("upnode_impersonating_active", "true");
				sessionStorage.setItem(
					"upnode_impersonated_user_email",
					result.user.email,
				);
				if (result.activeOrganizationId) {
					localStorage.setItem(
						"activeOrganizationId",
						result.activeOrganizationId,
					);
				}

				window.location.href = "/dashboard";
			} catch (err: any) {
				setActionError(
					err?.response?.data?.error || "Failed to impersonate user.",
				);
				setImpersonatingUserId(null);
				setConfirmModal({ isOpen: false, type: "block", targetUser: null });
			}
		} else if (confirmModal.type === "block") {
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
				setConfirmModal({ isOpen: false, type: "block", targetUser: null });
			}
		}
	};

	const handleImpersonate = async (targetUser: PlatformUser) => {
		try {
			setImpersonatingUserId(targetUser.id);
			setActionError(null);
			const result = await adminService.impersonateUser(targetUser.id);

			sessionStorage.setItem("upnode_impersonating_active", "true");
			sessionStorage.setItem(
				"upnode_impersonated_user_email",
				result.user.email,
			);
			if (result.activeOrganizationId) {
				localStorage.setItem(
					"activeOrganizationId",
					result.activeOrganizationId,
				);
			}

			window.location.href = "/dashboard";
		} catch (err: any) {
			setActionError(
				err?.response?.data?.error || "Failed to impersonate user.",
			);
			setImpersonatingUserId(null);
		}
	};

	useEffect(() => {
		if (!isAuthLoading) {
			if (!user || !isSuperAdmin) {
				router.replace("/dashboard");
			} else {
				fetchUsersData();
			}
		}
	}, [user, isAuthLoading, isSuperAdmin, router]);

	const fetchUsersData = async () => {
		try {
			setIsLoadingData(true);
			setActionError(null);
			const data = await adminService.getUsers();
			setUsersList(data);
		} catch (err: any) {
			setActionError(
				err?.response?.data?.error || "Failed to load platform accounts.",
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
		<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-mono flex flex-col transition-colors duration-300">
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
			/>

			<div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
				{/* Super Admin Left Sidebar */}
				<SuperAdminSidebar />

				{/* Main Workspace Area */}
				<main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 min-w-0">
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

					{/* Shared Subroute Navigation Tabs */}
					<AdminNavTabs />

					{/* User Management Table Container */}
					<div className="bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] p-6 space-y-5 shadow-sm">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-rose-500 font-bold uppercase text-xs">
									<Users className="w-4 h-4" />
									<span>Global Platform Accounts Directory</span>
								</div>
								<p className="text-xs text-[var(--muted-foreground)]">
									View all platform users across all tenant organizations and
									manage account block/unblock security status.
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
									onClick={fetchUsersData}
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
										<th className="py-3 px-4 font-bold">Email Address</th>
										<th className="py-3 px-4 font-bold">Platform Role</th>
										<th className="py-3 px-4 font-bold">Status</th>
										<th className="py-3 px-4 font-bold">Tenant Memberships</th>
										<th className="py-3 px-4 font-bold text-right">Actions</th>
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
												No user accounts found matching your query.
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
															<div className="flex items-center justify-end gap-2">
																<button
																	disabled={impersonatingUserId === u.id}
																	onClick={() =>
																		setConfirmModal({
																			isOpen: true,
																			type: "impersonate",
																			targetUser: u,
																		})
																	}
																	className="px-3 py-1 border border-sky-500/50 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white text-[11px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
																	title={`Login as ${u.email}`}
																>
																	{impersonatingUserId === u.id ? (
																		<Loader2 className="w-3 h-3 animate-spin" />
																	) : (
																		<LogIn className="w-3 h-3" />
																	)}
																	<span>[LOGIN_AS_USER]</span>
																</button>

																<button
																	disabled={togglingUserId === u.id}
																	onClick={() =>
																		setConfirmModal({
																			isOpen: true,
																			type: "block",
																			targetUser: u,
																		})
																	}
																	className={`px-3 py-1 border text-[11px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
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
															</div>
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
				</main>
			</div>

			{/* Confirmation Modal */}
			<ConfirmModal
				isOpen={confirmModal.isOpen}
				title={
					confirmModal.type === "impersonate"
						? "Confirm User Impersonation"
						: confirmModal.targetUser?.isBlocked
							? "Confirm User Unblock"
							: "Confirm User Block"
				}
				description={
					confirmModal.type === "impersonate"
						? `Are you sure you want to temporarily log in as ${confirmModal.targetUser?.name || confirmModal.targetUser?.email}? You will gain full access to their active workspace.`
						: confirmModal.targetUser?.isBlocked
							? `Are you sure you want to unblock access for ${confirmModal.targetUser?.email}? They will regain access to their tenant organizations.`
							: `Are you sure you want to block access for ${confirmModal.targetUser?.email}? They will be immediately logged out and forbidden from accessing the platform.`
				}
				targetName={
					confirmModal.targetUser
						? `${confirmModal.targetUser.name || "N/A"} (${confirmModal.targetUser.email})`
						: undefined
				}
				confirmText={
					confirmModal.type === "impersonate"
						? "[CONFIRM_IMPERSONATE]"
						: confirmModal.targetUser?.isBlocked
							? "[CONFIRM_UNBLOCK]"
							: "[CONFIRM_BLOCK]"
				}
				variant={
					confirmModal.type === "impersonate"
						? "info"
						: confirmModal.targetUser?.isBlocked
							? "warning"
							: "danger"
				}
				isLoading={togglingUserId !== null || impersonatingUserId !== null}
				onConfirm={handleConfirmAction}
				onClose={() =>
					setConfirmModal({ isOpen: false, type: "block", targetUser: null })
				}
			/>
		</div>
	);
}
