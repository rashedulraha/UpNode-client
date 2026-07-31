"use client";

import React, { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { useAuth } from "@/hooks/use-auth";
import { LogoutConfirmModal } from "@/components/auth/logout-confirm-modal";
import { StatusDot } from "@/components/ui/status-dot";
import { LogOut } from "lucide-react";

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
    <aside className="w-64 bg-card/30 backdrop-blur-2xl frosted-border border-r border-border/40 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 shrink-0 font-sans glass-card">
      {/* Top Section: Projects navigation */}
      <div className="p-5 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest px-2 mb-3">
            Navigation
          </h2>
          <button
            onClick={() => onSelectProject(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              selectedProjectId === null
                ? "bg-primary/10 text-primary border border-primary/20 font-semibold"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>All Projects</span>
            </div>
            {selectedProjectId === null && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                ALL
              </span>
            )}
          </button>
        </div>

        {/* Project List */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-2 mb-2">
            <h2 className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              Projects
            </h2>
            <span className="text-[10px] font-mono text-muted-foreground/60">
              {projects?.length || 0}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-2 px-2 py-1">
              <div className="h-7 bg-muted/40 rounded-xl animate-pulse" />
              <div className="h-7 bg-muted/40 rounded-xl animate-pulse" />
            </div>
          ) : error ? (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              Failed to load projects
            </div>
          ) : projects && projects.length > 0 ? (
            projects.map((proj) => {
              const isSelected = selectedProjectId === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 text-primary border border-primary/20 font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <StatusDot variant="OPERATIONAL" size="sm" pulse={false} />
                    <span className="truncate">{proj.name}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-4 text-xs text-muted-foreground text-center font-mono">
              No projects created yet.
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
