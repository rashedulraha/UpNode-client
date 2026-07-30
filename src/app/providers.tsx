"use client";

import React, { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { getQueryClient } from "@/lib/query-client";
import { AuthProvider } from "@/context/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  // Obtain QueryClient instance (safe for Next.js App Router SSR)
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AuthProvider>{children}</AuthProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}

export default Providers;
