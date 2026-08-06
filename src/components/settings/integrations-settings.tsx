"use client";

import React, { useState, useEffect } from "react";
import {
	integrationsService,
	ProjectIntegrationSetting,
} from "@/services/integrations.service";
import { SettingsNav } from "@/components/settings/settings-nav";
import {
	Hash,
	Mail,
	CheckCircle2,
	AlertCircle,
	Save,
	BellRing,
	Layers,
	Sparkles,
	Loader2,
} from "lucide-react";
import { MaintenanceSettings } from "@/components/settings/maintenance-settings";

export function IntegrationsSettings() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	// Form states
	const [orgSlackWebhook, setOrgSlackWebhook] = useState("");
	const [orgAlertEmail, setOrgAlertEmail] = useState("");
	const [projects, setProjects] = useState<ProjectIntegrationSetting[]>([]);

	useEffect(() => {
		fetchIntegrations();
	}, []);

	const fetchIntegrations = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await integrationsService.getIntegrations();
			setOrgSlackWebhook(data.slackWebhookUrl || "");
			setOrgAlertEmail(data.alertEmail || "");
			setProjects(data.projects || []);
		} catch (err: any) {
			setError(
				err.response?.data?.error || "Failed to load integration settings.",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleProjectSettingChange = (
		projectId: string,
		field: "slackWebhookUrl" | "alertEmail",
		value: string,
	) => {
		setProjects((prev) =>
			prev.map((p) => (p.id === projectId ? { ...p, [field]: value } : p)),
		);
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setSaving(true);
			setError(null);
			setSuccessMessage(null);

			const updated = await integrationsService.updateIntegrations({
				slackWebhookUrl: orgSlackWebhook.trim() || null,
				alertEmail: orgAlertEmail.trim() || null,
				projects: projects.map((p) => ({
					id: p.id,
					slackWebhookUrl: p.slackWebhookUrl?.trim() || null,
					alertEmail: p.alertEmail?.trim() || null,
				})),
			});

			setOrgSlackWebhook(updated.slackWebhookUrl || "");
			setOrgAlertEmail(updated.alertEmail || "");
			setProjects(updated.projects || []);
			setSuccessMessage("Integration alert settings updated successfully!");
			setTimeout(() => setSuccessMessage(null), 4000);
		} catch (err: any) {
			setError(
				err.response?.data?.error || "Failed to update integration settings.",
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="space-y-6 font-mono animate-pulse">
				<SettingsNav />
				<div className="p-8 rounded-none bg-[var(--card)] border border-[var(--border)] text-center text-xs text-[var(--muted-foreground)]">
					[LOADING_INTEGRATION_SETTINGS...]
				</div>
			</div>
		);
	}

	const isSlackConfigured = Boolean(orgSlackWebhook.trim());
	const isEmailConfigured = Boolean(orgAlertEmail.trim());

	return (
		<div className="space-y-6 font-mono text-xs select-none text-[var(--foreground)]">
			<SettingsNav />

			<form onSubmit={handleSave} className="space-y-6">
				{/* Feedback alerts */}
				{error && (
					<div className="p-4 rounded-none bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
						<AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
						<span>[ERR]: {error}</span>
					</div>
				)}

				{successMessage && (
					<div className="p-4 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
						<CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
						<span>[SUCCESS]: {successMessage}</span>
					</div>
				)}

				{/* 1. Global / Organization Level Alert Integrations Card */}
				<div className="p-6 rounded-none bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] space-y-6 shadow-sm">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
						<div className="flex items-center gap-3">
							<div className="p-2.5 rounded-none bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] shrink-0">
								<BellRing className="w-4 h-4 text-emerald-400" />
							</div>
							<div>
								<h2 className="text-base font-bold text-[var(--foreground)] uppercase tracking-wider font-mono">
									Organization Alert Channels
								</h2>
								<p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 font-mono">
									Default Slack Webhook URL and email recipients for all
									incident notifications across your organization.
								</p>
							</div>
						</div>

						<span className="text-[10px] font-mono px-2.5 py-1 rounded-none border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] font-bold uppercase shrink-0 self-start sm:self-center">
							ORGANIZATION DEFAULT
						</span>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Slack Webhook Input */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)] uppercase">
									<Hash className="w-3.5 h-3.5 text-emerald-400" />
									<span>Slack Incoming Webhook URL</span>
								</label>
								<span
									className={`text-[9px] px-2 py-0.5 rounded-none border font-mono font-bold uppercase ${
										isSlackConfigured
											? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
											: "border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)]"
									}`}
								>
									{isSlackConfigured ? "CONFIGURED" : "UNCONFIGURED"}
								</span>
							</div>

							<input
								type="url"
								value={orgSlackWebhook}
								onChange={(e) => setOrgSlackWebhook(e.target.value)}
								placeholder="https://hooks.slack.com/services/T000/B000/XXXX"
								className="w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-none text-xs font-mono text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none transition-all shadow-inner"
							/>
							<p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed font-mono">
								Slack Webhook posts rich, block-formatted alerts to your
								team&apos;s Slack channel when an incident triggers.
							</p>
						</div>

						{/* Alert Email Input */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)] uppercase">
									<Mail className="w-3.5 h-3.5 text-sky-400" />
									<span>Transactional Alert Emails</span>
								</label>
								<span
									className={`text-[9px] px-2 py-0.5 rounded-none border font-mono font-bold uppercase ${
										isEmailConfigured
											? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
											: "border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)]"
									}`}
								>
									{isEmailConfigured ? "CONFIGURED" : "UNCONFIGURED"}
								</span>
							</div>

							<input
								type="text"
								value={orgAlertEmail}
								onChange={(e) => setOrgAlertEmail(e.target.value)}
								placeholder="sre@company.com, alerts@company.com"
								className="w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-none text-xs font-mono text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none transition-all shadow-inner"
							/>
							<p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed font-mono">
								Comma-separated email addresses to receive instant incident
								email notifications via Resend API.
							</p>
						</div>
					</div>
				</div>

				{/* 2. Per-Project Alert Overrides */}
				<div className="p-6 rounded-none bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] space-y-6 shadow-sm">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
						<div className="flex items-center gap-3">
							<div className="p-2.5 rounded-none bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] shrink-0">
								<Layers className="w-4 h-4 text-sky-400" />
							</div>
							<div>
								<h2 className="text-base font-bold text-[var(--foreground)] uppercase tracking-wider font-mono">
									Project Specific Overrides
								</h2>
								<p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 font-mono">
									Optionally configure dedicated Slack webhooks or email
									channels for specific microservices or projects.
								</p>
							</div>
						</div>

						<span className="text-[10px] font-mono px-2.5 py-1 rounded-none border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] font-bold uppercase shrink-0 self-start sm:self-center">
							{projects.length} PROJECTS
						</span>
					</div>

					{projects.length === 0 ? (
						<div className="py-8 text-center text-xs text-[var(--muted-foreground)] font-mono border border-[var(--border)] bg-[var(--background)]/60 rounded-none">
							[NO_PROJECTS_AVAILABLE_IN_THIS_ORGANIZATION]
						</div>
					) : (
						<div className="space-y-4 font-mono">
							{projects.map((proj) => (
								<div
									key={proj.id}
									className="p-5 rounded-none bg-[var(--background)]/60 border border-[var(--border)] space-y-4 transition-colors hover:border-[var(--primary)]"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Sparkles className="w-3.5 h-3.5 text-emerald-400" />
											<h3 className="text-xs font-bold text-[var(--foreground)] uppercase">
												{proj.name}
											</h3>
										</div>
										<span className="text-[10px] font-mono text-[var(--muted-foreground)]">
											ID: {proj.id.slice(0, 8)}...
										</span>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
										<div>
											<label className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">
												[SLACK_WEBHOOK_OVERRIDE]
											</label>
											<input
												type="url"
												value={proj.slackWebhookUrl || ""}
												onChange={(e) =>
													handleProjectSettingChange(
														proj.id,
														"slackWebhookUrl",
														e.target.value,
													)
												}
												placeholder="[INHERITS ORG SLACK WEBHOOK]"
												className="w-full px-3.5 py-2 bg-[var(--card)] border border-[var(--border)] rounded-none text-xs font-mono text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
											/>
										</div>

										<div>
											<label className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">
												[ALERT_EMAILS_OVERRIDE]
											</label>
											<input
												type="text"
												value={proj.alertEmail || ""}
												onChange={(e) =>
													handleProjectSettingChange(
														proj.id,
														"alertEmail",
														e.target.value,
													)
												}
												placeholder="[INHERITS ORG ALERT EMAILS]"
												className="w-full px-3.5 py-2 bg-[var(--card)] border border-[var(--border)] rounded-none text-xs font-mono text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
											/>
										</div>
									</div>

									{/* Maintenance Window — per project */}
									<div className="pt-3 border-t border-[var(--border)]">
										<MaintenanceSettings
											projectId={proj.id}
											projectName={proj.name}
										/>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Action Footer */}
				<div className="flex items-center justify-end gap-4 pt-2 font-mono">
					<button
						type="submit"
						disabled={saving}
						className="px-5 py-2.5 rounded-none border border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] font-mono font-bold text-xs transition-all cursor-pointer shrink-0 uppercase tracking-wider shadow-sm hover:opacity-90 flex items-center gap-2 disabled:opacity-50 active:scale-95"
					>
						{saving ? (
							<>
								<Loader2 className="w-3.5 h-3.5 animate-spin" />
								<span>[SAVING_CHANGES...]</span>
							</>
						) : (
							<>
								<Save className="w-3.5 h-3.5" />
								<span>[SAVE_INTEGRATION_SETTINGS]</span>
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}

export default IntegrationsSettings;
