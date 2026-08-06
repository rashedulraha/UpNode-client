"use client";

import React, { useState } from "react";
import { Activity, Clock, ShieldCheck } from "lucide-react";

export interface TelemetryPoint {
	timestamp: string;
	latencyMs: number;
	status: "UP" | "DOWN" | "DEGRADED";
}

export interface UptimeChartProps {
	title?: string;
	uptimePercentage?: number;
	averageLatencyMs?: number;
	dataPoints?: TelemetryPoint[];
	timeRange?: "24h" | "7d" | "30d";
	onTimeRangeChange?: (range: "24h" | "7d" | "30d") => void;
}

export function UptimeChart({
	title = "Uptime & Telemetry Status",
	uptimePercentage = 99.95,
	averageLatencyMs = 38,
	dataPoints = [],
	timeRange = "24h",
	onTimeRangeChange,
}: UptimeChartProps) {
	const [selectedRange, setSelectedRange] = useState<"24h" | "7d" | "30d">(
		timeRange,
	);

	const handleRangeChange = (range: "24h" | "7d" | "30d") => {
		setSelectedRange(range);
		if (onTimeRangeChange) {
			onTimeRangeChange(range);
		}
	};

	// Generate default status bars if no dataPoints provided
	const points: TelemetryPoint[] =
		dataPoints.length > 0
			? dataPoints
			: Array.from({ length: 48 }, (_, i) => ({
					timestamp: `Point ${i + 1}`,
					latencyMs: 30 + Math.floor(Math.random() * 20),
					status: i === 12 ? "DEGRADED" : i === 28 ? "DOWN" : "UP",
				}));

	const getBarColor = (status: "UP" | "DOWN" | "DEGRADED") => {
		switch (status) {
			case "UP":
				return "bg-emerald-500 hover:bg-emerald-400";
			case "DEGRADED":
				return "bg-amber-500 hover:bg-amber-400";
			case "DOWN":
				return "bg-rose-500 hover:bg-rose-400";
			default:
				return "bg-slate-300 dark:bg-neutral-800";
		}
	};

	return (
		<div
			data-testid="uptime-chart"
			className="p-6 bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] rounded-lg shadow-sm font-sans space-y-6"
		>
			{/* Top Controls Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<Activity className="w-4 h-4 text-emerald-500" />
						<h3 className="text-base font-bold font-mono uppercase tracking-wide text-[var(--foreground)]">
							{title}
						</h3>
					</div>
					<p className="text-xs font-mono text-[var(--muted-foreground)]">
						Real-time ping telemetry across active ingestion nodes
					</p>
				</div>

				{/* Timeframe Selector Buttons */}
				<div className="inline-flex p-1 bg-[var(--secondary)] border border-[var(--border)] rounded font-mono text-xs">
					{(["24h", "7d", "30d"] as const).map((range) => (
						<button
							key={range}
							type="button"
							onClick={() => handleRangeChange(range)}
							className={`px-3 py-1 rounded transition-all cursor-pointer ${
								selectedRange === range
									? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold"
									: "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
							}`}
						>
							{range}
						</button>
					))}
				</div>
			</div>

			{/* SLA & Latency Metrics Banner */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[var(--background)] border border-[var(--border)] rounded font-mono">
				<div className="flex items-center gap-3">
					<div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500">
						<ShieldCheck className="w-5 h-5" />
					</div>
					<div>
						<span className="text-[10px] uppercase text-[var(--muted-foreground)] tracking-wider">
							Uptime SLA
						</span>
						<div className="text-xl font-bold text-[var(--foreground)]">
							{uptimePercentage}%
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded text-sky-500">
						<Clock className="w-5 h-5" />
					</div>
					<div>
						<span className="text-[10px] uppercase text-[var(--muted-foreground)] tracking-wider">
							Avg Latency
						</span>
						<div className="text-xl font-bold text-[var(--foreground)]">
							{averageLatencyMs} ms
						</div>
					</div>
				</div>
			</div>

			{/* Uptime Status Bars Strip */}
			<div className="space-y-2">
				<div className="flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)]">
					<span>Check Intervals ({points.length} nodes)</span>
					<span className="text-emerald-500 font-bold">100% Operational</span>
				</div>

				<div className="flex items-center gap-1 h-8 w-full p-1 bg-[var(--background)] border border-[var(--border)] rounded overflow-hidden">
					{points.map((pt, idx) => (
						<div
							key={idx}
							title={`${pt.timestamp}: ${pt.latencyMs}ms (${pt.status})`}
							className={`flex-1 h-full rounded-xs transition-all cursor-pointer ${getBarColor(pt.status)}`}
						/>
					))}
				</div>
			</div>

			{/* Legend Footer */}
			<div className="flex items-center justify-end gap-4 text-[11px] font-mono text-slate-500 dark:text-neutral-400">
				<div className="flex items-center gap-1.5">
					<span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
					<span>Operational</span>
				</div>
				<div className="flex items-center gap-1.5">
					<span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
					<span>Degraded</span>
				</div>
				<div className="flex items-center gap-1.5">
					<span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
					<span>Downtime</span>
				</div>
			</div>
		</div>
	);
}

export default UptimeChart;
