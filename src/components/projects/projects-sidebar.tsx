"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProjects } from "@/hooks/use-projects";
import { Plus, Folder, Settings, Building2, Users, Shield, Sliders, User, Activity } from "lucide-react";
import { Project } from "@/services/projects.service";
import { organizationService, UserOrganization } from "@/services/organization.service";
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
  const [showPromo, setShowPromo] = React.useState<boolean>(true);
  const [activeOrg, setActiveOrg] = React.useState<UserOrganization | null>(null);

  React.useEffect(() => {
    const isDismissed = localStorage.getItem("upnode_promo_dismissed");
    if (isDismissed === "true") {
      setShowPromo(false);
    }
    // Fetch active org name
    organizationService.getUserOrganizations().then((orgs) => {
      if (orgs.length > 0) {
        const activeOrgId = localStorage.getItem("activeOrganizationId");
        const found = activeOrgId ? orgs.find((o) => o.id === activeOrgId) || orgs[0] : orgs[0];
        setActiveOrg(found);
      }
    }).catch(() => {});
  }, [user]);

  const handleDismissPromo = () => {
    setShowPromo(false);
  };

  const isTeamPage = pathname?.includes("/dashboard/settings/team");
  const isIntegrationsPage = pathname?.includes("/dashboard/settings/integrations");
  const isProfilePage = pathname?.includes("/dashboard/settings/profile");

  return (
    <aside className="w-full lg:w-72 xl:w-80 bg-white dark:bg-black backdrop-blur-3xl flex flex-col justify-between h-auto lg:h-full shrink-0 font-mono border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-neutral-800 overflow-hidden select-none transition-colors">
      {/* Top Section: Projects & Organization navigation */}
      <div className="p-4 space-y-5 overflow-y-auto">
        {/* Active Organization Badge */}
        {activeOrg && (
          <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950">
            <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-500 dark:text-neutral-400" />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-slate-400 dark:text-neutral-600 uppercase tracking-widest font-mono">ACTIVE_ORG</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white uppercase truncate">{activeOrg.name}</p>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 border font-bold uppercase ${
              activeOrg.memberRole === "ADMIN" 
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" 
                : activeOrg.memberRole === "ENGINEER" 
                ? "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                : "border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400"
            }`}>{activeOrg.memberRole}</span>
          </div>
        )}

        {/* Dashboard Core Navigation */}
        <div>
          <h2 className="text-[10px] font-mono font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest px-1 mb-2">
            [NAVIGATION]
          </h2>
          <div className="space-y-1 font-mono text-xs">
            <button
              onClick={() => onSelectProject(null)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-none transition-colors cursor-pointer border ${
                selectedProjectId === null && !isTeamPage && !isIntegrationsPage && !isProfilePage
                  ? "bg-slate-100 dark:bg-neutral-900/60 text-slate-900 dark:text-white border-slate-300 dark:border-neutral-700 font-bold shadow-sm"
                  : "bg-slate-50 dark:bg-neutral-950 text-slate-700 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Folder className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-neutral-500" />
                <span className="truncate uppercase font-medium">
                  [ALL_INCIDENTS]
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Organization IAM & Team Management Nav */}
        <div>
          <h2 className="text-[10px] font-mono font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest px-1 mb-2">
            [ORGANIZATION & TEAM]
          </h2>
          <div className="space-y-1 font-mono text-xs">
            <Link
              href="/dashboard/settings/team"
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-none transition-colors cursor-pointer border ${
                isTeamPage
                  ? "bg-slate-100 dark:bg-neutral-900/60 text-slate-900 dark:text-white border-slate-300 dark:border-neutral-700 font-bold shadow-sm"
                  : "bg-slate-50 dark:bg-neutral-950 text-slate-700 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Users className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-neutral-500" />
                <span className="truncate uppercase font-medium">
                  [TEAM_MANAGEMENT]
                </span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 font-mono font-bold uppercase border ${
                isTeamPage 
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" 
                  : "border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400"
              }`}>
                ADD_ADMIN
              </span>
            </Link>

            <Link
              href="/dashboard/settings/integrations"
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-none transition-colors cursor-pointer border ${
                isIntegrationsPage
                  ? "bg-slate-100 dark:bg-neutral-900/60 text-slate-900 dark:text-white border-slate-300 dark:border-neutral-700 font-bold shadow-sm"
                  : "bg-slate-50 dark:bg-neutral-950 text-slate-700 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Sliders className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-neutral-500" />
                <span className="truncate uppercase font-medium">
                  [INTEGRATIONS]
                </span>
              </div>
            </Link>

            <Link
              href="/dashboard/settings/profile"
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-none transition-colors cursor-pointer border ${
                isProfilePage
                  ? "bg-slate-100 dark:bg-neutral-900/60 text-slate-900 dark:text-white border-slate-300 dark:border-neutral-700 font-bold shadow-sm"
                  : "bg-slate-50 dark:bg-neutral-950 text-slate-700 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <User className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-neutral-500" />
                <span className="truncate uppercase font-medium">
                  [MY_ACCOUNT]
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between px-1 mb-2">
            <h2 className="text-[10px] font-mono font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
              [PROJECTS]
            </h2>
            <button
              onClick={onOpenCreateProject}
              className="p-1 text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-neutral-800"
              title="Create Project"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1 text-xs">
            {isLoading ? (
              <div className="p-3 text-center text-slate-400 dark:text-neutral-500 font-mono text-[10px]">
                [LOADING_PROJECTS...]
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => {
                const isSelected = selectedProjectId === project.id;
                return (
                  <div
                    key={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-none transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-slate-100 dark:bg-neutral-900/60 text-slate-900 dark:text-white border-slate-300 dark:border-neutral-700 font-bold shadow-sm"
                        : "bg-slate-50 dark:bg-neutral-950 text-slate-700 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Folder className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-neutral-500" />
                      <span className="truncate uppercase font-medium text-left">
                        {project.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {project.slug && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-none bg-slate-200 dark:bg-neutral-900 text-slate-700 dark:text-neutral-400 border border-slate-300 dark:border-neutral-800 uppercase">
                          {project.slug}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProjectSettings(project);
                        }}
                        className="p-1 rounded-none text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors border border-transparent hover:border-slate-300 dark:hover:border-neutral-700 cursor-pointer"
                        title="Project Settings"
                      >
                        <Settings className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-center text-slate-400 dark:text-neutral-500 font-mono text-[10px] border border-slate-200 dark:border-neutral-900 bg-slate-50 dark:bg-black">
                [NO_PROJECTS_REGISTERED]
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Promotion / Plan Info Banner */}
      {showPromo && (
        <div className="mx-4 mb-4 p-4 border border-amber-500/30 dark:border-amber-500/20 bg-amber-500/[0.03] dark:bg-amber-500/[0.01] relative font-mono text-[11px] space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider text-[10px]">
              [BETA_v2.6 // FREE_PLAN]
            </span>

            <button
              onClick={() => handleDismissPromo()}
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-[10px]"
              title="Dismiss promotion"
            >
              [X]
            </button>
          </div>

          {/* Footer Info & Action Buttons */}
          <div className="pt-1">
            <p className="text-[9px] text-slate-400 dark:text-neutral-500 mb-2.5 uppercase tracking-wide">
              NEXT RESET: 12H 18M • FREE PLAN LIMIT: 3 PROJECTS
            </p>

            <div className="flex items-center gap-2">
              <a
                href="/docs"
                className="flex-1 py-1.5 px-2 text-center border border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-900 text-slate-800 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors uppercase text-[9px] font-bold"
              >
                [READ_DOCS]
              </a>

              <a
                href="/dashboard/settings/profile#pricing"
                className="flex-1 py-1.5 px-2 text-center border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all uppercase text-[9px] font-bold"
              >
                [UPGRADE_NOW]
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 dark:border-neutral-900 font-mono text-[10px] text-slate-500 dark:text-neutral-500 flex items-center justify-between bg-slate-50 dark:bg-black">
        <span>TELEMETRY_ENGINE</span>
        <span className="text-slate-800 dark:text-neutral-300 font-bold">
          [ONLINE]
        </span>
      </div>
    </aside>
  );
}

export default ProjectsSidebar;
