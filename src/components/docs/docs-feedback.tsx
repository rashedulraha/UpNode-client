"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";

export function DocsFeedback({ sectionTitle }: { sectionTitle: string }) {
	const [voted, setVoted] = useState<"up" | "down" | null>(null);

	return (
		<div className="my-8 p-4 rounded-none border border-neutral-800 bg-black flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
			{voted ? (
				<div className="flex items-center gap-2 text-emerald-400 font-bold">
					<CheckCircle2 className="w-4 h-4" />
					<span>
						FEEDBACK RECEIVED FOR &quot;{sectionTitle.toUpperCase()}&quot;
					</span>
				</div>
			) : (
				<>
					<span className="text-neutral-400">
						WAS THIS SECTION ON{" "}
						<strong className="text-white">
							&quot;{sectionTitle.toUpperCase()}&quot;
						</strong>{" "}
						HELPFUL?
					</span>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setVoted("up")}
							className="flex items-center gap-1.5 px-3 py-1 border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-emerald-450 hover:text-emerald-450 transition-all cursor-pointer"
						>
							<ThumbsUp className="w-3.5 h-3.5" />
							<span>[YES]</span>
						</button>
						<button
							onClick={() => setVoted("down")}
							className="flex items-center gap-1.5 px-3 py-1 border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-rose-400 hover:text-rose-400 transition-all cursor-pointer"
						>
							<ThumbsDown className="w-3.5 h-3.5" />
							<span>[NO]</span>
						</button>
					</div>
				</>
			)}
		</div>
	);
}

export default DocsFeedback;
