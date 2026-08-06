"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useIncidentStream } from "@/hooks/useIncidentStream";
import { useIncidents, useIncident } from "@/hooks/use-incidents";
import { useAuth } from "@/hooks/use-auth";
import { IncidentStatus, IncidentSeverity } from "@/types";
import DashboardHeader from "./dashboard-header";
import { RolePreviewBanner } from "@/components/auth/role-switcher";
import ProjectsSidebar from "../projects/projects-sidebar";
import IncidentList from "../incidents/incident-list";
import IncidentDetails from "../incidents/incident-details";
import CreateIncidentModal from "../incidents/create-incident-modal";
import CreateProjectModal from "../projects/create-project-modal";
import ProjectSettingsModal from "../projects/project-settings-modal";
import { Project } from "@/services/projects.service";
import {
	OnboardingWizard,
	ONBOARDING_KEY,
} from "../onboarding/onboarding-wizard";
import { organizationService } from "@/services/organization.service";

export function DashboardView() {
	const { user } = useAuth();

	// Onboarding state — show wizard if user has no org and hasn't completed onboarding
	const [showOnboarding, setShowOnboarding] = useState(false);
	const [onboardingChecked, setOnboardingChecked] = useState(false);

	useEffect(() => {
		if (!user) return;
		const alreadyDone =
			typeof window !== "undefined" &&
			localStorage.getItem(ONBOARDING_KEY) === "true";
		if (alreadyDone) {
			setOnboardingChecked(true);
			return;
		}
		// Check if user is in any org
		organizationService
			.getUserOrganizations()
			.then((orgs) => {
				if (orgs.length === 0) {
					setShowOnboarding(true);
				} else {
					// User has an org — store it and skip onboarding
					if (
						typeof window !== "undefined" &&
						!localStorage.getItem("activeOrganizationId")
					) {
						localStorage.setItem("activeOrganizationId", orgs[0].id);
					}
					localStorage.setItem(ONBOARDING_KEY, "true");
				}
				setOnboardingChecked(true);
			})
			.catch(() => {
				setOnboardingChecked(true);
			});
	}, [user]);

	const streamStatus = useIncidentStream();

	// Selected filters state
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
		null,
	);
	const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
		null,
	);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [statusFilter, setStatusFilter] = useState<IncidentStatus | "ALL">(
		"ALL",
	);
	const [severityFilter, setSeverityFilter] = useState<
		IncidentSeverity | "ALL"
	>("ALL");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
	const [isCreateProjectOpen, setIsCreateProjectOpen] =
		useState<boolean>(false);
	const [settingsProject, setSettingsProject] = useState<Project | null>(null);

	// Fetch incidents list from backend via TanStack Query
	const {
		data: paginatedIncidents,
		isLoading: isListLoading,
		error: listError,
		refetch: refetchIncidents,
	} = useIncidents({
		projectId: selectedProjectId || undefined,
		status: statusFilter === "ALL" ? undefined : statusFilter,
		severity: severityFilter === "ALL" ? undefined : severityFilter,
	});

	// Fetch detailed info for currently selected incident
	const { data: selectedIncident, isLoading: isDetailLoading } =
		useIncident(selectedIncidentId);

	// Client-side search filter by title
	const filteredIncidents = useMemo(() => {
		const items = paginatedIncidents?.items || [];
		if (!searchQuery.trim()) return items;
		return items.filter((item) =>
			item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()),
		);
	}, [paginatedIncidents?.items, searchQuery]);

	return (
		<div className="min-h-screen lg:h-screen lg:max-h-screen w-full max-w-full overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans relative selection:bg-slate-800 transition-colors duration-300">
			{/* Role Preview Banner for Admins */}
			<RolePreviewBanner />

			{/* Background Noise Layer */}
			<div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

			{/* Top Header */}
			<DashboardHeader
				streamStatus={streamStatus}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				onOpenCreateModal={() => setIsCreateModalOpen(true)}
			/>

			{/* Body Content: Responsive Stack on mobile, Split on desktop */}
			<div className="flex flex-col lg:flex-row flex-1 h-full lg:h-[calc(100vh-4rem)] overflow-y-auto lg:overflow-hidden w-full max-w-full relative z-10">
				{/* Projects Sidebar */}
				<ProjectsSidebar
					selectedProjectId={selectedProjectId}
					onSelectProject={(id) => {
						setSelectedProjectId(id);
						setSelectedIncidentId(null);
					}}
					onOpenCreateProject={() => setIsCreateProjectOpen(true)}
					onOpenProjectSettings={(project) => setSettingsProject(project)}
				/>

				{/* Main Content Area */}
				<main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto lg:overflow-hidden h-full flex flex-col min-w-0">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-y-auto lg:overflow-hidden min-w-0">
						{/* Left Column: Incidents List */}
						<div className="lg:col-span-5 h-auto lg:h-full overflow-y-auto lg:overflow-hidden min-w-0">
							<IncidentList
								incidents={filteredIncidents}
								selectedIncidentId={selectedIncidentId}
								onSelectIncident={setSelectedIncidentId}
								isLoading={isListLoading}
								error={listError as Error}
								onRefresh={refetchIncidents}
								statusFilter={statusFilter}
								onStatusFilterChange={setStatusFilter}
								severityFilter={severityFilter}
								onSeverityFilterChange={setSeverityFilter}
							/>
						</div>

						{/* Right Column: Incident Details */}
						<div className="lg:col-span-7 h-auto lg:h-full overflow-y-auto lg:overflow-hidden min-w-0">
							<IncidentDetails
								incident={selectedIncident || null}
								isLoading={isDetailLoading}
								onClose={() => setSelectedIncidentId(null)}
								onSelectIncident={setSelectedIncidentId}
							/>
						</div>
					</div>
				</main>
			</div>

			{/* Modal for reporting a new incident */}
			<CreateIncidentModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
			/>

			{/* Modal for creating a new project */}
			<CreateProjectModal
				isOpen={isCreateProjectOpen}
				onClose={() => setIsCreateProjectOpen(false)}
			/>

			{/* Modal for project settings */}
			<ProjectSettingsModal
				isOpen={settingsProject !== null}
				onClose={() => setSettingsProject(null)}
				project={settingsProject}
				onProjectDeleted={() => {
					if (selectedProjectId === settingsProject?.id) {
						setSelectedProjectId(null);
						setSelectedIncidentId(null);
					}
				}}
			/>

			{/* Onboarding Wizard — shown once for first-time users with no org */}
			{showOnboarding && user && (
				<OnboardingWizard
					userName={user.name || user.email || ""}
					onComplete={(_orgId, _orgName) => {
						setShowOnboarding(false);
						window.location.reload();
					}}
				/>
			)}
		</div>
	);
}

export default DashboardView;
