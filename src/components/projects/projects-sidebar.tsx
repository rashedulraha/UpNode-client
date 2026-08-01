"use client";

import React, { useState } from "react";
import { useProjects, useCreateProject } from "@/hooks/use-projects";
import { Plus, Folder } from "lucide-react";

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
    <aside className="w-full lg:w-64 bg-neutral-950/80 backdrop-blur-3xl flex flex-col justify-between h-auto lg:h-full shrink-0 font-mono border-b lg:border-b-0 lg:border-r border-neutral-800 overflow-hidden">
      {/* Top Section: Projects navigation */}
      <div className="p-4 sm:p-5 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-[10px] font-mono font-semibold text-neutral-500 uppercase tracking-widest px-1 mb-3">
            [NAVIGATION]
          </h2>
          <div className="space-y-1 font-mono text-xs">
            <button
              onClick={() => onSelectProject(null)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-none transition-colors cursor-pointer border ${
                selectedProjectId === null
                  ? "bg-neutral-900 text-white border-white font-bold shadow-sm"
                  : "bg-black text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-neutral-400">[ALL]</span>
                <span className="truncate uppercase">All Projects</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-none bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
                {projects.length}
              </span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between px-1 mb-3">
            <h2 className="text-[10px] font-mono font-semibold text-neutral-500 uppercase tracking-widest">
              [PROJECTS]
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1 rounded-none text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors border border-neutral-800 cursor-pointer"
              title="Add New Project"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 font-mono text-xs max-h-64 lg:max-h-none overflow-y-auto pr-0.5">
            {isLoading ? (
              <div className="space-y-2 py-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 rounded-none bg-black border border-neutral-900 animate-pulse"
                  />
                ))}
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => {
                const isSelected = selectedProjectId === project.id;
                return (
                  <button
                    key={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-none transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-neutral-900 text-white border-white font-bold shadow-sm"
                        : "bg-black text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Folder className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                      <span className="truncate uppercase">{project.name}</span>
                    </div>

                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-none bg-neutral-900 text-neutral-400 border border-neutral-800 uppercase">
                      {project.slug}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-neutral-500 font-mono text-[11px] border border-neutral-900 bg-black">
                [NO_PROJECTS_REGISTERED]
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-neutral-900 font-mono text-[10px] text-neutral-500 flex items-center justify-between bg-black">
        <span>TELEMETRY_ENGINE</span>
        <span className="text-neutral-400 font-bold">[ONLINE]</span>
      </div>

      {/* Modal for creating a new project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
          <div className="w-full max-w-md p-6 border border-neutral-800 bg-black shadow-2xl space-y-5 rounded-none">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              [CREATE_NEW_PROJECT]
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 uppercase">[PROJECT_NAME]</label>
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
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-white font-mono text-xs rounded-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 uppercase">[PROJECT_SLUG]</label>
                <input
                  type="text"
                  required
                  placeholder="api-gateway"
                  value={projectSlug}
                  onChange={(e) => setProjectSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-white font-mono text-xs rounded-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 uppercase">[DESCRIPTION]</label>
                <textarea
                  placeholder="Service monitoring details..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-white font-mono text-xs rounded-none h-20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-800 bg-black text-neutral-400 hover:text-white uppercase font-mono text-xs rounded-none"
                >
                  [CANCEL]
                </button>
                <button
                  type="submit"
                  disabled={createProjectMutation.isPending}
                  className="px-4 py-2 border border-white bg-white text-black font-bold uppercase font-mono text-xs hover:opacity-90 rounded-none disabled:opacity-50"
                >
                  {createProjectMutation.isPending ? "[CREATING...]" : "[CREATE_PROJECT]"}
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
