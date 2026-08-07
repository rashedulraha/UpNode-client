"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Building2,
	Users,
	ArrowLeft,
	ShieldAlert,
	ChevronLeft,
	ChevronRight,
	PanelLeftClose,
	PanelLeftOpen,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function SuperAdminSidebar() {
	const pathname = usePathname();
	const { user } = useAuth();
	const [isCollapsed, setIsCollapsed] = useState(false);

	useEffect(() => {
		const storedValue = localStorage.getItem(
			"upnode_superadmin_sidebar_collapsed",
		);
		if (storedValue === "true") {
			setIsCollapsed(true);
		}
	}, []);

	const toggleCollapse = () => {
		const nextState = !isCollapsed;
		setIsCollapsed(nextState);
		localStorage.setItem(
			"upnode_superadmin_sidebar_collapsed",
			String(nextState),
		);
	};

	const navItems = [
		{
			label: "[OVERVIEW]",
			shortLabel: "OVERVIEW",
			href: "/super-admin",
			icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
			badge: "LIVE",
		},
		{
			label: "[ORGANIZATION_MGMT]",
			shortLabel: "ORGS",
			href: "/super-admin/organizations",
			icon: <Building2 className="w-4 h-4 shrink-0" />,
		},
		{
			label: "[USER_MANAGEMENT]",
			shortLabel: "USERS",
			href: "/super-admin/users",
			icon: <Users className="w-4 h-4 shrink-0" />,
		},
	];

	return (
		<aside
			className={`h-[calc(100vh-3.5rem)] shrink-0 border-r border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-xl flex flex-col justify-between p-3 font-mono text-xs select-none transition-all duration-300 ease-in-out shadow-sm overflow-y-auto ${
				isCollapsed ? "w-16 items-center" : "w-64"
			}`}
		>
			<div className="space-y-5 w-full">
				{/* Sidebar Toggle & Header Badge */}
				<div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border)]">
					{!isCollapsed && (
						<div className="flex items-center gap-1.5 text-rose-500 font-bold text-[11px] truncate">
							<ShieldAlert className="w-4 h-4 animate-pulse shrink-0 text-rose-500" />
							<span className="truncate">SUPER_ADMIN</span>
						</div>
					)}
					<button
						onClick={toggleCollapse}
						className={`p-1.5 border border-[var(--border)] bg-[var(--secondary)]/80 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-all cursor-pointer ${
							isCollapsed ? "mx-auto" : ""
						}`}
						title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
					>
						{isCollapsed ? (
							<PanelLeftOpen className="w-4 h-4 text-rose-500" />
						) : (
							<PanelLeftClose className="w-4 h-4" />
						)}
					</button>
				</div>

				{!isCollapsed && (
					<div className="p-2.5 border border-rose-500/30 bg-rose-500/10 space-y-1">
						<div className="flex items-center justify-between">
							<span className="text-[10px] text-rose-400 font-bold uppercase">
								MASTER_CONSOLE
							</span>
							<span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
						</div>
						<p className="text-[10px] text-[var(--muted-foreground)] uppercase">
							Platform Security Root
						</p>
					</div>
				)}

				{/* Navigation Links */}
				<div>
					{!isCollapsed && (
						<h2 className="text-[10px] font-mono font-bold text-[var(--muted-foreground)] uppercase tracking-widest px-1 mb-2">
							[PLATFORM_CONTROL]
						</h2>
					)}
					<div className="space-y-1 font-mono text-xs">
						{navItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									title={isCollapsed ? item.shortLabel : undefined}
									className={`w-full flex items-center ${
										isCollapsed
											? "justify-center px-0 py-2.5"
											: "justify-between px-3 py-2"
									} transition-colors cursor-pointer border ${
										isActive
											? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-bold shadow-sm"
											: "bg-[var(--card)]/40 text-[var(--muted-foreground)] border-transparent hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
									}`}
								>
									<div className="flex items-center gap-2.5 min-w-0">
										{item.icon}
										{!isCollapsed && (
											<span className="truncate uppercase text-[11px]">
												{item.label}
											</span>
										)}
									</div>
									{!isCollapsed && item.badge && (
										<span className="px-1.5 py-0.2 text-[9px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
											{item.badge}
										</span>
									)}
								</Link>
							);
						})}
					</div>
				</div>

				{/* Master User Details */}
				{!isCollapsed && (
					<div className="p-2.5 bg-[var(--secondary)]/60 border border-[var(--border)] space-y-1">
						<span className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold">
							LOGGED_AS_MASTER:
						</span>
						<p className="font-bold text-[11px] text-[var(--foreground)] truncate">
							{user?.name || user?.email}
						</p>
						<span className="text-[9px] text-rose-500 font-bold uppercase">
							[{user?.role}]
						</span>
					</div>
				)}
			</div>

			{/* Bottom Action: Return to App */}
			<div className="pt-3 border-t border-[var(--border)] mt-4 w-full">
				<Link
					href="/dashboard"
					title={isCollapsed ? "Return to Dashboard" : undefined}
					className={`w-full flex items-center justify-center gap-2 py-2 bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] hover:opacity-80 transition-all font-bold text-xs uppercase cursor-pointer ${
						isCollapsed ? "px-0" : "px-3"
					}`}
				>
					<ArrowLeft className="w-3.5 h-3.5 text-rose-500 shrink-0" />
					{!isCollapsed && <span>[RETURN_TO_APP]</span>}
				</Link>
			</div>
		</aside>
	);
}

export default SuperAdminSidebar;
