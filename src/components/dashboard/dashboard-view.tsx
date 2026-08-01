"use client";

import React, { useState, useMemo } from "react";
import { useIncidentStream } from "@/hooks/useIncidentStream";
import { useIncidents, useIncident } from "@/hooks/use-incidents";
import { IncidentStatus, IncidentSeverity } from "@/types";
import DashboardHeader from "./dashboard-header";
import ProjectsSidebar from "../projects/projects-sidebar";
import IncidentList from "../incidents/incident-list";
import IncidentDetails from "../incidents/incident-details";
import CreateIncidentModal from "../incidents/create-incident-modal";

export function DashboardView() {
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
    <div className="h-screen max-h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground font-sans">
      {/* Top Header */}
      <DashboardHeader
        streamStatus={streamStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Body: Sidebar + Main Content Split */}
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        {/* Projects Sidebar */}
        <ProjectsSidebar
          selectedProjectId={selectedProjectId}
          onSelectProject={(id) => {
            setSelectedProjectId(id);
            setSelectedIncidentId(null);
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden h-full flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
            {/* Left Column: Incidents List */}
            <div className="lg:col-span-5 h-full overflow-hidden">
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
            <div className="lg:col-span-7 h-full overflow-hidden">
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
    </div>
  );
}

export default DashboardView;
