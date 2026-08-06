"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Building2,
	ArrowRight,
	CheckCircle2,
	Loader2,
	Users,
	Folder,
	Radio,
	Terminal,
	X,
} from "lucide-react";
import { organizationService } from "@/services/organization.service";

interface OnboardingWizardProps {
	userName: string;
	onComplete: (orgId: string, orgName: string) => void;
}

const ONBOARDING_KEY = "upnode_onboarding_complete";

export function OnboardingWizard({
	userName,
	onComplete,
}: OnboardingWizardProps) {
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [orgName, setOrgName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [createdOrg, setCreatedOrg] = useState<{
		id: string;
		name: string;
	} | null>(null);

	const handleCreate = async () => {
		if (!orgName.trim() || orgName.trim().length < 2) {
			setError("Organization name must be at least 2 characters.");
			return;
		}
		setIsSubmitting(true);
		setError(null);
		try {
			const org = await organizationService.createOrganization(orgName.trim());
			// Store the org ID for later use
			if (typeof window !== "undefined") {
				localStorage.setItem("activeOrganizationId", org.id);
				localStorage.setItem(ONBOARDING_KEY, "true");
			}
			setCreatedOrg(org);
			setStep(3);
		} catch (err: any) {
			setError(
				err?.message || "Failed to create organization. Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFinish = () => {
		if (createdOrg) {
			onComplete(createdOrg.id, createdOrg.name);
		}
	};

	const displayName = userName?.split(" ")[0] || "there";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			{/* Noise Texture */}
			<div className="fixed inset-0 pointer-events-none opacity-[0.025] z-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

			<motion.div
				initial={{ opacity: 0, y: 24, scale: 0.97 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
				className="relative z-10 w-full max-w-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 shadow-2xl font-mono overflow-hidden"
			>
				{/* Top accent line */}
				<div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-slate-900 dark:via-white to-transparent opacity-20" />

				{/* Step Progress Bar */}
				<div className="flex border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black">
					{[1, 2, 3].map((s) => (
						<div
							key={s}
							className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-widest transition-colors border-r border-slate-200 dark:border-neutral-800 last:border-r-0 ${
								step === s
									? "bg-slate-900 dark:bg-white text-white dark:text-black"
									: step > s
										? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
										: "text-slate-400 dark:text-neutral-600"
							}`}
						>
							{step > s ? "✓" : `0${s}`}
						</div>
					))}
				</div>

				<AnimatePresence mode="wait">
					{/* STEP 1: Welcome */}
					{step === 1 && (
						<motion.div
							key="step1"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.2 }}
							className="p-8 space-y-6"
						>
							<div className="space-y-3">
								<div className="inline-flex items-center gap-2 px-2.5 py-1 border border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-black text-[10px] text-slate-600 dark:text-neutral-400 uppercase tracking-widest">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
									<span>NEW_SESSION // ONBOARDING</span>
								</div>
								<h2 className="text-2xl font-light uppercase tracking-tight text-slate-900 dark:text-white">
									Welcome, {displayName}.
								</h2>
								<p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed max-w-sm">
									UpNode is an incident management and uptime monitoring
									platform. Let&apos;s set up your workspace in under 60
									seconds.
								</p>
							</div>

							{/* Feature Grid */}
							<div className="grid grid-cols-2 gap-3">
								{[
									{
										icon: <Radio className="w-4 h-4" />,
										label: "Real-time incident stream",
										badge: "SSE",
									},
									{
										icon: <Terminal className="w-4 h-4" />,
										label: "AI root-cause diagnostics",
										badge: "AI",
									},
									{
										icon: <Folder className="w-4 h-4" />,
										label: "Multi-project uptime tracking",
										badge: "PING",
									},
									{
										icon: <Users className="w-4 h-4" />,
										label: "Team roles & alert routing",
										badge: "TEAM",
									},
								].map((item) => (
									<div
										key={item.badge}
										className="p-3 border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black space-y-2"
									>
										<div className="flex items-center justify-between">
											<span className="text-slate-600 dark:text-neutral-400">
												{item.icon}
											</span>
											<span className="text-[9px] font-bold px-1.5 py-0.5 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-500 dark:text-neutral-500 uppercase">
												{item.badge}
											</span>
										</div>
										<p className="text-[10px] text-slate-600 dark:text-neutral-400 leading-relaxed">
											{item.label}
										</p>
									</div>
								))}
							</div>

							<button
								onClick={() => setStep(2)}
								className="w-full py-3 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer border border-slate-900 dark:border-white"
							>
								<span>[START_SETUP]</span>
								<ArrowRight className="w-3.5 h-3.5" />
							</button>
						</motion.div>
					)}

					{/* STEP 2: Create Organization */}
					{step === 2 && (
						<motion.div
							key="step2"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.2 }}
							className="p-8 space-y-6"
						>
							<div className="space-y-2">
								<div className="inline-flex items-center gap-2 px-2.5 py-1 border border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-black text-[10px] text-slate-600 dark:text-neutral-400 uppercase tracking-widest">
									<Building2 className="w-3 h-3" />
									<span>STEP 02 // CREATE_WORKSPACE</span>
								</div>
								<h2 className="text-xl font-light uppercase tracking-tight text-slate-900 dark:text-white">
									Name your organization
								</h2>
								<p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
									This is your team workspace. You&apos;ll be set as{" "}
									<span className="text-slate-900 dark:text-white font-bold">
										[ADMIN]
									</span>{" "}
									and can invite teammates after setup.
								</p>
							</div>

							<div className="space-y-2">
								<label className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">
									ORGANIZATION_NAME
								</label>
								<input
									id="org-name-input"
									type="text"
									value={orgName}
									onChange={(e) => {
										setOrgName(e.target.value);
										if (error) setError(null);
									}}
									onKeyDown={(e) => e.key === "Enter" && handleCreate()}
									placeholder="e.g. Acme Engineering, ByteForce Labs..."
									autoFocus
									className="w-full px-4 py-3 border border-slate-300 dark:border-neutral-700 bg-white dark:bg-black text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:border-slate-500 dark:focus:border-neutral-400 focus:outline-none transition-colors font-mono"
								/>
								{/* Slug preview */}
								{orgName.trim().length >= 2 && (
									<p className="text-[10px] text-slate-400 dark:text-neutral-600 font-mono">
										SLUG:{" "}
										<span className="text-slate-700 dark:text-neutral-300">
											{orgName
												.trim()
												.toLowerCase()
												.replace(/[^a-z0-9\s-]/g, "")
												.replace(/\s+/g, "-")
												.slice(0, 50)}
										</span>
									</p>
								)}
								{error && (
									<p className="text-[10px] text-rose-500 font-mono">
										[ERR]: {error}
									</p>
								)}
							</div>

							<div className="p-3 border border-amber-500/20 bg-amber-500/[0.03] text-[10px] text-slate-500 dark:text-neutral-400">
								<span className="text-amber-600 dark:text-amber-500 font-bold">
									[INFO]
								</span>{" "}
								You will automatically become the{" "}
								<span className="font-bold text-slate-800 dark:text-neutral-200">
									ADMIN
								</span>{" "}
								of this organization with full management permissions.
							</div>

							<div className="flex gap-3">
								<button
									onClick={() => setStep(1)}
									className="px-4 py-3 border border-slate-200 dark:border-neutral-800 text-xs text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-neutral-600 transition-colors cursor-pointer uppercase"
								>
									[BACK]
								</button>
								<button
									onClick={handleCreate}
									disabled={isSubmitting || orgName.trim().length < 2}
									className="flex-1 py-3 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer border border-slate-900 dark:border-white"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="w-3.5 h-3.5 animate-spin" />
											<span>[CREATING...]</span>
										</>
									) : (
										<>
											<span>[CREATE_WORKSPACE]</span>
											<ArrowRight className="w-3.5 h-3.5" />
										</>
									)}
								</button>
							</div>
						</motion.div>
					)}

					{/* STEP 3: Done */}
					{step === 3 && createdOrg && (
						<motion.div
							key="step3"
							initial={{ opacity: 0, scale: 0.97 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.25 }}
							className="p-8 space-y-6 text-center"
						>
							<div className="flex flex-col items-center gap-4">
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{
										delay: 0.1,
										type: "spring",
										stiffness: 300,
										damping: 20,
									}}
									className="w-16 h-16 border-2 border-emerald-500 bg-emerald-500/10 flex items-center justify-center"
								>
									<CheckCircle2 className="w-8 h-8 text-emerald-500" />
								</motion.div>

								<div className="space-y-2">
									<div className="inline-flex items-center gap-2 px-2.5 py-1 border border-emerald-500/30 bg-emerald-500/5 text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
										<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
										<span>WORKSPACE_CREATED</span>
									</div>
									<h2 className="text-xl font-light uppercase tracking-tight text-slate-900 dark:text-white">
										You&apos;re all set!
									</h2>
									<p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
										Your organization{" "}
										<span className="font-bold text-slate-900 dark:text-white">
											[{createdOrg.name.toUpperCase()}]
										</span>{" "}
										has been created. You are now the ADMIN.
									</p>
								</div>
							</div>

							{/* What's next */}
							<div className="text-left p-4 border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-black space-y-2">
								<p className="text-[10px] font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mb-3">
									NEXT_STEPS
								</p>
								{[
									"Create your first project (URL monitoring)",
									"Invite teammates via Settings > Team",
									"Configure Slack webhook for alert routing",
								].map((item, i) => (
									<div
										key={i}
										className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-neutral-400"
									>
										<span className="text-emerald-500 font-bold">
											[{String(i + 1).padStart(2, "0")}]
										</span>
										{item}
									</div>
								))}
							</div>

							<button
								onClick={handleFinish}
								className="w-full py-3 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer border border-slate-900 dark:border-white"
							>
								<span>[LAUNCH_DASHBOARD]</span>
								<ArrowRight className="w-3.5 h-3.5" />
							</button>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}

export { ONBOARDING_KEY };
export default OnboardingWizard;
