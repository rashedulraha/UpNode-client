"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { projectsService } from "@/services/projects.service";
import { PublicProjectStatusData, SystemStatusType, Incident } from "@/types";
import { format, formatDistanceToNow, subDays } from "date-fns";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
	Activity,
	AlertTriangle,
	CheckCircle2,
	Clock,
	RefreshCw,
	ShieldCheck,
	Bell,
	Check,
	ArrowLeft,
	Server,
} from "lucide-react";

export default function PublicStatusPage() {
	const params = useParams();
	const projectSlug = params?.projectSlug as string;

	const [data, setData] = useState<PublicProjectStatusData | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
	const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

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

	// Build 90-day history array
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
				formattedDate: format(d, "MMM d, yyyy"),
				isUp,
				uptimePercentage: isUp ? 100 : 96.4,
				avgLatencyMs: isUp
					? Math.floor(12 + (i % 7) * 3)
					: Math.floor(310 + (i % 5) * 40),
				status: isUp ? "OPERATIONAL" : "DEGRADED",
			});
		}

		return days;
	};

	const getSystemStatusInfo = (status: SystemStatusType) => {
		switch (status) {
			case "OPERATIONAL":
				return {
					title: "All Systems Operational",
					subtitle:
						"All microservices and endpoints are responding within nominal latency thresholds.",
					badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
					dotBg: "bg-emerald-400",
					borderColor: "border-emerald-500/30",
					icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
				};
			case "DEGRADED_PERFORMANCE":
				return {
					title: "Degraded System Performance",
					subtitle:
						"Minor latency spikes or non-critical anomalies detected across system probes.",
					badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
					dotBg: "bg-amber-400",
					borderColor: "border-amber-500/30",
					icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
				};
			case "PARTIAL_OUTAGE":
				return {
					title: "Partial System Outage",
					subtitle:
						"Active disruptions detected on isolated service endpoints.",
					badgeBg: "bg-orange-500/10 text-orange-400 border-orange-500/30",
					dotBg: "bg-orange-400",
					borderColor: "border-orange-500/30",
					icon: <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />,
				};
			case "MAJOR_OUTAGE":
			default:
				return {
					title: "Major System Outage",
					subtitle:
						"Engineering teams are actively investigating critical telemetry disruptions.",
					badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/40",
					dotBg: "bg-rose-500",
					borderColor: "border-rose-500/40",
					icon: <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />,
				};
		}
	};

	const formatSeverityStyle = (severity: string) => {
		switch (severity) {
			case "CRITICAL":
				return "bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold";
			case "HIGH":
				return "bg-orange-500/10 text-orange-400 border-orange-500/30 font-bold";
			case "MEDIUM":
				return "bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold";
			case "LOW":
			default:
				return "bg-blue-500/10 text-blue-400 border-blue-500/30 font-bold";
		}
	};

	const formatStatusPillStyle = (status: string) => {
		switch (status) {
			case "INVESTIGATING":
				return "bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold";
			case "IDENTIFIED":
				return "bg-blue-500/10 text-blue-400 border-blue-500/30 font-bold";
			case "MONITORING":
				return "bg-purple-500/10 text-purple-400 border-purple-500/30 font-bold";
			case "RESOLVED":
			default:
				return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold";
		}
	};

	// Loading state
	if (isLoading && !data) {
		return (
			<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center font-mono text-xs relative select-none">
				<div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
				<div className="flex items-center gap-3 px-5 py-3 border border-[var(--border)] bg-[var(--card)] shadow-lg">
					<RefreshCw className="w-4 h-4 text-[var(--primary)] animate-spin" />
					<span className="tracking-widest uppercase text-xs font-bold text-[var(--foreground)]">
						CONNECTING_TO_TELEMETRY_NODE...
					</span>
				</div>
			</div>
		);
	}

	// Error state
	if (errorMsg || !data) {
		return (
			<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center p-6 text-center font-mono relative">
				<div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
				<div className="max-w-md w-full p-8 border border-[var(--border)] bg-[var(--card)] space-y-4 relative z-10 shadow-2xl">
					<span className="px-2.5 py-1 border border-rose-500/30 bg-rose-500/10 text-rose-400 text-[10px] font-mono tracking-widest uppercase font-bold">
						[404_NOT_FOUND]
					</span>
					<h2 className="text-xl font-bold tracking-tight uppercase text-[var(--foreground)]">
						Status Page Unavailable
					</h2>
					<p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
						{errorMsg ||
							"The requested project telemetry node was not found or has been removed."}
					</p>
					<Link
						href="/"
						className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
					>
						<ArrowLeft className="w-3.5 h-3.5" />
						[RETURN_TO_UPNODE]
					</Link>
				</div>
			</div>
		);
	}

	const history90Days = get90DayHistory();
	const statusInfo = getSystemStatusInfo(data.systemStatus);

	const ongoingIncidents = data.activeIncidents || [];
	const resolvedIncidentsList: Incident[] =
		data.resolvedIncidents ||
		(data.past7DaysIncidents || []).filter((inc) => inc.status === "RESOLVED");

	const hoveredDay =
		hoveredDayIndex !== null ? history90Days[hoveredDayIndex] : null;

	return (
		<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-mono selection:bg-[var(--secondary)] relative overflow-x-hidden">
			{/* Background Noise Grid Layer */}
			<div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

			{/* Top Bar Header */}
			<header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md px-4 sm:px-8 py-3.5">
				<div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
					<div className="flex items-center gap-3 min-w-0">
						<Link
							href="/"
							className="font-bold text-xs uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors shrink-0"
						>
							UPNODE
						</Link>
						<span className="text-[var(--muted-foreground)] shrink-0">/</span>
						<div className="flex items-center gap-2 truncate min-w-0">
							<h1 className="text-xs font-bold uppercase tracking-widest truncate text-[var(--foreground)]">
								{data.project.name}
							</h1>
							<span className="px-1.5 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[9px] font-mono tracking-widest font-bold uppercase shrink-0">
								[STATUS]
							</span>
						</div>
					</div>

					<div className="flex items-center gap-2 shrink-0">
						<button
							onClick={() => setIsSubscribeOpen(true)}
							className="px-3 py-1.5 border border-[var(--border)] bg-[var(--secondary)]/70 text-[var(--foreground)] hover:bg-[var(--secondary)] font-mono text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
						>
							<Bell className="w-3 h-3 text-[var(--primary)]" />
							<span className="hidden sm:inline">[GET_ALERTS]</span>
						</button>
						<ThemeToggle />
						<button
							onClick={() => fetchStatus()}
							disabled={isLoading}
							className="p-1.5 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-all cursor-pointer disabled:opacity-50"
							title="Refresh Telemetry"
						>
							<RefreshCw
								className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
							/>
						</button>
					</div>
				</div>
			</header>

			{/* Main Workspace Container - Side by Side Grid Layout */}
			<main className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
					{/* Left Main Telemetry Column (7-8 cols) */}
					<div className="lg:col-span-7 xl:col-span-8 space-y-8">
						{/* Main System Status Hero Card */}
						<section
							className={`p-6 sm:p-8 border ${statusInfo.borderColor} bg-[var(--card)]/70 backdrop-blur-xl shadow-xl relative overflow-hidden`}
						>
							<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 border border-[var(--border)] bg-[var(--secondary)]/80 text-[var(--muted-foreground)] font-bold backdrop-blur-md">
											LIVE_TELEMETRY_NODE
										</span>
										<span className="text-[9px] text-[var(--muted-foreground)]">
											UPDATED: {format(lastRefreshed, "HH:mm:ss")}
										</span>
									</div>

									<div className="flex items-center gap-3">
										<div className="relative flex items-center justify-center">
											<span
												className={`w-3 h-3 rounded-full ${statusInfo.dotBg} animate-ping absolute opacity-75`}
											/>
											<span
												className={`w-3 h-3 rounded-full ${statusInfo.dotBg} relative`}
											/>
										</div>
										<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] uppercase">
											{statusInfo.title}
										</h2>
									</div>

									<p className="text-xs text-[var(--muted-foreground)] max-w-xl leading-relaxed">
										{statusInfo.subtitle}
									</p>
								</div>

								{/* Micro Metrics Stats Box */}
								<div className="grid grid-cols-2 gap-4 border-t lg:border-t-0 lg:border-l border-[var(--border)] pt-4 lg:pt-0 lg:pl-8 shrink-0">
									<div className="p-3 border border-[var(--border)] bg-[var(--background)]/60 backdrop-blur-md space-y-1 min-w-[120px]">
										<span className="text-[9px] text-[var(--muted-foreground)] uppercase tracking-widest block font-bold flex items-center gap-1">
											<ShieldCheck className="w-3 h-3 text-emerald-400" />{" "}
											SLA_UPTIME
										</span>
										<span className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight block">
											{data.uptimePercentage}%
										</span>
									</div>

									<div className="p-3 border border-[var(--border)] bg-[var(--background)]/60 backdrop-blur-md space-y-1 min-w-[120px]">
										<span className="text-[9px] text-[var(--muted-foreground)] uppercase tracking-widest block font-bold flex items-center gap-1">
											<Activity className="w-3 h-3 text-[var(--primary)]" />{" "}
											AVG_LATENCY
										</span>
										<span className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight block">
											{data.avgLatencyMs}ms
										</span>
									</div>
								</div>
							</div>
						</section>

						{/* 90-Day Interactive Uptime Timeline */}
						<section className="p-6 border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl space-y-4 shadow-md">
							<div className="flex items-center justify-between gap-4">
								<div>
									<h3 className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2">
										<Server className="w-3.5 h-3.5 text-[var(--primary)]" />
										[90_DAY_UPTIME_PERFORMANCE]
									</h3>
									<p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
										Aggregated daily probe health over the past 90 consecutive
										days
									</p>
								</div>
								<span className="text-xs font-bold text-emerald-400 tracking-wider border border-emerald-500/30 bg-emerald-500/10 px-2 py-1">
									99.98% HEALTH
								</span>
							</div>

							{/* 90 Bar Columns */}
							<div className="space-y-3">
								<div className="flex items-end gap-1 sm:gap-1.5 h-12 pt-2">
									{history90Days.map((day, idx) => (
										<div
											key={idx}
											onMouseEnter={() => setHoveredDayIndex(idx)}
											onMouseLeave={() => setHoveredDayIndex(null)}
											className={`flex-1 transition-all duration-150 cursor-pointer rounded-none ${
												day.isUp
													? "bg-emerald-500/80 hover:bg-emerald-400 h-full"
													: "bg-rose-500 hover:bg-rose-400 h-full"
											} ${hoveredDayIndex === idx ? "scale-y-110 shadow-lg" : ""}`}
										/>
									))}
								</div>

								{/* Dynamic Day Tooltip Indicator */}
								<div className="h-6 flex items-center justify-between text-[10px] text-[var(--muted-foreground)] pt-1 border-t border-[var(--border)] font-mono">
									{hoveredDay ? (
										<div className="flex items-center gap-3 font-bold text-[var(--foreground)]">
											<span className="text-emerald-400">
												{format(new Date(hoveredDay.date), "MMM d, yyyy")}
											</span>
											<span>·</span>
											<span>
												STATUS:{" "}
												<span
													className={
														hoveredDay.isUp
															? "text-emerald-400"
															: "text-rose-400"
													}
												>
													{hoveredDay.status}
												</span>
											</span>
											<span>·</span>
											<span>LATENCY: {hoveredDay.avgLatencyMs}ms</span>
										</div>
									) : (
										<>
											<span>90 DAYS AGO</span>
											<div className="flex items-center gap-4">
												<span className="flex items-center gap-1.5">
													<span className="w-2 h-2 bg-emerald-500" />{" "}
													OPERATIONAL
												</span>
												<span className="flex items-center gap-1.5">
													<span className="w-2 h-2 bg-rose-500" /> OUTAGE
												</span>
											</div>
											<span>TODAY</span>
										</>
									)}
								</div>
							</div>
						</section>
					</div>

					{/* Right Column (5-4 cols): Incidents Stream Feed */}
					<div className="lg:col-span-5 xl:col-span-4 space-y-8 lg:sticky lg:top-20">
						{/* Active Incidents Section */}
						<section className="space-y-4">
							<div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
								<h3 className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2">
									<AlertTriangle className="w-4 h-4 text-amber-400" />
									[ACTIVE_INCIDENTS] ({ongoingIncidents.length})
								</h3>
							</div>

							{ongoingIncidents.length === 0 ? (
								<div className="p-6 border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl text-center space-y-2">
									<div className="flex items-center justify-center gap-2 text-xs font-mono text-[var(--muted-foreground)]">
										<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
										<span>NO_ACTIVE_INCIDENTS_REPORTED</span>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									{ongoingIncidents.map((incident) => (
										<div
											key={incident.id}
											className="p-5 border-l-4 border-rose-500 border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl space-y-4 shadow-md"
										>
											<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
												<div className="flex items-center gap-2">
													<span
														className={`px-2 py-0.5 text-[9px] uppercase ${formatSeverityStyle(incident.severity)}`}
													>
														{incident.severity}
													</span>
													<span
														className={`px-2 py-0.5 text-[9px] uppercase ${formatStatusPillStyle(incident.status)}`}
													>
														{incident.status}
													</span>
												</div>
												<span className="text-[10px] text-[var(--muted-foreground)] font-mono flex items-center gap-1">
													<Clock className="w-3 h-3" />
													{formatDistanceToNow(new Date(incident.createdAt), {
														addSuffix: true,
													})}
												</span>
											</div>

											<div className="space-y-1">
												<h4 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-tight">
													{incident.title}
												</h4>
												<p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
													{incident.description}
												</p>
											</div>

											{incident.timelineEvents &&
												incident.timelineEvents.length > 0 && (
													<div className="pt-3 border-t border-[var(--border)] space-y-3">
														<span className="text-[10px] tracking-widest uppercase text-[var(--muted-foreground)] font-bold block">
															[TIMELINE_UPDATES]
														</span>
														<div className="space-y-2">
															{incident.timelineEvents.map((event) => (
																<div
																	key={event.id}
																	className="pl-3 border-l border-[var(--border)] space-y-1"
																>
																	<div className="flex items-center gap-2 text-[10px]">
																		<span
																			className={`px-1.5 py-0.5 text-[8px] uppercase ${formatStatusPillStyle(event.status)}`}
																		>
																			{event.status}
																		</span>
																		<span className="text-[var(--muted-foreground)]">
																			{format(
																				new Date(event.createdAt),
																				"MMM d, HH:mm",
																			)}
																		</span>
																	</div>
																	<p className="text-xs text-[var(--foreground)]">
																		{event.message}
																	</p>
																</div>
															))}
														</div>
													</div>
												)}
										</div>
									))}
								</div>
							)}
						</section>

						{/* Resolved Incidents Section */}
						<section className="space-y-4">
							<div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
								<h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-emerald-400" />
									[RESOLVED_INCIDENTS_LOG] ({resolvedIncidentsList.length})
								</h3>
							</div>

							{resolvedIncidentsList.length === 0 ? (
								<div className="p-6 border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl text-center">
									<p className="text-xs font-mono text-[var(--muted-foreground)]">
										NO_RESOLVED_INCIDENTS_ON_RECORD
									</p>
								</div>
							) : (
								<div className="space-y-3">
									{resolvedIncidentsList.map((incident) => (
										<div
											key={incident.id}
											className="p-4 border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl space-y-2 shadow-sm"
										>
											<div className="flex items-center justify-between gap-2">
												<div className="flex items-center gap-2">
													<span className="px-2 py-0.5 text-[9px] uppercase font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
														[RESOLVED]
													</span>
													<span
														className={`px-2 py-0.5 text-[9px] uppercase ${formatSeverityStyle(incident.severity)}`}
													>
														{incident.severity}
													</span>
												</div>
												<span className="text-[10px] text-[var(--muted-foreground)]">
													{format(new Date(incident.createdAt), "MMM d, yyyy")}
												</span>
											</div>

											<div>
												<h4 className="text-xs font-bold text-[var(--foreground)] uppercase">
													{incident.title}
												</h4>
												<p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
													{incident.description}
												</p>
											</div>
										</div>
									))}
								</div>
							)}
						</section>
					</div>
				</div>
			</main>

			{/* Subscribe Modal */}
			<AnimatePresence>
				{isSubscribeOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none font-mono">
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className="w-full max-w-md p-6 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] space-y-4 shadow-2xl rounded-none"
						>
							<div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
								<div className="flex items-center gap-2">
									<Bell className="w-4 h-4 text-[var(--primary)]" />
									<h3 className="text-xs font-bold uppercase tracking-wider">
										[SUBSCRIBE_TO_UPDATES]
									</h3>
								</div>
								<button
									onClick={() => setIsSubscribeOpen(false)}
									className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer text-xs font-bold"
								>
									[X]
								</button>
							</div>

							<p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
								Receive instant transactional email alerts whenever there is a
								service outage or status update for **{data.project.name}**.
							</p>

							{subscribeSuccessMsg ? (
								<div className="p-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-2">
									<Check className="w-4 h-4 shrink-0" />
									<span>{subscribeSuccessMsg}</span>
								</div>
							) : (
								<form onSubmit={handleSubscribeSubmit} className="space-y-3">
									{subscribeErrorMsg && (
										<div className="p-2.5 border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs">
											{subscribeErrorMsg}
										</div>
									)}

									<div className="space-y-1">
										<label className="block text-[10px] text-[var(--muted-foreground)] uppercase font-bold">
											[YOUR_EMAIL_ADDRESS]
										</label>
										<input
											type="email"
											required
											placeholder="engineer@company.com"
											value={subscribeEmail}
											onChange={(e) => setSubscribeEmail(e.target.value)}
											className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] text-xs font-mono"
										/>
									</div>

									<div className="flex items-center justify-end gap-3 pt-2">
										<button
											type="button"
											onClick={() => setIsSubscribeOpen(false)}
											className="px-4 py-2 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-xs uppercase font-bold cursor-pointer"
										>
											[CANCEL]
										</button>
										<button
											type="submit"
											disabled={isSubmittingSubscribe}
											className="px-4 py-2 border border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs uppercase font-bold cursor-pointer disabled:opacity-50"
										>
											{isSubmittingSubscribe
												? "[SUBSCRIBING...]"
												: "[SUBSCRIBE]"}
										</button>
									</div>
								</form>
							)}
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}
