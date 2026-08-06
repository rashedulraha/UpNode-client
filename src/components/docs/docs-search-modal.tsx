"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search,
	Hash,
	X,
	ArrowRight,
	CornerDownLeft,
	BookOpen,
	Code2,
	Bell,
	Zap,
} from "lucide-react";

export interface DocSearchItem {
	id: string;
	label: string;
	category: string;
	description?: string;
	icon?: React.ReactNode;
}

interface DocsSearchModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (id: string) => void;
	items: DocSearchItem[];
}

export function DocsSearchModal({
	isOpen,
	onClose,
	onSelect,
	items,
}: DocsSearchModalProps) {
	const [query, setQuery] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	const filteredItems = items.filter(
		(item) =>
			item.label.toLowerCase().includes(query.toLowerCase()) ||
			item.category.toLowerCase().includes(query.toLowerCase()) ||
			(item.description &&
				item.description.toLowerCase().includes(query.toLowerCase())),
	);

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => inputRef.current?.focus(), 50);
			setSelectedIndex(0);
		} else {
			setQuery("");
		}
	}, [isOpen]);

	useEffect(() => {
		setSelectedIndex(0);
	}, [query]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;

			if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev < filteredItems.length - 1 ? prev + 1 : 0,
				);
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev > 0 ? prev - 1 : filteredItems.length - 1,
				);
			} else if (e.key === "Enter") {
				e.preventDefault();
				if (filteredItems[selectedIndex]) {
					onSelect(filteredItems[selectedIndex].id);
					onClose();
				}
			} else if (e.key === "Escape") {
				e.preventDefault();
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, filteredItems, selectedIndex, onSelect, onClose]);

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md"
					/>

					{/* Modal Container */}
					<motion.div
						initial={{ opacity: 0, scale: 0.96, y: -10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.96, y: -10 }}
						transition={{ type: "spring", damping: 25, stiffness: 300 }}
						className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl z-10"
					>
						{/* Input Bar */}
						<div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-neutral-800">
							<Search className="w-4 h-4 text-slate-400 dark:text-neutral-500 mr-3 flex-shrink-0" />
							<input
								ref={inputRef}
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search documentation topics, API endpoints..."
								className="w-full bg-transparent font-mono text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 outline-none"
							/>
							{query && (
								<button
									onClick={() => setQuery("")}
									className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer mr-2"
								>
									<X className="w-3.5 h-3.5" />
								</button>
							)}
							<kbd className="hidden sm:inline-block px-2 py-0.5 font-mono text-[10px] text-slate-400 dark:text-neutral-500 bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded shadow-xs">
								ESC
							</kbd>
						</div>

						{/* Results List */}
						<div className="max-h-80 overflow-y-auto p-2 space-y-1">
							{filteredItems.length > 0 ? (
								filteredItems.map((item, idx) => {
									const isSelected = idx === selectedIndex;
									return (
										<button
											key={item.id}
											onClick={() => {
												onSelect(item.id);
												onClose();
											}}
											onMouseEnter={() => setSelectedIndex(idx)}
											className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
												isSelected
													? "bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-slate-900 dark:text-white"
													: "hover:bg-slate-50 dark:hover:bg-neutral-800/50 text-slate-700 dark:text-neutral-300 border border-transparent"
											}`}
										>
											<div className="flex items-center gap-3 min-w-0">
												<div
													className={`p-2 rounded-lg ${
														isSelected
															? "bg-blue-500 text-white"
															: "bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400"
													}`}
												>
													<Hash className="w-3.5 h-3.5" />
												</div>
												<div className="min-w-0">
													<p className="font-mono text-xs font-semibold truncate">
														{item.label}
													</p>
													{item.description && (
														<p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
															{item.description}
														</p>
													)}
												</div>
											</div>

											<div className="flex items-center gap-2 flex-shrink-0 ml-3">
												<span className="font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-700">
													{item.category}
												</span>
												{isSelected && (
													<CornerDownLeft className="w-3.5 h-3.5 text-blue-500 hidden sm:block" />
												)}
											</div>
										</button>
									);
								})
							) : (
								<div className="py-12 text-center text-slate-400 dark:text-neutral-500 font-mono text-xs">
									No matching topics found for &quot;{query}&quot;
								</div>
							)}
						</div>

						{/* Footer Navigation Bar */}
						<div className="px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-neutral-400">
							<div className="flex items-center gap-3">
								<span className="flex items-center gap-1">
									<kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 text-[10px]">
										↑
									</kbd>
									<kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 text-[10px]">
										↓
									</kbd>{" "}
									Navigate
								</span>
								<span className="flex items-center gap-1">
									<kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 text-[10px]">
										↵
									</kbd>{" "}
									Select
								</span>
							</div>
							<span>UpNode Docs v2.6</span>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}

export default DocsSearchModal;
