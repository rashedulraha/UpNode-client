"use client";

import { useAuthContext } from "@/context/auth-context";

export function useAuth() {
  return useAuthContext();
}

export default useAuth;
