"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useProjects, useCreateProject } from "@/hooks/use-projects";
import {
  Activity,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Plus,
  Server,
  FolderGit2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, isLoading: authLoading, signOut } = useAuth();
  const { data: projects, isLoading: projectsLoading, error: projectsError, refetch } = useProjects();
  const createProjectMutation = useCreateProject();

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      setFormError("Project name is required");
      return;
    }
    setFormError(null);

    try {
      await createProjectMutation.mutateAsync({
        name: newProjectName.trim(),
        description: newProjectDesc.trim() || undefined,
      });
      setNewProjectName("");
      setNewProjectDesc("");
    } catch (err: any) {
      setFormError(err.message || "Failed to create project");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">UpNode</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono">
              v1.0
            </span>
          </div>

          <div className="flex items-center gap-4">
            {authLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-sm">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span className="font-medium text-zinc-200">{user?.name || user?.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Status Hero Card */}
        <section className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-zinc-900 border border-indigo-500/20 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Server className="w-3.5 h-3.5" /> Express Backend & Next.js Architecture
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Client & Backend Communication Service Layer
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed">
              Configured with centralized Axios API client, Better Auth session authentication, TanStack Query state management, and strict TypeScript types.
            </p>
          </div>
        </section>

        {/* Auth Status & API Connection Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2 font-semibold text-zinc-200">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                Authentication Status
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  isAuthenticated
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                }`}
              >
                {isAuthenticated ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" /> Unauthenticated
                  </>
                )}
              </span>
            </div>

            {isAuthenticated ? (
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <p className="text-zinc-500 text-xs font-mono uppercase">User ID</p>
                  <p className="font-mono text-zinc-300 text-xs">{user?.id}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <p className="text-zinc-500 text-xs font-mono uppercase">Email</p>
                  <p className="text-zinc-200 font-medium">{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-zinc-400">
                <p>You are currently accessing as a guest. Sign in or register to test protected API operations.</p>
                <div className="flex gap-3 pt-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Go to Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Register Account
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* API Connection Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2 font-semibold text-zinc-200">
                <Server className="w-5 h-5 text-indigo-400" />
                Express API Connection
              </div>
              <button
                onClick={() => refetch()}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Refetch API"
              >
                <RefreshCw className={`w-4 h-4 ${projectsLoading ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400 text-xs font-mono">BASE URL</span>
                <span className="font-mono text-indigo-400 text-xs">
                  {process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400 text-xs">TanStack Query Status</span>
                <span className="font-medium text-emerald-400 text-xs uppercase">
                  {projectsLoading ? "Fetching..." : projectsError ? "Error" : "Connected (200 OK)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Demonstration: Projects List & Add Form */}
        <section className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Express Backend API Integration Demo</h2>
            </div>
            <span className="text-xs text-zinc-400">
              {projects?.length || 0} project(s) fetched via TanStack Query
            </span>
          </div>

          {/* Form to test mutation */}
          {isAuthenticated ? (
            <form onSubmit={handleCreateProject} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" /> Create New Project via Express API
              </h3>
              {formError && <p className="text-xs text-red-400 font-medium">{formError}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Project Name (e.g. Production API)"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Description (Optional)"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={createProjectMutation.isPending}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                {createProjectMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Add Project
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-400 flex items-center justify-between">
              <span>Sign in to test creating projects on the Express backend via TanStack Mutations.</span>
              <Link href="/login" className="text-indigo-400 hover:underline font-semibold">
                Sign In &rarr;
              </Link>
            </div>
          )}

          {/* List of projects */}
          {projectsLoading ? (
            <div className="flex items-center justify-center py-12 text-zinc-500 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              <span>Fetching projects from server...</span>
            </div>
          ) : projectsError ? (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm">
              Failed to load projects from server: {projectsError.message}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-zinc-100">{proj.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                      ID: {proj.id.slice(0, 8)}...
                    </span>
                  </div>
                  {proj.description && <p className="text-xs text-zinc-400">{proj.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500 text-sm">
              No projects found on Express server yet. Create one above!
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-6 text-center text-xs text-zinc-500">
        UpNode Client & Server Integration — Built with Next.js App Router, Axios, TanStack Query, and Better Auth.
      </footer>
    </div>
  );
}
