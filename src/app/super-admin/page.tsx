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
import {
	ShieldAlert,
	Users,
	Building2,
	Folder,
	Activity,
	Lock,
	Unlock,
	ArrowLeft,
	Loader2,
	CheckCircle2,
	AlertCircle,
	Terminal,
	RefreshCw,
	Server,
	Sparkles,
	Radio,
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

	// 1. Guard check for SUPER_ADMIN role
	const isSuperAdmin = user?.role === "SUPER_ADMIN";

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
		return (
			<div className="min-h-screen bg-[#090a0f] text-slate-200 font-mono flex flex-col items-center justify-center p-6 space-y-4">
				<div className="flex items-center gap-3 text-rose-500 font-bold text-sm uppercase animate-pulse">
					<ShieldAlert className="w-6 h-6" />
					<span>[VERIFYING_SUPER_ADMIN_SECURITY_CLEARANCE...]</span>
				</div>
				<p className="text-xs text-slate-400 text-center max-w-md">
					Restricted platform area. Authorization token and SUPER_ADMIN
					credentials required.
				</p>
			</div>
		);
	}

	const filteredUsers = usersList.filter(
		(u) =>
			u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			u.role.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="min-h-screen bg-[#07080c] text-slate-100 font-mono relative selection:bg-rose-500/30">
			{/* High-tech Background Mesh */}
			<div className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:20px_20px]" />

			{/* Top Header Console Navbar */}
			<header className="sticky top-0 z-30 bg-[#0c0e14]/90 backdrop-blur-xl border-b border-rose-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
				<div className="flex items-center gap-4">
					<Link
						href="/dashboard"
						className="px-3 py-1.5 border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-bold uppercase transition-all flex items-center gap-2"
					>
						<ArrowLeft className="w-3.5 h-3.5 text-rose-400" />
						<span>[BACK_TO_DASHBOARD]</span>
					</Link>

					<div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

					<div className="flex items-center gap-2">
						<Terminal className="w-4 h-4 text-rose-500" />
						<span className="text-sm font-bold tracking-tight uppercase">
							UPNODE // PLATFORM_SUPER_ADMIN_CONSOLE
						</span>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-bold uppercase">
						<Radio className="w-3 h-3 text-rose-400 animate-pulse" />
						<span>MASTER_ROOT_ACTIVE</span>
					</div>

					<div className="text-right text-xs">
						<p className="font-bold text-slate-200 uppercase truncate max-w-[140px]">
							{user?.name || user?.email}
						</p>
						<span className="text-[10px] text-rose-400 uppercase font-bold">
							[{user?.role}]
						</span>
					</div>
				</div>
			</header>

			{/* Main Workspace Body */}
			<main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative z-10">
				{/* Top Alert Banners */}
				{actionError && (
					<div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3 shadow-lg">
						<AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
						<span>[ERR]: {actionError}</span>
					</div>
				)}

				{actionSuccess && (
					<div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3 shadow-lg">
						<CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
						<span>[SUCCESS]: {actionSuccess}</span>
					</div>
				)}

				{/* Stat Counter Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<div className="p-5 bg-[#0f111a]/80 border border-slate-800 space-y-2 relative overflow-hidden">
						<div className="flex items-center justify-between text-slate-400">
							<span className="text-[11px] font-bold uppercase tracking-wider">
								TOTAL_USERS
							</span>
							<Users className="w-4 h-4 text-emerald-400" />
						</div>
						<p className="text-3xl font-bold text-slate-100">
							{stats ? (
								stats.totalUsers
							) : (
								<Loader2 className="w-5 h-5 animate-spin" />
							)}
						</p>
						<p className="text-[10px] text-slate-500 uppercase">
							Platform registered accounts
						</p>
					</div>

					<div className="p-5 bg-[#0f111a]/80 border border-slate-800 space-y-2 relative overflow-hidden">
						<div className="flex items-center justify-between text-slate-400">
							<span className="text-[11px] font-bold uppercase tracking-wider">
								ORGANIZATIONS
							</span>
							<Building2 className="w-4 h-4 text-sky-400" />
						</div>
						<p className="text-3xl font-bold text-slate-100">
							{stats ? (
								stats.totalOrganizations
							) : (
								<Loader2 className="w-5 h-5 animate-spin" />
							)}
						</p>
						<p className="text-[10px] text-slate-500 uppercase">
							Active multi-tenant spaces
						</p>
					</div>

					<div className="p-5 bg-[#0f111a]/80 border border-slate-800 space-y-2 relative overflow-hidden">
						<div className="flex items-center justify-between text-slate-400">
							<span className="text-[11px] font-bold uppercase tracking-wider">
								PROJECTS
							</span>
							<Folder className="w-4 h-4 text-amber-400" />
						</div>
						<p className="text-3xl font-bold text-slate-100">
							{stats ? (
								stats.totalProjects
							) : (
								<Loader2 className="w-5 h-5 animate-spin" />
							)}
						</p>
						<p className="text-[10px] text-slate-500 uppercase">
							Monitored endpoints
						</p>
					</div>

					<div className="p-5 bg-[#0f111a]/80 border border-slate-800 space-y-2 relative overflow-hidden">
						<div className="flex items-center justify-between text-slate-400">
							<span className="text-[11px] font-bold uppercase tracking-wider">
								INCIDENTS
							</span>
							<Activity className="w-4 h-4 text-rose-400" />
						</div>
						<p className="text-3xl font-bold text-slate-100">
							{stats ? (
								stats.totalIncidents
							) : (
								<Loader2 className="w-5 h-5 animate-spin" />
							)}
						</p>
						<p className="text-[10px] text-slate-500 uppercase">
							Log alerts recorded
						</p>
					</div>
				</div>

				{/* Global Platform Users Table */}
				<div className="bg-[#0f111a]/80 border border-slate-800 p-6 space-y-5 shadow-2xl">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
						<div className="space-y-1">
							<div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-xs">
								<Users className="w-4 h-4 text-rose-500" />
								<span>Global User Accounts Directory</span>
							</div>
							<p className="text-xs text-slate-400">
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
								className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-rose-500 w-full sm:w-64"
							/>
							<button
								onClick={fetchAdminData}
								className="p-2 border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-all"
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
								<tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
									<th className="py-3 px-4 font-bold">User Name</th>
									<th className="py-3 px-4 font-bold">Email</th>
									<th className="py-3 px-4 font-bold">Platform Role</th>
									<th className="py-3 px-4 font-bold">Status</th>
									<th className="py-3 px-4 font-bold">Orgs</th>
									<th className="py-3 px-4 font-bold text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-800/50 text-slate-300">
								{isLoadingData ? (
									<tr>
										<td colSpan={6} className="py-8 text-center text-slate-500">
											<Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
											<span>Loading platform accounts...</span>
										</td>
									</tr>
								) : filteredUsers.length === 0 ? (
									<tr>
										<td colSpan={6} className="py-8 text-center text-slate-500">
											No accounts found matching your query.
										</td>
									</tr>
								) : (
									filteredUsers.map((u) => {
										const isSelf = u.id === user?.id;
										return (
											<tr
												key={u.id}
												className="hover:bg-slate-900/40 transition-colors"
											>
												<td className="py-3.5 px-4 font-bold text-slate-200">
													{u.name || "N/A"}
												</td>
												<td className="py-3.5 px-4 text-slate-300">
													{u.email}
												</td>
												<td className="py-3.5 px-4 font-mono font-bold">
													<span
														className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
															u.role === "SUPER_ADMIN"
																? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
																: "bg-slate-800 text-slate-300"
														}`}
													>
														{u.role}
													</span>
												</td>
												<td className="py-3.5 px-4">
													{u.isBlocked ? (
														<span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold uppercase flex items-center gap-1 w-max">
															<Lock className="w-3 h-3" />
															BLOCKED
														</span>
													) : (
														<span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase flex items-center gap-1 w-max">
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
														<span className="text-[10px] text-slate-500 uppercase font-bold">
															[MASTER_PROTECTED]
														</span>
													) : (
														<button
															disabled={togglingUserId === u.id}
															onClick={() => handleToggleBlock(u)}
															className={`px-3 py-1 border text-[11px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ml-auto ${
																u.isBlocked
																	? "border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950"
																	: "border-rose-500/50 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white"
															}`}
														>
															{togglingUserId === u.id ? (
																<Loader2 className="w-3 h-3 animate-spin" />
															) : u.isBlocked ? (
																<Unlock className="w-3 h-3" />
															) : (
																<Lock className="w-3 h-3" />
															)}
															<span>{u.isBlocked ? "UNBLOCK" : "BLOCK"}</span>
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
			</main>
		</div>
	);
}
