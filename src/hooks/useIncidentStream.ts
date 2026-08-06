"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Incident, PaginatedIncidents, SSEIncidentEvent } from "@/types";

export interface IncidentStreamStatus {
	isConnected: boolean;
	isReconnecting: boolean;
	error: string | null;
	lastEventTime: Date | null;
}

export function useIncidentStream() {
	const queryClient = useQueryClient();
	const [status, setStatus] = useState<IncidentStreamStatus>({
		isConnected: false,
		isReconnecting: false,
		error: null,
		lastEventTime: null,
	});

	const eventSourceRef = useRef<EventSource | null>(null);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const retryCountRef = useRef<number>(0);
	const isUnmountedRef = useRef<boolean>(false);

	const updateCacheWithIncident = useCallback(
		(incident: Incident, eventType: string) => {
			// 1. Direct update for individual incident query cache if present
			queryClient.setQueryData<Incident>(
				["incidents", incident.id],
				(oldData) => {
					if (!oldData) return incident;
					return {
						...oldData,
						...incident,
						timelineEvents: incident.timelineEvents || oldData.timelineEvents,
					};
				},
			);

			// 2. Update list queries cache directly or invalidate
			queryClient.setQueriesData<PaginatedIncidents>(
				{ queryKey: ["incidents"] },
				(oldPaginatedData) => {
					if (!oldPaginatedData) return oldPaginatedData;

					const existingIndex = oldPaginatedData.items.findIndex(
						(item) => item.id === incident.id,
					);

					let newItems: Incident[];
					let newTotal = oldPaginatedData.total;

					if (existingIndex >= 0) {
						// Update existing item in place
						newItems = [...oldPaginatedData.items];
						newItems[existingIndex] = {
							...newItems[existingIndex],
							...incident,
						};
					} else {
						// Prepend new item to list
						newItems = [incident, ...oldPaginatedData.items];
						newTotal += 1;
					}

					return {
						...oldPaginatedData,
						items: newItems,
						total: newTotal,
					};
				},
			);

			// Invalidate queries to ensure complete consistency in background
			queryClient.invalidateQueries({
				queryKey: ["incidents"],
				exact: false,
				refetchType: "none",
			});
		},
		[queryClient],
	);

	const connect = useCallback(() => {
		if (isUnmountedRef.current) return;

		// Prevent duplicate connections
		if (eventSourceRef.current) {
			eventSourceRef.current.close();
			eventSourceRef.current = null;
		}

		const serverUrl =
			process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
		const activeOrgId =
			(typeof window !== "undefined" &&
				localStorage.getItem("activeOrganizationId")) ||
			"org-upnode-main";
		const streamUrl = `${serverUrl}/api/stream?organizationId=${encodeURIComponent(activeOrgId)}`;

		try {
			const eventSource = new EventSource(streamUrl, {
				withCredentials: true,
			});

			eventSourceRef.current = eventSource;

			eventSource.onopen = () => {
				if (isUnmountedRef.current) return;
				retryCountRef.current = 0;
				setStatus({
					isConnected: true,
					isReconnecting: false,
					error: null,
					lastEventTime: new Date(),
				});
			};

			// Custom event from server: incident_update
			eventSource.addEventListener("incident_update", (e: MessageEvent) => {
				if (isUnmountedRef.current) return;
				try {
					const payload = JSON.parse(e.data) as SSEIncidentEvent;
					if (payload && payload.data) {
						updateCacheWithIncident(payload.data, payload.type);
						setStatus((prev) => ({
							...prev,
							lastEventTime: new Date(),
						}));
					}
				} catch (err) {
					console.error("[SSE] Failed to parse incident_update event:", err);
				}
			});

			// Default event connected
			eventSource.addEventListener("connected", () => {
				if (isUnmountedRef.current) return;
				setStatus((prev) => ({
					...prev,
					isConnected: true,
					isReconnecting: false,
					error: null,
				}));
			});

			eventSource.onerror = (err) => {
				if (isUnmountedRef.current) return;
				eventSource.close();
				eventSourceRef.current = null;

				const maxDelay = 30000; // 30s
				const backoffDelay = Math.min(
					1000 * Math.pow(2, retryCountRef.current),
					maxDelay,
				);

				retryCountRef.current += 1;

				setStatus({
					isConnected: false,
					isReconnecting: true,
					error: `Connection lost. Reconnecting in ${(backoffDelay / 1000).toFixed(0)}s...`,
					lastEventTime: null,
				});

				if (reconnectTimeoutRef.current) {
					clearTimeout(reconnectTimeoutRef.current);
				}

				reconnectTimeoutRef.current = setTimeout(() => {
					// eslint-disable-next-line react-hooks/immutability
					connect();
				}, backoffDelay);
			};
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.error("[SSE] Error creating EventSource:", err);
			setStatus({
				isConnected: false,
				isReconnecting: false,
				error: err.message || "Failed to initialize SSE stream",
				lastEventTime: null,
			});
		}
	}, [updateCacheWithIncident]);

	useEffect(() => {
		isUnmountedRef.current = false;
		connect();

		const handleOnline = () => {
			retryCountRef.current = 0;
			connect();
		};

		const handleOffline = () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
				eventSourceRef.current = null;
			}
			setStatus({
				isConnected: false,
				isReconnecting: false,
				error: "Network offline",
				lastEventTime: null,
			});
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			isUnmountedRef.current = true;

			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}

			if (eventSourceRef.current) {
				eventSourceRef.current.close();
				eventSourceRef.current = null;
			}

			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, [connect]);

	return status;
}

export default useIncidentStream;
