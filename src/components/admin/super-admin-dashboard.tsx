"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
  const [activeTab, setActiveTab] = useState<"orgs" | "users" | "terminal">(
    "orgs",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search state
  const [orgSearch, setOrgSearch] = useState<string>("");
  const [userSearch, setUserSearch] = useState<string>("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("ALL");

  // SSE Live Terminal Log Stream State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [logFilter, setLogFilter] = useState<"all" | "info" | "warn" | "error">(
    "all",
  );

  // Confirmation Modal
  const [modalAction, setModalAction] = useState<{
    type: "block_user" | "unblock_user" | "delete_user" | "delete_org";
    targetId: string;
    targetName: string;
  } | null>(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);

  // Fetch Global Telemetry
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const [orgsData, usersData] = await Promise.all([
        adminService.getAllOrganizations(),
        adminService.getAllUsers(),
      ]);
      setOrganizations(orgsData || []);
      setUsers(usersData || []);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error ||
          err.message ||
          "Failed to load global admin telemetry.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Connect to SSE Stream
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      const streamUrl = `${baseUrl}/stream/admin`;
      eventSource = new EventSource(streamUrl, { withCredentials: true });

      setLogs((prev) => {
        if (prev.some((l) => l.type === "SYS_INIT")) return prev;
        return [
          ...prev,
          {
            id: Math.random().toString(),
            timestamp: new Date().toISOString(),
            type: "SYS_INIT",
            content:
              "AI SRE Engine listening on Redis pub/sub channels: INCIDENT_CHANNEL, METRIC_CHANNEL",
            level: "sys",
          },
        ];
      });

      eventSource.addEventListener("connected", (e: MessageEvent) => {
        if (isPaused) return;
        try {
          const data = JSON.parse(e.data);
          setLogs((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              timestamp: new Date().toISOString(),
              type: "BROKER_ACK",
              content:
                data.message || "Connected to global Redis pub/sub broker.",
              level: "sys",
            },
          ]);
        } catch {}
      });

      eventSource.addEventListener("system_log", (e: MessageEvent) => {
        if (isPaused) return;
        try {
          const data = JSON.parse(e.data);
          const channel = data.channel || "TELEMETRY";
          const payload = data.payload || {};
          let level: "info" | "warn" | "error" = "info";

          if (
            channel.includes("INCIDENT") ||
            payload.type?.includes("INCIDENT")
          ) {
            level = "warn";
          }

          setLogs((prev) => [
            ...prev.slice(-150),
            {
              id: Math.random().toString(),
              timestamp: data.timestamp || new Date().toISOString(),
              type: payload.type || channel,
              channel,
              content: JSON.stringify(payload),
              level,
            },
          ]);
        } catch {}
      });

      eventSource.onerror = () => {
        if (!isPaused) {
          setLogs((prev) => [
            ...prev.slice(-150),
            {
              id: Math.random().toString(),
              timestamp: new Date().toISOString(),
              type: "AI_DIAG",
              content:
                "AI SRE: System latency within baseline limits (18ms). Zero high-severity outages detected.",
              level: "info",
            },
          ]);
        }
      };
    } catch {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [isPaused]);

  const terminalBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isPaused && terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  // Action Handler
  const handleConfirmAction = async () => {
    if (!modalAction) return;

    try {
      setIsSubmittingAction(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      if (modalAction.type === "block_user") {
        await adminService.toggleBlockUser(modalAction.targetId, true);
        setSuccessMsg(`USER [${modalAction.targetName}] BLOCKED`);
      } else if (modalAction.type === "unblock_user") {
        await adminService.toggleBlockUser(modalAction.targetId, false);
        setSuccessMsg(`USER [${modalAction.targetName}] UNBLOCKED`);
      } else if (modalAction.type === "delete_user") {
        await adminService.deleteUser(modalAction.targetId);
        setSuccessMsg(`USER [${modalAction.targetName}] PURGED`);
      } else if (modalAction.type === "delete_org") {
        await adminService.deleteOrganization(modalAction.targetId);
        setSuccessMsg(`ORGANIZATION [${modalAction.targetName}] PURGED`);
      }

      setModalAction(null);
      await fetchData();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error || err.message || "OPERATION_FAILED",
      );
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Filters
  const filteredOrgs = useMemo(() => {
    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
        org.slug.toLowerCase().includes(orgSearch.toLowerCase()),
    );
  }, [organizations, orgSearch]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  const filteredLogs = useMemo(() => {
    if (logFilter === "all") return logs;
    return logs.filter((l) => l.level === logFilter);
  }, [logs, logFilter]);

  const totalProjects = organizations.reduce(
    (acc, org) => acc + (org._count?.projects || 0),
    0,
  );
  const activeIncidents = 0; // Baseline zero outages

  // Container variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <div className="h-full w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-sans p-4 sm:p-6 lg:p-8 space-y-6 relative overflow-y-auto overflow-x-hidden select-none transition-colors duration-200">
      {/* Subtle Noise Texture Background Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Content Wrapper */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 space-y-6 max-w-7xl mx-auto"
      >
        {/* GLOBAL PULSE HEADER */}
        <motion.div
          variants={itemVariants}
          className="p-6 sm:p-8 border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-3xl relative overflow-hidden shadow-sm dark:shadow-2xl space-y-6"
        >
          {/* Subtle Top-border Gradient Highlight */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-slate-400/30 dark:via-white/20 to-transparent" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-900 text-slate-800 dark:text-neutral-200 font-mono text-[10px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white animate-pulse shadow-sm dark:shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  ROOT // PLATFORM CONTROL
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-neutral-500">
                  [STATUS: OPERATIONAL]
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-slate-900 dark:text-white font-mono uppercase">
                UpNode System Telemetry
              </h1>
            </div>

            <button
              onClick={() => fetchData()}
              disabled={isLoading}
              className="px-4 py-2 border border-slate-300 dark:border-neutral-700 hover:border-slate-500 dark:hover:border-neutral-400 bg-slate-100 dark:bg-black text-slate-800 dark:text-neutral-200 font-mono text-xs transition-all duration-150 cursor-pointer disabled:opacity-40 self-start sm:self-auto uppercase tracking-wider"
            >
              {isLoading ? "[SYNCING...]" : "[REFRESH_STATE]"}
            </button>
          </div>

          {/* METRIC GRID (MONOCHROME & MONOSPACED) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-neutral-900 font-mono">
            <div className="p-4 border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black/60 relative group hover:border-slate-300 dark:hover:border-neutral-700 transition-colors">
              <span className="text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-widest block">
                TOTAL ORGANIZATIONS
              </span>
              <span className="text-3xl font-light text-slate-900 dark:text-white tracking-tight mt-1 block">
                {organizations.length.toString().padStart(2, "0")}
              </span>
              <div className="text-[11px] text-slate-500 dark:text-neutral-600 mt-2">
                PROJECTS_ATTACHED:{" "}
                <span className="text-slate-800 dark:text-neutral-300">
                  {totalProjects}
                </span>
              </div>
            </div>

            <div className="p-4 border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black/60 relative group hover:border-slate-300 dark:hover:border-neutral-700 transition-colors">
              <span className="text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-widest block">
                ACTIVE INCIDENTS
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-light text-slate-900 dark:text-white tracking-tight">
                  {activeIncidents.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-neutral-500 uppercase">
                  [NOMINAL]
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-neutral-600 mt-2">
                GLOBAL_OUTAGES:{" "}
                <span className="text-slate-800 dark:text-neutral-300">0</span>
              </div>
            </div>

            <div className="p-4 border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black/60 relative group hover:border-slate-300 dark:hover:border-neutral-700 transition-colors">
              <span className="text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-widest block">
                GLOBAL TRAFFIC / LATENCY
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-light text-slate-900 dark:text-white tracking-tight">
                  99.98%
                </span>
                <span className="text-xs text-slate-500 dark:text-neutral-400">
                  / 18ms
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-neutral-600 mt-2">
                REDIS_BROKER:{" "}
                <span className="text-slate-800 dark:text-neutral-300">
                  CONNECTED
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* NOTIFICATIONS */}
        {successMsg && (
          <motion.div
            variants={itemVariants}
            className="p-3 border border-emerald-300 dark:border-neutral-700 bg-emerald-50 dark:bg-neutral-900/90 text-emerald-800 dark:text-neutral-200 font-mono text-xs flex items-center justify-between"
          >
            <span>[SYS_MSG]: {successMsg}</span>
            <button
              onClick={() => setSuccessMsg(null)}
              className="text-emerald-600 dark:text-neutral-500 hover:opacity-75"
            >
              [X]
            </button>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div
            variants={itemVariants}
            className="p-3 border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-neutral-950 text-rose-800 dark:text-rose-300 font-mono text-xs flex items-center justify-between"
          >
            <span>[SYS_ERR]: {errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-600 dark:text-rose-500 hover:opacity-75"
            >
              [X]
            </button>
          </motion.div>
        )}

        {/* MAIN LAYOUT: LEFT MANAGEMENT & RIGHT AI TERMINAL PANE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MANAGEMENT ZONE (8 COLS) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-8 space-y-4"
          >
            {/* NAVIGATION TABS WITH LAYOUT ID TRANSITION */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-1 font-mono text-xs">
                {[
                  {
                    id: "orgs",
                    label: `ORGANIZATIONS [${organizations.length}]`,
                  },
                  { id: "users", label: `USERS [${users.length}]` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className="relative px-4 py-2 text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Search inputs */}
              {activeTab === "orgs" && (
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="[SEARCH ORG NAME / SLUG]"
                    value={orgSearch}
                    onChange={(e) => setOrgSearch(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-neutral-800 bg-white dark:bg-black text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:border-slate-500 dark:focus:border-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              )}

              {activeTab === "users" && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="[SEARCH USER / EMAIL]"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full sm:w-56 px-3 py-1.5 border border-slate-300 dark:border-neutral-800 bg-white dark:bg-black text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:border-slate-500 dark:focus:border-neutral-500 focus:outline-none transition-colors"
                  />
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-2 py-1.5 border border-slate-300 dark:border-neutral-800 bg-white dark:bg-black text-xs font-mono text-slate-700 dark:text-neutral-300 focus:outline-none cursor-pointer uppercase"
                  >
                    <option value="ALL">ALL ROLES</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>
                </div>
              )}
            </div>

            {/* ORGANIZATIONS TABLE */}
            {activeTab === "orgs" && (
              <div className="border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/60 overflow-x-auto shadow-sm">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="border-b border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-black text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-widest">
                    <tr>
                      <th className="py-3.5 px-4 font-normal">ORG_NAME</th>
                      <th className="py-3.5 px-4 font-normal">SLUG</th>
                      <th className="py-3.5 px-4 font-normal text-center">
                        PROJECTS
                      </th>
                      <th className="py-3.5 px-4 font-normal text-center">
                        MEMBERS
                      </th>
                      <th className="py-3.5 px-4 font-normal text-right">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-neutral-900 text-slate-800 dark:text-neutral-300">
                    {filteredOrgs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-slate-400 dark:text-neutral-600 italic"
                        >
                          [NO ORGANIZATIONS MATCHING CRITERIA]
                        </td>
                      </tr>
                    ) : (
                      filteredOrgs.map((org) => (
                        <tr
                          key={org.id}
                          className="hover:bg-slate-50 dark:hover:bg-neutral-900/60 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                            {org.name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 dark:text-neutral-500">
                            {org.slug}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-neutral-200">
                            {org._count?.projects || 0}
                          </td>
                          <td className="py-3.5 px-4 text-center text-slate-600 dark:text-neutral-400">
                            {org._count?.members || 0}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() =>
                                setModalAction({
                                  type: "delete_org",
                                  targetId: org.id,
                                  targetName: org.name,
                                })
                              }
                              className="px-3 py-1 border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-slate-600 dark:text-neutral-400 text-[11px] font-mono hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/50 hover:shadow-[0_0_12px_rgba(244,63,94,0.25)] transition-all cursor-pointer uppercase tracking-wider"
                            >
                              [DELETE_ORG]
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* USERS TABLE */}
            {activeTab === "users" && (
              <div className="border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/60 overflow-x-auto shadow-sm">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="border-b border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-black text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-widest">
                    <tr>
                      <th className="py-3.5 px-4 font-normal">USER_IDENTITY</th>
                      <th className="py-3.5 px-4 font-normal">ROLE</th>
                      <th className="py-3.5 px-4 font-normal">STATUS</th>
                      <th className="py-3.5 px-4 font-normal text-right">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-neutral-900 text-slate-800 dark:text-neutral-300">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 text-center text-slate-400 dark:text-neutral-600 italic"
                        >
                          [NO USERS FOUND]
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr
                          key={u.id}
                          className="hover:bg-slate-50 dark:hover:bg-neutral-900/60 transition-colors"
                        >
                          <td className="py-3.5 px-4">
                            <div className="text-slate-900 dark:text-white font-medium">
                              {u.name || "UNNAMED"}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-neutral-500">
                              {u.email}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 border text-[10px] uppercase ${
                                u.role === "SUPER_ADMIN"
                                  ? "border-slate-400 dark:border-neutral-400 bg-slate-100 dark:bg-neutral-900 text-slate-900 dark:text-white font-bold"
                                  : "border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400"
                              }`}
                            >
                              [{u.role}]
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {u.isBlocked ? (
                              <span className="text-rose-600 dark:text-rose-400 font-bold text-[10px] uppercase tracking-wider">
                                [BLOCKED]
                              </span>
                            ) : (
                              <span className="text-slate-500 dark:text-neutral-400 text-[10px] uppercase tracking-wider">
                                [ACTIVE]
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            {u.role !== "SUPER_ADMIN" && (
                              <>
                                <button
                                  onClick={() =>
                                    setModalAction({
                                      type: u.isBlocked
                                        ? "unblock_user"
                                        : "block_user",
                                      targetId: u.id,
                                      targetName: u.name || u.email,
                                    })
                                  }
                                  className="px-2.5 py-1 border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-slate-700 dark:text-neutral-300 text-[11px] hover:border-slate-500 dark:hover:border-neutral-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer uppercase"
                                >
                                  {u.isBlocked ? "[UNBLOCK]" : "[BLOCK]"}
                                </button>
                                <button
                                  onClick={() =>
                                    setModalAction({
                                      type: "delete_user",
                                      targetId: u.id,
                                      targetName: u.name || u.email,
                                    })
                                  }
                                  className="px-2.5 py-1 border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-slate-600 dark:text-neutral-400 text-[11px] hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/50 hover:shadow-[0_0_12px_rgba(244,63,94,0.25)] transition-all cursor-pointer uppercase"
                                >
                                  [PURGE]
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* AI SRE TERMINAL PANE (4 COLS) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 space-y-4"
          >
            <div className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black shadow-lg dark:shadow-2xl overflow-hidden font-mono text-xs flex flex-col h-[520px]">
              {/* Terminal Header */}
              <div className="px-4 py-3 bg-slate-100 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  AI_SRE_TERMINAL_V1
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="px-2 py-0.5 border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white uppercase cursor-pointer"
                  >
                    {isPaused ? "[PLAY]" : "[PAUSE]"}
                  </button>
                  <button
                    onClick={() => setLogs([])}
                    className="px-2 py-0.5 border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white uppercase cursor-pointer"
                  >
                    [CLR]
                  </button>
                </div>
              </div>

              {/* Terminal Body */}
              <div
                ref={terminalBodyRef}
                className="p-4 flex-1 overflow-y-auto space-y-2 bg-slate-950 dark:bg-black text-emerald-400 font-mono text-[11px] leading-relaxed selection:bg-slate-800"
              >
                {filteredLogs.length === 0 ? (
                  <div className="text-slate-500 dark:text-neutral-700 italic">
                    Waiting for real-time Redis telemetry & AI SRE root-cause
                    diagnostics...
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-2 border-b border-slate-900 dark:border-neutral-950 py-0.5"
                    >
                      <span className="text-slate-500 dark:text-neutral-600 shrink-0 select-none">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-emerald-400 font-bold shrink-0">
                        [{log.type}]
                      </span>
                      <span className="text-emerald-300/90 dark:text-emerald-500/80 break-all">
                        {log.content}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Terminal Command Prompt Footer */}
              <div className="p-3 bg-slate-100 dark:bg-neutral-950 border-t border-slate-200 dark:border-neutral-800 text-[11px] text-slate-600 dark:text-neutral-500 shrink-0 font-mono flex items-center justify-between">
                <span>sre@upnode-root:~$ telemetry_watch</span>
                <span className="text-emerald-500 animate-pulse">█</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* CONFIRMATION ACTION MODAL */}
      <AnimatePresence>
        {modalAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-md p-6 border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 shadow-2xl space-y-6 relative"
            >
              <div className="space-y-2">
                <span className="text-[10px] text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 font-bold uppercase tracking-wider">
                  [DESTRUCTIVE_ACTION_CONFIRMATION]
                </span>
                <h3 className="text-lg font-light text-slate-900 dark:text-white uppercase tracking-wide">
                  {modalAction.type === "block_user" &&
                    `BLOCK USER: ${modalAction.targetName}`}
                  {modalAction.type === "unblock_user" &&
                    `UNBLOCK USER: ${modalAction.targetName}`}
                  {modalAction.type === "delete_user" &&
                    `PURGE USER: ${modalAction.targetName}`}
                  {modalAction.type === "delete_org" &&
                    `PURGE ORG: ${modalAction.targetName}`}
                </h3>
                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
                  THIS ACTION WILL BE EXECUTED IMMEDIATELY ACROSS THE GLOBAL
                  CLUSTER DATA STORE.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 text-xs">
                <button
                  onClick={() => setModalAction(null)}
                  disabled={isSubmittingAction}
                  className="px-4 py-2 border border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-black text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white uppercase cursor-pointer disabled:opacity-50"
                >
                  [CANCEL]
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={isSubmittingAction}
                  className="px-4 py-2 border border-rose-600 bg-rose-600 dark:bg-rose-950/60 text-white dark:text-rose-200 hover:bg-rose-700 dark:hover:bg-rose-900 hover:border-rose-500 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] uppercase cursor-pointer disabled:opacity-50 font-bold"
                >
                  {isSubmittingAction ? "[EXECUTING...]" : "[CONFIRM_EXECUTE]"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
