"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
	Loader2,
	CheckCircle2,
	AlertCircle,
	ShieldAlert,
	ArrowLeft,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function UnsubscribePage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-mono text-xs">
					<Loader2 className="h-5 w-5 animate-spin text-slate-400 dark:text-neutral-500" />
				</div>
			}
		>
			<UnsubscribeContent />
		</Suspense>
	);
}

function UnsubscribeContent() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";
	const projectId = searchParams.get("project") || "";
	const token = searchParams.get("token") || "";

	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [message, setMessage] = useState<string | null>(null);

	const handleUnsubscribe = async () => {
		if (!email || !projectId || !token) {
			setStatus("error");
			setMessage(
				"Invalid unsubscribe link parameters. Please check your email link.",
			);
			return;
		}

		setStatus("loading");
		setMessage(null);

		try {
			const serverUrl =
				process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";
			const res = await fetch(
				`${serverUrl}/api/projects/public/unsubscribe?email=${encodeURIComponent(
					email,
				)}&project=${encodeURIComponent(projectId)}&token=${encodeURIComponent(token)}`,
			);

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || data.error || "Failed to unsubscribe.");
			}

			setStatus("success");
			setMessage(
				data.message ||
					`Successfully unsubscribed ${email} from incident alerts.`,
			);
		} catch (err: any) {
			setStatus("error");
			setMessage(
				err.message ||
					"An error occurred while processing your unsubscribe request.",
			);
		}
	};

	useEffect(() => {
		if (email && projectId && token) {
			handleUnsubscribe();
		} else {
			setStatus("error");
			setMessage("Missing required unsubscribe parameters.");
		}
	}, [email, projectId, token]);

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-sans flex flex-col justify-between p-6 sm:p-12 relative">
			{/* Background Noise Grid Overlay */}
			<div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

			{/* Header */}
			<div className="flex items-center justify-between relative z-10">
				<Link href="/" className="flex items-center gap-2">
					<span className="font-bold text-sm tracking-widest uppercase font-mono text-slate-900 dark:text-white">
						UPNODE
					</span>
					<span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-100 dark:bg-black text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800">
						GDPR COMPLIANT
					</span>
				</Link>
				<div className="flex items-center gap-3">
					<ThemeToggle />
					<Link
						href="/"
						className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-1.5"
					>
						<ArrowLeft className="w-3.5 h-3.5" />
						<span>[HOME]</span>
					</Link>
				</div>
			</div>

			{/* Main Content Box */}
			<div className="my-auto max-w-md w-full mx-auto p-6 sm:p-8 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-lg shadow-sm relative z-10 font-mono text-xs space-y-6">
				<div className="text-center space-y-2">
					<div className="inline-flex items-center justify-center p-3 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-full text-slate-900 dark:text-white">
						<ShieldAlert className="w-6 h-6 text-amber-500" />
					</div>
					<h1 className="text-lg font-bold uppercase tracking-wide text-slate-900 dark:text-white">
						Email Subscription Management
					</h1>
					<p className="text-slate-500 dark:text-neutral-400 text-[11px] leading-relaxed">
						GDPR Article 17 Compliant One-Click Unsubscribe Portal
					</p>
				</div>

				{status === "loading" && (
					<div className="p-4 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-center space-y-2 rounded">
						<Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-600 dark:text-neutral-400" />
						<p className="text-slate-600 dark:text-neutral-300 font-bold uppercase">
							Processing Unsubscribe Request...
						</p>
					</div>
				)}

				{status === "success" && (
					<div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-2 rounded">
						<div className="flex items-center gap-2 font-bold uppercase">
							<CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
							<span>[UNSUBSCRIBED_SUCCESSFULLY]</span>
						</div>
						<p className="text-[11px] leading-relaxed">{message}</p>
					</div>
				)}

				{status === "error" && (
					<div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 space-y-2 rounded">
						<div className="flex items-center gap-2 font-bold uppercase">
							<AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
							<span>[UNSUBSCRIBE_FAILED]</span>
						</div>
						<p className="text-[11px] leading-relaxed">{message}</p>
						<button
							onClick={handleUnsubscribe}
							className="mt-2 py-1.5 px-3 bg-rose-500 text-white font-bold uppercase text-[10px] rounded hover:opacity-90 transition-all cursor-pointer"
						>
							Retry Unsubscribe
						</button>
					</div>
				)}

				{email && (
					<div className="p-3 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[11px] text-slate-500 dark:text-neutral-400 space-y-1 rounded">
						<p>
							<span className="font-bold text-slate-700 dark:text-neutral-300">
								Target Email:
							</span>{" "}
							{email}
						</p>
						<p>
							<span className="font-bold text-slate-700 dark:text-neutral-300">
								Project ID:
							</span>{" "}
							{projectId}
						</p>
					</div>
				)}

				<div className="pt-2 text-center">
					<Link
						href="/"
						className="inline-block py-2 px-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider text-xs border border-slate-900 dark:border-white hover:opacity-90 transition-all rounded"
					>
						Return to UpNode
					</Link>
				</div>
			</div>

			{/* Footer */}
			<div className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 text-center tracking-widest uppercase relative z-10">
				UPNODE TELEMETRY PLATFORM // GDPR ARTICLE 17 COMPLIANT
			</div>
		</div>
	);
}
