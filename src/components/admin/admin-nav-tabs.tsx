"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Building2, Users, LayoutDashboard } from "lucide-react";

export function AdminNavTabs() {
	const pathname = usePathname();

	const tabs = [
		{
			label: "Overview",
			href: "/super-admin",
			icon: <LayoutDashboard className="w-4 h-4" />,
		},
		{
			label: "Organization Management",
			href: "/super-admin/organizations",
			icon: <Building2 className="w-4 h-4" />,
		},
		{
			label: "User Management",
			href: "/super-admin/users",
			icon: <Users className="w-4 h-4" />,
		},
	];

	return (
		<div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
			{tabs.map((tab) => {
				const isActive = pathname === tab.href;
				return (
					<Link
						key={tab.href}
						href={tab.href}
						className={`px-4 py-2 text-xs font-bold uppercase transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
							isActive
								? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm"
								: "bg-[var(--card)]/90 text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
						}`}
					>
						{tab.icon}
						<span>[{tab.label.toUpperCase()}]</span>
					</Link>
				);
			})}
		</div>
	);
}

export default AdminNavTabs;
