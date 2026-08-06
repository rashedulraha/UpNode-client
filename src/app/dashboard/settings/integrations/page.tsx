"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import IntegrationsSettings from "@/components/settings/integrations-settings";
import { Sliders, ArrowLeft, RefreshCw } from "lucide-react";

export default function IntegrationsSettingsPage() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col relative selection:bg-slate-800 transition-colors duration-300">
      {/* Background Noise Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Top Minimal Header Navigation Bar */}
      <header className="border-b border-[var(--border)] bg-[var(--card)] backdrop-blur-3xl px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 font-mono text-xs text-[var(--foreground)]">
        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[DASHBOARD]</span>
          </Link>
          <span className="text-[var(--border)]">/</span>
          <span>SETTINGS</span>
          <span className="text-[var(--border)]">/</span>
          <span className="font-bold text-[var(--foreground)] flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            [ALERT_INTEGRATIONS]
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="h-8 px-3 text-xs font-mono text-[var(--foreground)] bg-[var(--secondary)] border border-[var(--border)] transition-all cursor-pointer uppercase flex items-center gap-1.5 shrink-0 hover:opacity-80"
          >
            <RefreshCw className="w-3 h-3 text-[var(--muted-foreground)]" />
            <span>[REFRESH]</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-8 space-y-7 relative z-10 font-mono">
        {/* Minimal Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] font-mono text-[10px] font-bold uppercase tracking-widest">
                TELEMETRY // ALERTS & WEBHOOKS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-[var(--foreground)] font-mono uppercase">
              Notification Integrations
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] max-w-2xl leading-relaxed font-mono">
              Configure Slack Webhooks for block-formatted alerts to your #incidents channel, Resend SMTP transactional emails, and per-project alert overrides.
            </p>
          </div>
        </div>

        {/* Integrations Settings Form Component */}
        <IntegrationsSettings key={refreshKey} />
      </main>
    </div>
  );
}
