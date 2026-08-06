import { QueryClient, isServer } from "@tanstack/react-query";

function createQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000, // 1 minute
				gcTime: 5 * 60 * 1000, // 5 minutes
				retry: (failureCount, error: any) => {
					// Do not retry client errors (400, 401, 403, 404)
					if (
						error?.response?.status &&
						error.response.status >= 400 &&
						error.response.status < 500
					) {
						return false;
					}
					return failureCount < 2;
				},
				refetchOnWindowFocus: false,
				refetchOnReconnect: true,
			},
			mutations: {
				retry: false,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
	if (isServer) {
		// Server: always make a new query client
		return createQueryClient();
	} else {
		// Browser: make a new query client if we don't already have one
		if (!browserQueryClient) {
			browserQueryClient = createQueryClient();
		}
		return browserQueryClient;
	}
}
