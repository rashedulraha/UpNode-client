"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { adminService, PlatformOrganization } from "@/services/admin.service";
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
	Building2,
	Lock,
	Unlock,
	ArrowLeft,
	Loader2,
	CheckCircle2,
	AlertCircle,
	Terminal,
	RefreshCw,
	Radio,
	ShieldCheck,
	Search,
	LogIn,
} from "lucide-react";

export default function OrganizationManagementPage() {
	const router = useRouter();
	const { user, isLoading: isAuthLoading } = useAuth();

	const [orgsList, setOrgsList] = useState<PlatformOrganization[]>([]);
	const [isLoadingData, setIsLoadingData] = useState(true);
	const [actionError, setActionError] = useState<string | null>(null);
	const [actionSuccess, setActionSuccess] = useState<string | null>(null);
	const [togglingOrgId, setTogglingOrgId] = useState<string | null>(null);
	const [impersonatingOrgId, setImpersonatingOrgId] = useState<string | null>(
		null,
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [confirmModal, setConfirmModal] = useState<{
		isOpen: boolean;
		type: "suspend" | "view";
		targetOrg: PlatformOrganization | null;
	}>({
		isOpen: false,
		type: "suspend",
		targetOrg: null,
	});

	const isSuperAdmin = user?.role === "SUPER_ADMIN";

	const handleConfirmAction = async () => {
		if (!confirmModal.targetOrg) return;
		const org = confirmModal.targetOrg;

		if (confirmModal.type === "view") {
			try {
				setImpersonatingOrgId(org.id);
				setActionError(null);
				localStorage.setItem("activeOrganizationId", org.id);
				sessionStorage.setItem("upnode_impersonating_active", "true");
				sessionStorage.setItem(
					"upnode_impersonated_user_email",
					org.adminEmail,
				);
				window.location.href = "/dashboard";
			} catch (err: any) {
				setActionError(
					err?.response?.data?.error ||
						"Failed to switch organization workspace.",
				);
				setImpersonatingOrgId(null);
				setConfirmModal({ isOpen: false, type: "suspend", targetOrg: null });
			}
		} else if (confirmModal.type === "suspend") {
			try {
				setTogglingOrgId(org.id);
				setActionError(null);
				setActionSuccess(null);

				const result = await adminService.toggleOrganizationSuspend(org.id);
				setOrgsList((prev) =>
					prev.map((o) =>
						o.id === org.id
							? { ...o, isSuspended: result.organization.isSuspended }
							: o,
					),
				);
				setActionSuccess(result.message);
				setTimeout(() => setActionSuccess(null), 4000);
			} catch (err: any) {
				setActionError(
					err?.response?.data?.error || "Failed to update organization status.",
				);
			} finally {
				setTogglingOrgId(null);
				setConfirmModal({ isOpen: false, type: "suspend", targetOrg: null });
			}
		}
	};

	const handleViewWorkspace = async (org: PlatformOrganization) => {
		try {
			setImpersonatingOrgId(org.id);
			setActionError(null);

			// Switch active organization context directly for Super Admin
			localStorage.setItem("activeOrganizationId", org.id);
			sessionStorage.setItem("upnode_impersonating_active", "true");
			sessionStorage.setItem("upnode_impersonated_user_email", org.adminEmail);

			window.location.href = "/dashboard";
		} catch (err: any) {
			setActionError(
				err?.response?.data?.error ||
					"Failed to switch organization workspace.",
			);
			setImpersonatingOrgId(null);
		}
	};

	useEffect(() => {
		if (!isAuthLoading) {
			if (!user || !isSuperAdmin) {
				router.replace("/dashboard");
			} else {
				fetchOrganizationsData();
			}
		}
	}, [user, isAuthLoading, isSuperAdmin, router]);

	const fetchOrganizationsData = async () => {
		try {
			setIsLoadingData(true);
			setActionError(null);
			const data = await adminService.getOrganizations();
			setOrgsList(data);
		} catch (err: any) {
			setActionError(
				err?.response?.data?.error || "Failed to load organizations.",
			);
		} finally {
			setIsLoadingData(false);
		}
	};

	const handleToggleSuspend = async (org: PlatformOrganization) => {
		try {
			setTogglingOrgId(org.id);
			setActionError(null);
			setActionSuccess(null);

			const result = await adminService.toggleOrganizationSuspend(org.id);
			setOrgsList((prev) =>
				prev.map((o) =>
					o.id === org.id
						? { ...o, isSuspended: result.organization.isSuspended }
						: o,
				),
			);
			setActionSuccess(result.message);
			setTimeout(() => setActionSuccess(null), 4000);
		} catch (err: any) {
			setActionError(
				err?.response?.data?.error || "Failed to update organization status.",
			);
		} finally {
			setTogglingOrgId(null);
		}
	};

	if (isAuthLoading || (user && !isSuperAdmin)) {
		return <AdminPageSkeleton />;
	}

	const filteredOrgs = orgsList.filter(
		(o) =>
			o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			o.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			o.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
			o.slug.toLowerCase().includes(searchQuery.toLowerCase()),
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

					{/* Organization Management Table Container */}
					<div className="bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] p-6 space-y-5 shadow-sm">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-rose-500 font-bold uppercase text-xs">
									<Building2 className="w-4 h-4" />
									<span>Platform Organization Spaces Directory</span>
								</div>
								<p className="text-xs text-[var(--muted-foreground)]">
									View all tenant organizations, admin contacts, subscription
									plans, and suspend policy controls.
								</p>
							</div>

							<div className="flex items-center gap-3">
								<div className="relative">
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="Search org name, admin, or email..."
										className="px-3.5 py-1.5 bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] w-full sm:w-72"
									/>
								</div>
								<button
									onClick={fetchOrganizationsData}
									className="p-2 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] hover:opacity-80 transition-all cursor-pointer"
									title="Refresh organizations list"
								>
									<RefreshCw
										className={`w-4 h-4 ${isLoadingData ? "animate-spin" : ""}`}
									/>
								</button>
							</div>
						</div>

						{/* Table View */}
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse text-xs">
								<thead>
									<tr className="border-b border-[var(--border)] text-[var(--muted-foreground)] uppercase text-[10px] tracking-wider">
										<th className="py-3 px-4 font-bold">Organization</th>
										<th className="py-3 px-4 font-bold">Admin Contact</th>
										<th className="py-3 px-4 font-bold">Created Date</th>
										<th className="py-3 px-4 font-bold">Plan</th>
										<th className="py-3 px-4 font-bold">Status</th>
										<th className="py-3 px-4 font-bold text-right">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
									{isLoadingData ? (
										<TableSkeletonRows rows={5} />
									) : filteredOrgs.length === 0 ? (
										<tr>
											<td
												colSpan={6}
												className="py-8 text-center text-[var(--muted-foreground)]"
											>
												No organization workspaces found matching your search.
											</td>
										</tr>
									) : (
										filteredOrgs.map((org) => {
											return (
												<tr
													key={org.id}
													className="hover:bg-[var(--secondary)]/50 transition-colors"
												>
													<td className="py-3.5 px-4">
														<p className="font-bold text-[var(--foreground)] uppercase">
															{org.name}
														</p>
														<p className="text-[10px] text-[var(--muted-foreground)] font-mono">
															slug: {org.slug}
														</p>
													</td>
													<td className="py-3.5 px-4">
														<p className="font-bold text-[var(--foreground)]">
															{org.adminName}
														</p>
														<p className="text-[10px] text-[var(--muted-foreground)] font-mono">
															{org.adminEmail}
														</p>
													</td>
													<td className="py-3.5 px-4 font-mono text-[11px]">
														{new Date(org.createdAt).toLocaleDateString(
															"en-US",
															{
																year: "numeric",
																month: "short",
																day: "numeric",
															},
														)}
													</td>
													<td className="py-3.5 px-4">
														<span
															className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
																org.plan === "PRO"
																	? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40"
																	: "bg-[var(--secondary)] text-[var(--muted-foreground)] border-[var(--border)]"
															}`}
														>
															[{org.plan}_PLAN]
														</span>
													</td>
													<td className="py-3.5 px-4">
														{org.isSuspended ? (
															<span className="px-2 py-0.5 bg-rose-500/20 text-rose-500 border border-rose-500/40 text-[10px] font-bold uppercase flex items-center gap-1 w-max">
																<Lock className="w-3 h-3" />
																SUSPENDED
															</span>
														) : (
															<span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 text-[10px] font-bold uppercase flex items-center gap-1 w-max">
																<CheckCircle2 className="w-3 h-3" />
																ACTIVE
															</span>
														)}
													</td>
													<td className="py-3.5 px-4 text-right">
														<div className="flex items-center justify-end gap-2">
															<button
																disabled={impersonatingOrgId === org.id}
																onClick={() =>
																	setConfirmModal({
																		isOpen: true,
																		type: "view",
																		targetOrg: org,
																	})
																}
																className="px-3 py-1 border border-sky-500/50 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white text-[11px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
																title={`Inspect workspace of ${org.name}`}
															>
																{impersonatingOrgId === org.id ? (
																	<Loader2 className="w-3 h-3 animate-spin" />
																) : (
																	<LogIn className="w-3 h-3" />
																)}
																<span>[VIEW_WORKSPACE]</span>
															</button>

															<button
																disabled={togglingOrgId === org.id}
																onClick={() =>
																	setConfirmModal({
																		isOpen: true,
																		type: "suspend",
																		targetOrg: org,
																	})
																}
																className={`px-3 py-1 border text-[11px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
																	org.isSuspended
																		? "border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white"
																		: "border-rose-500/50 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white"
																}`}
															>
																{togglingOrgId === org.id ? (
																	<Loader2 className="w-3 h-3 animate-spin" />
																) : org.isSuspended ? (
																	<Unlock className="w-3 h-3" />
																) : (
																	<Lock className="w-3 h-3" />
																)}
																<span>
																	{org.isSuspended ? "UNSUSPEND" : "SUSPEND"}
																</span>
															</button>
														</div>
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
					confirmModal.type === "view"
						? "Confirm Workspace Switch"
						: confirmModal.targetOrg?.isSuspended
							? "Confirm Organization Reactivation"
							: "Confirm Organization Suspension"
				}
				description={
					confirmModal.type === "view"
						? `Are you sure you want to switch workspace context to '${confirmModal.targetOrg?.name}'? You will view live telemetry and project status as an administrator.`
						: confirmModal.targetOrg?.isSuspended
							? `Are you sure you want to reactivate the organization '${confirmModal.targetOrg?.name}'? Members will regain access.`
							: `Are you sure you want to suspend '${confirmModal.targetOrg?.name}'? All member access to this workspace will be immediately blocked.`
				}
				targetName={
					confirmModal.targetOrg
						? `${confirmModal.targetOrg.name} (Admin: ${confirmModal.targetOrg.adminEmail})`
						: undefined
				}
				confirmText={
					confirmModal.type === "view"
						? "[CONFIRM_SWITCH]"
						: confirmModal.targetOrg?.isSuspended
							? "[CONFIRM_REACTIVATE]"
							: "[CONFIRM_SUSPEND]"
				}
				variant={
					confirmModal.type === "view"
						? "info"
						: confirmModal.targetOrg?.isSuspended
							? "warning"
							: "danger"
				}
				isLoading={togglingOrgId !== null || impersonatingOrgId !== null}
				onConfirm={handleConfirmAction}
				onClose={() =>
					setConfirmModal({ isOpen: false, type: "suspend", targetOrg: null })
				}
			/>
		</div>
	);
}
