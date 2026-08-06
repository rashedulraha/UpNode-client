"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	Server,
	Layers,
	Radio,
	LayoutDashboard,
	ArrowRight,
	ShieldCheck,
	CheckCircle2,
} from "lucide-react";

export function DataFlowAnimation() {
	const nodes = [
		{
			id: "servers",
			title: "Telemetry Sources",
			subtitle: "APIs, Edge Nodes & DBs",
			icon: Server,
			color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
		},
		{
			id: "buffer",
			title: "BullMQ / Redis Buffer",
			subtitle: "500k req/s Non-blocking",
			icon: Layers,
			color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
		},
		{
			id: "sse",
			title: "SSE Stream Engine",
			subtitle: "<15ms Global Broadcast",
			icon: Radio,
			color: "text-primary bg-primary/10 border-primary/20",
		},
		{
			id: "dashboard",
			title: "UpNode SRE Dashboard",
			subtitle: "Real-time AI Insights",
			icon: LayoutDashboard,
			color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
		},
	];

	return (
		<div className="w-full rounded-2xl bg-card/60 backdrop-blur-xl border border-border/80 p-6 shadow-xl space-y-6 relative overflow-hidden">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-sm font-bold text-foreground flex items-center gap-2">
						Real-Time Data Pipeline
						<span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
							Zero Lockup Architecture
						</span>
					</h3>
					<p className="text-xs text-muted-foreground font-mono mt-0.5">
						Non-blocking queue ingestion to live SSE browser broadcasts
					</p>
				</div>

				<div className="flex items-center gap-1 text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
					<ShieldCheck className="w-3.5 h-3.5" />
					<span>99.999% SLA Uptime</span>
				</div>
			</div>

			{/* Nodes grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
				{nodes.map((node, index) => (
					<motion.div
						key={node.id}
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: index * 0.1 }}
						className="p-4 rounded-xl bg-card border border-border/70 hover:border-primary/40 transition-all space-y-2 relative group"
					>
						<div className="flex items-center justify-between">
							<div className={`p-2 rounded-xl border ${node.color}`}>
								<node.icon className="w-4 h-4" />
							</div>
							<span className="text-[10px] font-mono text-muted-foreground">
								Step 0{index + 1}
							</span>
						</div>

						<div>
							<h4 className="text-xs font-bold text-foreground">
								{node.title}
							</h4>
							<p className="text-[11px] font-mono text-muted-foreground mt-0.5">
								{node.subtitle}
							</p>
						</div>

						{/* Glowing animated beam connecting steps on desktop */}
						{index < nodes.length - 1 && (
							<div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
								<motion.div
									animate={{ x: [0, 4, 0] }}
									transition={{ repeat: Infinity, duration: 1.5 }}
								>
									<ArrowRight className="w-4 h-4 text-primary/70" />
								</motion.div>
							</div>
						)}
					</motion.div>
				))}
			</div>

			{/* Animated Data Stream Bar */}
			<div className="relative h-2 bg-muted/70 rounded-full overflow-hidden">
				<motion.div
					animate={{ x: ["-100%", "100%"] }}
					transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
					className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)]"
				/>
			</div>
		</div>
	);
}
