"use client";

import React from "react";
import { useProjects } from "@/hooks/use-projects";
import { useAuth } from "@/hooks/use-auth";
import {
  FolderGit2,
  Layers,
  Check,
  AlertTriangle,
  Loader2,
  User,
  LogOut,
  Shield,
} from "lucide-react";

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

  return (
    <aside className="w-64 bg-zinc-900/90 border-r border-zinc-800 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 shrink-0">
      {/* Top Section: Projects navigation */}
      <div className="p-4 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3 mb-3">
            Projects Overview
          </h2>
          <button
            onClick={() => onSelectProject(null)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              selectedProjectId === null
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>All Projects</span>
            </div>
            {selectedProjectId === null && <Check className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>

        {/* Project List */}
        <div className="space-y-1">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3 mb-2">
            Active Projects ({projects?.length || 0})
          </h2>

          {isLoading ? (
            <div className="space-y-2 px-3 py-2">
              <div className="h-8 bg-zinc-800/60 rounded-xl animate-pulse" />
              <div className="h-8 bg-zinc-800/60 rounded-xl animate-pulse" />
              <div className="h-8 bg-zinc-800/60 rounded-xl animate-pulse" />
            </div>
          ) : error ? (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Failed to load projects</span>
            </div>
          ) : projects && projects.length > 0 ? (
            projects.map((proj) => {
              const isSelected = selectedProjectId === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FolderGit2 className={`w-4 h-4 ${isSelected ? "text-indigo-400" : "text-zinc-500"}`} />
                    <span className="truncate">{proj.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-4 text-xs text-zinc-500 text-center">
              No projects created yet.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: User Profile */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/40">
        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-500/30">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-zinc-200 truncate">{user?.name || "User"}</p>
              <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default ProjectsSidebar;
