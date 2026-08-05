"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

function ProtectedRouteGuard({ children, requireAuth = true }: ProtectedRouteProps) {
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
  }, [user, isAuthenticated, isLoading, requireAuth, router, pathname, searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-sm font-medium text-zinc-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function ProtectedRoute(props: ProtectedRouteProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      }
    >
      <ProtectedRouteGuard {...props} />
    </Suspense>
  );
}

export default ProtectedRoute;
