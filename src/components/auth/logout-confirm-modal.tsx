"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LogOut, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LogoutConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading?: boolean;
}

export function LogoutConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	isLoading = false,
}: LogoutConfirmModalProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md font-mono">
					<motion.div
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.98 }}
						transition={{ duration: 0.15 }}
						className="w-full max-w-sm p-5 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-2xl space-y-4 rounded-none relative text-left"
					>
						<button
							onClick={onClose}
							disabled={isLoading}
							className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer text-[10px] font-mono"
						>
							[X]
						</button>

						{/* Modal Header */}
						<div className="flex items-center gap-2 border-b border-[var(--border)] pb-2.5">
							<LogOut className="w-4 h-4 text-rose-500" />
							<h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
								[CONFIRM_SIGN_OUT]
							</h3>
						</div>

						{/* Modal Body */}
						<p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed font-mono uppercase">
							Are you sure you want to terminate your active telemetry session?
							You will need to re-authenticate to access the live dashboard.
						</p>

						{/* Modal Actions */}
						<div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
							<button
								type="button"
								onClick={onClose}
								disabled={isLoading}
								className="px-3.5 py-1.5 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] hover:opacity-80 uppercase font-mono text-[11px] rounded-none cursor-pointer"
							>
								[CANCEL]
							</button>

							<button
								type="button"
								onClick={onConfirm}
								disabled={isLoading}
								className="px-3.5 py-1.5 border border-rose-500 bg-rose-600 text-white font-bold uppercase font-mono text-[11px] hover:bg-rose-700 rounded-none disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
							>
								<LogOut className="w-3.5 h-3.5" />
								<span>{isLoading ? "[SIGNING_OUT...]" : "[SIGN_OUT]"}</span>
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>,
		document.body,
	);
}

export default LogoutConfirmModal;
