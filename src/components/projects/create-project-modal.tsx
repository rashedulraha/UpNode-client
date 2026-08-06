"use client";

import React, { useState } from "react";
import { useCreateProject } from "@/hooks/use-projects";
import { Folder, X, Loader2, Plus, AlertCircle } from "lucide-react";

interface CreateProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CreateProjectModal({
	isOpen,
	onClose,
}: CreateProjectModalProps) {
	const createProjectMutation = useCreateProject();
	const [projectName, setProjectName] = useState("");
	const [projectSlug, setProjectSlug] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	const [projectUrl, setProjectUrl] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	if (!isOpen) return null;

	const handleCreateProject = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!projectName) return;

		setErrorMessage(null);
		try {
			await createProjectMutation.mutateAsync({
				name: projectName,
				slug: projectSlug.toLowerCase().trim() || undefined,
				description: projectDescription,
				url: projectUrl || undefined,
			});
			onClose();
			setProjectName("");
			setProjectSlug("");
			setProjectDescription("");
			setProjectUrl("");
		} catch (err: any) {
			setErrorMessage(err.message || "Failed to create project");
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md font-mono">
			<div className="w-full max-w-md p-6 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-2xl space-y-5 rounded-none">
				{/* Modal Header */}
				<div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
					<div className="flex items-center gap-2">
						<Folder className="w-4 h-4 text-[var(--foreground)]" />
						<h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
							[CREATE_NEW_PROJECT]
						</h3>
					</div>
					<button
						onClick={onClose}
						className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer text-xs font-mono"
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

				<form
					onSubmit={handleCreateProject}
					className="space-y-4 text-xs font-mono"
				>
					<div className="space-y-1">
						<label className="block text-[10px] text-[var(--muted-foreground)] uppercase font-mono font-bold">
							[PROJECT_NAME] *
						</label>
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
											.replace(/-+/g, "-"),
									);
								}
							}}
							className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] font-mono text-xs rounded-none"
						/>
					</div>

					<div className="space-y-1">
						<label className="block text-[10px] text-[var(--muted-foreground)] uppercase font-mono font-bold">
							[PROJECT_SLUG]
						</label>
						<input
							type="text"
							placeholder="api-gateway"
							value={projectSlug}
							onChange={(e) => setProjectSlug(e.target.value)}
							className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] font-mono text-xs rounded-none"
						/>
					</div>

					<div className="space-y-1">
						<label className="block text-[10px] text-[var(--muted-foreground)] uppercase font-mono font-bold">
							[WEBSITE_URL_FOR_UPTIME_CHECK]
						</label>
						<input
							type="url"
							placeholder="https://example.com"
							value={projectUrl}
							onChange={(e) => setProjectUrl(e.target.value)}
							className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] font-mono text-xs rounded-none"
						/>
					</div>

					<div className="space-y-1">
						<label className="block text-[10px] text-[var(--muted-foreground)] uppercase font-mono font-bold">
							[DESCRIPTION]
						</label>
						<textarea
							placeholder="Service monitoring details..."
							value={projectDescription}
							onChange={(e) => setProjectDescription(e.target.value)}
							className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] font-mono text-xs rounded-none h-20"
						/>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] hover:opacity-80 uppercase font-mono text-xs rounded-none cursor-pointer"
						>
							[CANCEL]
						</button>
						<button
							type="submit"
							disabled={createProjectMutation.isPending}
							className="px-4 py-2 border border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] font-bold uppercase font-mono text-xs hover:opacity-90 rounded-none disabled:opacity-50 cursor-pointer flex items-center gap-2"
						>
							{createProjectMutation.isPending ? (
								<>
									<Loader2 className="w-3.5 h-3.5 animate-spin" /> [CREATING...]
								</>
							) : (
								<>
									<Plus className="w-3.5 h-3.5" /> [CREATE_PROJECT]
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateProjectModal;
