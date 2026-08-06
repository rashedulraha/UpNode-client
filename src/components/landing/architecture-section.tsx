"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const GLASS: React.CSSProperties = {
	background: "var(--lp-surface)",
	backdropFilter: "blur(20px)",
	WebkitBackdropFilter: "blur(20px)",
	border: "0.5px solid var(--lp-border)",
	borderTop: "0.5px solid var(--lp-border-top)",
};

const GLASS_ACTIVE: React.CSSProperties = {
	background: "var(--lp-surface-hover)",
	backdropFilter: "blur(20px)",
	WebkitBackdropFilter: "blur(20px)",
	border: "0.5px solid var(--lp-stroke)",
	borderTop: "0.5px solid var(--lp-border-top)",
};

const steps = [
	{
		step: 1,
		title: "Ingestion Gateway",
		tech: "Go / Edge Proxy",
		latency: "< 0.8ms",
		desc: "High-concurrency edge webhooks accept telemetry spikes up to 500,000 req/sec.",
	},
	{
		step: 2,
		title: "BullMQ / Redis Queue",
		tech: "In-Memory Buffer",
		latency: "< 0.2ms",
		desc: "Non-blocking RAM buffer queues incoming alerts into job channels instantly.",
	},
	{
		step: 3,
		title: "Async Worker Pool",
		tech: "Isolated Runners",
		latency: "< 3.5ms",
		desc: "Decoupled process pool handles deduplication, rules, and alert routing.",
	},
	{
		step: 4,
		title: "SSE Broadcast",
		tech: "HTTP/2 Event Stream",
		latency: "< 12ms",
		desc: "Pushes real-time incident state directly to SRE dashboards — zero polling.",
	},
];

export function ArchitectureSection() {
	const [active, setActive] = useState(1);

	return (
		<section
			id="architecture"
			className="py-24 relative"
			style={{
				background: "var(--lp-bg)",
				borderBottom: "0.5px solid var(--lp-border)",
			}}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 14 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="text-center space-y-4"
				>
					<div
						className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase"
						style={{
							background: "var(--lp-surface)",
							border: "0.5px solid var(--lp-border)",
							color: "var(--lp-text-dim)",
						}}
					>
						<span
							className="w-1 h-1 rounded-full inline-block"
							style={{ background: "var(--lp-text-mid)" }}
						/>
						High-Throughput Pipeline
					</div>
					<h2
						className="text-3xl sm:text-5xl font-bold tracking-tighter leading-tight"
						style={{ color: "var(--lp-text-primary)" }}
					>
						Zero main-thread
						<br />
						<span
							style={{
								WebkitTextStroke: "1px var(--lp-stroke)",
								color: "transparent",
							}}
						>
							DB lockup.
						</span>
					</h2>
					<p
						className="text-sm max-w-lg mx-auto font-sans leading-relaxed"
						style={{ color: "var(--lp-text-mid)" }}
					>
						Traditional platforms lock databases under telemetry spikes. UpNode
						completely decouples ingestion with an async queue architecture.
					</p>
				</motion.div>

				{/* Pipeline Steps */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
					className="grid grid-cols-1 md:grid-cols-4 gap-3"
				>
					{steps.map((item) => {
						const isActive = active === item.step;
						return (
							<motion.div
								key={item.step}
								initial={{ opacity: 0, y: 14 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.45, delay: item.step * 0.08 }}
								whileHover={{ y: -3 }}
								onClick={() => setActive(item.step)}
								className="cursor-pointer p-5 rounded-2xl transition-all space-y-4"
								style={isActive ? GLASS_ACTIVE : GLASS}
							>
								{/* Step number + latency */}
								<div className="flex items-center justify-between">
									<span
										className="font-mono text-[10px] tracking-widest"
										style={{
											border: "0.5px solid var(--lp-border)",
											padding: "2px 8px",
											borderRadius: "4px",
											background: "var(--lp-surface)",
											color: "var(--lp-text-dim)",
										}}
									>
										STAGE 0{item.step}
									</span>
									<span
										className="font-mono text-[10px] tracking-widest"
										style={{
											color: isActive
												? "var(--lp-text-primary)"
												: "var(--lp-text-dim)",
										}}
									>
										{item.latency}
									</span>
								</div>

								{/* Title / Tech / Desc */}
								<div className="space-y-1.5">
									<div
										className="font-mono text-[9px] tracking-widest uppercase"
										style={{ color: "var(--lp-text-faint)" }}
									>
										{item.tech}
									</div>
									<h3
										className="text-sm font-semibold transition-colors"
										style={{
											color: isActive
												? "var(--lp-text-primary)"
												: "var(--lp-text-mid)",
										}}
									>
										{item.title}
									</h3>
									<p
										className="text-xs leading-relaxed font-sans"
										style={{ color: "var(--lp-text-dim)" }}
									>
										{item.desc}
									</p>
								</div>

								{/* Active indicator */}
								{isActive && (
									<div className="flex items-center gap-2">
										<span className="relative flex h-1.5 w-1.5">
											<span
												className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70"
												style={{ background: "var(--lp-text-mid)" }}
											/>
											<span
												className="relative inline-flex rounded-full h-1.5 w-1.5"
												style={{ background: "var(--lp-text-primary)" }}
											/>
										</span>
										<span
											className="font-mono text-[9px] tracking-widest uppercase"
											style={{ color: "var(--lp-text-dim)" }}
										>
											Selected
										</span>
									</div>
								)}
							</motion.div>
						);
					})}
				</motion.div>

				{/* Connector Flow Line */}
				<div className="hidden md:flex items-center justify-center gap-0">
					{steps.map((s, i) => (
						<React.Fragment key={s.step}>
							<div
								className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] transition-all cursor-pointer"
								style={{
									background:
										active === s.step
											? "var(--lp-surface-hover)"
											: "var(--lp-surface)",
									border:
										active === s.step
											? "0.5px solid var(--lp-stroke)"
											: "0.5px solid var(--lp-border)",
									color:
										active === s.step
											? "var(--lp-text-primary)"
											: "var(--lp-text-dim)",
								}}
								onClick={() => setActive(s.step)}
							>
								{s.step}
							</div>
							{i < steps.length - 1 && (
								<div
									className="flex-1 h-[0.5px] mx-1"
									style={{ background: "var(--lp-border)" }}
								/>
							)}
						</React.Fragment>
					))}
				</div>
			</div>
		</section>
	);
}
