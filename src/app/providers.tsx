"use client";

import React, { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { getQueryClient } from "@/lib/query-client";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/toast";

// Suppress false-positive React 19 script tag warning from next-themes inline FOUC prevention script
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
      return;
    }
    origError.apply(console, args);
  };
}

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
        scriptProps={{ "data-cfasync": "false" }}
      >

        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}

export default Providers;
