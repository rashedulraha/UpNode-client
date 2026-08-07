"use client";

import React, {
	useState,
	useEffect,
	useCallback,
	useRef,
	useMemo,
} from "react";
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
	ArrowLeft,
	Users,
	Sliders,
	Palette,
	Building2,
	ChevronRight,
	Sparkles,
	PanelLeftClose,
	PanelLeftOpen,
	ShieldCheck,
	Edit3,
	UserPlus,
	Cpu,
	Search,
	LayoutDashboard,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { useIncidentStream } from "@/hooks/useIncidentStream";
import { useAuth } from "@/hooks/use-auth";
import { authClient } from "@/lib/auth-client";
import { LogoutConfirmModal } from "@/components/auth/logout-confirm-modal";
import { RoleSwitcher } from "@/components/auth/role-switcher";
import {
	profileService,
	ActiveSession,
	NotificationPreferences,
} from "@/services/profile.service";
import { organizationService } from "@/services/organization.service";
import MemberList from "@/components/team/member-list";
import InviteMemberModal from "@/components/team/invite-member-modal";
import { useMembers } from "@/hooks/use-team";
import { ThemeSettings } from "@/components/settings/theme-settings";
import IntegrationsSettings from "@/components/settings/integrations-settings";

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
			className={`flex items-center gap-2.5 px-4 py-2.5 rounded-none text-xs font-mono border shadow-md ${
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
			<span className="uppercase tracking-wide font-bold">{msg}</span>
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
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			className="p-6 sm:p-7 rounded-none bg-[var(--card)] border border-[var(--border)] space-y-6 shadow-sm font-mono relative overflow-visible text-[var(--foreground)]"
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

// ─── Section 0: Welcome & Identity Overview ────────────────────────────────────

function IdentityOverviewSection({
	onNavigateToProfile,
}: {
	onNavigateToProfile: () => void;
}) {
	const { user } = useAuth();
	const [activeOrgName, setActiveOrgName] = useState<string>("Loading...");

	useEffect(() => {
		organizationService
			.getUserOrganizations()
			.then((orgs) => {
				if (orgs.length > 0) {
					const activeOrgId =
						typeof window !== "undefined"
							? localStorage.getItem("activeOrganizationId")
							: null;
					const found = orgs.find((o) => o.id === activeOrgId) || orgs[0];
					setActiveOrgName(found.name);
				} else {
					setActiveOrgName("No Active Organization");
				}
			})
			.catch(() => setActiveOrgName("Organization Workspace"));
	}, []);

	const initials = getInitials(user?.name, user?.email);

	return (
		<div className="space-y-6 font-mono">
			{/* Welcome Hero Card */}
			<div className="p-6 sm:p-8 rounded-none bg-[var(--card)] border border-[var(--border)] shadow-md relative overflow-hidden">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
					<div className="flex items-center gap-5">
						<div className="w-16 h-16 rounded-none bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center text-xl font-bold shrink-0 overflow-hidden shadow-inner">
							{user?.image ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={user.image}
									alt="avatar"
									className="w-full h-full object-cover"
								/>
							) : (
								initials
							)}
						</div>
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<span className="text-[10px] px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-widest">
									[ONLINE_ACCOUNT]
								</span>
							</div>
							<h2 className="text-xl sm:text-2xl font-bold uppercase text-[var(--foreground)] tracking-tight">
								WELCOME BACK,{" "}
								{user?.name || user?.email?.split("@")[0] || "USER"}!
							</h2>
							<p className="text-xs text-[var(--muted-foreground)]">
								{user?.email} · ROLE:{" "}
								<span className="text-[var(--foreground)] font-bold">
									[{user?.role || "USER"}]
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Account & Organization Overview Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* Active Organization Card */}
				<div className="p-5 bg-[var(--card)] border border-[var(--border)] space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold tracking-widest flex items-center gap-1.5">
							<Building2 className="w-4 h-4 text-sky-400" />
							<span>ACTIVE_ORGANIZATION</span>
						</span>
						<span className="text-[9px] px-1.5 py-0.5 bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] font-bold">
							WORKSPACE
						</span>
					</div>
					<h3 className="text-lg font-bold uppercase text-[var(--foreground)] truncate">
						{activeOrgName}
					</h3>
					<p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
						Connected telemetry metrics, projects, and incident streams belong
						to this organization.
					</p>
				</div>

				{/* Account Security & Verification Card */}
				<div className="p-5 bg-[var(--card)] border border-[var(--border)] space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold tracking-widest flex items-center gap-1.5">
							<ShieldCheck className="w-4 h-4 text-emerald-400" />
							<span>SECURITY_STATUS</span>
						</span>
						<span className="text-[9px] px-1.5 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold uppercase">
							VERIFIED
						</span>
					</div>
					<h3 className="text-lg font-bold uppercase text-[var(--foreground)]">
						PROTECTED SESSION
					</h3>
					<p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
						Session tokens are encrypted. Password and active devices can be
						managed under Security & Sessions.
					</p>
				</div>
			</div>
		</div>
	);
}

// ─── Section 1: User Personal Profile Edit ────────────────────────────────────

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
				tag="PROFILE // PERSONAL INFO"
				title="Personal Account Information"
				subtitle="Update your display name, email preferences, and avatar URL"
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
			tag="PROFILE // PERSONAL INFO"
			title="Personal Account Information"
			subtitle="Update your display name, email preferences, and avatar URL"
		>
			<form onSubmit={handleSubmit} className="space-y-6">
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
						<div className="flex items-center gap-2 flex-wrap">
							<span className="text-sm font-bold text-[var(--foreground)] truncate">
								{user?.name || "[UNSET_NAME]"}
							</span>
							<span className="px-2 py-0.5 rounded-none border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-widest">
								[{user?.role || "VIEWER"}]
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

				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 font-mono">
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
											: "bg-[var(--background)]/80 border-[var(--border)] hover:bg-[var(--secondary)]"
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
				if (!unmounted)
					setError(err?.response?.data?.error || "FAILED TO LOAD PREFERENCES");
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
		setPrefs({ ...prefs, [key]: !prefs[key] });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!prefs || savingRef.current) return;
		savingRef.current = true;
		setSaving(true);
		setError(null);
		try {
			await profileService.updateNotificationPreferences({
				emailEnabled: prefs.emailEnabled,
				slackEnabled: prefs.slackEnabled,
			});
			onSuccess("NOTIFICATION PREFERENCES SAVED");
		} catch (err: any) {
			setError(err?.response?.data?.error || "FAILED TO SAVE PREFERENCES");
		} finally {
			setSaving(false);
			savingRef.current = false;
		}
	};

	if (loading) {
		return (
			<SectionSkeleton
				tag="PREFERENCES // NOTIFICATIONS"
				title="Alert & Dispatch Channels"
				subtitle="Configure channels for automated telemetry alerts"
			/>
		);
	}

	return (
		<Section
			id="notifications"
			tag="PREFERENCES // NOTIFICATIONS"
			title="Alert & Dispatch Channels"
			subtitle="Configure channels for automated telemetry alerts"
		>
			<form onSubmit={handleSubmit} className="space-y-4 font-mono">
				<div className="space-y-3">
					<div className="flex items-center justify-between p-4 rounded-none border border-[var(--border)] bg-[var(--background)]/80">
						<div className="space-y-0.5">
							<span className="text-xs font-bold text-[var(--foreground)] uppercase">
								Email Incident Alerts
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

// ─── Section 5: Embedded Team Management Tab ─────────────────────────────────

function TeamSection() {
	const { data: members = [], isLoading, error, refetch } = useMembers();
	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState<string>("ALL");
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

	const filteredMembers = useMemo(() => {
		return members.filter((m) => {
			if (roleFilter !== "ALL" && m.role !== roleFilter) return false;
			if (!searchQuery.trim()) return true;
			const query = searchQuery.toLowerCase().trim();
			return (
				m.user?.email.toLowerCase().includes(query) ||
				(m.user?.name && m.user.name.toLowerCase().includes(query)) ||
				m.role.toLowerCase().includes(query)
			);
		});
	}, [members, searchQuery, roleFilter]);

	const adminCount = members.filter((m) => m.role === "ADMIN").length;
	const engineerCount = members.filter((m) => m.role === "ENGINEER").length;
	const viewerCount = members.filter((m) => m.role === "VIEWER").length;

	return (
		<div className="space-y-5 font-mono">
			<div className="p-6 rounded-none bg-[var(--card)] border border-[var(--border)] space-y-4 shadow-sm">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="space-y-1">
						<div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
							<Users className="w-4 h-4 text-sky-400" />
							<span className="font-semibold uppercase tracking-wider">
								ORGANIZATION // IAM ACCESS
							</span>
						</div>
						<h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[var(--foreground)]">
							Team Management & IAM Roles
						</h2>
						<p className="text-xs text-[var(--muted-foreground)] max-w-xl leading-relaxed">
							Manage organization members, assign IAM roles (ADMIN, ENGINEER,
							VIEWER), and invite team members.
						</p>
					</div>

					<div className="flex items-center gap-2.5 shrink-0">
						<button
							onClick={() => refetch()}
							className="px-3.5 py-2 rounded-none border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--secondary)]/80 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
						>
							<RefreshCw
								className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
							/>
							<span>{isLoading ? "[SYNCING...]" : "[REFRESH]"}</span>
						</button>

						<button
							onClick={() => setIsInviteModalOpen(true)}
							className="px-4 py-2 rounded-none border border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] font-mono font-bold text-xs transition-all cursor-pointer shrink-0 uppercase tracking-wider shadow-sm hover:opacity-90 flex items-center gap-2 active:scale-95"
						>
							<UserPlus className="w-3.5 h-3.5" />
							<span>[+ INVITE_MEMBER]</span>
						</button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
				<div
					onClick={() =>
						setRoleFilter(roleFilter === "ADMIN" ? "ALL" : "ADMIN")
					}
					className={`p-5 rounded-none bg-[var(--card)] border space-y-2 transition-all cursor-pointer shadow-sm ${
						roleFilter === "ADMIN"
							? "border-emerald-500/60 bg-emerald-500/10"
							: "border-[var(--border)] hover:bg-[var(--secondary)]/50"
					}`}
				>
					<div className="flex items-center justify-between">
						<p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest flex items-center gap-1.5">
							<Shield className="w-3.5 h-3.5 text-emerald-400" />
							<span>ADMINISTRATORS</span>
						</p>
					</div>
					<h3 className="text-3xl font-light text-[var(--foreground)]">
						{adminCount.toString().padStart(2, "0")}
					</h3>
				</div>

				<div
					onClick={() =>
						setRoleFilter(roleFilter === "ENGINEER" ? "ALL" : "ENGINEER")
					}
					className={`p-5 rounded-none bg-[var(--card)] border space-y-2 transition-all cursor-pointer shadow-sm ${
						roleFilter === "ENGINEER"
							? "border-sky-500/60 bg-sky-500/10"
							: "border-[var(--border)] hover:bg-[var(--secondary)]/50"
					}`}
				>
					<div className="flex items-center justify-between">
						<p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest flex items-center gap-1.5">
							<Cpu className="w-3.5 h-3.5 text-sky-400" />
							<span>ENGINEERS</span>
						</p>
					</div>
					<h3 className="text-3xl font-light text-[var(--foreground)]">
						{engineerCount.toString().padStart(2, "0")}
					</h3>
				</div>

				<div
					onClick={() =>
						setRoleFilter(roleFilter === "VIEWER" ? "ALL" : "VIEWER")
					}
					className={`p-5 rounded-none bg-[var(--card)] border space-y-2 transition-all cursor-pointer shadow-sm ${
						roleFilter === "VIEWER"
							? "border-amber-500/60 bg-amber-500/10"
							: "border-[var(--border)] hover:bg-[var(--secondary)]/50"
					}`}
				>
					<div className="flex items-center justify-between">
						<p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest flex items-center gap-1.5">
							<Eye className="w-3.5 h-3.5 text-amber-400" />
							<span>VIEWERS</span>
						</p>
					</div>
					<h3 className="text-3xl font-light text-[var(--foreground)]">
						{viewerCount.toString().padStart(2, "0")}
					</h3>
				</div>
			</div>

			<div className="p-6 rounded-none bg-[var(--card)] border border-[var(--border)] space-y-5 font-mono shadow-sm">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-3 w-full sm:w-auto">
						<div className="relative flex items-center w-full sm:w-80">
							<Search className="absolute left-3.5 h-3.5 w-3.5 text-[var(--muted-foreground)] pointer-events-none" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="[SEARCH NAME / EMAIL / ROLE]"
								className="w-full pl-9 pr-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-none text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none transition-all font-mono"
							/>
						</div>

						<div className="flex items-center gap-1 overflow-x-auto">
							{["ALL", "ADMIN", "ENGINEER", "VIEWER"].map((role) => (
								<button
									key={role}
									onClick={() => setRoleFilter(role)}
									className={`px-3 py-1.5 rounded-none text-[10px] font-mono border transition-all cursor-pointer uppercase ${
										roleFilter === role
											? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-sm"
											: "border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/80"
									}`}
								>
									[{role}]
								</button>
							))}
						</div>
					</div>

					<div className="text-[11px] text-[var(--muted-foreground)] font-mono self-end sm:self-center">
						SHOWING{" "}
						<span className="font-bold text-[var(--foreground)]">
							{filteredMembers.length}
						</span>{" "}
						OF{" "}
						<span className="font-bold text-[var(--foreground)]">
							{members.length}
						</span>{" "}
						MEMBERS
					</div>
				</div>

				<MemberList
					members={filteredMembers}
					isLoading={isLoading}
					error={error as Error}
				/>
			</div>

			<InviteMemberModal
				isOpen={isInviteModalOpen}
				onClose={() => setIsInviteModalOpen(false)}
			/>
		</div>
	);
}

// ─── Section 6: Role Simulation ──────────────────────────────────────────────

function RoleSimulationSection() {
	return (
		<Section
			id="simulation"
			tag="DEVELOPER // TESTING"
			title="Role Simulation"
			subtitle="Switch your active role for the current session to test UI and permissions"
		>
			<div className="p-4 rounded-none border border-[var(--border)] bg-[var(--background)]/80 flex flex-row items-center justify-between gap-4 font-mono">
				<div className="space-y-1">
					<span className="text-xs font-bold text-[var(--foreground)] uppercase">
						Active Workspace Role
					</span>
					<p className="text-[11px] text-[var(--muted-foreground)]">
						This will temporarily override your role for the current session to
						help you test access controls.
					</p>
				</div>
				<div className="w-48 shrink-0">
					<RoleSwitcher />
				</div>
			</div>
		</Section>
	);
}

function TeamSectionWrapper() {
	const { data: members = [], isLoading, error } = useMembers();
	const [isInviteOpen, setIsInviteOpen] = useState(false);

	return (
		<Section
			id="team"
			tag="TEAM_IAM"
			title="Organization Members & Access Control"
			subtitle="Manage team member roles, security permissions, and invite engineers to your telemetry dashboard."
			badge={
				<button
					onClick={() => setIsInviteOpen(true)}
					className="px-3.5 py-2 border border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 font-mono text-xs uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2"
				>
					<UserPlus className="w-4 h-4" />
					<span>[INVITE_MEMBER]</span>
				</button>
			}
		>
			<MemberList members={members} isLoading={isLoading} error={error} />
			<InviteMemberModal
				isOpen={isInviteOpen}
				onClose={() => setIsInviteOpen(false)}
			/>
		</Section>
	);
}

// ─── Main Page Component (Full-Page Dashboard Layout) ──────────────────────────

export default function ProfilePage() {
	const streamStatus = useIncidentStream();
	const [searchQuery, setSearchQuery] = useState("");
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [activeSection, setActiveSection] = useState<
		| "overview"
		| "profile"
		| "security"
		| "sessions"
		| "team"
		| "theme"
		| "integrations"
		| "notifications"
		| "simulation"
	>("overview");

	const [toastState, setToastState] = useState<{
		msg: string;
		type: "success" | "error";
	} | null>(null);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const { user, signOut } = useAuth();

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

	const accountNavSections = [
		{
			id: "overview" as const,
			label: "01_OVERVIEW",
			subLabel: "Welcome & Status",
			icon: <LayoutDashboard className="w-4 h-4 text-emerald-400" />,
		},
		{
			id: "profile" as const,
			label: "02_PERSONAL_INFO",
			subLabel: "Name, Email & Avatar",
			icon: <User className="w-4 h-4" />,
		},
		{
			id: "security" as const,
			label: "03_SECURITY",
			subLabel: "Password & Auth",
			icon: <Lock className="w-4 h-4" />,
		},
		{
			id: "sessions" as const,
			label: "04_ACTIVE_SESSIONS",
			subLabel: "Devices & Tokens",
			icon: <Monitor className="w-4 h-4" />,
		},
		{
			id: "notifications" as const,
			label: "05_NOTIFICATIONS",
			subLabel: "Alert Channels",
			icon: <Bell className="w-4 h-4" />,
		},
		{
			id: "simulation" as const,
			label: "06_ROLE_SIMULATION",
			subLabel: "Dev IAM Override",
			icon: <Shield className="w-4 h-4" />,
		},
	];

	const systemNavSections = [
		{
			id: "team" as const,
			label: "TEAM & ACCESS",
			subLabel: "Organization Members",
			icon: <Users className="w-4 h-4 text-sky-400" />,
		},
		{
			id: "theme" as const,
			label: "THEME CONSOLE",
			subLabel: "Visual Styling",
			icon: <Palette className="w-4 h-4 text-emerald-400" />,
		},
		{
			id: "integrations" as const,
			label: "INTEGRATIONS",
			subLabel: "Webhooks & Slack",
			icon: <Sliders className="w-4 h-4 text-amber-400" />,
		},
	];

	return (
		<div className="h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col overflow-hidden select-none transition-colors duration-300">
			{/* Top Navbar Header */}
			<DashboardHeader
				streamStatus={streamStatus}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				onOpenCreateModal={() => {}}
			/>

			{/* Full Page Workspace Layout */}
			<div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
				{/* Dedicated Left Settings Sidebar */}
				<aside
					className={`bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-b lg:border-b-0 lg:border-r border-[var(--sidebar-border)] flex flex-col shrink-0 overflow-y-auto font-mono select-none transition-all duration-300 ${
						isSidebarCollapsed ? "w-full lg:w-16" : "w-full lg:w-72 xl:w-80"
					}`}
				>
					{/* Top Sidebar Header */}
					<div className="p-3 sm:p-4 border-b border-[var(--sidebar-border)] space-y-3">
						<div
							className={`flex items-center ${isSidebarCollapsed ? "flex-col gap-2" : "justify-between gap-2"}`}
						>
							<Link
								href="/dashboard"
								className={`inline-flex items-center gap-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-all py-1.5 px-2.5 border border-[var(--border)] rounded-none uppercase font-bold tracking-wide group ${
									isSidebarCollapsed ? "justify-center w-full px-2" : ""
								}`}
								title="Back to Dashboard"
							>
								<ArrowLeft className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:-translate-x-0.5 transition-transform shrink-0" />
								{!isSidebarCollapsed && <span>[DASHBOARD]</span>}
							</Link>

							<button
								onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
								className={`flex p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] border border-[var(--border)] transition-all cursor-pointer ${
									isSidebarCollapsed ? "justify-center w-full" : ""
								}`}
								title={
									isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"
								}
							>
								{isSidebarCollapsed ? (
									<PanelLeftOpen className="w-4 h-4 text-emerald-400 shrink-0" />
								) : (
									<PanelLeftClose className="w-4 h-4 shrink-0" />
								)}
							</button>
						</div>

						{!isSidebarCollapsed && (
							<div className="flex items-center justify-between gap-2 pt-1">
								<div className="min-w-0">
									<p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest">
										LOCATION
									</p>
									<h2 className="text-xs font-bold uppercase truncate text-[var(--foreground)]">
										SETTINGS CONSOLE
									</h2>
								</div>
								<span className="text-[9px] px-1.5 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold uppercase shrink-0">
									[{user?.role || "USER"}]
								</span>
							</div>
						)}
					</div>

					{/* Navigation Body */}
					<div className="p-3 sm:p-4 space-y-4 flex-1">
						{/* Account Sections */}
						<div>
							{!isSidebarCollapsed && (
								<h3 className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest px-1 mb-2">
									[ACCOUNT_SETTINGS]
								</h3>
							)}
							<div className="space-y-1">
								{accountNavSections.map((s) => {
									const isActive = activeSection === s.id;
									return (
										<button
											key={s.id}
											onClick={() => setActiveSection(s.id)}
											title={
												isSidebarCollapsed
													? `${s.label} - ${s.subLabel}`
													: undefined
											}
											className={`w-full flex items-center text-xs font-mono transition-all cursor-pointer rounded-none border text-left ${
												isActive
													? "bg-[var(--secondary)] text-[var(--foreground)] border-transparent font-bold shadow-sm"
													: "bg-[var(--card)]/40 text-[var(--muted-foreground)] border-transparent hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
											} ${isSidebarCollapsed ? "justify-center px-0 py-2.5" : "justify-between px-3 py-2"}`}
										>
											<div
												className={`flex items-center gap-2.5 min-w-0 ${isSidebarCollapsed ? "justify-center w-full" : ""}`}
											>
												<div
													className={`p-1 shrink-0 ${
														isActive
															? "text-[var(--primary)]"
															: "text-[var(--muted-foreground)]"
													}`}
												>
													{s.icon}
												</div>
												{!isSidebarCollapsed && (
													<div className="min-w-0">
														<p className="uppercase text-[11px] tracking-wider truncate font-bold">
															{s.label}
														</p>
														<p className="text-[9px] text-[var(--muted-foreground)] truncate font-normal">
															{s.subLabel}
														</p>
													</div>
												)}
											</div>
											{!isSidebarCollapsed && isActive && (
												<span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
											)}
										</button>
									);
								})}
							</div>
						</div>

						{/* System Settings Tabs */}
						<div className="pt-2">
							{!isSidebarCollapsed && (
								<h3 className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest px-1 mb-2">
									[SYSTEM_SETTINGS]
								</h3>
							)}
							<div className="space-y-1">
								{systemNavSections.map((item) => {
									const isActive = activeSection === item.id;
									return (
										<button
											key={item.id}
											onClick={() => setActiveSection(item.id)}
											title={
												isSidebarCollapsed
													? `${item.label} - ${item.subLabel}`
													: undefined
											}
											className={`w-full flex items-center text-xs font-mono transition-all cursor-pointer rounded-none border text-left ${
												isActive
													? "bg-[var(--secondary)] text-[var(--foreground)] border-transparent font-bold shadow-sm"
													: "bg-[var(--card)]/40 text-[var(--muted-foreground)] border-transparent hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
											} ${isSidebarCollapsed ? "justify-center px-0 py-2.5" : "justify-between px-3 py-2"}`}
										>
											<div
												className={`flex items-center gap-2.5 min-w-0 ${isSidebarCollapsed ? "justify-center w-full" : ""}`}
											>
												<div className="p-1 shrink-0">{item.icon}</div>
												{!isSidebarCollapsed && (
													<div className="min-w-0">
														<p className="uppercase text-[11px] tracking-wider truncate font-bold">
															{item.label}
														</p>
														<p className="text-[9px] text-[var(--muted-foreground)] truncate">
															{item.subLabel}
														</p>
													</div>
												)}
											</div>
											{!isSidebarCollapsed && isActive && (
												<span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
											)}
										</button>
									);
								})}
							</div>
						</div>
					</div>

					{/* Sidebar Footer: Sign Out */}
					<div className="p-3 sm:p-4 border-t border-[var(--sidebar-border)] bg-[var(--card)]/40">
						<button
							onClick={() => setIsLogoutModalOpen(true)}
							className={`w-full flex items-center justify-center gap-2 text-xs transition-all cursor-pointer border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 uppercase font-bold tracking-wider active:scale-95 ${
								isSidebarCollapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2"
							}`}
							title="Sign Out"
						>
							<LogOut className="w-3.5 h-3.5 shrink-0" />
							{!isSidebarCollapsed && <span>[SIGN_OUT]</span>}
						</button>
					</div>
				</aside>

				{/* Right Main Content Workspace Area */}
				<main className="flex-1 overflow-y-auto bg-[var(--background)] p-4 sm:p-6 lg:p-8 font-mono space-y-6">
					{/* Status Bar */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest">
									SETTINGS
								</span>
								<span className="text-[10px] text-[var(--border)]">/</span>
								<span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
									{
										[...accountNavSections, ...systemNavSections].find(
											(s) => s.id === activeSection,
										)?.label
									}
								</span>
							</div>
							<h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[var(--foreground)]">
								{
									[...accountNavSections, ...systemNavSections].find(
										(s) => s.id === activeSection,
									)?.subLabel
								}
							</h1>
						</div>

						<div className="flex items-center gap-2 shrink-0">
							<div className="px-3 py-1 bg-[var(--card)] border border-[var(--border)] text-[10px] uppercase font-bold text-[var(--muted-foreground)] flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
								<span>SYSTEM_ACTIVE</span>
							</div>
						</div>
					</div>

					{/* Toast Notifications */}
					<AnimatePresence>
						{toastState && (
							<div className="mb-4">
								<Toast msg={toastState.msg} type={toastState.type} />
							</div>
						)}
					</AnimatePresence>

					{/* Active View Container */}
					<div className="max-w-5xl">
						<AnimatePresence mode="wait">
							{activeSection === "overview" && (
								<motion.div
									key="overview"
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.15 }}
								>
									<IdentityOverviewSection
										onNavigateToProfile={() => setActiveSection("profile")}
									/>
								</motion.div>
							)}
							{activeSection === "profile" && (
								<motion.div
									key="profile"
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.15 }}
								>
									<ProfileSection onSuccess={(msg) => showToast(msg)} />
								</motion.div>
							)}
							{activeSection === "security" && (
								<motion.div
									key="security"
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.15 }}
								>
									<PasswordSection onSuccess={(msg) => showToast(msg)} />
								</motion.div>
							)}
							{activeSection === "sessions" && (
								<motion.div
									key="sessions"
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.15 }}
								>
									<SessionsSection onSuccess={(msg) => showToast(msg)} />
								</motion.div>
							)}
							{activeSection === "notifications" && (
								<motion.div
									key="notifications"
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.15 }}
								>
									<NotificationsSection onSuccess={(msg) => showToast(msg)} />
								</motion.div>
							)}
							{activeSection === "simulation" && (
								<motion.div
									key="simulation"
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.15 }}
								>
									<RoleSimulationSection />
								</motion.div>
							)}
							{activeSection === "team" && (
								<motion.div
									key="team"
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.15 }}
								>
									<TeamSectionWrapper />
								</motion.div>
							)}
							{activeSection === "theme" && (
								<motion.div
									key="theme"
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.15 }}
								>
									<ThemeSettings />
								</motion.div>
							)}
							{activeSection === "integrations" && (
								<motion.div
									key="integrations"
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.15 }}
								>
									<IntegrationsSettings />
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</main>
			</div>

			{/* Logout Confirmation Modal */}
			<LogoutConfirmModal
				isOpen={isLogoutModalOpen}
				onClose={() => setIsLogoutModalOpen(false)}
				onConfirm={handleConfirmLogout}
				isLoading={isSigningOut}
			/>
		</div>
	);
}
