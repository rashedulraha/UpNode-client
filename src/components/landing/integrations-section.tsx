"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Database, Globe, Layers, Server } from "lucide-react";

const GLASS: React.CSSProperties = {
	background: "var(--lp-surface)",
	backdropFilter: "blur(16px)",
	WebkitBackdropFilter: "blur(16px)",
	border: "0.5px solid var(--lp-border)",
	borderTop: "0.5px solid var(--lp-border-top)",
};

const techStack = [
	{ name: "PostgreSQL", icon: Database, tag: "Primary Store" },
	{ name: "Redis", icon: Database, tag: "BullMQ Queue" },
	{ name: "Next.js", icon: Globe, tag: "App Router" },
	{ name: "Docker", icon: Server, tag: "Containers" },
	{ name: "Kubernetes", icon: Cpu, tag: "Orchestration" },
	{ name: "Kafka", icon: Layers, tag: "Event Streaming" },
];

export function IntegrationsSection() {
	return (
		<section
			className="py-12"
			style={{
				background: "var(--lp-bg)",
				borderBottom: "0.5px solid var(--lp-border)",
			}}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
				<p
					className="text-center font-mono text-[10px] uppercase tracking-widest"
					style={{ color: "var(--lp-text-dim)" }}
				>
					Relied on by top-tier engineering teams worldwide
				</p>

				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ staggerChildren: 0.07, delayChildren: 0.1 }}
					className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
				>
					{techStack.map((tech, idx) => (
						<motion.div
							key={idx}
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: idx * 0.07 }}
							whileHover={{ y: -2 }}
							className="p-4 rounded-xl flex flex-col items-center justify-center gap-2 group cursor-pointer transition-all"
							style={GLASS}
						>
							<tech.icon
								className="w-4 h-4 transition-colors"
								style={{ color: "var(--lp-text-mid)" }}
							/>
							<span
								className="font-mono text-[11px] transition-colors"
								style={{ color: "var(--lp-text-primary)" }}
							>
								{tech.name}
							</span>
							<span
								className="font-mono text-[9px] tracking-widest uppercase"
								style={{ color: "var(--lp-text-dim)" }}
							>
								{tech.tag}
							</span>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
