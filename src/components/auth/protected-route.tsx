"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requireAuth?: boolean;
}

function ProtectedRouteGuard({
	children,
	requireAuth = true,
}: ProtectedRouteProps) {
	const { user, isAuthenticated, isLoading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (isLoading) return;

		if (requireAuth) {
			if (!isAuthenticated) {
				const redirectTo = searchParams.get("redirectTo") || pathname;
				router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
			} else if (user && !user.emailVerified && pathname !== "/verify-email") {
				router.push("/verify-email");
			}
		} else if (!requireAuth && isAuthenticated) {
			if (user && !user.emailVerified && pathname !== "/verify-email") {
				router.push("/verify-email");
			} else {
				const redirectTo = searchParams.get("redirectTo") || "/dashboard";
				router.push(redirectTo);
			}
		}
	}, [
		user,
		isAuthenticated,
		isLoading,
		requireAuth,
		router,
		pathname,
		searchParams,
	]);

	// If session check completes and user is unauthenticated, hide content while redirecting
	if (!isLoading && requireAuth && !isAuthenticated) {
		return null;
	}

	if (!isLoading && !requireAuth && isAuthenticated) {
		return null;
	}

	// Render children immediately so skeleton loaders inside dashboard render without full-screen blocking spinner
	return <>{children}</>;
}

export function ProtectedRoute(props: ProtectedRouteProps) {
	return (
		<Suspense fallback={<>{props.children}</>}>
			<ProtectedRouteGuard {...props} />
		</Suspense>
	);
}

export default ProtectedRoute;
