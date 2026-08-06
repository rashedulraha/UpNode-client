"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProjects } from "@/hooks/use-projects";
import {
	Plus,
	Folder,
	Settings,
	Building2,
	Users,
	Sliders,
	User,
	Palette,
	ChevronDown,
	X,
	Loader2,
} from "lucide-react";
import { Project } from "@/services/projects.service";
import {
	organizationService,
	UserOrganization,
} from "@/services/organization.service";
import { useAuth } from "@/hooks/use-auth";

interface ProjectsSidebarProps {
	selectedProjectId: string | null;
	onSelectProject: (projectId: string | null) => void;
	onOpenCreateProject: () => void;
	onOpenProjectSettings: (project: Project) => void;
}

export function ProjectsSidebar({
	selectedProjectId,
	onSelectProject,
	onOpenCreateProject,
	onOpenProjectSettings,
}: ProjectsSidebarProps) {
	const pathname = usePathname();
	const { user } = useAuth();
	const { data: projects = [], isLoading } = useProjects();
	const [showPromo, setShowPromo] = useState<boolean>(true);

	// Organizations State
	const [allOrgs, setAllOrgs] = useState<UserOrganization[]>([]);
	const [activeOrg, setActiveOrg] = useState<UserOrganization | null>(null);
	const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
	const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
	const [newOrgName, setNewOrgName] = useState("");
	const [isCreatingOrg, setIsCreatingOrg] = useState(false);
	const [createOrgError, setCreateOrgError] = useState<string | null>(null);

	useEffect(() => {
		const isDismissed = localStorage.getItem("upnode_promo_dismissed");
		if (isDismissed === "true") {
			setShowPromo(false);
		}
		// Fetch user organizations
		fetchUserOrgs();
	}, [user]);

	const fetchUserOrgs = async () => {
		try {
			const orgs = await organizationService.getUserOrganizations();
			setAllOrgs(orgs);
			if (orgs.length > 0) {
				const activeOrgId = localStorage.getItem("activeOrganizationId");
				const found = activeOrgId
					? orgs.find((o) => o.id === activeOrgId) || orgs[0]
					: orgs[0];
				setActiveOrg(found);
				if (!activeOrgId) {
					localStorage.setItem("activeOrganizationId", found.id);
				}
			}
		} catch (err) {
			console.error("Failed to load organizations:", err);
		}
	};

	const handleSelectOrg = (orgId: string) => {
		localStorage.setItem("activeOrganizationId", orgId);
		setIsOrgDropdownOpen(false);
		window.location.reload();
	};

	const handleCreateOrg = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newOrgName.trim() || newOrgName.trim().length < 2) {
			setCreateOrgError("Organization name must be at least 2 characters.");
			return;
		}
		try {
			setIsCreatingOrg(true);
			setCreateOrgError(null);
			const created = await organizationService.createOrganization(
				newOrgName.trim(),
			);
			localStorage.setItem("activeOrganizationId", created.id);
			setIsCreateOrgModalOpen(false);
			window.location.reload();
		} catch (err: any) {
			setCreateOrgError(
				err?.response?.data?.error ||
					err?.message ||
					"Failed to create organization.",
			);
		} finally {
			setIsCreatingOrg(false);
		}
	};

	const handleDismissPromo = () => {
		setShowPromo(false);
		localStorage.setItem("upnode_promo_dismissed", "true");
	};

	const isTeamPage = pathname?.includes("/dashboard/settings/team");
	const isIntegrationsPage = pathname?.includes(
		"/dashboard/settings/integrations",
	);
	const isProfilePage = pathname?.includes("/dashboard/settings/profile");
	const isThemePage = pathname?.includes("/dashboard/settings/theme");

	return (
		<>
			<aside className="w-full lg:w-72 xl:w-80 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] backdrop-blur-3xl flex flex-col justify-between h-auto lg:h-full shrink-0 font-mono border-b lg:border-b-0 lg:border-r border-[var(--sidebar-border)] overflow-hidden select-none transition-colors duration-300">
				{/* Top Section: Projects & Organization navigation */}
				<div className="p-4 space-y-5 overflow-y-auto">
					{/* Active Organization Switcher & Badge */}
					<div className="space-y-1">
						<div className="relative">
							<div className="flex items-center justify-between gap-2 px-3 py-2 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono">
								<button
									onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
									className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer group"
									title="Click to switch organization"
								>
									<Building2 className="w-3.5 h-3.5 shrink-0 text-[var(--muted-foreground)]" />
									<div className="flex-1 min-w-0">
										<p className="text-[9px] text-[var(--muted-foreground)] uppercase tracking-widest font-mono">
											ACTIVE_ORG
										</p>
										<p className="text-xs font-bold text-[var(--foreground)] uppercase truncate flex items-center gap-1 group-hover:text-emerald-500 transition-colors">
											{activeOrg ? activeOrg.name : "[SELECT_ORGANIZATION]"}
											<ChevronDown className="w-3 h-3 text-[var(--muted-foreground)] shrink-0" />
										</p>
									</div>
								</button>

								{activeOrg && (
									<span
										className={`text-[9px] px-1.5 py-0.5 border font-bold uppercase shrink-0 ${
											activeOrg.memberRole === "ADMIN"
												? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
												: activeOrg.memberRole === "ENGINEER"
													? "border-blue-500/30 bg-blue-500/10 text-blue-400"
													: "border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)]"
										}`}
									>
										{activeOrg.memberRole}
									</span>
								)}
							</div>

							{/* Org Dropdown List */}
							{isOrgDropdownOpen && (
								<>
									<div
										className="fixed inset-0 z-30"
										onClick={() => setIsOrgDropdownOpen(false)}
									/>
									<div className="absolute left-0 right-0 top-full mt-1 bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] shadow-2xl z-40 p-2 space-y-1 font-mono text-xs">
										<div className="px-2 py-1 text-[9px] text-[var(--muted-foreground)] uppercase tracking-widest font-bold border-b border-[var(--border)] flex items-center justify-between">
											<span>[YOUR_ORGANIZATIONS]</span>
											<button
												onClick={() => setIsOrgDropdownOpen(false)}
												className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
											>
												<X className="w-3 h-3" />
											</button>
										</div>

										{allOrgs.map((o) => (
											<button
												key={o.id}
												onClick={() => handleSelectOrg(o.id)}
												className={`w-full text-left px-2.5 py-1.5 flex items-center justify-between transition-colors cursor-pointer ${
													activeOrg?.id === o.id
														? "bg-[var(--secondary)] text-[var(--foreground)] font-bold"
														: "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
												}`}
											>
												<span className="truncate">{o.name}</span>
												<span className="text-[9px] opacity-70">
													[{o.memberRole}]
												</span>
											</button>
										))}

										<div className="pt-1 border-t border-[var(--border)]">
											<button
												onClick={() => {
													setIsOrgDropdownOpen(false);
													setIsCreateOrgModalOpen(true);
												}}
												className="w-full text-center justify-center font-bold px-2.5 py-1.5 text-[var(--foreground)] bg-[var(--secondary)] hover:opacity-80 transition-colors cursor-pointer text-[10px] uppercase flex items-center gap-1"
											>
												+ [CREATE_ORG]
											</button>
										</div>
									</div>
								</>
							)}
						</div>
					</div>

					{/* Dashboard Core Navigation */}
					<div>
						<h2 className="text-[10px] font-mono font-bold text-[var(--muted-foreground)] uppercase tracking-widest px-1 mb-2">
							[NAVIGATION]
						</h2>
						<div className="space-y-1 font-mono text-xs">
							<button
								onClick={() => onSelectProject(null)}
								className={`w-full flex items-center justify-between px-3 py-1.5 rounded-none transition-colors cursor-pointer border ${
									selectedProjectId === null &&
									!isTeamPage &&
									!isIntegrationsPage &&
									!isProfilePage
										? "bg-[var(--secondary)] text-[var(--foreground)] border-[var(--primary)] font-bold shadow-sm"
										: "bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)] hover:border-[var(--primary)]"
								}`}
							>
								<div className="flex items-center gap-2 min-w-0">
									<Folder className="w-3.5 h-3.5 shrink-0 text-[var(--muted-foreground)]" />
									<span className="truncate uppercase font-medium">
										[ALL_INCIDENTS]
									</span>
								</div>
							</button>
						</div>
					</div>

					{/* Organization IAM & Team Management Nav */}
					<div>
						<h2 className="text-[10px] font-mono font-bold text-[var(--muted-foreground)] uppercase tracking-widest px-1 mb-2">
							[ORGANIZATION & TEAM]
						</h2>
						<div className="space-y-1 font-mono text-xs">
							<Link
								href="/dashboard/settings/team"
								className={`w-full flex items-center justify-between px-3 py-1.5 rounded-none transition-colors cursor-pointer border ${
									isTeamPage
										? "bg-[var(--secondary)] text-[var(--foreground)] border-[var(--primary)] font-bold shadow-sm"
										: "bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)] hover:border-[var(--primary)]"
								}`}
							>
								<div className="flex items-center gap-2 min-w-0">
									<Users className="w-3.5 h-3.5 shrink-0 text-[var(--muted-foreground)]" />
									<span className="truncate uppercase font-medium">
										[TEAM_MANAGEMENT]
									</span>
								</div>
								<span
									className={`text-[9px] px-1.5 py-0.5 font-mono font-bold uppercase border ${
										isTeamPage
											? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
											: "border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)]"
									}`}
								>
									ADD_ADMIN
								</span>
							</Link>

							<Link
								href="/dashboard/settings/integrations"
								className={`w-full flex items-center justify-between px-3 py-1.5 rounded-none transition-colors cursor-pointer border ${
									isIntegrationsPage
										? "bg-[var(--secondary)] text-[var(--foreground)] border-[var(--primary)] font-bold shadow-sm"
										: "bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)] hover:border-[var(--primary)]"
								}`}
							>
								<div className="flex items-center gap-2 min-w-0">
									<Sliders className="w-3.5 h-3.5 shrink-0 text-[var(--muted-foreground)]" />
									<span className="truncate uppercase font-medium">
										[INTEGRATIONS]
									</span>
								</div>
							</Link>
						</div>
					</div>

					{/* Registered Services / Projects Section */}
					<div>
						<div className="flex items-center justify-between px-1 mb-2">
							<h2 className="text-[10px] font-mono font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
								[PROJECTS]
							</h2>
							<button
								onClick={onOpenCreateProject}
								className="p-1 hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer border border-[var(--border)]"
								title="Create New Project"
							>
								<Plus className="w-3 h-3" />
							</button>
						</div>

						<div className="space-y-1 font-mono text-xs">
							{isLoading ? (
								<div className="p-3 bg-[var(--card)] border border-[var(--border)] text-[10px] text-[var(--muted-foreground)] uppercase font-mono animate-pulse">
									[LOADING_PROJECTS...]
								</div>
							) : projects.length === 0 ? (
								<div className="p-3 bg-[var(--card)] border border-[var(--border)] text-[10px] text-[var(--muted-foreground)] uppercase font-mono text-center">
									[NO_PROJECTS_REGISTERED]
								</div>
							) : (
								projects.map((project) => {
									const isSelected = selectedProjectId === project.id;
									return (
										<div
											key={project.id}
											className={`flex items-center justify-between px-3 py-1.5 rounded-none transition-colors border group ${
												isSelected
													? "bg-[var(--secondary)] text-[var(--foreground)] border-[var(--primary)] font-bold shadow-sm"
													: "bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)] hover:border-[var(--primary)]"
											}`}
										>
											<button
												onClick={() => onSelectProject(project.id)}
												className="flex-1 text-left truncate flex items-center gap-2 cursor-pointer uppercase"
											>
												<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
												<span className="truncate">{project.name}</span>
											</button>

											<button
												onClick={(e) => {
													e.stopPropagation();
													onOpenProjectSettings(project);
												}}
												className="p-1 opacity-0 group-hover:opacity-100 hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all cursor-pointer border border-transparent hover:border-[var(--border)]"
												title="Project Settings"
											>
												<Settings className="w-3 h-3" />
											</button>
										</div>
									);
								})
							)}
						</div>
					</div>
				</div>

				{/* Bottom Banner Promo Container */}
				{showPromo && (
					<div className="p-4 border-t border-[var(--border)] font-mono">
						<div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2 relative">
							<button
								onClick={handleDismissPromo}
								className="absolute top-2 right-2 text-amber-400 hover:opacity-100 cursor-pointer"
							>
								[X]
							</button>
							<div className="pr-6 space-y-1">
								<p className="text-[10px] font-bold uppercase tracking-wider">
									[BETA_v2.6 // FREE_PLAN]
								</p>
								<p className="text-[9px] text-amber-400/80 font-mono leading-tight">
									NEXT RESET: 12H 18M • FREE PLAN LIMIT: 3 PROJECTS
								</p>
							</div>
							<div className="pt-1 flex items-center gap-2">
								<Link
									href="/docs"
									className="flex-1 text-center py-1 bg-[var(--background)] text-[var(--foreground)] border border-amber-500/40 text-[10px] font-bold uppercase hover:opacity-80"
								>
									[READ_DOCS]
								</Link>
								<Link
									href="/#pricing"
									className="flex-1 text-center py-1 bg-amber-500 text-black text-[10px] font-bold uppercase hover:opacity-90"
								>
									[UPGRADE_NOW]
								</Link>
							</div>
						</div>
					</div>
				)}
			</aside>

			{/* Create Organization Modal */}
			{isCreateOrgModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm font-mono select-none">
					<div className="w-full max-w-md bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] shadow-2xl p-5 space-y-4">
						<div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
							<div className="flex items-center gap-2">
								<Building2 className="w-4 h-4 text-[var(--foreground)]" />
								<h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
									[CREATE_NEW_ORGANIZATION]
								</h3>
							</div>
							<button
								onClick={() => setIsCreateOrgModalOpen(false)}
								className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
							>
								<X className="w-4 h-4" />
							</button>
						</div>

						<form
							onSubmit={handleCreateOrg}
							className="space-y-4 text-xs font-mono"
						>
							{createOrgError && (
								<div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-[11px]">
									[ERR]: {createOrgError}
								</div>
							)}

							<div className="space-y-1.5">
								<label className="block text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
									[ORGANIZATION_NAME] *
								</label>
								<input
									type="text"
									required
									value={newOrgName}
									onChange={(e) => setNewOrgName(e.target.value)}
									placeholder="e.g. Acme Corp / Engineering Team"
									className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] font-mono"
								/>
							</div>

							<div className="flex items-center justify-end gap-3 pt-2">
								<button
									type="button"
									onClick={() => setIsCreateOrgModalOpen(false)}
									className="px-4 py-2 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] uppercase cursor-pointer text-xs"
								>
									[CANCEL]
								</button>
								<button
									type="submit"
									disabled={isCreatingOrg}
									className="px-4 py-2 border border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] font-bold uppercase cursor-pointer text-xs hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
								>
									{isCreatingOrg ? (
										<>
											<Loader2 className="w-3.5 h-3.5 animate-spin" />
											<span>[CREATING...]</span>
										</>
									) : (
										<span>+ [CREATE_ORGANIZATION]</span>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}

export default ProjectsSidebar;
