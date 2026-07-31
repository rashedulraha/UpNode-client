"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { projectsService } from "@/services/projects.service";
import { PublicProjectStatusData, SystemStatusType } from "@/types";
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Activity,
  Globe,
  Clock,
  RefreshCw,
  Zap,
  Radio,
  Loader2,
  Calendar,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PublicStatusPage() {
  const params = useParams();
  const projectSlug = params?.projectSlug as string;

  const [data, setData] = useState<PublicProjectStatusData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

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
          "Failed to load status page. Please check the project URL."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Auto refresh every 60 seconds
    const interval = setInterval(() => {
      fetchStatus();
    }, 60000);

    return () => clearInterval(interval);
  }, [projectSlug]);

  const renderStatusBanner = (status: SystemStatusType) => {
    switch (status) {
      case "OPERATIONAL":
        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-4 shadow-sm"
          >
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-500 shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-500">
                All Systems Operational
              </h2>
              <p className="text-xs sm:text-sm text-emerald-500/80 mt-1">
                All services and monitors are functioning normally without disruption.
              </p>
            </div>
          </motion.div>
        );

      case "DEGRADED_PERFORMANCE":
        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center gap-4 shadow-sm"
          >
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500 shrink-0">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-500">
                System Degraded Performance
              </h2>
              <p className="text-xs sm:text-sm text-amber-500/80 mt-1">
                Some services are experiencing increased response latency or intermittent errors.
              </p>
            </div>
          </motion.div>
        );

      case "PARTIAL_OUTAGE":
      case "MAJOR_OUTAGE":
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-4 shadow-sm"
          >
            <div className="p-3 rounded-2xl bg-destructive/20 text-destructive shrink-0">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-destructive">
                Ongoing Incident Detected
              </h2>
              <p className="text-xs sm:text-sm text-destructive/80 mt-1">
                Engineers are actively investigating system disruptions. See live updates below.
              </p>
            </div>
          </motion.div>
        );
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <span className="px-2.5 py-0.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-bold">CRITICAL</span>;
      case "HIGH":
        return <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold">HIGH</span>;
      case "MEDIUM":
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold">MEDIUM</span>;
      case "LOW":
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold">LOW</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "INVESTIGATING":
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-mono font-medium border border-amber-500/20">INVESTIGATING</span>;
      case "IDENTIFIED":
        return <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-mono font-medium border border-blue-500/20">IDENTIFIED</span>;
      case "MONITORING":
        return <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 text-[10px] font-mono font-medium border border-purple-500/20">MONITORING</span>;
      case "RESOLVED":
      default:
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-mono font-medium border border-emerald-500/20">RESOLVED</span>;
    }
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground mt-3 font-mono">Loading System Status Page...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Status Page Not Found</h2>
        <p className="text-xs text-muted-foreground mt-2 max-w-sm">
          {errorMsg || "The status page you requested does not exist or has been removed."}
        </p>
        <Link
          href="/"
          className="mt-6 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:bg-primary/90 transition-all"
        >
          Return to UpNode Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Top Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">
                {data.project.name}
              </h1>
              <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                Live Status Monitor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => fetchStatus()}
              disabled={isLoading}
              title="Refresh Status"
              className="p-2 rounded-xl bg-muted/60 hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Status Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 space-y-10">
        {/* Status Banner */}
        {renderStatusBanner(data.systemStatus)}

        {/* Monitor Performance Bar & Metrics */}
        <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Primary HTTP Monitor Status
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {data.project.url ? (
                  <span className="font-mono text-muted-foreground">{data.project.url}</span>
                ) : (
                  "Automated 5-minute ping telemetry check"
                )}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block uppercase font-mono">Uptime (24h)</span>
                <span className="font-bold text-foreground font-mono text-sm">{data.uptimePercentage}%</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block uppercase font-mono">Avg Latency</span>
                <span className="font-bold text-foreground font-mono text-sm flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  {data.avgLatencyMs}ms
                </span>
              </div>
            </div>
          </div>

          {/* 30-Pill Visual Ping History Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>90 days ago</span>
              <span className="text-emerald-500 font-semibold">{data.uptimePercentage}% Uptime</span>
              <span>Today</span>
            </div>

            <div className="flex items-center gap-1.5 h-8">
              {(data.recentMetrics.length > 0 ? data.recentMetrics : Array.from({ length: 30 })).map(
                (metric: any, idx: number) => {
                  const isUp = metric ? metric.isUp : true;
                  const latency = metric ? metric.responseTimeMs : 0;
                  return (
                    <div
                      key={idx}
                      title={
                        metric
                          ? `Status: ${metric.isUp ? "UP" : "DOWN"} (${metric.statusCode || "ERR"}) | Latency: ${latency}ms | ${format(new Date(metric.createdAt), "HH:mm:ss")}`
                          : "Operational"
                      }
                      className={`flex-1 h-full rounded-md transition-all cursor-pointer hover:scale-105 ${
                        isUp
                          ? "bg-emerald-500/80 hover:bg-emerald-500"
                          : "bg-destructive hover:bg-destructive/90"
                      }`}
                    />
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* Active Incidents Section */}
        {data.activeIncidents.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Active System Incidents
            </h3>

            <div className="space-y-4">
              {data.activeIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-6 rounded-3xl bg-card border border-destructive/20 space-y-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(incident.severity)}
                        {getStatusBadge(incident.status)}
                      </div>
                      <h4 className="text-base font-bold text-foreground mt-2">
                        {incident.title}
                      </h4>
                    </div>

                    <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                      {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {incident.description}
                  </p>

                  {/* Timeline updates for active incident */}
                  {incident.timelineEvents && incident.timelineEvents.length > 0 && (
                    <div className="pt-4 border-t border-border space-y-3">
                      <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider block">
                        Incident Updates:
                      </span>
                      {incident.timelineEvents.map((evt) => (
                        <div key={evt.id} className="pl-4 border-l-2 border-primary/40 space-y-1">
                          <div className="flex items-center gap-2 text-[11px]">
                            {getStatusBadge(evt.status)}
                            <span className="text-muted-foreground font-mono">
                              {format(new Date(evt.createdAt), "MMM d, HH:mm")}
                            </span>
                          </div>
                          <p className="text-xs text-foreground">{evt.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7-Day Incident Timeline History from TimelineEvent Model */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Past 7 Days Incident History
            </h3>
            <span className="text-xs text-muted-foreground font-mono">Timeline Events</span>
          </div>

          {data.past7DaysIncidents.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-muted/20 border border-border border-dashed space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
              <p className="text-xs font-semibold text-foreground">No Incidents Reported in the Last 7 Days</p>
              <p className="text-[11px] text-muted-foreground">
                All services operated smoothly with 100% availability.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {data.past7DaysIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(incident.severity)}
                        {getStatusBadge(incident.status)}
                      </div>
                      <h4 className="text-sm font-bold text-foreground mt-1.5">
                        {incident.title}
                      </h4>
                    </div>

                    <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                      {format(new Date(incident.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {incident.description}
                  </p>

                  {/* Incident Timeline Log Entries */}
                  {incident.timelineEvents && incident.timelineEvents.length > 0 && (
                    <div className="pt-3 border-t border-border/60 space-y-2.5">
                      {incident.timelineEvents.map((event) => (
                        <div key={event.id} className="flex items-start gap-3 text-xs">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">{event.message}</span>
                              {getStatusBadge(event.status)}
                            </div>
                            <span className="text-[11px] text-muted-foreground font-mono mt-0.5 block">
                              {format(new Date(event.createdAt), "MMM d, yyyy - HH:mm:ss")}
                            </span>
                          </div>
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
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground font-mono space-y-2">
        <p>Powered by UpNode Infrastructure Telemetry Platform</p>
        <p className="text-[11px] opacity-70">
          Last checked {formatDistanceToNow(lastRefreshed, { addSuffix: true })}
        </p>
      </footer>
    </div>
  );
}
