"use client";

import React from "react";
import { useProjects } from "@/hooks/use-projects";
import { Plus, Folder, Settings } from "lucide-react";
import { Project } from "@/services/projects.service";

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
  const { data: projects = [], isLoading } = useProjects();

  return (
    <aside className="w-full lg:w-72 xl:w-80 bg-white dark:bg-black backdrop-blur-3xl flex flex-col justify-between h-auto lg:h-full shrink-0 font-mono border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-neutral-800 overflow-hidden select-none transition-colors">
      {/* Top Section: Projects navigation */}
      <div className="p-4 space-y-5 overflow-y-auto">
        <div>
          <h2 className="text-[10px] font-mono font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest px-1 mb-2.5">
            [NAVIGATION]
          </h2>
          <div className="space-y-1 font-mono text-xs">
            <button
              onClick={() => onSelectProject(null)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-none transition-colors cursor-pointer border ${
                selectedProjectId === null
                  ? "bg-slate-100 dark:bg-neutral-900/60 text-slate-900 dark:text-white border-slate-300 dark:border-neutral-700 font-bold shadow-sm"
                  : "bg-slate-50 dark:bg-neutral-950 text-slate-700 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Folder className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-neutral-500" />
                <span className="truncate uppercase font-medium">[ALL_INCIDENTS]</span>
              </div>
            </button>
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
                      <span className="truncate uppercase font-medium text-left">{project.name}</span>
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

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 dark:border-neutral-900 font-mono text-[10px] text-slate-500 dark:text-neutral-500 flex items-center justify-between bg-slate-50 dark:bg-black">
        <span>TELEMETRY_ENGINE</span>
        <span className="text-slate-800 dark:text-neutral-300 font-bold">[ONLINE]</span>
      </div>
    </aside>
  );
}

export default ProjectsSidebar;
