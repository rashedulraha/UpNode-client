"use client";

import React from "react";
import { useCustomTheme } from "@/hooks/use-custom-theme";
import { Sun, Palette, Terminal } from "lucide-react";

export function ThemeToggle() {
	const { mode, activeDeveloperTheme, toggleTheme, isMounted } =
		useCustomTheme();

	if (!isMounted) {
		return (
			<button
				type="button"
				aria-label="Toggle theme"
				className="h-8 px-2.5 flex items-center justify-center border border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)] shrink-0 font-mono text-[10px]"
			>
				<Sun className="h-3.5 w-3.5" />
			</button>
		);
	}

	const isLight = mode === "light";
	const devThemeName = activeDeveloperTheme.name;

	return (
		<button
			type="button"
			onClick={toggleTheme}
			title={
				isLight
					? `Switch to ${devThemeName} Developer Theme`
					: "Switch to Light Theme"
			}
			aria-label={
				isLight ? `Switch to ${devThemeName}` : "Switch to Light Theme"
			}
			className="h-8 px-2.5 flex items-center gap-1.5 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] hover:opacity-90 transition-all cursor-pointer shrink-0 font-mono text-[10px] tracking-wider rounded-none uppercase group"
		>
			{isLight ? (
				<>
					<Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" />
					<span className="hidden sm:inline-block font-bold">[LIGHT]</span>
				</>
			) : (
				<>
					<Palette className="h-3.5 w-3.5 text-emerald-400 shrink-0 group-hover:rotate-12 transition-transform" />
					<span
						className="hidden sm:inline-block font-bold"
						style={{ color: "var(--primary)" }}
					>
						[DARK]
					</span>
				</>
			)}
		</button>
	);
}

export default ThemeToggle;
