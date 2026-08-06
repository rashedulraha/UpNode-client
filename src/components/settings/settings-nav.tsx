"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Palette, Users, Sliders, LayoutDashboard } from "lucide-react";

export function SettingsNav() {
	const pathname = usePathname();

	const tabs = [
		{
			label: "My Account",
			href: "/dashboard/settings/profile",
			icon: <User className="w-4 h-4" />,
		},
		{
			label: "Theme Console",
			href: "/dashboard/settings/theme",
			icon: <Palette className="w-4 h-4" />,
		},
		{
			label: "Team & Access",
			href: "/dashboard/settings/team",
			icon: <Users className="w-4 h-4" />,
		},
		{
			label: "Integrations",
			href: "/dashboard/settings/integrations",
			icon: <Sliders className="w-4 h-4" />,
		},
	];

	return (
		<div className="w-full rounded-none backdrop-blur-xl bg-[var(--card)]/90 border border-[var(--border)] p-2 sm:p-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm font-mono text-xs">
			{/* Breadcrumb / Section Header */}
			<div className="flex items-center gap-2.5 px-2 text-[var(--muted-foreground)]">
				<Link
					href="/dashboard"
					className="flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors py-1 px-2 rounded-none hover:bg-[var(--secondary)]"
				>
					<LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
					<span className="font-semibold uppercase tracking-wider text-[11px]">
						Dashboard
					</span>
				</Link>
				<span className="text-[var(--border)]">/</span>
				<span className="font-bold text-[var(--foreground)] uppercase tracking-wider text-[11px]">
					Settings
				</span>
			</div>

			{/* Navigation Tabs */}
			<div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
				{tabs.map((tab) => {
					const isActive = pathname === tab.href;
					return (
						<Link
							key={tab.href}
							href={tab.href}
							className={`px-3.5 py-2 rounded-none text-xs font-mono font-bold transition-all flex items-center gap-2 shrink-0 ${
								isActive
									? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
									: "bg-[var(--secondary)]/60 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
							}`}
						>
							{tab.icon}
							<span>{tab.label}</span>
						</Link>
					);
				})}
			</div>
		</div>
	);
}

export default SettingsNav;
