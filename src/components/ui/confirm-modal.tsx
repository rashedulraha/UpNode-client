"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, Loader2, X } from "lucide-react";

interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	description: string;
	targetName?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "danger" | "warning" | "info";
	isLoading?: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

export function ConfirmModal({
	isOpen,
	title,
	description,
	targetName,
	confirmText = "[CONFIRM]",
	cancelText = "[CANCEL]",
	variant = "danger",
	isLoading = false,
	onConfirm,
	onClose,
}: ConfirmModalProps) {
	if (!isOpen) return null;

	const variantStyles = {
		danger: {
			border: "border-rose-500/40",
			bgBadge: "bg-rose-500/10 text-rose-500 border-rose-500/30",
			icon: <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />,
			btnConfirm:
				"bg-rose-500 hover:bg-rose-600 text-white border-rose-500 shadow-md",
		},
		warning: {
			border: "border-amber-500/40",
			bgBadge: "bg-amber-500/10 text-amber-500 border-amber-500/30",
			icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
			btnConfirm:
				"bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-500 font-bold shadow-md",
		},
		info: {
			border: "border-sky-500/40",
			bgBadge: "bg-sky-500/10 text-sky-400 border-sky-500/30",
			icon: <ShieldAlert className="w-5 h-5 text-sky-400 shrink-0" />,
			btnConfirm:
				"bg-sky-500 hover:bg-sky-600 text-white border-sky-500 shadow-md",
		},
	};

	const currentStyle = variantStyles[variant];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in font-mono text-xs">
			<div
				className={`w-full max-w-md bg-[var(--card)]/95 border ${currentStyle.border} shadow-2xl p-6 space-y-5 relative selection:bg-rose-500/30 text-[var(--foreground)]`}
			>
				{/* Top Header */}
				<div className="flex items-start justify-between gap-3 border-b border-[var(--border)] pb-3">
					<div className="flex items-center gap-2.5">
						{currentStyle.icon}
						<div>
							<h3 className="font-bold text-sm uppercase tracking-tight text-[var(--foreground)]">
								{title}
							</h3>
							<span className="text-[10px] text-[var(--muted-foreground)] uppercase">
								SUPER_ADMIN_CONFIRMATION_REQUIRED
							</span>
						</div>
					</div>
					<button
						disabled={isLoading}
						onClick={onClose}
						className="p-1 border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
					>
						<X className="w-4 h-4" />
					</button>
				</div>

				{/* Body Content */}
				<div className="space-y-3">
					<p className="text-xs text-[var(--foreground)] leading-relaxed">
						{description}
					</p>

					{targetName && (
						<div className="p-3 bg-[var(--secondary)]/60 border border-[var(--border)] space-y-1">
							<span className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold">
								TARGET_IDENTIFIER:
							</span>
							<p className="font-bold text-xs text-[var(--foreground)] break-all font-mono">
								{targetName}
							</p>
						</div>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4">
					<button
						type="button"
						disabled={isLoading}
						onClick={onClose}
						className="px-4 py-2 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--secondary)]/80 text-xs font-bold uppercase transition-all cursor-pointer"
					>
						{cancelText}
					</button>

					<button
						type="button"
						disabled={isLoading}
						onClick={onConfirm}
						className={`px-4 py-2 border text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-2 ${currentStyle.btnConfirm}`}
					>
						{isLoading ? (
							<Loader2 className="w-3.5 h-3.5 animate-spin" />
						) : null}
						<span>{confirmText}</span>
					</button>
				</div>
			</div>
		</div>
	);
}
