"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
	User,
	Lock,
	Monitor,
	Bell,
	Eye,
	EyeOff,
	Loader2,
	CheckCircle2,
	AlertCircle,
	Trash2,
	Shield,
	Camera,
	LogOut,
	Smartphone,
	Globe,
	ToggleLeft,
	ToggleRight,
	RefreshCw,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { SettingsNav } from "@/components/settings/settings-nav";
import { useIncidentStream } from "@/hooks/useIncidentStream";
import { useAuth } from "@/hooks/use-auth";
import { authClient } from "@/lib/auth-client";
import { LogoutConfirmModal } from "@/components/auth/logout-confirm-modal";
import {
	profileService,
	ActiveSession,
	NotificationPreferences,
} from "@/services/profile.service";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseUA(ua: string | null | undefined): {
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

function getInitials(name?: string | null, email?: string): string {
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

function timeAgo(dateStr?: string): string {
	if (!dateStr) return "";
	const diff = Date.now() - new Date(dateStr).getTime();
	if (diff < 60000) return "JUST_NOW";
	if (diff < 3600000) return `${Math.floor(diff / 60000)}M_AGO`;
	if (diff < 86400000) return `${Math.floor(diff / 3600000)}H_AGO`;
	return `${Math.floor(diff / 86400000)}D_AGO`;
}

// ─── Toast Banner ────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -6 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -6 }}
			className={`flex items-center gap-2.5 px-4 py-2.5 rounded-none text-xs font-mono border ${
				type === "success"
					? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
					: "bg-rose-500/10 border-rose-500/30 text-rose-400"
			}`}
		>
			{type === "success" ? (
				<CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
			) : (
				<AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
			)}
			<span className="uppercase tracking-wide">{msg}</span>
		</motion.div>
	);
}

// ─── Section Card Wrapper ───────────────────────────────────────────────────

function Section({
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
			className="p-6 rounded-none bg-[var(--card)] border border-[var(--border)] space-y-6 shadow-sm font-mono relative overflow-hidden text-[var(--foreground)]"
		>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<span className="px-2.5 py-0.5 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] font-mono text-[9px] font-bold uppercase tracking-widest rounded-none">
							{tag}
						</span>
					</div>
					<h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--foreground)] uppercase font-mono">
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

// ─── Field Input Component ───────────────────────────────────────────────────

function Field({
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
		<div className="space-y-1.5 font-mono">
			<label
				htmlFor={id}
				className="block text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest"
			>
				{label}
			</label>
			<div className="relative">
				<input
					id={id}
					type={type}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className="w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-none text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none transition-all font-mono"
				/>
				{suffix && (
					<div className="absolute right-3.5 top-1/2 -translate-y-1/2">
						{suffix}
					</div>
				)}
			</div>
		</div>
	);
}

// ─── Toggle Button ───────────────────────────────────────────────────────────

function Toggle({
	id,
	enabled,
	onChange,
	disabled,
}: {
	id: string;
	enabled: boolean;
	onChange: (v: boolean) => void;
	disabled?: boolean;
}) {
	return (
		<button
			id={id}
			type="button"
			onClick={() => onChange(!enabled)}
			disabled={disabled}
			className="flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
			aria-pressed={enabled}
		>
			<span className="font-mono text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
				{enabled ? "[ENABLED]" : "[DISABLED]"}
			</span>
			{enabled ? (
				<ToggleRight className="w-8 h-8 text-emerald-400" />
			) : (
				<ToggleLeft className="w-8 h-8 text-[var(--muted-foreground)]" />
			)}
		</button>
	);
}

// ─── Action Button ───────────────────────────────────────────────────────────

function SubmitButton({
	loading,
	label = "[SAVE_CHANGES]",
}: {
	loading: boolean;
	label?: string;
}) {
	return (
		<button
			type="submit"
			disabled={loading}
			className="px-5 py-2.5 rounded-none border border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] font-mono font-bold text-xs transition-all cursor-pointer uppercase tracking-wider shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center gap-2"
		>
			{loading ? (
				<>
					<Loader2 className="w-3.5 h-3.5 animate-spin" />
					<span>[SAVING...]</span>
				</>
			) : (
				<span>{label}</span>
			)}
		</button>
	);
}

// ─── Section Skeleton Loader ──────────────────────────────────────────────────

function SectionSkeleton({
	tag,
	title,
	subtitle,
}: {
	tag: string;
	title: string;
	subtitle: string;
}) {
	return (
		<div className="p-6 rounded-none bg-[var(--card)] border border-[var(--border)] space-y-6 shadow-sm font-mono relative overflow-hidden animate-pulse">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
				<div className="space-y-2">
					<div className="w-36 h-4 bg-[var(--secondary)] rounded-none" />
					<h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--foreground)] uppercase font-mono">
						{title}
					</h2>
					<p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
						{subtitle}
					</p>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center gap-4 p-4 rounded-none bg-[var(--background)] border border-[var(--border)]">
					<div className="w-14 h-14 bg-[var(--secondary)] rounded-none shrink-0" />
					<div className="space-y-2 flex-1">
						<div className="w-40 h-4 bg-[var(--secondary)] rounded-none" />
						<div className="w-56 h-3 bg-[var(--secondary)] rounded-none" />
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<div className="w-24 h-3 bg-[var(--secondary)] rounded-none" />
						<div className="h-10 bg-[var(--background)] border border-[var(--border)] rounded-none" />
					</div>
					<div className="space-y-2">
						<div className="w-28 h-3 bg-[var(--secondary)] rounded-none" />
						<div className="h-10 bg-[var(--background)] border border-[var(--border)] rounded-none" />
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── Section 1: User Profile ─────────────────────────────────────────────────

function ProfileSection({ onSuccess }: { onSuccess: (msg: string) => void }) {
	const { user, isLoading: authLoading, refetchSession } = useAuth();
	const [name, setName] = useState(user?.name ?? "");
	const [image, setImage] = useState(user?.image ?? "");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (user) {
			setName(user.name ?? "");
			setImage(user.image ?? "");
		}
	}, [user]);

	if (authLoading || !user) {
		return (
			<SectionSkeleton
				tag="PROFILE // CREDENTIALS"
				title="User Identity"
				subtitle="Update public display name and avatar profile image link"
			/>
		);
	}

	const initials = getInitials(name || user?.name, user?.email);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			await profileService.updateProfile({
				name: name.trim() || undefined,
				image: image.trim() || undefined,
			});
			await refetchSession();
			onSuccess("PROFILE UPDATED SUCCESSFULLY");
		} catch (err: any) {
			setError(err.message || "FAILED TO UPDATE PROFILE");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Section
			id="profile"
			tag="PROFILE // CREDENTIALS"
			title="User Identity"
			subtitle="Update public display name and avatar profile image link"
		>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* User Card Header */}
				<div className="flex items-center gap-4 p-4 bg-[var(--background)] border border-[var(--border)] rounded-none">
					<div className="w-14 h-14 rounded-none border border-[var(--border)] bg-[var(--secondary)] flex items-center justify-center text-lg font-bold font-mono text-[var(--foreground)] shrink-0 overflow-hidden shadow-sm">
						{image ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={image}
								alt="avatar"
								className="w-full h-full object-cover"
							/>
						) : (
							initials
						)}
					</div>
					<div className="space-y-1 font-mono min-w-0">
						<div className="flex items-center gap-2">
							<span className="text-sm font-bold text-[var(--foreground)] truncate">
								{user?.name || "[UNSET_NAME]"}
							</span>
							<span className="px-2 py-0.5 rounded-none border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-[9px] font-bold uppercase tracking-widest">
								{user?.role || "VIEWER"}
							</span>
						</div>
						<p className="text-xs text-[var(--muted-foreground)] truncate">
							{user?.email}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Field
						id="profile-name"
						label="Display Name"
						value={name}
						onChange={setName}
						placeholder="Enter display name"
					/>
					<Field
						id="profile-avatar"
						label="Avatar Image URL"
						value={image}
						onChange={setImage}
						placeholder="https://domain.com/avatar.jpg"
						suffix={
							<Camera className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
						}
					/>
				</div>

				<AnimatePresence>
					{error && <Toast msg={error} type="error" />}
				</AnimatePresence>

				<div className="flex justify-end">
					<SubmitButton loading={loading} label="[UPDATE_PROFILE]" />
				</div>
			</form>
		</Section>
	);
}

// ─── Section 2: Password Security ───────────────────────────────────────────

function PasswordSection({ onSuccess }: { onSuccess: (msg: string) => void }) {
	const [current, setCurrent] = useState("");
	const [next, setNext] = useState("");
	const [confirm, setConfirm] = useState("");
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNext, setShowNext] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { user } = useAuth();
	const [resetLoading, setResetLoading] = useState(false);

	const handleSendResetEmail = async () => {
		if (!user?.email) return;
		setResetLoading(true);
		setError(null);
		try {
			const result = await authClient.requestPasswordReset({
				email: user.email,
				redirectTo: `${window.location.origin}/reset-password`,
			});
			if (result.error) {
				setError(
					result.error.message || "Failed to send reset password email.",
				);
			} else {
				onSuccess("RESET PASSWORD EMAIL SENT");
			}
		} catch (err: any) {
			setError(err.message || "Failed to send reset password email.");
		} finally {
			setResetLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		if (next !== confirm) {
			setError("NEW PASSWORDS DO NOT MATCH");
			return;
		}
		if (next.length < 8) {
			setError("NEW PASSWORD MUST BE AT LEAST 8 CHARACTERS");
			return;
		}
		setLoading(true);
		try {
			await profileService.changePassword(current, next);
			setCurrent("");
			setNext("");
			setConfirm("");
			onSuccess("PASSWORD CHANGED SUCCESSFULLY");
		} catch (err: any) {
			setError(err.message || "FAILED TO CHANGE PASSWORD");
		} finally {
			setLoading(false);
		}
	};

	const eyeToggle = (show: boolean, setShow: (v: boolean) => void) => (
		<button
			type="button"
			onClick={() => setShow(!show)}
			className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
		>
			{show ? (
				<EyeOff className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
			) : (
				<Eye className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
			)}
		</button>
	);

	return (
		<Section
			id="password"
			tag="SECURITY // AUTHENTICATION"
			title="Change Password"
			subtitle="Update your password to protect your user credentials"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<Field
					id="password-current"
					label="Current Password"
					type={showCurrent ? "text" : "password"}
					value={current}
					onChange={setCurrent}
					placeholder="••••••••"
					suffix={eyeToggle(showCurrent, setShowCurrent)}
				/>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Field
						id="password-new"
						label="New Password"
						type={showNext ? "text" : "password"}
						value={next}
						onChange={setNext}
						placeholder="Min 8 characters"
						suffix={eyeToggle(showNext, setShowNext)}
					/>
					<Field
						id="password-confirm"
						label="Confirm New Password"
						type="password"
						value={confirm}
						onChange={setConfirm}
						placeholder="Re-enter new password"
					/>
				</div>

				{/* Password Strength Indicator */}
				{next.length > 0 && (
					<div className="space-y-1.5 pt-1 font-mono">
						<div className="flex gap-1.5">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="h-1.5 flex-1 rounded-none transition-all"
									style={{
										background:
											next.length >= i * 4
												? i <= 2
													? "#f59e0b"
													: i === 3
														? "#3b82f6"
														: "#10b981"
												: "rgba(120,120,120,0.2)",
									}}
								/>
							))}
						</div>
						<p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
							STRENGTH:{" "}
							<span className="text-[var(--foreground)] font-bold">
								{next.length < 8
									? "INSUFFICIENT"
									: next.length < 12
										? "MODERATE"
										: next.length < 16
											? "GOOD"
											: "OPTIMAL"}
							</span>
						</p>
					</div>
				)}

				<AnimatePresence>
					{error && <Toast msg={error} type="error" />}
				</AnimatePresence>

				<div className="flex justify-between items-center pt-2 font-mono">
					<button
						type="button"
						onClick={handleSendResetEmail}
						disabled={resetLoading || !user?.email}
						className="text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:underline transition-all cursor-pointer disabled:opacity-50 uppercase font-bold"
					>
						{resetLoading
							? "[SENDING...]"
							: "[FORGOT_OR_RESET_PASSWORD_BY_EMAIL]"}
					</button>
					<SubmitButton loading={loading} label="[UPDATE_PASSWORD]" />
				</div>
			</form>
		</Section>
	);
}

// ─── Section 3: Active Sessions ──────────────────────────────────────────────

function SessionsSection({ onSuccess }: { onSuccess: (msg: string) => void }) {
	const { session: currentSession } = useAuth();
	const [sessions, setSessions] = useState<ActiveSession[]>([]);
	const [loading, setLoading] = useState(true);
	const [revoking, setRevoking] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fetchSessions = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await profileService.listSessions();
			setSessions(data);
		} catch (err: any) {
			setError(err?.response?.data?.error || "FAILED TO LOAD SESSIONS");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSessions();
	}, [fetchSessions]);

	const handleRevoke = async (token: string) => {
		setRevoking(token);
		try {
			await profileService.revokeSession(token);
			setSessions((prev) => prev.filter((s) => s.token !== token));
			onSuccess("SESSION TOKEN REVOKED");
		} catch {
			setError("FAILED TO REVOKE SESSION");
		} finally {
			setRevoking(null);
		}
	};

	return (
		<Section
			id="sessions"
			tag="TOKENS // ACTIVE SESSIONS"
			title="Active Sessions"
			subtitle="Authenticated devices and active token sessions connected to your account"
			badge={
				<button
					onClick={fetchSessions}
					disabled={loading}
					className="px-3 py-1.5 text-xs font-mono text-[var(--foreground)] bg-[var(--secondary)] border border-[var(--border)] rounded-none transition-all cursor-pointer uppercase flex items-center gap-1.5 shadow-sm hover:opacity-80"
				>
					<RefreshCw
						className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
					/>
					<span>{loading ? "[SYNCING...]" : "[REFRESH]"}</span>
				</button>
			}
		>
			{loading ? (
				<div className="space-y-3 font-mono">
					<div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest flex items-center gap-2 animate-pulse mb-2">
						<span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
						<span>[SYNCING_ACTIVE_SESSIONS...]</span>
					</div>
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-none border border-[var(--border)] bg-[var(--background)] animate-pulse"
						>
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 bg-[var(--secondary)] rounded-none shrink-0" />
								<div className="space-y-1.5 min-w-0">
									<div className="w-40 h-4 bg-[var(--secondary)] rounded-none" />
									<div className="w-56 h-3 bg-[var(--secondary)] rounded-none" />
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="space-y-3 font-mono">
					<AnimatePresence>
						{error && <Toast msg={error} type="error" />}
					</AnimatePresence>

					{sessions.length === 0 ? (
						<p className="text-xs text-[var(--muted-foreground)] py-6 text-center border border-dashed border-[var(--border)] rounded-none">
							NO ACTIVE SESSIONS RECORDED.
						</p>
					) : (
						sessions.map((s) => {
							const { browser, os, icon } = parseUA(s.userAgent);
							const isCurrent = s.token === currentSession?.token;
							return (
								<motion.div
									key={s.id}
									layout
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0, height: 0 }}
									className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-none border transition-all ${
										isCurrent
											? "bg-[var(--secondary)]/80 border-[var(--border)] shadow-sm"
											: "bg-[var(--background)]/80 border-[var(--border)] hover:border-[var(--primary)]"
									}`}
								>
									<div className="flex items-center gap-3 min-w-0">
										<div
											className={`w-9 h-9 rounded-none border flex items-center justify-center shrink-0 ${
												isCurrent
													? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
													: "bg-[var(--secondary)] border-[var(--border)] text-[var(--foreground)]"
											}`}
										>
											{icon}
										</div>
										<div className="min-w-0">
											<div className="flex items-center gap-2">
												<span className="text-xs font-bold text-[var(--foreground)] uppercase truncate">
													{browser} // {os}
												</span>
												{isCurrent && (
													<span className="px-2 py-0.5 rounded-none border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
														[CURRENT_SESSION]
													</span>
												)}
											</div>
											<p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 truncate">
												IP: {s.ipAddress || "INTERNAL"} · {timeAgo(s.createdAt)}{" "}
												· EXPIRES: {new Date(s.expiresAt).toLocaleDateString()}
											</p>
										</div>
									</div>

									{!isCurrent && (
										<button
											id={`revoke-session-${s.id}`}
											onClick={() => handleRevoke(s.token)}
											disabled={revoking === s.token}
											className="px-3.5 py-1.5 rounded-none text-[11px] border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-bold uppercase transition-all cursor-pointer shrink-0 self-end sm:self-center flex items-center gap-1.5 disabled:opacity-50"
										>
											{revoking === s.token ? (
												<Loader2 className="w-3.5 h-3.5 animate-spin" />
											) : (
												<Trash2 className="w-3.5 h-3.5" />
											)}
											<span>[REVOKE]</span>
										</button>
									)}
								</motion.div>
							);
						})
					)}
				</div>
			)}
		</Section>
	);
}

// ─── Section 4: Notification Rules ──────────────────────────────────────────

function NotificationsSection({
	onSuccess,
}: {
	onSuccess: (msg: string) => void;
}) {
	const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const savingRef = useRef(false);

	useEffect(() => {
		let unmounted = false;
		async function load() {
			try {
				setLoading(true);
				const data = await profileService.getNotificationPreferences();
				if (!unmounted) setPrefs(data);
			} catch (err: any) {
				if (!unmounted) setError("FAILED TO LOAD NOTIFICATION PREFERENCES");
			} finally {
				if (!unmounted) setLoading(false);
			}
		}
		load();
		return () => {
			unmounted = true;
		};
	}, []);

	const handleToggle = (key: keyof NotificationPreferences) => {
		if (!prefs) return;
		setPrefs((prev) => (prev ? { ...prev, [key]: !prev[key] } : null));
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!prefs || savingRef.current) return;
		savingRef.current = true;
		setSaving(true);
		setError(null);
		try {
			const updated = await profileService.updateNotificationPreferences(prefs);
			setPrefs(updated);
			onSuccess("NOTIFICATION PREFERENCES SAVED");
		} catch (err: any) {
			setError("FAILED TO SAVE PREFERENCES");
		} finally {
			setSaving(false);
			savingRef.current = false;
		}
	};

	if (loading) {
		return (
			<SectionSkeleton
				tag="ALERTS // PREFERENCES"
				title="Notification Rules"
				subtitle="Configure event subscription rules and alert dispatch channels"
			/>
		);
	}

	return (
		<Section
			id="notifications"
			tag="ALERTS // PREFERENCES"
			title="Notification Rules"
			subtitle="Configure event subscription rules and alert dispatch channels"
		>
			<form onSubmit={handleSave} className="space-y-6">
				<div className="space-y-4">
					<div className="flex items-center justify-between p-4 rounded-none border border-[var(--border)] bg-[var(--background)]/80">
						<div className="space-y-0.5">
							<span className="text-xs font-bold text-[var(--foreground)] uppercase">
								Email Alert Notifications
							</span>
							<p className="text-[11px] text-[var(--muted-foreground)]">
								Receive transactional email notifications when critical incident
								events trigger
							</p>
						</div>
						<Toggle
							id="notify-email"
							enabled={Boolean(prefs?.emailEnabled)}
							onChange={() => handleToggle("emailEnabled")}
						/>
					</div>

					<div className="flex items-center justify-between p-4 rounded-none border border-[var(--border)] bg-[var(--background)]/80">
						<div className="space-y-0.5">
							<span className="text-xs font-bold text-[var(--foreground)] uppercase">
								Slack Webhook Notifications
							</span>
							<p className="text-[11px] text-[var(--muted-foreground)]">
								Post formatted telemetry messages to connected Slack incoming
								webhook channels
							</p>
						</div>
						<Toggle
							id="notify-slack"
							enabled={Boolean(prefs?.slackEnabled)}
							onChange={() => handleToggle("slackEnabled")}
						/>
					</div>
				</div>

				<AnimatePresence>
					{error && <Toast msg={error} type="error" />}
				</AnimatePresence>

				<div className="flex justify-end">
					<SubmitButton loading={saving} label="[SAVE_PREFERENCES]" />
				</div>
			</form>
		</Section>
	);
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function ProfilePage() {
	const streamStatus = useIncidentStream();
	const [searchQuery, setSearchQuery] = useState("");
	const [activeSection, setActiveSection] = useState<
		"profile" | "password" | "sessions" | "notifications"
	>("profile");
	const [toastState, setToastState] = useState<{
		msg: string;
		type: "success" | "error";
	} | null>(null);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const { signOut } = useAuth();

	const handleConfirmLogout = async () => {
		setIsSigningOut(true);
		await signOut();
		setIsSigningOut(false);
		setIsLogoutModalOpen(false);
	};

	const showToast = useCallback(
		(text: string, type: "success" | "error" = "success") => {
			setToastState({ msg: text, type });
			setTimeout(() => setToastState(null), 3500);
		},
		[],
	);

	const navSections = [
		{
			id: "profile" as const,
			label: "01_IDENTITY",
			icon: <User className="w-3.5 h-3.5" />,
		},
		{
			id: "password" as const,
			label: "02_SECURITY",
			icon: <Lock className="w-3.5 h-3.5" />,
		},
		{
			id: "sessions" as const,
			label: "03_SESSIONS",
			icon: <Monitor className="w-3.5 h-3.5" />,
		},
		{
			id: "notifications" as const,
			label: "04_NOTIFICATIONS",
			icon: <Bell className="w-3.5 h-3.5" />,
		},
	];

	return (
		<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col relative selection:bg-slate-800 transition-colors duration-300">
			{/* Background Noise Layer */}
			<div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

			{/* Sticky Dashboard Header Navbar */}
			<DashboardHeader
				streamStatus={streamStatus}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				onOpenCreateModal={() => {}}
			/>

			{/* Main Content Area */}
			<main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 relative z-10 font-mono">
				<SettingsNav />

				{/* Toast Alert */}
				<AnimatePresence>
					{toastState && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="mb-4"
						>
							<Toast msg={toastState.msg} type={toastState.type} />
						</motion.div>
					)}
				</AnimatePresence>

				<div className="flex flex-col lg:flex-row gap-6 items-start">
					{/* Dashboard Sub-Sidebar Navigation */}
					<aside className="w-full lg:w-64 shrink-0 font-mono">
						<div className="p-3 rounded-none bg-[var(--card)] border border-[var(--border)] space-y-1.5 shadow-sm">
							<p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest px-2.5 py-1 mb-1">
								ACCOUNT_SECTIONS
							</p>
							{navSections.map((s) => {
								const isActive = activeSection === s.id;
								return (
									<button
										key={s.id}
										onClick={() => setActiveSection(s.id)}
										className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-none text-xs font-mono transition-all cursor-pointer uppercase ${
											isActive
												? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-sm"
												: "bg-[var(--secondary)]/60 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
										}`}
									>
										{s.icon}
										<span>{s.label}</span>
									</button>
								);
							})}

							<div className="pt-2 border-t border-[var(--border)] mt-2">
								<button
									onClick={() => setIsLogoutModalOpen(true)}
									className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-none text-xs transition-all cursor-pointer border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 uppercase font-bold"
								>
									<LogOut className="w-3.5 h-3.5" />
									<span>SIGN_OUT</span>
								</button>
							</div>
						</div>
					</aside>

					{/* Section Active View */}
					<div className="flex-1 min-w-0 w-full">
						<AnimatePresence mode="wait">
							{activeSection === "profile" && (
								<motion.div
									key="profile"
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.15 }}
								>
									<ProfileSection onSuccess={(msg) => showToast(msg)} />
								</motion.div>
							)}
							{activeSection === "password" && (
								<motion.div
									key="password"
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.15 }}
								>
									<PasswordSection onSuccess={(msg) => showToast(msg)} />
								</motion.div>
							)}
							{activeSection === "sessions" && (
								<motion.div
									key="sessions"
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.15 }}
								>
									<SessionsSection onSuccess={(msg) => showToast(msg)} />
								</motion.div>
							)}
							{activeSection === "notifications" && (
								<motion.div
									key="notifications"
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.15 }}
								>
									<NotificationsSection onSuccess={(msg) => showToast(msg)} />
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</main>

			<LogoutConfirmModal
				isOpen={isLogoutModalOpen}
				onClose={() => setIsLogoutModalOpen(false)}
				onConfirm={handleConfirmLogout}
				isLoading={isSigningOut}
			/>
		</div>
	);
}
