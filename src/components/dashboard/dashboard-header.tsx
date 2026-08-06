"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { IncidentStreamStatus } from "@/hooks/useIncidentStream";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { RoleSwitcher } from "@/components/auth/role-switcher";
import { LogoutConfirmModal } from "@/components/auth/logout-confirm-modal";
import {
	Plus,
	Search,
	Home,
	Users,
	User,
	Palette,
	Sliders,
	ChevronDown,
	LogOut,
	X,
	ShieldCheck,
} from "lucide-react";

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
	const { user, signOut } = useAuth();
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);

	const handleConfirmLogout = async () => {
		setIsSigningOut(true);
		await signOut();
		setIsSigningOut(false);
		setIsLogoutModalOpen(false);
	};

	return (
		<>
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

				{/* Right: Streamlined Actions & User Profile Dropdown */}
				<div className="flex items-center gap-2 sm:gap-3 ml-auto">
					<ThemeToggle />

					<button
						onClick={onOpenCreateModal}
						className="h-8 px-3.5 rounded-none flex items-center gap-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 text-xs font-mono font-bold transition-all cursor-pointer shadow-md uppercase tracking-wider border border-[var(--primary)] shrink-0 active:scale-95"
					>
						<Plus className="w-3.5 h-3.5" />
						<span className="hidden sm:inline">[NEW_INCIDENT]</span>
					</button>

					{/* Glassmorphic User Account Settings Dropdown */}
					<div className="relative pl-2 border-l border-[var(--border)] shrink-0">
						<button
							onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
							className="h-8 px-2.5 rounded-none flex items-center gap-2 bg-[var(--secondary)]/70 border border-[var(--border)] hover:border-[var(--primary)] text-xs font-mono text-[var(--foreground)] transition-all cursor-pointer hover:bg-[var(--secondary)]"
							title="Account & Role Settings"
						>
							<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
							<span className="hidden xl:inline max-w-[120px] truncate text-[11px] font-bold">
								{user?.name || user?.email}
							</span>
							<ChevronDown className="w-3 h-3 text-[var(--muted-foreground)] shrink-0" />
						</button>

						{isUserDropdownOpen && (
							<>
								<div
									className="fixed inset-0 z-40"
									onClick={() => setIsUserDropdownOpen(false)}
								/>
								<div className="absolute right-0 top-full mt-2 w-64 rounded-none backdrop-blur-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl z-50 p-2.5 space-y-2 font-mono text-xs text-[var(--foreground)]">
									{/* User Header & Role Info */}
									<div className="px-2.5 py-2 rounded-none bg-[var(--secondary)]/60 border border-[var(--border)] flex items-center justify-between">
										<div className="min-w-0 flex-1">
											<p className="text-[11px] font-bold truncate text-[var(--foreground)]">
												{user?.name || "User Account"}
											</p>
											<p className="text-[9px] text-[var(--muted-foreground)] truncate">
												{user?.email}
											</p>
										</div>
										<button
											onClick={() => setIsUserDropdownOpen(false)}
											className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-none transition-colors"
										>
											<X className="w-3.5 h-3.5" />
										</button>
									</div>

									{/* Inline Role Switcher */}
									<div className="px-1 py-0.5">
										<div className="text-[9px] text-[var(--muted-foreground)] uppercase tracking-wider font-bold mb-1.5 px-1 flex items-center gap-1">
											<ShieldCheck className="w-3 h-3 text-emerald-400" />
											<span>Workspace Role Mode</span>
										</div>
										<RoleSwitcher />
									</div>

									<div className="border-t border-[var(--border)] my-1" />

									{/* Menu Navigation Links */}
									<div className="space-y-0.5">
										<Link
											href="/dashboard/settings/profile"
											onClick={() => setIsUserDropdownOpen(false)}
											className="flex items-center gap-2.5 px-2.5 py-2 rounded-none hover:bg-[var(--secondary)] text-[var(--foreground)] uppercase transition-colors"
										>
											<User className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
											<span>[MY_ACCOUNT]</span>
										</Link>

										<Link
											href="/dashboard/settings/team"
											onClick={() => setIsUserDropdownOpen(false)}
											className="flex items-center gap-2.5 px-2.5 py-2 rounded-none hover:bg-[var(--secondary)] text-[var(--foreground)] uppercase transition-colors"
										>
											<Users className="w-3.5 h-3.5 text-sky-400" />
											<span>[TEAM & ADMIN]</span>
										</Link>

										<Link
											href="/dashboard/settings/theme"
											onClick={() => setIsUserDropdownOpen(false)}
											className="flex items-center gap-2.5 px-2.5 py-2 rounded-none hover:bg-[var(--secondary)] text-[var(--foreground)] uppercase transition-colors"
										>
											<Palette className="w-3.5 h-3.5 text-emerald-400" />
											<span>[THEME_CONSOLE]</span>
										</Link>

										<Link
											href="/dashboard/settings/integrations"
											onClick={() => setIsUserDropdownOpen(false)}
											className="flex items-center gap-2.5 px-2.5 py-2 rounded-none hover:bg-[var(--secondary)] text-[var(--foreground)] uppercase transition-colors"
										>
											<Sliders className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
											<span>[INTEGRATIONS]</span>
										</Link>
									</div>

									<div className="border-t border-[var(--border)] pt-1" />

									<button
										onClick={() => {
											setIsUserDropdownOpen(false);
											setIsLogoutModalOpen(true);
										}}
										className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-none text-rose-500 hover:bg-rose-500/10 uppercase transition-colors cursor-pointer text-left font-bold"
									>
										<LogOut className="w-3.5 h-3.5" />
										<span>[SIGN_OUT]</span>
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			</header>

			<LogoutConfirmModal
				isOpen={isLogoutModalOpen}
				onClose={() => setIsLogoutModalOpen(false)}
				onConfirm={handleConfirmLogout}
				isLoading={isSigningOut}
			/>
		</>
	);
}

export default DashboardHeader;
