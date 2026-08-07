"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { IncidentStreamStatus } from "@/hooks/useIncidentStream";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Plus, Search, Home, ShieldAlert } from "lucide-react";

interface DashboardHeaderProps {
	streamStatus: IncidentStreamStatus;
	searchQuery: string;
	onSearchChange: (q: string) => void;
	onOpenCreateModal: () => void;
}

export function DashboardHeader({
	streamStatus,
	searchQuery,
	onSearchChange,
	onOpenCreateModal,
}: DashboardHeaderProps) {
	const { user } = useAuth();
	const pathname = usePathname();
	const isDashboardRoot = pathname === "/dashboard";

	const isImpersonating =
		typeof window !== "undefined" &&
		sessionStorage.getItem("upnode_impersonating_active") === "true";
	const impersonatedEmail =
		typeof window !== "undefined"
			? sessionStorage.getItem("upnode_impersonated_user_email") || ""
			: "";

	const handleExitImpersonation = () => {
		sessionStorage.removeItem("upnode_impersonating_active");
		sessionStorage.removeItem("upnode_impersonated_user_email");
		window.location.href = "/super-admin";
	};

	return (
		<>
			{isImpersonating && (
				<div className="w-full bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between font-mono text-xs text-amber-400 z-50">
					<div className="flex items-center gap-2">
						<ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
						<span>
							[IMPERSONATION_ACTIVE] Currently inspecting workspace as{" "}
							<strong>{impersonatedEmail || user?.email}</strong>
						</span>
					</div>
					<button
						onClick={handleExitImpersonation}
						className="px-3 py-1 border border-amber-500 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase text-[11px] transition-all cursor-pointer shadow-sm"
					>
						[EXIT_IMPERSONATION]
					</button>
				</div>
			)}
			<header className="sticky top-0 z-50 h-14 px-4 sm:px-6 backdrop-blur-xl bg-[var(--card)]/85 border-b border-[var(--border)] text-[var(--foreground)] flex items-center justify-between gap-4 shrink-0 font-mono text-xs select-none transition-colors duration-300 shadow-sm">
				{/* Left: Brand logo & Stream indicator */}
				<div className="flex items-center gap-3">
					<Link
						href="/"
						className="h-8 w-8 rounded-none flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--secondary)]/60 hover:bg-[var(--secondary)] transition-all cursor-pointer border border-[var(--border)] shrink-0"
						title="Go to Home"
					>
						<Home className="w-3.5 h-3.5" />
					</Link>

					<div className="flex items-center gap-2">
						<span className="font-bold text-sm tracking-widest text-[var(--foreground)] uppercase">
							UPNODE
						</span>
						<span className="text-[9px] font-mono px-1.5 py-0.5 rounded-none bg-[var(--secondary)] text-[var(--muted-foreground)] border border-[var(--border)]">
							v2.6
						</span>
					</div>

					<div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[var(--border)]">
						<span
							className={`w-1.5 h-1.5 rounded-full ${
								streamStatus.isConnected
									? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"
									: "bg-amber-400"
							}`}
						/>
						<span className="text-[10px] font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
							{streamStatus.isConnected
								? "STREAM ACTIVE"
								: streamStatus.isReconnecting
									? "RECONNECTING"
									: "OFFLINE"}
						</span>
					</div>
				</div>

				{/* Middle: Clean Glassmorphic Search Bar */}
				<div className="flex-1 max-w-xs sm:max-w-md hidden md:block font-mono">
					<div className="relative flex items-center h-8">
						<Search className="absolute left-3 h-3.5 w-3.5 text-[var(--muted-foreground)] pointer-events-none" />
						<input
							type="text"
							placeholder="[SEARCH ORG OR PROJECT]"
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className="w-full h-8 pl-9 pr-3 rounded-none bg-[var(--background)]/70 border border-[var(--border)] text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] focus:bg-[var(--background)] transition-all font-mono shadow-inner"
						/>
					</div>
				</div>

				{/* Right: Streamlined Actions & User Profile */}
				<div className="flex items-center gap-2 sm:gap-3 ml-auto">
					{user?.role === "SUPER_ADMIN" && (
						<Link
							href="/super-admin"
							className="h-8 px-3 rounded-none flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-sm uppercase tracking-wider shrink-0"
							title="Super Admin Console"
						>
							<ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
							<span className="hidden md:inline">[SUPER_ADMIN]</span>
						</Link>
					)}

					<ThemeToggle />

					{isDashboardRoot && (
						<button
							onClick={onOpenCreateModal}
							className="h-8 px-3.5 rounded-none flex items-center gap-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 text-xs font-mono font-bold transition-all cursor-pointer shadow-md uppercase tracking-wider border border-[var(--primary)] shrink-0 active:scale-95"
						>
							<Plus className="w-3.5 h-3.5" />
							<span className="hidden sm:inline">[NEW_INCIDENT]</span>
						</button>
					)}

					{/* Direct Link to My Account */}
					<div className="pl-2 border-l border-[var(--border)] shrink-0">
						<Link
							href="/dashboard/settings/profile"
							className="h-8 px-2.5 rounded-none flex items-center gap-2 bg-[var(--secondary)]/70 border border-[var(--border)] text-xs font-mono text-[var(--foreground)] transition-all cursor-pointer hover:bg-[var(--secondary)]"
							title="My Account"
						>
							<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
							<span className="hidden xl:inline max-w-[120px] truncate text-[11px] font-bold">
								{user?.name || user?.email}
							</span>
						</Link>
					</div>
				</div>
			</header>
		</>
	);
}

export default DashboardHeader;
