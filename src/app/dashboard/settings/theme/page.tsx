"use client";

import React, { useState } from "react";
import { ThemeSettings } from "@/components/settings/theme-settings";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { useIncidentStream } from "@/hooks/useIncidentStream";

export default function ThemeSettingsPage() {
  const { streamStatus } = useIncidentStream();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-sans flex flex-col relative selection:bg-slate-800">
      {/* Background Noise Grid Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Sticky Dashboard Header Navbar */}
      <DashboardHeader
        streamStatus={streamStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={() => {}}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 relative z-10 font-mono">
        <ThemeSettings />
      </main>
    </div>
  );
}
