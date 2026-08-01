"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateIncident } from "@/hooks/use-incidents";
import { useProjects } from "@/hooks/use-projects";
import { IncidentSeverity, IncidentStatus } from "@/types";
import { X, Loader2, AlertCircle, Plus, ShieldAlert } from "lucide-react";

const createIncidentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  projectId: z.string().min(1, "Please select a project"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  status: z.enum(["INVESTIGATING", "IDENTIFIED", "MONITORING", "RESOLVED"]),
});

type CreateIncidentFormValues = z.infer<typeof createIncidentSchema>;

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateIncidentModal({ isOpen, onClose }: CreateIncidentModalProps) {
  const { data: projects } = useProjects();
  const createMutation = useCreateIncident();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateIncidentFormValues>({
    resolver: zodResolver(createIncidentSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: "",
      severity: "MEDIUM",
      status: "INVESTIGATING",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (values: CreateIncidentFormValues) => {
    setErrorMessage(null);
    try {
      await createMutation.mutateAsync(values);
      reset();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create incident");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md font-mono">
      <div className="w-full max-w-lg p-6 border border-slate-300 dark:border-neutral-800 bg-white dark:bg-black shadow-2xl space-y-5 rounded-none">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-900 dark:text-white" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              [REPORT_NEW_INCIDENT]
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-xs font-mono"
          >
            [X]
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-mono">
          {errorMessage && (
            <div className="p-3 rounded-none bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Project Selection */}
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-500 dark:text-neutral-400 uppercase font-mono font-bold">
              [TARGET_PROJECT]
            </label>
            <select
              {...register("projectId")}
              className={`w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white font-mono text-xs rounded-none ${
                errors.projectId ? "border-rose-500" : ""
              }`}
            >
              <option value="">-- SELECT PROJECT --</option>
              {projects?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.projectId && <p className="text-[10px] text-rose-500 font-mono">{errors.projectId.message}</p>}
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-500 dark:text-neutral-400 uppercase font-mono font-bold">
              [INCIDENT_TITLE]
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="e.g. Database Connection Timeouts"
              className={`w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white font-mono text-xs rounded-none ${
                errors.title ? "border-rose-500" : ""
              }`}
            />
            {errors.title && <p className="text-[10px] text-rose-500 font-mono">{errors.title.message}</p>}
          </div>

          {/* Severity & Initial Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 dark:text-neutral-400 uppercase font-mono font-bold">
                [SEVERITY]
              </label>
              <select
                {...register("severity")}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white font-mono text-xs rounded-none"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-500 dark:text-neutral-400 uppercase font-mono font-bold">
                [INITIAL_STATUS]
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white font-mono text-xs rounded-none"
              >
                <option value="INVESTIGATING">INVESTIGATING</option>
                <option value="IDENTIFIED">IDENTIFIED</option>
                <option value="MONITORING">MONITORING</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-500 dark:text-neutral-400 uppercase font-mono font-bold">
              [DESCRIPTION_DIAGNOSTIC_DETAILS]
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Describe the symptoms, impacted services, and error trace..."
              className={`w-full px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white font-mono text-xs rounded-none h-20 ${
                errors.description ? "border-rose-500" : ""
              }`}
            />
            {errors.description && <p className="text-[10px] text-rose-500 font-mono">{errors.description.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-neutral-800 bg-slate-100 dark:bg-black text-slate-700 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white uppercase font-mono text-xs rounded-none cursor-pointer"
            >
              [CANCEL]
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
              className="px-4 py-2 border border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-black font-bold uppercase font-mono text-xs hover:opacity-90 rounded-none disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {isSubmitting || createMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> [SUBMITTING...]
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> [SUBMIT_INCIDENT]
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateIncidentModal;
