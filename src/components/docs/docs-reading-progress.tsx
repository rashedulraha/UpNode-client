"use client";

import React, { useState, useEffect } from "react";

export function DocsReadingProgress() {
	const [completion, setCompletion] = useState(0);

	useEffect(() => {
		const updateScrollCompletion = () => {
			const currentProgress = window.scrollY;
			const scrollHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			if (scrollHeight > 0) {
				setCompletion(
					Math.min(100, Math.max(0, (currentProgress / scrollHeight) * 100)),
				);
			}
		};

		window.addEventListener("scroll", updateScrollCompletion);
		updateScrollCompletion();

		return () => window.removeEventListener("scroll", updateScrollCompletion);
	}, []);

	return (
		<div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none">
			<div
				className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(59,130,246,0.7)]"
				style={{ width: `${completion}%` }}
			/>
		</div>
	);
}

export default DocsReadingProgress;
