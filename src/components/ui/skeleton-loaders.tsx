"use client";

import React from "react";

export function StatCardSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{[1, 2, 3, 4].map((i) => (
				<div
					key={i}
					className="p-5 bg-[var(--card)]/90 border border-[var(--border)] space-y-3 shadow-sm animate-pulse"
				>
					<div className="flex items-center justify-between">
						<div className="h-3 w-20 bg-[var(--secondary)]" />
						<div className="h-4 w-4 rounded-full bg-[var(--secondary)]" />
					</div>
					<div className="space-y-2">
						<div className="h-8 w-24 bg-[var(--secondary)]" />
						<div className="h-3 w-32 bg-[var(--secondary)]/70" />
					</div>
					<div className="h-3 w-full bg-[var(--secondary)]/40 border-t border-[var(--border)] pt-2" />
				</div>
			))}
		</div>
	);
}

export function TableSkeletonRows({ rows = 5 }: { rows?: number }) {
	return (
		<>
			{Array.from({ length: rows }).map((_, index) => (
				<tr
					key={`skeleton-row-${index + 1}`}
					className="animate-pulse border-b border-[var(--border)]"
				>
					<td className="py-4 px-4">
						<div className="h-4 w-28 bg-[var(--secondary)] mb-1" />
						<div className="h-3 w-20 bg-[var(--secondary)]/60" />
					</td>
					<td className="py-4 px-4">
						<div className="h-4 w-36 bg-[var(--secondary)]" />
					</td>
					<td className="py-4 px-4">
						<div className="h-4 w-24 bg-[var(--secondary)]" />
					</td>
					<td className="py-4 px-4">
						<div className="h-5 w-16 bg-[var(--secondary)]" />
					</td>
					<td className="py-4 px-4">
						<div className="h-4 w-12 bg-[var(--secondary)]" />
					</td>
					<td className="py-4 px-4 text-right">
						<div className="h-7 w-24 bg-[var(--secondary)] ml-auto" />
					</td>
				</tr>
			))}
		</>
	);
}

export function AdminPageSkeleton() {
	return (
		<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-mono p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
			{/* Top Bar Skeleton */}
			<div className="h-12 w-full bg-[var(--card)] border border-[var(--border)] shadow-sm" />

			{/* Subroute Nav Tabs Skeleton */}
			<div className="flex gap-2">
				<div className="h-9 w-28 bg-[var(--card)] border border-[var(--border)]" />
				<div className="h-9 w-44 bg-[var(--card)] border border-[var(--border)]" />
				<div className="h-9 w-36 bg-[var(--card)] border border-[var(--border)]" />
			</div>

			{/* Overview Header Skeleton */}
			<div className="h-28 w-full bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 space-y-2">
				<div className="h-4 w-48 bg-[var(--secondary)]" />
				<div className="h-6 w-80 bg-[var(--secondary)]" />
				<div className="h-3 w-96 bg-[var(--secondary)]/60" />
			</div>

			{/* Stat Cards Skeleton */}
			<StatCardSkeleton />

			{/* Table Container Skeleton */}
			<div className="bg-[var(--card)] border border-[var(--border)] p-6 space-y-4 shadow-sm">
				<div className="h-6 w-64 bg-[var(--secondary)]" />
				<div className="h-40 w-full bg-[var(--secondary)]/30 border border-[var(--border)]" />
			</div>
		</div>
	);
}
