"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import IntegrationsSettings from "@/components/settings/integrations-settings";

export default function IntegrationsSettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Top Header Navigation Bar */}
      <header className="border-b border-border/40 bg-card/40 backdrop-blur-2xl px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 font-sans glass-card-floating">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-muted-foreground">Settings</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-semibold text-foreground">Integrations &amp; Notifications</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-8 space-y-7">
        {/* Title Header */}
        <div className="border-b border-border/30 pb-6">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Notification Integrations
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Configure Slack Webhooks for rich block-formatted alerts to your #incidents channel, and set up Resend / SMTP transactional email recipients.
          </p>
        </div>

        {/* Integrations Settings Form Component */}
        <IntegrationsSettings />
      </main>
    </div>
  );
}
