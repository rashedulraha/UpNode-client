"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useProjects } from "@/hooks/use-projects";
import { useAuth } from "@/hooks/use-auth";
import { LogoutConfirmModal } from "@/components/auth/logout-confirm-modal";
import { StatusDot } from "@/components/ui/status-dot";
import { LogOut, Users, Activity, Bell } from "lucide-react";

interface ProjectsSidebarProps {
  selectedProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
}

export function ProjectsSidebar({
  selectedProjectId,
  onSelectProject,
}: ProjectsSidebarProps) {
  const { data: projects, isLoading, error } = useProjects();
  const { user, signOut } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    setIsLogoutModalOpen(false);
  };

  return (
    <aside className="w-full lg:w-64 bg-white/70 dark:bg-black/80 backdrop-blur-3xl flex flex-col justify-between h-auto lg:h-full shrink-0 font-sans border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-neutral-800 overflow-hidden">
      {/* Top Section: Projects navigation */}
      <div className="p-4 sm:p-5 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-[10px] font-mono font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-widest px-2 mb-3">
            [NAVIGATION]
          </h2>
          <div className="space-y-1.5 font-mono text-xs">
            <button
              onClick={() => onSelectProject(null)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer border ${
                selectedProjectId === null
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white font-bold shadow-sm"
                  : "text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-3.5 h-3.5" />
                <span>ALL TELEMETRY</span>
              </div>
              {selectedProjectId === null && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 dark:bg-black/20 text-current uppercase font-bold">
                  ALL
                </span>
              )}
            </button>

            <Link
              href="/dashboard/settings/team"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl font-mono text-xs text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white border border-transparent transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-3.5 h-3.5" />
                <span>TEAM & ROLES</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 uppercase">
                RBAC
              </span>
            </Link>

            <Link
              href="/dashboard/settings/integrations"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl font-mono text-xs text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white border border-transparent transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-3.5 h-3.5" />
                <span>INTEGRATIONS</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 uppercase font-bold">
                ALERT
              </span>
            </Link>
          </div>
        </div>

        {/* Project List */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-2 mb-2 font-mono">
            <h2 className="text-[10px] font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
              [PROJECTS]
            </h2>
            <span className="text-[10px] text-slate-400 dark:text-neutral-500">
              {projects?.length || 0}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-2 px-2 py-1">
              <div className="h-7 bg-slate-200/50 dark:bg-neutral-900 rounded-xl animate-pulse" />
              <div className="h-7 bg-slate-200/50 dark:bg-neutral-900 rounded-xl animate-pulse" />
            </div>
          ) : error ? (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-mono">
              [FAILED TO LOAD PROJECTS]
            </div>
          ) : projects && projects.length > 0 ? (
            projects.map((proj) => {
              const isSelected = selectedProjectId === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white font-bold shadow-sm"
                      : "text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <StatusDot variant="OPERATIONAL" size="sm" pulse={false} />
                    <span className="truncate">{proj.name}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-4 text-xs text-slate-400 dark:text-neutral-500 text-center font-mono italic">
              [NO PROJECTS CREATED YET]
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: User Profile */}
      <div className="p-4 border-t border-border/40 bg-card/60 backdrop-blur-xl">
        <div className="p-2.5 rounded-2xl bg-muted/30 border border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-primary/20">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate font-mono">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isSigningOut}
      />
    </aside>
  );
}

export default ProjectsSidebar;
