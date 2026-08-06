"use client";

import React, { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { AuthProvider } from "@/context/auth-context";
import { CustomThemeProvider } from "@/context/theme-context";
import { Toaster } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  // Obtain QueryClient instance (safe for Next.js App Router SSR)
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </CustomThemeProvider>
    </QueryClientProvider>
  );
}

export default Providers;
