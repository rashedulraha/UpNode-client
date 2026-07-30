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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-white">Report New Incident</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Project Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">Target Project</label>
            <select
              {...register("projectId")}
              className={`w-full px-3.5 py-2 bg-zinc-950 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-zinc-200 ${
                errors.projectId ? "border-red-500" : "border-zinc-800"
              }`}
            >
              <option value="">-- Select Project --</option>
              {projects?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.projectId && <p className="text-xs text-red-400">{errors.projectId.message}</p>}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">Incident Title</label>
            <input
              {...register("title")}
              type="text"
              placeholder="e.g. Database Connection Timeouts"
              className={`w-full px-3.5 py-2 bg-zinc-950 border rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-zinc-200 ${
                errors.title ? "border-red-500" : "border-zinc-800"
              }`}
            />
            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
          </div>

          {/* Severity & Initial Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">Severity</label>
              <select
                {...register("severity")}
                className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-zinc-200"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">Initial Status</label>
              <select
                {...register("status")}
                className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-zinc-200"
              >
                <option value="INVESTIGATING">INVESTIGATING</option>
                <option value="IDENTIFIED">IDENTIFIED</option>
                <option value="MONITORING">MONITORING</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">Description / Diagnostic Details</label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Describe the symptoms, impacted services, and error trace..."
              className={`w-full px-3.5 py-2 bg-zinc-950 border rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-zinc-200 ${
                errors.description ? "border-red-500" : "border-zinc-800"
              }`}
            />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              {isSubmitting || createMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Submit Incident
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
