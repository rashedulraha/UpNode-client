"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { User, Session } from "@/types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetchSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionData, isPending, error, refetch } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const user = (sessionData?.user as User) || null;
  const session = (sessionData?.session as Session) || null;
  const isAuthenticated = !!user;
  const isLoading = isPending;

  const refetchSession = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleSignOut = useCallback(async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("activeOrganizationId");
        sessionStorage.clear();
      }
      await authClient.signOut().catch(() => {});
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      } else {
        router.push("/login");
      }
    }
  }, [router]);

  // Listen to 401 unauthorized events dispatched from Axios response interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      if (pathname !== "/login" && pathname !== "/register") {
        const redirectUrl = `/login?redirectTo=${encodeURIComponent(pathname)}`;
        startTransition(() => {
          router.push(redirectUrl);
        });
      }
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        isLoading,
        refetchSession,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
