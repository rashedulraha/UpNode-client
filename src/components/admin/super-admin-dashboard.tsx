"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { adminService } from "@/services/admin.service";
import { AdminOrganization, AdminUser } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Server,
  Users,
  Building2,
  Activity,
  RefreshCw,
  Search,
  Pause,
  Play,
  Trash2,
  UserX,
  UserCheck,
  Filter,
  Terminal as TerminalIcon,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"overview" | "orgs" | "users">("overview");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search and Filters
  const [orgSearch, setOrgSearch] = useState<string>("");
  const [userSearch, setUserSearch] = useState<string>("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("ALL");
  const [userStatusFilter, setUserStatusFilter] = useState<string>("ALL");

  // Terminal Live Log Stream State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [logFilter, setLogFilter] = useState<"all" | "info" | "warn" | "error" | "sys">("all");
  const [isTerminalExpanded, setIsTerminalExpanded] = useState<boolean>(true);
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
      setOrganizations(orgsData || []);
      setUsers(usersData || []);
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

      setLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          timestamp: new Date().toISOString(),
          type: "BOOT",
          content: "System Health Telemetry Terminal initialized. Subscribed to Redis channels: INCIDENT_CHANNEL, METRIC_CHANNEL",
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
            ...prev.slice(-150), // Keep last 150 log lines
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
            ...prev.slice(-150),
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
    if (!isPaused && terminalEndRef.current && isTerminalExpanded) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isPaused, isTerminalExpanded]);

  // Action Handlers
  const handleConfirmAction = async () => {
    if (!modalAction) return;

    try {
      setIsSubmittingAction(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      if (modalAction.type === "block_user") {
        await adminService.toggleBlockUser(modalAction.targetId, true);
        setSuccessMsg(`User '${modalAction.targetName}' has been blocked.`);
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

  // Filtered Organizations
  const filteredOrgs = useMemo(() => {
    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
        org.slug.toLowerCase().includes(orgSearch.toLowerCase())
    );
  }, [organizations, orgSearch]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
      const matchesStatus =
        userStatusFilter === "ALL" ||
        (userStatusFilter === "BLOCKED" && u.isBlocked) ||
        (userStatusFilter === "ACTIVE" && !u.isBlocked);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, userSearch, userRoleFilter, userStatusFilter]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    if (logFilter === "all") return logs;
    return logs.filter((l) => l.level === logFilter);
  }, [logs, logFilter]);

  const totalProjects = organizations.reduce((acc, org) => acc + (org._count?.projects || 0), 0);
  const blockedUsersCount = users.filter((u) => u.isBlocked).length;
  const superAdminCount = users.filter((u) => u.role === "SUPER_ADMIN").length;

  return (
    <div className="w-full h-full flex flex-col space-y-6 overflow-y-auto p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
      {/* Top Banner / Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-2xl shadow-xl dark:shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> ROOT SUPER_ADMIN
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Platform Control Plane
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mt-2">
              Global Management Console
            </h1>
          </div>

          <button
            onClick={() => fetchData()}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Syncing..." : "Sync Global State"}
          </button>
        </div>

        {/* Global Key Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-[10px] uppercase tracking-widest font-semibold">ORGANIZATIONS</span>
              <Building2 className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight block">
              {organizations.length}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-[10px] uppercase tracking-widest font-semibold">ACTIVE PROJECTS</span>
              <Server className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight block">
              {totalProjects}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-[10px] uppercase tracking-widest font-semibold">PLATFORM USERS</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {users.length}
              </span>
              {blockedUsersCount > 0 && (
                <span className="text-[10px] text-rose-500 font-medium">({blockedUsersCount} Blocked)</span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-[10px] uppercase tracking-widest font-semibold">REDIS STREAM</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 font-mono text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 dark:text-emerald-400 hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 font-mono text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-600 dark:text-rose-400 hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* TERMINAL-STYLE SYSTEM HEALTH TELEMETRY STREAM */}
      <section className="rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Header */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            </div>
            <span className="text-slate-400 text-[11px] font-semibold tracking-wide flex items-center gap-2">
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              root@upnode-telemetry:~# stream --redis-global-live
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            {/* Filter Buttons */}
            <div className="hidden sm:flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/50">
              {(["all", "info", "warn", "error"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setLogFilter(level)}
                  className={`px-2 py-0.5 rounded uppercase text-[10px] font-bold transition-all cursor-pointer ${
                    logFilter === level
                      ? "bg-slate-700 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
              {isPaused ? "RESUME" : "PAUSE"}
            </button>

            <button
              onClick={() => setLogs([])}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3 h-3 text-rose-400" />
              CLEAR
            </button>

            <button
              onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {isTerminalExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        {isTerminalExpanded && (
          <div className="p-4 sm:p-5 h-64 overflow-y-auto space-y-2 bg-slate-950/80 text-slate-300 selection:bg-slate-800 font-mono">
            {filteredLogs.length === 0 ? (
              <div className="text-slate-500 italic py-4 text-center">
                Listening for real-time telemetry events on Redis pub/sub broker...
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="leading-relaxed flex items-start gap-2.5 text-[11px] hover:bg-slate-900/60 p-1 rounded transition-colors">
                  <span className="text-slate-500 shrink-0 select-none">
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
                  <span className="text-slate-300 break-all">{log.content}</span>
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        )}
      </section>

      {/* MAIN DATA TABLES: ORGANIZATIONS VS USERS */}
      <section className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-700/50"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("orgs")}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === "orgs"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-700/50"
              }`}
            >
              Organizations ({organizations.length})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-700/50"
              }`}
            >
              Platform Users ({users.length})
            </button>
          </div>

          {/* Search bar inside active tab */}
          {activeTab === "orgs" && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
              />
            </div>
          )}

          {activeTab === "users" && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none transition-all cursor-pointer font-mono"
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="VIEWER">VIEWER</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none transition-all cursor-pointer font-mono"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>
          )}
        </div>

        {/* OVERVIEW TAB CONTENT */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Organizations Summary */}
            <div className="rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  Recent Organizations
                </h3>
                <button
                  onClick={() => setActiveTab("orgs")}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-mono hover:underline cursor-pointer"
                >
                  View All ({organizations.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {organizations.slice(0, 5).map((org) => (
                  <div
                    key={org.id}
                    className="p-3.5 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/40 flex items-center justify-between font-mono text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white font-sans">{org.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{org.slug}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px]">
                        {org._count?.projects || 0} Projects
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users Summary */}
            <div className="rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Platform Users Overview
                </h3>
                <button
                  onClick={() => setActiveTab("users")}
                  className="text-xs text-blue-600 dark:text-blue-400 font-mono hover:underline cursor-pointer"
                >
                  View All ({users.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {users.slice(0, 5).map((u) => (
                  <div
                    key={u.id}
                    className="p-3.5 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        {u.name || "Unnamed User"}
                        {u.role === "SUPER_ADMIN" && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[9px] font-bold">
                            ROOT
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{u.email}</div>
                    </div>
                    <div>
                      {u.isBlocked ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-bold text-[10px]">
                          BLOCKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px]">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORGANIZATIONS TABLE */}
        {activeTab === "orgs" && (
          <div className="rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-slate-100/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800/80 font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="py-4 px-6 font-semibold">Organization Name</th>
                  <th className="py-4 px-6 font-semibold">Slug</th>
                  <th className="py-4 px-6 font-semibold">Active Projects</th>
                  <th className="py-4 px-6 font-semibold">Total Members</th>
                  <th className="py-4 px-6 font-semibold">Created Date</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                {filteredOrgs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                      No organizations found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrgs.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900 dark:text-white font-sans">
                        {org.name}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-400">{org.slug}</td>
                      <td className="py-4 px-6 font-mono font-semibold text-slate-900 dark:text-white">
                        {org._count?.projects || 0}
                      </td>
                      <td className="py-4 px-6 font-mono font-semibold text-slate-900 dark:text-white">
                        {org._count?.members || 0}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-400">
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
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Org
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
          <div className="rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-slate-100/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800/80 font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="py-4 px-6 font-semibold">User</th>
                  <th className="py-4 px-6 font-semibold">Platform Role</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Organizations</th>
                  <th className="py-4 px-6 font-semibold">Joined Date</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                      No users found matching search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 dark:text-white">{u.name || "Unnamed User"}</div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{u.email}</div>
                      </td>
                      <td className="py-4 px-6 font-mono">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                            u.role === "SUPER_ADMIN"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono">
                        {u.isBlocked ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                            BLOCKED
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-400">
                        {u.members && u.members.length > 0
                          ? u.members.map((m) => m.organization.name).join(", ")
                          : "None"}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {u.role !== "SUPER_ADMIN" && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                setModalAction({
                                  type: u.isBlocked ? "unblock_user" : "block_user",
                                  targetId: u.id,
                                  targetName: u.name || u.email,
                                })
                              }
                              className={`px-3 py-1.5 rounded-xl font-mono text-[11px] border transition-all cursor-pointer flex items-center gap-1 ${
                                u.isBlocked
                                  ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              }`}
                            >
                              {u.isBlocked ? (
                                <>
                                  <UserCheck className="w-3.5 h-3.5" /> Unblock
                                </>
                              ) : (
                                <>
                                  <UserX className="w-3.5 h-3.5" /> Block
                                </>
                              )}
                            </button>
                            <button
                              onClick={() =>
                                setModalAction({
                                  type: "delete_user",
                                  targetId: u.id,
                                  targetName: u.name || u.email,
                                })
                              }
                              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CONFIRMATION ACTION MODAL */}
      <AnimatePresence>
        {modalAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative font-sans backdrop-blur-2xl"
            >
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono text-[10px] uppercase font-bold tracking-wider">
                  CONFIRMATION REQUIRED
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {modalAction.type === "block_user" && `Block User "${modalAction.targetName}"?`}
                  {modalAction.type === "unblock_user" && `Unblock User "${modalAction.targetName}"?`}
                  {modalAction.type === "delete_user" && `Permanently Delete User "${modalAction.targetName}"?`}
                  {modalAction.type === "delete_org" && `Delete Organization "${modalAction.targetName}"?`}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono leading-relaxed">
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
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={isSubmittingAction}
                  className={`px-5 py-2.5 rounded-xl text-white font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50 ${
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
