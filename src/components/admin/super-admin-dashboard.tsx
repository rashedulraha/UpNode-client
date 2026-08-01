"use client";

import React, { useState, useEffect, useRef } from "react";
import { adminService } from "@/services/admin.service";
import { AdminOrganization, AdminUser } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface LogEntry {
  id: string;
  timestamp: string;
  type: string;
  channel?: string;
  content: string;
  level: "info" | "warn" | "error" | "sys";
}

export default function SuperAdminDashboard() {
  const [organizations, setOrganizations] = useState<AdminOrganization[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"orgs" | "users">("orgs");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Terminal Live Log Stream State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Confirmation Modal States
  const [modalAction, setModalAction] = useState<{
    type: "block_user" | "unblock_user" | "delete_user" | "delete_org";
    targetId: string;
    targetName: string;
  } | null>(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);

  // Fetch Admin Overview Data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const [orgsData, usersData] = await Promise.all([
        adminService.getAllOrganizations(),
        adminService.getAllUsers(),
      ]);
      setOrganizations(orgsData);
      setUsers(usersData);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || "Failed to load global admin telemetry.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Connect to Live SSE Log Stream (/api/stream/admin)
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      const streamUrl = `${baseUrl}/stream/admin`;
      eventSource = new EventSource(streamUrl, { withCredentials: true });

      // Add initial welcome boot log
      setLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          timestamp: new Date().toISOString(),
          type: "BOOT",
          content: "System Health Telemetry Terminal initialized. Subscribed to global Redis channels: INCIDENT_CHANNEL, METRIC_CHANNEL",
          level: "sys",
        },
      ]);

      eventSource.addEventListener("connected", (e: MessageEvent) => {
        if (isPaused) return;
        try {
          const data = JSON.parse(e.data);
          setLogs((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              timestamp: new Date().toISOString(),
              type: "REDIS_CONNECT",
              content: data.message || "Connected to global Redis pub/sub broker.",
              level: "sys",
            },
          ]);
        } catch {
          // ignore
        }
      });

      eventSource.addEventListener("system_log", (e: MessageEvent) => {
        if (isPaused) return;
        try {
          const data = JSON.parse(e.data);
          const channel = data.channel || "TELEMETRY";
          const payload = data.payload || {};
          let level: "info" | "warn" | "error" = "info";

          if (channel.includes("INCIDENT") || payload.type?.includes("INCIDENT")) {
            level = "warn";
          }

          setLogs((prev) => [
            ...prev.slice(-100), // Keep last 100 log lines
            {
              id: Math.random().toString(),
              timestamp: data.timestamp || new Date().toISOString(),
              type: payload.type || channel,
              channel,
              content: JSON.stringify(payload),
              level,
            },
          ]);
        } catch {
          // ignore
        }
      });

      eventSource.onerror = () => {
        if (!isPaused) {
          setLogs((prev) => [
            ...prev.slice(-100),
            {
              id: Math.random().toString(),
              timestamp: new Date().toISOString(),
              type: "STREAM_WAIT",
              content: "Listening for real-time telemetry events on Redis pub/sub broker...",
              level: "info",
            },
          ]);
        }
      };
    } catch {
      // Fallback
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isPaused]);

  // Terminal Auto Scroll
  useEffect(() => {
    if (!isPaused && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isPaused]);

  // Action Handlers
  const handleConfirmAction = async () => {
    if (!modalAction) return;

    try {
      setIsSubmittingAction(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      if (modalAction.type === "block_user") {
        await adminService.toggleBlockUser(modalAction.targetId, true);
        setSuccessMsg(`User '${modalAction.targetName}' has been blocked and session terminated.`);
      } else if (modalAction.type === "unblock_user") {
        await adminService.toggleBlockUser(modalAction.targetId, false);
        setSuccessMsg(`User '${modalAction.targetName}' has been unblocked.`);
      } else if (modalAction.type === "delete_user") {
        await adminService.deleteUser(modalAction.targetId);
        setSuccessMsg(`User '${modalAction.targetName}' deleted successfully.`);
      } else if (modalAction.type === "delete_org") {
        await adminService.deleteOrganization(modalAction.targetId);
        setSuccessMsg(`Organization '${modalAction.targetName}' and all projects deleted.`);
      }

      setModalAction(null);
      await fetchData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || "Failed to complete action.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const totalProjects = organizations.reduce((acc, org) => acc + (org._count?.projects || 0), 0);

  return (
    <div className="w-full h-full flex flex-col space-y-6 overflow-y-auto p-6 font-sans text-foreground bg-background">
      {/* Top Banner / Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 dark:bg-neutral-950/80 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono text-[10px] font-bold tracking-widest uppercase">
                ROOT SUPER_ADMIN
              </span>
              <span className="text-xs font-mono text-neutral-400">Platform Control Plane</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mt-1">
              Global Management Console
            </h1>
          </div>

          <button
            onClick={() => fetchData()}
            disabled={isLoading}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          >
            {isLoading ? "Syncing..." : "Sync Global State"}
          </button>
        </div>

        {/* Global Key Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono pt-4 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-semibold">
              ORGANIZATIONS
            </span>
            <span className="text-2xl font-bold text-white tracking-tight mt-1 block">
              {organizations.length}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-semibold">
              ACTIVE PROJECTS
            </span>
            <span className="text-2xl font-bold text-white tracking-tight mt-1 block">
              {totalProjects}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-semibold">
              TOTAL USERS
            </span>
            <span className="text-2xl font-bold text-white tracking-tight mt-1 block">
              {users.length}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-semibold">
              REDIS BROKER
            </span>
            <span className="text-2xl font-bold text-emerald-400 tracking-tight mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* TERMINAL-STYLE (CLAUDE CODE-LIKE) SYSTEM HEALTH TERMINAL */}
      <section className="rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Header */}
        <div className="px-5 py-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-neutral-400 text-[11px] font-semibold tracking-wide">
              root@upnode-telemetry:~# stream --redis-global-live
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            >
              {isPaused ? "RESUME STREAM" : "PAUSE STREAM"}
            </button>
            <button
              onClick={() => setLogs([])}
              className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            >
              CLEAR BUFFER
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-5 h-64 overflow-y-auto space-y-1.5 bg-neutral-950 text-neutral-300 selection:bg-neutral-800">
          {logs.length === 0 ? (
            <div className="text-neutral-600 italic">
              Initializing Redis pub/sub listener... Waiting for incoming telemetry events.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="leading-relaxed flex items-start gap-2 text-[11px]">
                <span className="text-neutral-600 shrink-0">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                    log.level === "error"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : log.level === "warn"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : log.level === "sys"
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {log.type}
                </span>
                <span className="text-neutral-300 break-all">{log.content}</span>
              </div>
            ))
          )}
          <div ref={terminalEndRef} />
        </div>
      </section>

      {/* MAIN DATA TABLES: ORGANIZATIONS VS USERS */}
      <section className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab("orgs")}
              className={`px-4 py-2 rounded-2xl font-semibold transition-all cursor-pointer ${
                activeTab === "orgs"
                  ? "bg-white text-neutral-950 shadow-md"
                  : "bg-white/5 text-neutral-400 hover:text-white border border-white/10"
              }`}
            >
              All Organizations ({organizations.length})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-2xl font-semibold transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-white text-neutral-950 shadow-md"
                  : "bg-white/5 text-neutral-400 hover:text-white border border-white/10"
              }`}
            >
              All Platform Users ({users.length})
            </button>
          </div>
        </div>

        {/* ORGANIZATIONS TABLE */}
        {activeTab === "orgs" && (
          <div className="rounded-3xl bg-neutral-900/40 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-white/5 border-b border-white/10 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                <tr>
                  <th className="py-4 px-6 font-semibold">Organization Name</th>
                  <th className="py-4 px-6 font-semibold">Slug</th>
                  <th className="py-4 px-6 font-semibold">Active Projects</th>
                  <th className="py-4 px-6 font-semibold">Total Members</th>
                  <th className="py-4 px-6 font-semibold">Created Date</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-medium text-white font-sans">{org.name}</td>
                    <td className="py-4 px-6 font-mono text-neutral-400">{org.slug}</td>
                    <td className="py-4 px-6 font-mono text-white">{org._count?.projects || 0}</td>
                    <td className="py-4 px-6 font-mono text-white">{org._count?.members || 0}</td>
                    <td className="py-4 px-6 font-mono text-neutral-400">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() =>
                          setModalAction({
                            type: "delete_org",
                            targetId: org.id,
                            targetName: org.name,
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono text-[11px] transition-all cursor-pointer"
                      >
                        Delete Org
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS TABLE */}
        {activeTab === "users" && (
          <div className="rounded-3xl bg-neutral-900/40 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-white/5 border-b border-white/10 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                <tr>
                  <th className="py-4 px-6 font-semibold">User</th>
                  <th className="py-4 px-6 font-semibold">Platform Role</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Organizations</th>
                  <th className="py-4 px-6 font-semibold">Joined Date</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-white">{u.name}</div>
                      <div className="text-[11px] font-mono text-neutral-400">{u.email}</div>
                    </td>
                    <td className="py-4 px-6 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                          u.role === "SUPER_ADMIN"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono">
                      {u.isBlocked ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                          BLOCKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-mono text-neutral-400">
                      {u.members && u.members.length > 0
                        ? u.members.map((m) => m.organization.name).join(", ")
                        : "None"}
                    </td>
                    <td className="py-4 px-6 font-mono text-neutral-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {u.role !== "SUPER_ADMIN" && (
                        <>
                          <button
                            onClick={() =>
                              setModalAction({
                                type: u.isBlocked ? "unblock_user" : "block_user",
                                targetId: u.id,
                                targetName: u.name || u.email,
                              })
                            }
                            className={`px-3 py-1.5 rounded-xl font-mono text-[11px] border transition-all cursor-pointer ${
                              u.isBlocked
                                ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
                            }`}
                          >
                            {u.isBlocked ? "Unblock" : "Block User"}
                          </button>
                          <button
                            onClick={() =>
                              setModalAction({
                                type: "delete_user",
                                targetId: u.id,
                                targetName: u.name || u.email,
                              })
                            }
                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono text-[11px] transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CONFIRMATION ACTION MODAL */}
      <AnimatePresence>
        {modalAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-8 rounded-3xl bg-neutral-900/90 border border-white/15 shadow-2xl space-y-6 relative font-sans backdrop-blur-2xl"
            >
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono text-[10px] uppercase font-bold tracking-widest">
                  CONFIRMATION REQUIRED
                </span>
                <h3 className="text-xl font-medium tracking-tight text-white">
                  {modalAction.type === "block_user" && `Block User "${modalAction.targetName}"?`}
                  {modalAction.type === "unblock_user" && `Unblock User "${modalAction.targetName}"?`}
                  {modalAction.type === "delete_user" && `Permanently Delete User "${modalAction.targetName}"?`}
                  {modalAction.type === "delete_org" && `Delete Organization "${modalAction.targetName}"?`}
                </h3>
                <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                  {modalAction.type === "block_user" &&
                    "Blocking this user will immediately terminate all active sessions and forbid access across the platform."}
                  {modalAction.type === "unblock_user" &&
                    "Unblocking this user will restore their ability to sign in and interact with organizations."}
                  {modalAction.type === "delete_user" &&
                    "This action is irreversible. All memberships and account records will be permanently removed."}
                  {modalAction.type === "delete_org" &&
                    "This will permanently delete the organization, all associated projects, ping metrics, and incidents."}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 font-mono text-xs">
                <button
                  onClick={() => setModalAction(null)}
                  disabled={isSubmittingAction}
                  className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={isSubmittingAction}
                  className={`px-5 py-2.5 rounded-2xl text-white font-semibold shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
                    modalAction.type === "unblock_user"
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-rose-600 hover:bg-rose-500"
                  }`}
                >
                  {isSubmittingAction ? "Processing..." : "Confirm Action"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
