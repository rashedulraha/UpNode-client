"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	Globe,
	Smartphone,
	Monitor,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";

export function parseUA(ua: string | null | undefined): {
	browser: string;
	os: string;
	icon: React.ReactNode;
} {
	if (!ua)
		return {
			browser: "UNKNOWN_BROWSER",
			os: "UNKNOWN_OS",
			icon: <Globe className="w-4 h-4" />,
		};
	const isMobile = /mobile|android|iphone|ipad/i.test(ua);
	const isChrome = /chrome/i.test(ua) && !/edg|opr/i.test(ua);
	const isFirefox = /firefox/i.test(ua);
	const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua);
	const isEdge = /edg/i.test(ua);
	const browser = isChrome
		? "Chrome"
		: isFirefox
			? "Firefox"
			: isSafari
				? "Safari"
				: isEdge
					? "Edge"
					: "Browser";

	const isWindows = /windows/i.test(ua);
	const isMac = /macintosh|mac os x/i.test(ua);
	const isLinux = /linux/i.test(ua);
	const os = isMobile
		? "Mobile"
		: isWindows
			? "Windows"
			: isMac
				? "macOS"
				: isLinux
					? "Linux"
					: "Unknown OS";

	const icon = isMobile ? (
		<Smartphone className="w-4 h-4" />
	) : (
		<Monitor className="w-4 h-4" />
	);
	return { browser, os, icon };
}

export function getInitials(name?: string | null, email?: string): string {
	if (name && name.trim()) {
		return name
			.trim()
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	}
	return (email?.[0] ?? "U").toUpperCase();
}

export function timeAgo(dateStr?: string): string {
	if (!dateStr) return "";
	const diff = Date.now() - new Date(dateStr).getTime();
	if (diff < 60000) return "JUST_NOW";
	if (diff < 3600000) return `${Math.floor(diff / 60000)}M_AGO`;
	if (diff < 86400000) return `${Math.floor(diff / 3600000)}H_AGO`;
	return `${Math.floor(diff / 86400000)}D_AGO`;
}

export function Toast({
	msg,
	type,
}: {
	msg: string;
	type: "success" | "error";
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -6 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -6 }}
			className={`flex items-center gap-2.5 px-4 py-2.5 rounded-none text-xs font-mono border ${
				type === "success"
					? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
					: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
			}`}
		>
			{type === "success" ? (
				<CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
			) : (
				<AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
			)}
			<span className="uppercase tracking-wide">{msg}</span>
		</motion.div>
	);
}

export function Section({
	id,
	tag,
	title,
	subtitle,
	badge,
	children,
}: {
	id: string;
	tag: string;
	title: string;
	subtitle: string;
	badge?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<motion.div
			id={id}
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.25 }}
			className="p-6 rounded-none bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] space-y-6 shadow-sm font-mono relative overflow-hidden"
		>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<span className="px-2 py-0.5 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] font-mono text-[9px] font-bold uppercase tracking-widest">
							{tag}
						</span>
					</div>
					<h2 className="text-base sm:text-lg font-light tracking-tight text-[var(--foreground)] uppercase font-mono">
						{title}
					</h2>
					<p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
						{subtitle}
					</p>
				</div>
				{badge}
			</div>
			{children}
		</motion.div>
	);
}

export function Field({
	label,
	id,
	type = "text",
	value,
	onChange,
	placeholder,
	suffix,
}: {
	label: string;
	id: string;
	type?: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	suffix?: React.ReactNode;
}) {
	return (
		<div className="space-y-2">
			<label
				htmlFor={id}
				className="block text-xs font-mono text-[var(--foreground)] font-semibold uppercase tracking-wider"
			>
				{label}
			</label>
			<div className="relative flex items-center">
				<input
					id={id}
					type={type}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-none text-xs font-mono text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
				/>
				{suffix && (
					<div className="absolute right-3 cursor-pointer">{suffix}</div>
				)}
			</div>
		</div>
	);
}
