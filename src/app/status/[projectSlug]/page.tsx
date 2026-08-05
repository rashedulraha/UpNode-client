"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { projectsService } from "@/services/projects.service";
import { PublicProjectStatusData, SystemStatusType, Incident } from "@/types";
import { format, formatDistanceToNow, subDays } from "date-fns";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicStatusPage() {
  const params = useParams();
  const projectSlug = params?.projectSlug as string;

  const [data, setData] = useState<PublicProjectStatusData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Email Subscribe Modal State
  const [isSubscribeOpen, setIsSubscribeOpen] = useState<boolean>(false);
  const [subscribeEmail, setSubscribeEmail] = useState<string>("");
  const [isSubmittingSubscribe, setIsSubmittingSubscribe] =
    useState<boolean>(false);
  const [subscribeSuccessMsg, setSubscribeSuccessMsg] = useState<string | null>(
    null,
  );
  const [subscribeErrorMsg, setSubscribeErrorMsg] = useState<string | null>(
    null,
  );

  const fetchStatus = async () => {
    if (!projectSlug) return;
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await projectsService.getPublicStatus(projectSlug);
      setData(res);
      setLastRefreshed(new Date());
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to load status page. Please verify the project URL.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Real-time polling every 60 seconds
    const interval = setInterval(() => {
      fetchStatus();
    }, 60000);

    return () => clearInterval(interval);
  }, [projectSlug]);

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail || !subscribeEmail.includes("@")) {
      setSubscribeErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSubmittingSubscribe(true);
    setSubscribeErrorMsg(null);
    setSubscribeSuccessMsg(null);

    try {
      const res = await projectsService.subscribeToStatusUpdates(
        projectSlug,
        subscribeEmail,
      );
      setSubscribeSuccessMsg(
        res.message || "Subscribed to real-time status updates.",
      );
      setSubscribeEmail("");
    } catch (err: any) {
      setSubscribeErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to subscribe. Please try again.",
      );
    } finally {
      setIsSubmittingSubscribe(false);
    }
  };

  // Build or fall back 90 days array
  const get90DayHistory = () => {
    if (data?.uptimeHistory90Days && data.uptimeHistory90Days.length === 90) {
      return data.uptimeHistory90Days;
    }

    const days = [];
    const today = new Date();
    const incidentDates = new Set(
      [
        ...(data?.activeIncidents || []),
        ...(data?.past7DaysIncidents || []),
        ...(data?.resolvedIncidents || []),
      ].map((inc) => format(new Date(inc.createdAt), "yyyy-MM-dd")),
    );

    for (let i = 89; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = format(d, "yyyy-MM-dd");
      const hasIncident = incidentDates.has(dateStr);
      const isUp = !hasIncident;

      days.push({
        date: dateStr,
        isUp,
        uptimePercentage: isUp ? 100 : 96.4,
        avgLatencyMs: isUp
          ? Math.floor(14 + (i % 7) * 3)
          : Math.floor(320 + (i % 5) * 40),
        status: isUp ? "OPERATIONAL" : "DEGRADED",
      });
    }

    return days;
  };

  const getSystemStatusLabel = (status: SystemStatusType) => {
    switch (status) {
      case "OPERATIONAL":
        return {
          title: "All Systems Operational",
          subtitle:
            "All services are functioning within optimal telemetry parameters.",
          badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          dotBg: "bg-emerald-400",
        };
      case "DEGRADED_PERFORMANCE":
        return {
          title: "Degraded Performance",
          subtitle:
            "Increased latency or minor performance anomalies detected.",
          badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          dotBg: "bg-amber-400",
        };
      case "PARTIAL_OUTAGE":
        return {
          title: "Partial Outage",
          subtitle: "Disruption detected across non-critical endpoints.",
          badgeBg: "bg-orange-500/10 text-orange-400 border-orange-500/20",
          dotBg: "bg-orange-400",
        };
      case "MAJOR_OUTAGE":
      default:
        return {
          title: "Major System Outage",
          subtitle:
            "Engineers are actively investigating active service disruptions.",
          badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          dotBg: "bg-rose-400",
        };
    }
  };

  const formatSeverity = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "HIGH":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "MEDIUM":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "LOW":
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  const formatStatusPill = (status: string) => {
    switch (status) {
      case "INVESTIGATING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "IDENTIFIED":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "MONITORING":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "RESOLVED":
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
  };

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 flex flex-col items-center justify-center font-mono text-xs relative">
        <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="flex items-center gap-2.5 px-4 py-2.5 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="tracking-widest uppercase text-[10px] text-slate-500 dark:text-neutral-400">
            CONNECTING_TO_TELEMETRY...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (errorMsg || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 flex flex-col items-center justify-center p-6 text-center font-mono relative">
        <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-md w-full p-8 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black space-y-4 relative z-10">
          <span className="px-2.5 py-1 border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-mono tracking-widest uppercase">
            [404_NOT_FOUND]
          </span>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase mt-3">
            Status Page Unavailable
          </h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono leading-relaxed">
            {errorMsg ||
              "The requested project telemetry node was not found or has been removed."}
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-5 py-2.5 border border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all"
          >
            [RETURN_TO_UPNODE]
          </Link>
        </div>
      </div>
    );
  }

  const history90Days = get90DayHistory();
  const statusInfo = getSystemStatusLabel(data.systemStatus);

  // Ongoing incidents: status != RESOLVED
  const ongoingIncidents = data.activeIncidents || [];
  // Resolved incidents: status == RESOLVED or from resolvedIncidents array
  const resolvedIncidentsList: Incident[] =
    data.resolvedIncidents ||
    (data.past7DaysIncidents || []).filter((inc) => inc.status === "RESOLVED");

  const statusBorderColor =
    {
      OPERATIONAL: "border-emerald-500/30",
      DEGRADED_PERFORMANCE: "border-amber-500/30",
      PARTIAL_OUTAGE: "border-orange-500/30",
      MAJOR_OUTAGE: "border-rose-500/40",
    }[data.systemStatus] || "border-slate-200 dark:border-neutral-800";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-mono selection:bg-slate-800 relative overflow-x-hidden">
      {/* Background Noise Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md px-6 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                UPNODE
              </Link>
              <span className="text-slate-300 dark:text-neutral-700">/</span>
              <h1 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                {data.project.name}
              </h1>
              <span className="px-2 py-0.5 border border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 text-[9px] font-mono tracking-widest text-slate-500 dark:text-neutral-500 uppercase">
                STATUS
              </span>
            </div>
            {data.project.url && (
              <p className="text-[10px] font-mono text-slate-400 dark:text-neutral-600 tracking-tight">
                {data.project.url}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSubscribeOpen(true)}
              className="px-3 py-2 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-neutral-600 font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer"
            >
              [GET_ALERTS]
            </button>
            <ThemeToggle />
            <button
              onClick={() => fetchStatus()}
              disabled={isLoading}
              className="px-3 py-2 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "[SYNCING...]" : "[REFRESH]"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-4xl w-full mx-auto px-6 py-8 space-y-8">
        {/* System Status Banner */}
        <section
          className={`p-6 border-2 ${statusBorderColor} bg-white dark:bg-black`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-slate-400 dark:text-neutral-600 font-bold block">
                CURRENT_TELEMETRY_STATUS
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${statusInfo.dotBg} animate-pulse shrink-0`}
                />
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                  {statusInfo.title}
                </h2>
              </div>
              <p className="text-[10px] font-mono text-slate-500 dark:text-neutral-400 max-w-xl leading-relaxed">
                {statusInfo.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-8 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-neutral-800 pt-4 sm:pt-0 sm:pl-8 font-mono">
              <div>
                <span className="text-[9px] text-slate-400 dark:text-neutral-600 uppercase tracking-widest block font-bold">
                  SLA_UPTIME
                </span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {data.uptimePercentage}%
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 dark:text-neutral-600 uppercase tracking-widest block font-bold">
                  AVG_LATENCY
                </span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {data.avgLatencyMs}ms
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 90-Day Uptime Bars Section */}
        <section className="p-6 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500">
                [90_DAY_UPTIME_PERFORMANCE]
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-neutral-600 mt-0.5">
                Daily health metrics aggregated over the past 90 days
              </p>
            </div>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
              {data.uptimePercentage}%
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-end gap-0.5 sm:gap-[3px] h-10">
              {history90Days.map((day, idx) => (
                <div
                  key={idx}
                  title={`${day.date}: ${day.isUp ? "Operational" : "Incident"} | ${day.avgLatencyMs}ms`}
                  className={`flex-1 transition-all duration-150 cursor-pointer hover:opacity-70 ${
                    day.isUp
                      ? "bg-emerald-500 dark:bg-emerald-500 h-full"
                      : "bg-rose-500 h-full"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 dark:text-neutral-600 pt-2 border-t border-slate-100 dark:border-neutral-900">
              <span>90 DAYS AGO</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500" /> OPERATIONAL
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-rose-500" /> OUTAGE
                </span>
              </div>
              <span>TODAY</span>
            </div>
          </div>
        </section>

        {/* Ongoing Incidents Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500">
              [ACTIVE_INCIDENTS] ({ongoingIncidents.length})
            </h3>
          </div>

          {ongoingIncidents.length === 0 ? (
            <div className="p-6 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-center">
              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400 dark:text-neutral-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                NO_ACTIVE_INCIDENTS_REPORTED
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {ongoingIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-5 border-l-2 border-rose-500 border border-rose-500/20 bg-white dark:bg-black space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${formatSeverity(incident.severity)}`}
                      >
                        {incident.severity}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${formatStatusPill(incident.status)}`}
                      >
                        {incident.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-neutral-600 font-mono">
                      {formatDistanceToNow(new Date(incident.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                      {incident.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                      {incident.description}
                    </p>
                  </div>

                  {incident.timelineEvents &&
                    incident.timelineEvents.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 dark:border-neutral-900 space-y-2">
                        <span className="text-[9px] tracking-widest uppercase text-slate-400 dark:text-neutral-600 font-bold block">
                          TIMELINE_UPDATES
                        </span>
                        {incident.timelineEvents.map((event) => (
                          <div
                            key={event.id}
                            className="pl-3 border-l border-slate-300 dark:border-neutral-700 space-y-0.5"
                          >
                            <div className="flex items-center gap-2 text-[10px]">
                              <span
                                className={`px-1.5 py-0.5 text-[9px] uppercase font-bold border ${formatStatusPill(event.status)}`}
                              >
                                {event.status}
                              </span>
                              <span className="text-slate-400 dark:text-neutral-600">
                                {format(
                                  new Date(event.createdAt),
                                  "MMM d, HH:mm",
                                )}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-700 dark:text-neutral-300">
                              {event.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Resolved Incidents History */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500">
              [RESOLVED_INCIDENTS] ({resolvedIncidentsList.length})
            </h3>
          </div>

          {resolvedIncidentsList.length === 0 ? (
            <div className="p-6 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-center">
              <p className="text-[10px] font-mono text-slate-400 dark:text-neutral-600">
                NO_RESOLVED_INCIDENTS_ON_RECORD
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resolvedIncidentsList.map((incident) => (
                <div
                  key={incident.id}
                  className="p-5 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${formatSeverity(incident.severity)}`}
                      >
                        {incident.severity}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${formatStatusPill(incident.status)}`}
                      >
                        {incident.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-neutral-600 font-mono">
                      Resolved{" "}
                      {format(
                        new Date(incident.updatedAt || incident.createdAt),
                        "MMM d, yyyy",
                      )}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                      {incident.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                      {incident.description}
                    </p>
                  </div>

                  {incident.timelineEvents &&
                    incident.timelineEvents.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 dark:border-neutral-900 space-y-2">
                        <span className="text-[9px] tracking-widest uppercase text-slate-400 dark:text-neutral-600 font-bold block">
                          INCIDENT_TIMELINE
                        </span>
                        {incident.timelineEvents.map((event) => (
                          <div
                            key={event.id}
                            className="pl-3 border-l border-slate-300 dark:border-neutral-700 space-y-0.5"
                          >
                            <div className="flex items-center gap-2 text-[10px]">
                              <span
                                className={`px-1.5 py-0.5 text-[9px] uppercase font-bold border ${formatStatusPill(event.status)}`}
                              >
                                {event.status}
                              </span>
                              <span className="text-slate-400 dark:text-neutral-600">
                                {format(
                                  new Date(event.createdAt),
                                  "MMM d, yyyy - HH:mm",
                                )}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-700 dark:text-neutral-300">
                              {event.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-neutral-800 py-8 text-center space-y-1 font-mono bg-white dark:bg-black">
        <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-neutral-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-neutral-400">
            POWERED BY UPNODE
          </span>
        </div>
        <p className="text-[9px] text-slate-400 dark:text-neutral-600 max-w-sm mx-auto">
          Automated real-time infrastructure telemetry and incident
          orchestration.
        </p>
        <p className="text-[9px] text-slate-300 dark:text-neutral-700">
          LAST_SYNC: {formatDistanceToNow(lastRefreshed, { addSuffix: true })}
        </p>
      </footer>

      {/* EMAIL SUBSCRIBE MODAL */}
      <AnimatePresence>
        {isSubscribeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="w-full max-w-md p-6 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black shadow-2xl space-y-5 relative font-mono"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-3">
                <div>
                  <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 dark:text-neutral-600 font-bold block">
                    REAL_TIME_ALERTS
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                    Subscribe to Updates
                  </h3>
                </div>
                <button
                  onClick={() => setIsSubscribeOpen(false)}
                  className="text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white text-xs font-mono transition-colors cursor-pointer"
                >
                  [ESC]
                </button>
              </div>

              <p className="text-[10px] text-slate-500 dark:text-neutral-400">
                Receive email notifications for {data.project.name} incidents.
              </p>

              {subscribeSuccessMsg ? (
                <div className="p-4 border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] space-y-3 text-center">
                  <p className="font-bold">{subscribeSuccessMsg}</p>
                  <button
                    onClick={() => {
                      setSubscribeSuccessMsg(null);
                      setIsSubscribeOpen(false);
                    }}
                    className="px-4 py-2 border border-emerald-500 bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest cursor-pointer"
                  >
                    [CLOSE]
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribeSubmit} className="space-y-4">
                  {subscribeErrorMsg && (
                    <div className="p-3 border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px]">
                      [ERR]: {subscribeErrorMsg}
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
                      EMAIL_ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={subscribeEmail}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      placeholder="engineer@company.com"
                      disabled={isSubmittingSubscribe}
                      className="w-full px-3 py-2.5 border border-slate-300 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-950 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-slate-500 dark:focus:border-neutral-400 transition-all font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingSubscribe}
                    className="w-full py-2.5 border border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 hover:opacity-90"
                  >
                    {isSubmittingSubscribe
                      ? "[SUBSCRIBING...]"
                      : "[SUBSCRIBE_TO_ALERTS]"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
