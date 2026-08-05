"use client";

import React, { useState, useEffect } from "react";
import { useUpdateProject, useDeleteProject } from "@/hooks/use-projects";
import { Project } from "@/services/projects.service";
import { Settings, Loader2, Save, Trash2, AlertCircle } from "lucide-react";
import { useOrgRole } from "@/hooks/use-org-role";

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onProjectDeleted?: () => void;
}

export function ProjectSettingsModal({
  isOpen,
  onClose,
  project,
  onProjectDeleted,
}: ProjectSettingsModalProps) {
  const { isAdmin } = useOrgRole();

  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();


  const [projectName, setProjectName] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (project) {
      setProjectName(project.name || "");
      setProjectSlug(project.slug || "");
      setProjectDescription(project.description || "");
      setProjectUrl(project.url || "");
      setErrorMessage(null);
      setShowDeleteConfirm(false);
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName) return;

    setErrorMessage(null);
    try {
      await updateMutation.mutateAsync({
        id: project.id,
        data: {
          name: projectName,
          slug: projectSlug.toLowerCase().trim() || undefined,
          description: projectDescription,
          url: projectUrl || undefined,
        },
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update project settings");
    }
  };

  const handleDeleteProject = async () => {
    if (!isAdmin) return;
    setErrorMessage(null);
    try {
      await deleteMutation.mutateAsync(project.id);
      if (onProjectDeleted) {
        onProjectDeleted();
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete project");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md font-mono">
      <div className="w-full max-w-md p-6 border border-slate-300 dark:border-neutral-800 bg-white dark:bg-black shadow-2xl space-y-5 rounded-none">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-900 dark:text-white" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              [PROJECT_SETTINGS]
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-xs font-mono"
            type="button"
          >
            [X]
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-none bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!showDeleteConfirm ? (
          <form onSubmit={handleUpdateProject} className="space-y-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 dark:text-neutral-400 uppercase font-mono font-bold">
                [PROJECT_NAME] *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. API Gateway Microservice"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white font-mono text-xs rounded-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 dark:text-neutral-400 uppercase font-mono font-bold">
                [PROJECT_SLUG]
              </label>
              <input
                type="text"
                placeholder="api-gateway"
                value={projectSlug}
                onChange={(e) => setProjectSlug(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white font-mono text-xs rounded-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 dark:text-neutral-400 uppercase font-mono font-bold">
                [WEBSITE_URL_FOR_UPTIME_CHECK]
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white font-mono text-xs rounded-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 dark:text-neutral-400 uppercase font-mono font-bold">
                [DESCRIPTION]
              </label>
              <textarea
                placeholder="Service monitoring details..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white font-mono text-xs rounded-none h-20"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-neutral-800">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-2 border border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all uppercase font-mono text-xs rounded-none cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> [DELETE]
                </button>
              ) : (
                <div className="text-[10px] text-slate-400 font-mono">
                  [READ-ONLY ACCESS]
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 dark:border-neutral-800 bg-slate-100 dark:bg-black text-slate-700 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white uppercase font-mono text-xs rounded-none cursor-pointer"
                >
                  [CANCEL]
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 border border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-black font-bold uppercase font-mono text-xs hover:opacity-90 rounded-none disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> [SAVING...]
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" /> [SAVE_CHANGES]
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4 font-mono text-xs text-center py-2">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase">
                [CRITICAL_WARNING]
              </h4>
              <p className="text-slate-500 dark:text-neutral-400 text-[11px] leading-relaxed">
                Are you absolutely sure you want to delete **{project.name}**? This will delete all incidents, metrics, and data associated with it. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-200 dark:border-neutral-800">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-slate-300 dark:border-neutral-800 bg-slate-100 dark:bg-black text-slate-700 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white uppercase font-mono text-xs rounded-none cursor-pointer"
              >
                [CANCEL]
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 border border-rose-500 bg-rose-600 text-white font-bold uppercase font-mono text-xs hover:bg-rose-700 rounded-none disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> [DELETING...]
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> [CONFIRM_DELETE]
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectSettingsModal;
