"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Building2,
	Users,
	ArrowLeft,
	ShieldAlert,
	Radio,
	Terminal,
	FolderCheck,
	Activity,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function SuperAdminSidebar() {
	const pathname = usePathname();
	const { user } = useAuth();

	const navItems = [
		{
			label: "[OVERVIEW]",
			href: "/super-admin",
			icon: <LayoutDashboard className="w-3.5 h-3.5" />,
			badge: "LIVE",
		},
		{
			label: "[ORGANIZATION_MGMT]",
			href: "/super-admin/organizations",
			icon: <Building2 className="w-3.5 h-3.5" />,
		},
		{
			label: "[USER_MANAGEMENT]",
			href: "/super-admin/users",
			icon: <Users className="w-3.5 h-3.5" />,
		},
	];

	return (
		<aside className="w-full lg:w-64 shrink-0 border-r border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-xl flex flex-col justify-between p-4 font-mono text-xs select-none transition-colors duration-300 shadow-sm overflow-y-auto">
			<div className="space-y-6">
				{/* Top Console Header Badge */}
				<div className="p-3 border border-rose-500/30 bg-rose-500/10 space-y-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1.5 text-rose-500 font-bold text-[11px]">
							<ShieldAlert className="w-4 h-4 animate-pulse" />
							<span>SUPER_ADMIN</span>
						</div>
						<span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
					</div>
					<p className="text-[10px] text-[var(--muted-foreground)] uppercase">
						Platform Master Console
					</p>
				</div>

				{/* Platform Management Navigation */}
				<div>
					<h2 className="text-[10px] font-mono font-bold text-[var(--muted-foreground)] uppercase tracking-widest px-1 mb-2">
						[PLATFORM_CONTROL]
					</h2>
					<div className="space-y-1 font-mono text-xs">
						{navItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`w-full flex items-center justify-between px-3 py-2 transition-colors cursor-pointer border ${
										isActive
											? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-bold shadow-sm"
											: "bg-[var(--card)]/40 text-[var(--muted-foreground)] border-transparent hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
									}`}
								>
									<div className="flex items-center gap-2 min-w-0">
										{item.icon}
										<span className="truncate uppercase">{item.label}</span>
									</div>
									{item.badge && (
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
				<div className="p-3 bg-[var(--secondary)]/60 border border-[var(--border)] space-y-1">
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
			</div>

			{/* Bottom Action: Back to Normal Dashboard */}
			<div className="pt-4 border-t border-[var(--border)] mt-6">
				<Link
					href="/dashboard"
					className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] hover:opacity-80 transition-all font-bold text-xs uppercase cursor-pointer"
				>
					<ArrowLeft className="w-3.5 h-3.5 text-rose-500" />
					<span>[RETURN_TO_APP]</span>
				</Link>
			</div>
		</aside>
	);
}

export default SuperAdminSidebar;
