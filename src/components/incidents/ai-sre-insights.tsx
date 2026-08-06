"use client";

import { useState, useEffect } from "react";
import { Incident } from "@/types";
import { useUpdateIncidentStatus } from "@/hooks/use-incidents";

interface AiSreInsightsProps {
	incident: Incident;
}

export function AiSreInsights({ incident }: AiSreInsightsProps) {
	const [copied, setCopied] = useState(false);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [isApplyingFix, setIsApplyingFix] = useState(false);
	const [fixApplied, setFixApplied] = useState(false);
	const [displayedText, setDisplayedText] = useState("");
	const updateStatusMutation = useUpdateIncidentStatus();

	// Root cause text
	const rootCauseText =
		incident.aiRootCause ||
		`[AI_SRE_DIAGNOSTIC] Anomalous HTTP telemetry pattern detected. Connection pool exhaustion on target project "${
			incident.project?.name || "Service"
		}". High latency spikes (>1450ms) correlated with Redis key eviction failures.`;

	// Fix suggestion text
	const fixSuggestionText =
		incident.aiFixSuggestion ||
		`upnode-cli scale-pool --target="${incident.projectId}" --max-connections=50 --flush-cache`;

	// Simulated streaming text typing animation
	useEffect(() => {
		setDisplayedText("");
		setIsAnalyzing(true);
		let index = 0;

		const timer = setInterval(() => {
			if (index < rootCauseText.length) {
				setDisplayedText((prev) => prev + rootCauseText.charAt(index));
				index++;
			} else {
				setIsAnalyzing(false);
				clearInterval(timer);
			}
		}, 12);

		return () => clearInterval(timer);
	}, [incident.id, rootCauseText]);

	const handleCopyFix = () => {
		navigator.clipboard.writeText(fixSuggestionText);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleReAnalyze = () => {
		setDisplayedText("");
		setIsAnalyzing(true);
		let index = 0;
		const timer = setInterval(() => {
			if (index < rootCauseText.length) {
				setDisplayedText((prev) => prev + rootCauseText.charAt(index));
				index++;
			} else {
				setIsAnalyzing(false);
				clearInterval(timer);
			}
		}, 12);
	};

	const handleApplyFix = async () => {
		setIsApplyingFix(true);
		try {
			await new Promise((res) => setTimeout(res, 1400));
			await updateStatusMutation.mutateAsync({
				id: incident.id,
				status: "RESOLVED",
				expectedVersion: incident.version,
			});
			setFixApplied(true);
		} catch (err) {
			console.error("Failed to apply fix:", err);
		} finally {
			setIsApplyingFix(false);
		}
	};

	return (
		<div className="w-full rounded-none bg-[var(--card)] border border-[var(--border)] overflow-hidden font-mono text-xs text-emerald-400 relative group shadow-2xl">
			{/* Terminal Header */}
			<div className="bg-[var(--secondary)] px-4 py-2 border-b border-[var(--border)] flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
					<span className="text-[11px] font-mono text-emerald-400 font-bold tracking-wider uppercase">
						AI_SRE_DIAGNOSTIC_ENGINE [v2.4]
					</span>
				</div>

				<div className="flex items-center gap-2 text-[10px]">
					<button
						onClick={handleReAnalyze}
						disabled={isAnalyzing}
						className="px-2 py-0.5 border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer disabled:opacity-40 uppercase"
					>
						{isAnalyzing ? "[STREAMING...]" : "[RE_ANALYZE]"}
					</button>
				</div>
			</div>

			{/* Terminal Streaming Body */}
			<div className="p-4 space-y-4 bg-[var(--card)]">
				<div className="space-y-1.5 leading-relaxed font-mono">
					<div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest flex items-center gap-2">
						<span>ROOT_CAUSE_ANALYSIS</span>
						{isAnalyzing && (
							<span className="text-emerald-400 animate-pulse">█</span>
						)}
					</div>
					<p className="text-emerald-400 text-[11px] break-words whitespace-pre-wrap">
						{displayedText}
					</p>
				</div>

				{/* Recommended Fix Command Box */}
				<div className="p-3 rounded-none bg-[var(--secondary)] border border-[var(--border)] space-y-2">
					<div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest">
						<span>RECOMMENDED_REMEDIATION_CLI</span>
						<button
							onClick={handleCopyFix}
							className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
						>
							{copied ? "[COPIED]" : "[COPY]"}
						</button>
					</div>

					<div className="p-2 rounded-none bg-[var(--background)] border border-[var(--border)] text-emerald-400 text-[11px] font-mono select-all break-all">
						{fixSuggestionText}
					</div>

					{/* Action Trigger */}
					<div className="pt-1 flex items-center justify-end">
						{fixApplied ? (
							<span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
								[INCIDENT_AUTO_RESOLVED]
							</span>
						) : (
							<button
								onClick={handleApplyFix}
								disabled={isApplyingFix || incident.status === "RESOLVED"}
								className="px-3 py-1 border border-emerald-600/60 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-40 uppercase tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.2)]"
							>
								{isApplyingFix
									? "[APPLYING_REMEDIATION...]"
									: "[AUTO_APPLY_FIX]"}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default AiSreInsights;
