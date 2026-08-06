"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Construction,
	Clock,
	ToggleLeft,
	ToggleRight,
	AlertTriangle,
	CheckCircle2,
	Loader2,
	Calendar,
	Info,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { projectsService, MaintenanceState } from "@/services/projects.service";

interface Props {
	projectId: string;
	projectName: string;
}

// ─── Glassmorphism card style (matches existing dashboard cards) ───────────────
const GLASS: React.CSSProperties = {
	background: "var(--lp-surface)",
	backdropFilter: "blur(20px)",
	WebkitBackdropFilter: "blur(20px)",
	border: "0.5px solid var(--lp-border)",
	borderTop: "0.5px solid var(--lp-border-top)",
};

function toLocalInputValue(iso: string | null | undefined): string {
	if (!iso) return "";
	// Convert UTC ISO to local datetime-local format (yyyy-MM-ddTHH:mm)
	const d = new Date(iso);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toISOOrNull(localVal: string): string | null {
	if (!localVal) return null;
	return new Date(localVal).toISOString();
}

export function MaintenanceSettings({ projectId, projectName }: Props) {
	const [state, setState] = useState<MaintenanceState | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);
	const [scheduleExpanded, setScheduleExpanded] = useState(false);

	// Local form state
	const [manualToggle, setManualToggle] = useState(false);
	const [startLocal, setStartLocal] = useState("");
	const [endLocal, setEndLocal] = useState("");

	const fetchState = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await projectsService.getMaintenanceState(projectId);
			setState(data);
			setManualToggle(data.maintenanceMode);
			setStartLocal(toLocalInputValue(data.maintenanceStart));
			setEndLocal(toLocalInputValue(data.maintenanceEnd));
			setScheduleExpanded(!!(data.maintenanceStart || data.maintenanceEnd));
		} catch (err: any) {
			setError(
				err?.response?.data?.error || "Failed to load maintenance settings.",
			);
		} finally {
			setLoading(false);
		}
	}, [projectId]);

	useEffect(() => {
		fetchState();
	}, [fetchState]);

	const showSuccess = (msg: string) => {
		setSuccessMsg(msg);
		setTimeout(() => setSuccessMsg(null), 4000);
	};

	/** Toggle manual maintenance mode immediately on click */
	const handleToggleManual = async () => {
		const newVal = !manualToggle;
		setManualToggle(newVal);
		setSaving(true);
		setError(null);
		try {
			const res = await projectsService.updateMaintenanceWindow(projectId, {
				maintenanceMode: newVal,
			});
			setState(res.project);
			showSuccess(res.message);
		} catch (err: any) {
			setManualToggle(!newVal); // revert
			setError(
				err?.response?.data?.error || "Failed to update maintenance mode.",
			);
		} finally {
			setSaving(false);
		}
	};

	/** Save scheduled window */
	const handleSaveSchedule = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		const startISO = toISOOrNull(startLocal);
		const endISO = toISOOrNull(endLocal);

		if (startISO && endISO && new Date(endISO) <= new Date(startISO)) {
			setError("End time must be after start time.");
			return;
		}

		setSaving(true);
		try {
			const res = await projectsService.updateMaintenanceWindow(projectId, {
				maintenanceStart: startISO,
				maintenanceEnd: endISO,
			});
			setState(res.project);
			showSuccess("Maintenance schedule saved.");
		} catch (err: any) {
			setError(
				err?.response?.data?.error || "Failed to save maintenance schedule.",
			);
		} finally {
			setSaving(false);
		}
	};

	/** Clear the scheduled window */
	const handleClearSchedule = async () => {
		setSaving(true);
		setError(null);
		try {
			const res = await projectsService.updateMaintenanceWindow(projectId, {
				maintenanceStart: null,
				maintenanceEnd: null,
			});
			setState(res.project);
			setStartLocal("");
			setEndLocal("");
			showSuccess("Maintenance schedule cleared.");
		} catch (err: any) {
			setError(err?.response?.data?.error || "Failed to clear schedule.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-10">
				<Loader2
					className="w-4 h-4 animate-spin"
					style={{ color: "var(--lp-text-faint)" }}
				/>
			</div>
		);
	}

	const isActive = state?.isCurrentlyInMaintenance ?? false;

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center gap-3 mb-1">
				<div
					className="w-8 h-8 rounded-none flex items-center justify-center"
					style={{
						background: "rgba(251,191,36,0.12)",
						border: "0.5px solid rgba(251,191,36,0.25)",
					}}
				>
					<Construction className="w-4 h-4" style={{ color: "#fbbf24" }} />
				</div>
				<div>
					<h3
						className="font-mono text-[12px] font-bold tracking-wide"
						style={{ color: "var(--lp-text-primary)" }}
					>
						Maintenance Window
					</h3>
					<p
						className="font-mono text-[10px]"
						style={{ color: "var(--lp-text-faint)" }}
					>
						Suppress incidents &amp; alerts without stopping monitoring
					</p>
				</div>
				{isActive && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-none font-mono text-[10px] font-semibold tracking-widest uppercase"
						style={{
							background: "rgba(251,191,36,0.15)",
							border: "0.5px solid rgba(251,191,36,0.35)",
							color: "#fbbf24",
						}}
					>
						<span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" />
						Active
					</motion.div>
				)}
			</div>

			{/* Status banner */}
			<AnimatePresence>
				{isActive && (
					<motion.div
						initial={{ opacity: 0, y: -6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						className="flex items-start gap-2.5 px-4 py-3 rounded-none font-mono text-[11px] leading-relaxed"
						style={{
							background: "rgba(251,191,36,0.07)",
							border: "0.5px solid rgba(251,191,36,0.25)",
							color: "#fbbf24",
						}}
					>
						<AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
						<span>
							<strong>{projectName}</strong> is currently in maintenance mode.
							The ping worker is still monitoring but all incident creation and
							alert notifications are suppressed.
						</span>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Success toast */}
			<AnimatePresence>
				{successMsg && (
					<motion.div
						initial={{ opacity: 0, y: -6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						className="flex items-center gap-2 px-4 py-2.5 rounded-none font-mono text-[11px]"
						style={{
							background: "rgba(52,211,153,0.08)",
							border: "0.5px solid rgba(52,211,153,0.25)",
							color: "#34d399",
						}}
					>
						<CheckCircle2 className="w-3.5 h-3.5" />
						{successMsg}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Error */}
			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="flex items-center gap-2 px-4 py-2.5 rounded-none font-mono text-[11px]"
						style={{
							background: "rgba(248,113,113,0.08)",
							border: "0.5px solid rgba(248,113,113,0.25)",
							color: "#fca5a5",
						}}
					>
						<AlertTriangle className="w-3.5 h-3.5" />
						{error}
					</motion.div>
				)}
			</AnimatePresence>

			{/* ─── Manual Toggle Card ─────────────────────────────────────────────────── */}
			<div className="p-4 rounded-none border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black">
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-start gap-3">
						<ToggleLeft
							className="w-4 h-4 mt-0.5 flex-shrink-0"
							style={{ color: "var(--lp-text-mid)" }}
						/>
						<div>
							<p
								className="font-mono text-[12px] font-semibold mb-0.5"
								style={{ color: "var(--lp-text-primary)" }}
							>
								Manual Maintenance Mode
							</p>
							<p
								className="font-mono text-[10px]"
								style={{ color: "var(--lp-text-dim)" }}
							>
								Instantly suspend all alerts for this project. Toggle off to
								resume.
							</p>
						</div>
					</div>

					{/* Toggle button */}
					<button
						id={`maintenance-toggle-${projectId}`}
						onClick={handleToggleManual}
						disabled={saving}
						className="relative flex-shrink-0 cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
						aria-label="Toggle maintenance mode"
						title={
							manualToggle
								? "Disable maintenance mode"
								: "Enable maintenance mode"
						}
					>
						{saving ? (
							<Loader2
								className="w-5 h-5 animate-spin"
								style={{ color: "var(--lp-text-faint)" }}
							/>
						) : manualToggle ? (
							<motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
								<ToggleRight className="w-9 h-9" style={{ color: "#fbbf24" }} />
							</motion.div>
						) : (
							<ToggleLeft
								className="w-9 h-9"
								style={{ color: "var(--lp-text-faint)" }}
							/>
						)}
					</button>
				</div>

				{manualToggle && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="mt-3 pt-3 font-mono text-[10px] flex items-center gap-2"
						style={{
							borderTop: "0.5px solid rgba(251,191,36,0.15)",
							color: "#fbbf24",
						}}
					>
						<Info className="w-3 h-3" />
						Manual mode overrides any scheduled window and stays active until
						you toggle it off.
					</motion.div>
				)}
			</div>

			{/* ─── Scheduled Window Card ───────────────────────────────────────────────── */}
			<div className="rounded-none border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black overflow-hidden">
				{/* Collapsible header */}
				<button
					onClick={() => setScheduleExpanded((v) => !v)}
					className="w-full flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer transition-all hover:bg-white/[0.02]"
				>
					<div className="flex items-center gap-3">
						<Calendar
							className="w-4 h-4"
							style={{ color: "var(--lp-text-mid)" }}
						/>
						<div className="text-left">
							<p
								className="font-mono text-[12px] font-semibold"
								style={{ color: "var(--lp-text-primary)" }}
							>
								Scheduled Window
							</p>
							<p
								className="font-mono text-[10px]"
								style={{ color: "var(--lp-text-dim)" }}
							>
								{state?.maintenanceStart
									? `${new Date(state.maintenanceStart).toLocaleString()} → ${state.maintenanceEnd ? new Date(state.maintenanceEnd).toLocaleString() : "open"}`
									: "No window scheduled"}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{state?.isScheduledWindowActive && (
							<span
								className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-none font-semibold"
								style={{
									background: "rgba(251,191,36,0.15)",
									color: "#fbbf24",
									border: "0.5px solid rgba(251,191,36,0.3)",
								}}
							>
								Window Active
							</span>
						)}
						{scheduleExpanded ? (
							<ChevronUp
								className="w-3.5 h-3.5"
								style={{ color: "var(--lp-text-faint)" }}
							/>
						) : (
							<ChevronDown
								className="w-3.5 h-3.5"
								style={{ color: "var(--lp-text-faint)" }}
							/>
						)}
					</div>
				</button>

				<AnimatePresence>
					{scheduleExpanded && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.2 }}
						>
							<form
								onSubmit={handleSaveSchedule}
								className="px-4 pb-4 pt-1 space-y-4"
								style={{ borderTop: "0.5px solid var(--lp-border)" }}
							>
								<div
									className="flex items-start gap-2 font-mono text-[10px] mt-3"
									style={{ color: "var(--lp-text-dim)" }}
								>
									<Clock className="w-3 h-3 flex-shrink-0 mt-0.5" />
									Times are in your local timezone. The server converts them to
									UTC.
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{/* Start */}
									<div>
										<label
											className="block font-mono text-[10px] tracking-widest uppercase mb-1.5"
											style={{ color: "var(--lp-text-faint)" }}
											htmlFor={`maintenance-start-${projectId}`}
										>
											Start Time
										</label>
										<input
											id={`maintenance-start-${projectId}`}
											type="datetime-local"
											value={startLocal}
											onChange={(e) => setStartLocal(e.target.value)}
											className="w-full font-mono text-[11px] px-3 py-2 rounded-lg outline-none transition-all focus:ring-1 focus:ring-amber-400/30"
											style={{
												background: "rgba(255,255,255,0.04)",
												border: "0.5px solid var(--lp-border)",
												color: "var(--lp-text-primary)",
												colorScheme: "dark",
											}}
										/>
									</div>

									{/* End */}
									<div>
										<label
											className="block font-mono text-[10px] tracking-widest uppercase mb-1.5"
											style={{ color: "var(--lp-text-faint)" }}
											htmlFor={`maintenance-end-${projectId}`}
										>
											End Time
										</label>
										<input
											id={`maintenance-end-${projectId}`}
											type="datetime-local"
											value={endLocal}
											onChange={(e) => setEndLocal(e.target.value)}
											className="w-full font-mono text-[11px] px-3 py-2 rounded-lg outline-none transition-all focus:ring-1 focus:ring-amber-400/30"
											style={{
												background: "rgba(255,255,255,0.04)",
												border: "0.5px solid var(--lp-border)",
												color: "var(--lp-text-primary)",
												colorScheme: "dark",
											}}
										/>
									</div>
								</div>

								<div className="flex items-center gap-2 pt-1">
									<button
										id={`maintenance-save-${projectId}`}
										type="submit"
										disabled={saving}
										className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-[11px] font-semibold transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
										style={{
											background: "rgba(251,191,36,0.15)",
											border: "0.5px solid rgba(251,191,36,0.35)",
											color: "#fbbf24",
										}}
									>
										{saving ? (
											<Loader2 className="w-3 h-3 animate-spin" />
										) : (
											<Clock className="w-3 h-3" />
										)}
										Save Schedule
									</button>

									{(state?.maintenanceStart || state?.maintenanceEnd) && (
										<button
											id={`maintenance-clear-${projectId}`}
											type="button"
											onClick={handleClearSchedule}
											disabled={saving}
											className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-[11px] transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
											style={{
												background: "rgba(255,255,255,0.04)",
												border: "0.5px solid var(--lp-border)",
												color: "var(--lp-text-dim)",
											}}
										>
											Clear Window
										</button>
									)}
								</div>
							</form>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Info note */}
			<p
				className="font-mono text-[10px] px-1"
				style={{ color: "var(--lp-text-faint)" }}
			>
				Ping metrics are always recorded during maintenance — uptime graphs
				remain accurate. Only incident creation and alert notifications are
				paused.
			</p>
		</div>
	);
}
