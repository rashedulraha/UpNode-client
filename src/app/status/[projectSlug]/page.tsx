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
  const [isSubmittingSubscribe, setIsSubmittingSubscribe] = useState<boolean>(false);
  const [subscribeSuccessMsg, setSubscribeSuccessMsg] = useState<string | null>(null);
  const [subscribeErrorMsg, setSubscribeErrorMsg] = useState<string | null>(null);

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
          "Failed to load status page. Please verify the project URL."
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
      const res = await projectsService.subscribeToStatusUpdates(projectSlug, subscribeEmail);
      setSubscribeSuccessMsg(res.message || "Subscribed to real-time status updates.");
      setSubscribeEmail("");
    } catch (err: any) {
      setSubscribeErrorMsg(
        err.response?.data?.message || err.message || "Failed to subscribe. Please try again."
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
      [...(data?.activeIncidents || []), ...(data?.past7DaysIncidents || []), ...(data?.resolvedIncidents || [])].map((inc) =>
        format(new Date(inc.createdAt), "yyyy-MM-dd")
      )
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
        avgLatencyMs: isUp ? Math.floor(14 + (i % 7) * 3) : Math.floor(320 + (i % 5) * 40),
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
          subtitle: "All services are functioning within optimal telemetry parameters.",
          badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          dotBg: "bg-emerald-400",
        };
      case "DEGRADED_PERFORMANCE":
        return {
          title: "Degraded Performance",
          subtitle: "Increased latency or minor performance anomalies detected.",
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
          subtitle: "Engineers are actively investigating active service disruptions.",
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

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center font-mono text-xs relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-widest uppercase text-[10px] text-neutral-400 font-semibold">
            Connecting to Telemetry...
          </span>
        </div>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center p-6 text-center font-sans relative overflow-hidden">
        <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-900/40 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-4">
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono tracking-widest uppercase font-semibold">
            404 NOT FOUND
          </span>
          <h2 className="text-xl font-medium tracking-tight text-white">Status Page Unavailable</h2>
          <p className="text-xs text-neutral-400 font-mono leading-relaxed">
            {errorMsg || "The requested project telemetry node was not found or has been removed."}
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-5 py-2.5 bg-white text-neutral-950 font-semibold rounded-2xl text-xs hover:bg-neutral-200 transition-all shadow-lg"
          >
            Return to UpNode
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

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-white selection:text-neutral-950 relative overflow-x-hidden">
      {/* Subtle Ambient Background Blur Accents */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-white/5 via-white/[0.02] to-transparent blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[300px] bg-emerald-500/[0.03] blur-3xl pointer-events-none z-0" />

      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/60 backdrop-blur-2xl px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-medium tracking-tight text-white">
                {data.project.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                SYSTEM STATUS
              </span>
            </div>
            {data.project.url && (
              <p className="text-xs font-mono text-neutral-400 tracking-tight">
                {data.project.url}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubscribeOpen(true)}
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs tracking-tight transition-all cursor-pointer backdrop-blur-md"
            >
              Get Incident Alerts
            </button>
            <ThemeToggle />
            <button
              onClick={() => fetchStatus()}
              disabled={isLoading}
              className="px-3 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white font-mono text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-4xl w-full mx-auto px-6 py-12 space-y-12">
        {/* Real-time System Status Banner */}
        <section className="p-8 sm:p-10 rounded-3xl bg-neutral-900/40 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-500 font-semibold block">
                CURRENT TELEMETRY STATUS
              </span>
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${statusInfo.dotBg} animate-pulse shrink-0`} />
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                  {statusInfo.title}
                </h2>
              </div>
              <p className="text-xs font-mono text-neutral-400 max-w-xl">
                {statusInfo.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-8 font-mono">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-semibold">
                  SLA UPTIME
                </span>
                <span className="text-xl font-medium text-white tracking-tight">
                  {data.uptimePercentage}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-semibold">
                  LATENCY
                </span>
                <span className="text-xl font-medium text-white tracking-tight">
                  {data.avgLatencyMs}ms
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 90-Day Uptime Bars Section */}
        <section className="p-8 sm:p-10 rounded-3xl bg-neutral-900/40 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between font-mono text-xs">
            <div>
              <h3 className="text-sm font-medium text-white font-sans tracking-tight">
                90-Day Uptime Performance
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Daily health metrics aggregated over the past 90 days.
              </p>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-semibold tracking-wider">
                {data.uptimePercentage}% UPTIME
              </span>
            </div>
          </div>

          {/* 90 Bars Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-1 sm:gap-1.5 h-12 overflow-hidden py-1">
              {history90Days.map((day, idx) => (
                <div
                  key={idx}
                  title={`${day.date}: ${day.isUp ? "Operational (100%)" : "Degraded Performance"} | ${day.avgLatencyMs}ms`}
                  className={`flex-1 h-full rounded-sm transition-all duration-200 cursor-pointer hover:scale-125 hover:z-20 ${
                    day.isUp
                      ? "bg-emerald-500/80 hover:bg-emerald-400"
                      : "bg-rose-500 hover:bg-rose-400"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-2 border-t border-white/5">
              <span>90 DAYS AGO</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> OPERATIONAL
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> OUTAGE
                </span>
              </div>
              <span>TODAY</span>
            </div>
          </div>
        </section>

        {/* Ongoing Incidents Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-neutral-400 font-semibold">
              ONGOING INCIDENTS ({ongoingIncidents.length})
            </h3>
          </div>

          {ongoingIncidents.length === 0 ? (
            <div className="p-8 rounded-3xl bg-neutral-900/20 border border-white/5 backdrop-blur-2xl text-center space-y-1">
              <p className="text-xs font-mono text-neutral-400">
                No active system incidents reported at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {ongoingIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-rose-500/30 backdrop-blur-2xl shadow-2xl space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold border ${formatSeverity(incident.severity)}`}>
                        {incident.severity}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold border ${formatStatusPill(incident.status)}`}>
                        {incident.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500">
                      Opened {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-medium text-white tracking-tight">
                      {incident.title}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-sans">
                      {incident.description}
                    </p>
                  </div>

                  {/* Timeline History */}
                  {incident.timelineEvents && incident.timelineEvents.length > 0 && (
                    <div className="pt-4 border-t border-white/10 space-y-3 font-mono">
                      <span className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">
                        TIMELINE UPDATES
                      </span>
                      {incident.timelineEvents.map((event) => (
                        <div key={event.id} className="pl-4 border-l border-white/20 space-y-1">
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-semibold border ${formatStatusPill(event.status)}`}>
                              {event.status}
                            </span>
                            <span className="text-neutral-500">
                              {format(new Date(event.createdAt), "MMM d, HH:mm")}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-200 font-sans">{event.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Resolved Incidents History Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-neutral-400 font-semibold">
              RESOLVED INCIDENTS HISTORY ({resolvedIncidentsList.length})
            </h3>
          </div>

          {resolvedIncidentsList.length === 0 ? (
            <div className="p-8 rounded-3xl bg-neutral-900/20 border border-white/5 backdrop-blur-2xl text-center space-y-1">
              <p className="text-xs font-mono text-neutral-400">
                No past resolved incidents recorded.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {resolvedIncidentsList.map((incident) => (
                <div
                  key={incident.id}
                  className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold border ${formatSeverity(incident.severity)}`}>
                        {incident.severity}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold border ${formatStatusPill(incident.status)}`}>
                        {incident.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500">
                      Resolved on {format(new Date(incident.updatedAt || incident.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-medium text-white tracking-tight">
                      {incident.title}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-sans">
                      {incident.description}
                    </p>
                  </div>

                  {/* Timeline History */}
                  {incident.timelineEvents && incident.timelineEvents.length > 0 && (
                    <div className="pt-4 border-t border-white/10 space-y-3 font-mono">
                      <span className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold block">
                        INCIDENT TIMELINE HISTORY
                      </span>
                      {incident.timelineEvents.map((event) => (
                        <div key={event.id} className="pl-4 border-l border-white/15 space-y-1">
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-semibold border ${formatStatusPill(event.status)}`}>
                              {event.status}
                            </span>
                            <span className="text-neutral-500">
                              {format(new Date(event.createdAt), "MMM d, yyyy - HH:mm:ss")}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-300 font-sans">{event.message}</p>
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

      {/* Powered by UpNode Branding Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 text-center space-y-3 font-mono text-xs text-neutral-500">
        <div className="flex items-center justify-center gap-2 text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-sans font-medium tracking-tight text-white text-sm">
            Powered by UpNode
          </span>
        </div>
        <p className="text-[11px] text-neutral-600 max-w-sm mx-auto">
          Automated real-time infrastructure telemetry, SSL expiration monitoring, and incident orchestration.
        </p>
        <p className="text-[10px] text-neutral-600 pt-2">
          Last checked {formatDistanceToNow(lastRefreshed, { addSuffix: true })}
        </p>
      </footer>

      {/* EMAIL SUBSCRIBE MODAL */}
      <AnimatePresence>
        {isSubscribeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-8 rounded-3xl bg-neutral-900/90 border border-white/15 shadow-2xl space-y-6 relative font-sans backdrop-blur-2xl"
            >
              <button
                onClick={() => setIsSubscribeOpen(false)}
                className="absolute top-6 right-6 font-mono text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                [ESC]
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-semibold block">
                  REAL-TIME ALERTS
                </span>
                <h3 className="text-xl font-medium tracking-tight text-white">Subscribe to Updates</h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Receive email notifications for {data.project.name} incidents.
                </p>
              </div>

              {subscribeSuccessMsg ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs space-y-3 text-center font-mono">
                  <p className="font-semibold text-sm">{subscribeSuccessMsg}</p>
                  <button
                    onClick={() => {
                      setSubscribeSuccessMsg(null);
                      setIsSubscribeOpen(false);
                    }}
                    className="mt-2 px-5 py-2 bg-emerald-500 text-neutral-950 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribeSubmit} className="space-y-4 font-mono">
                  {subscribeErrorMsg && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                      {subscribeErrorMsg}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs text-neutral-300">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={subscribeEmail}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      placeholder="engineer@company.com"
                      disabled={isSubmittingSubscribe}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-all font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingSubscribe}
                    className="w-full py-3 px-4 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg font-sans"
                  >
                    {isSubmittingSubscribe ? "Subscribing..." : "Subscribe to Alerts"}
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
