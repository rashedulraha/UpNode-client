"use client";

import { useState, useEffect } from "react";
import { organizationService } from "@/services/organization.service";
import { useAuth } from "@/hooks/use-auth";

/**
 * Returns the current user's role within the active organization.
 */
export function useOrgRole() {
  const { user } = useAuth();
  const [orgRole, setOrgRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    organizationService
      .getUserOrganizations()
      .then((orgs) => {
        if (orgs.length > 0) {
          // Use the active org or first available
          const activeOrgId =
            typeof window !== "undefined"
              ? localStorage.getItem("activeOrganizationId")
              : null;
          const activeOrg = activeOrgId
            ? orgs.find((o) => o.id === activeOrgId) || orgs[0]
            : orgs[0];
          setOrgRole(activeOrg.memberRole);
        } else {
          setOrgRole(null);
        }
      })
      .catch(() => setOrgRole(null))
      .finally(() => setIsLoading(false));
  }, [user]);

  const isAdmin = orgRole === "ADMIN" || user?.role === "ADMIN";

  const isAtLeastEngineer = isAdmin || orgRole === "ENGINEER";

  return { orgRole, isAdmin, isAtLeastEngineer, isLoading };
}
