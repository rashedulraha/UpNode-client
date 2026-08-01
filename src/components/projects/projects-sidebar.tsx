"use client";

import React, { useState } from "react";
import { useProjects, useCreateProject } from "@/hooks/use-projects";
import { Plus, Folder, X, Loader2 } from "lucide-react";

interface ProjectsSidebarProps {
  selectedProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
}

export function ProjectsSidebar({
  selectedProjectId,
  onSelectProject,
}: ProjectsSidebarProps) {
  const { data: projects = [], isLoading } = useProjects();
  const createProjectMutation = useCreateProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !projectSlug) return;

    try {
      await createProjectMutation.mutateAsync({
        name: projectName,
        slug: projectSlug.toLowerCase().trim(),
        description: projectDescription,
      });
      setIsModalOpen(false);
      setProjectName("");
      setProjectSlug("");
      setProjectDescription("");
    } catch {
      // Error handled by mutation
    }
  };

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
                  ? "bg-slate-900 dark:bg-neutral-900 text-white border-slate-900 dark:border-white font-bold shadow-sm"
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
              onClick={() => setIsModalOpen(true)}
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
                  <button
                    key={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-none transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-slate-900 dark:bg-neutral-900 text-white border-slate-900 dark:border-white font-bold shadow-sm"
                        : "bg-slate-50 dark:bg-neutral-950 text-slate-700 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Folder className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-neutral-500" />
                      <span className="truncate uppercase font-medium">{project.name}</span>
                    </div>

                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-none bg-slate-200 dark:bg-neutral-900 text-slate-700 dark:text-neutral-400 border border-slate-300 dark:border-neutral-800 uppercase shrink-0">
                      {project.slug}
                    </span>
                  </button>
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

      {/* Modal for creating a new project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-neutral-900 bg-slate-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-200/50 dark:bg-neutral-800 text-slate-900 dark:text-white border border-slate-300 dark:border-neutral-700">
                  <Folder className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Create New Project</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-500 dark:text-neutral-400">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. API Gateway Microservice"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    if (!projectSlug) {
                      setProjectSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, "-")
                          .replace(/-+/g, "-")
                      );
                    }
                  }}
                  className="w-full px-3.5 py-2 bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-500 dark:text-neutral-400">Project Slug</label>
                <input
                  type="text"
                  required
                  placeholder="api-gateway"
                  value={projectSlug}
                  onChange={(e) => setProjectSlug(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-500 dark:text-neutral-400">Description</label>
                <textarea
                  placeholder="Service monitoring details..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white h-20"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-neutral-900">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProjectMutation.isPending}
                  className="px-4 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-neutral-200 text-white dark:text-black rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-slate-900/20 dark:shadow-white/10"
                >
                  {createProjectMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> Create Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}

export default ProjectsSidebar;
