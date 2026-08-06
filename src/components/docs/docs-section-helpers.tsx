"use client";

import React, { useState } from "react";
import { Info, AlertTriangle, CheckCircle2, Check, Hash } from "lucide-react";

// ─── Theme-Aware Info Box ────────────────────────────────────────────────────
export function InfoBox({
	type = "info",
	children,
}: {
	type?: "info" | "warning" | "success";
	children: React.ReactNode;
}) {
	const styles = {
		info: {
			label: "DIAGNOSTIC // INFO",
			icon: <Info className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" />,
			container:
				"bg-black dark:bg-black border-blue-900/60 text-slate-300 dark:text-slate-300",
		},
		warning: {
			label: "DIAGNOSTIC // WARNING",
			icon: (
				<AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
			),
			container:
				"bg-black dark:bg-black border-amber-900/60 text-slate-300 dark:text-slate-300",
		},
		success: {
			label: "DIAGNOSTIC // SUCCESS",
			icon: (
				<CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
			),
			container:
				"bg-black dark:bg-black border-emerald-900/60 text-slate-300 dark:text-slate-300",
		},
	}[type];

	return (
		<div
			className={`my-5 font-mono text-[11px] leading-relaxed border border-dashed p-4 rounded-none bg-black ${styles.container}`}
		>
			<div className="flex items-center gap-2 mb-2 font-bold tracking-wider text-[10px] opacity-80">
				{styles.icon}
				<span>{styles.label}</span>
			</div>
			<div>{children}</div>
		</div>
	);
}

// ─── Section Heading with Copy Anchor ────────────────────────────────────────
export function SectionHeading({
	id,
	level,
	children,
}: {
	id: string;
	level: 1 | 2 | 3;
	children: React.ReactNode;
}) {
	const [copied, setCopied] = useState(false);

	const handleCopyLink = () => {
		const url = `${window.location.origin}${window.location.pathname}#${id}`;
		navigator.clipboard.writeText(url).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1800);
		});
	};

	const Tag = `h${level}` as "h1" | "h2" | "h3";
	const sizeMap = {
		1: "text-xl font-bold font-mono tracking-widest mb-5 mt-14 text-slate-900 dark:text-white pb-2 border-b border-dashed border-neutral-800 flex items-center gap-2 uppercase",
		2: "text-sm font-bold font-mono tracking-wider mb-4 mt-10 text-slate-800 dark:text-slate-100 flex items-center gap-2.5 uppercase",
		3: "text-xs font-bold font-mono tracking-wide mb-3 mt-8 text-slate-700 dark:text-slate-200 flex items-center gap-2 uppercase",
	};

	return (
		<Tag id={id} className={`group scroll-mt-24 relative ${sizeMap[level]}`}>
			{level === 1 && (
				<span className="text-emerald-400 font-bold">&gt;&gt;</span>
			)}
			{children}
			{level !== 1 && (
				<button
					onClick={handleCopyLink}
					className="ml-2 inline-flex items-center text-slate-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
					title="Copy direct link to section"
				>
					{copied ? (
						<Check className="w-3.5 h-3.5 text-emerald-400" />
					) : (
						<Hash className="w-3.5 h-3.5" />
					)}
				</button>
			)}
		</Tag>
	);
}

// ─── Theme-Aware Badge ───────────────────────────────────────────────────────
export function Badge({
	children,
	color = "blue",
}: {
	children: React.ReactNode;
	color?: "blue" | "green" | "yellow" | "red" | "purple";
}) {
	const badgeStyles = {
		blue: "border-blue-900/80 text-blue-400 bg-blue-950/20",
		green: "border-emerald-900/80 text-emerald-400 bg-emerald-950/20",
		yellow: "border-amber-900/80 text-amber-400 bg-amber-950/20",
		red: "border-rose-900/80 text-rose-400 bg-rose-950/20",
		purple: "border-purple-900/80 text-purple-400 bg-purple-950/20",
	}[color];

	return (
		<span
			className={`inline-flex items-center px-2 py-0.5 rounded-none font-mono text-[9px] tracking-widest uppercase font-bold border ${badgeStyles}`}
		>
			[{children}]
		</span>
	);
}

// ─── Inline Code Tag ─────────────────────────────────────────────────────────
export function InlineCode({ children }: { children: React.ReactNode }) {
	return (
		<code className="font-mono text-[11px] px-1.5 py-0.5 rounded-none bg-neutral-900 dark:bg-black text-emerald-400 border border-neutral-800 font-bold">
			{children}
		</code>
	);
}
