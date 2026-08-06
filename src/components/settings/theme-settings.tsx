"use client";

import React from "react";
import Link from "next/link";
import { useCustomTheme } from "@/hooks/use-custom-theme";
import {
  DEVELOPER_THEME_LIST,
  DeveloperThemeId,
  ThemeDefinition,
} from "@/lib/theme/theme-config";
import {
  Palette,
  Check,
  Sun,
  Terminal,
  Activity,
  ArrowLeft,
  Sparkles,
  Layers,
  User,
  Users,
  Sliders,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";

export function ThemeSettings() {
  const {
    mode,
    developerThemeId,
    activeDeveloperTheme,
    setMode,
    setDeveloperThemeId,
  } = useCustomTheme();

  return (
    <div className="space-y-6 font-mono selection:bg-slate-800">
      {/* Top Header Navigation & Settings Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-3 py-1.5 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-neutral-600 transition-all text-xs font-mono uppercase flex items-center gap-1.5 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[BACK_TO_DASHBOARD]</span>
          </Link>
          <span className="text-slate-300 dark:text-neutral-700">/</span>
          <span className="text-xs text-slate-500 dark:text-neutral-400 font-bold uppercase">
            SETTINGS // THEME_CONSOLE
          </span>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <Link
            href="/dashboard/settings/profile"
            className="px-3 py-1.5 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white uppercase transition-colors shrink-0 flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>[MY_ACCOUNT]</span>
          </Link>

          <Link
            href="/dashboard/settings/theme"
            className="px-3 py-1.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <Palette className="w-3.5 h-3.5 text-emerald-500" />
            <span>[THEME_CONSOLE]</span>
          </Link>

          <Link
            href="/dashboard/settings/team"
            className="px-3 py-1.5 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white uppercase transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>[TEAM_MANAGEMENT]</span>
          </Link>

          <Link
            href="/dashboard/settings/integrations"
            className="px-3 py-1.5 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white uppercase transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>[INTEGRATIONS]</span>
          </Link>
        </div>
      </div>

      {/* Main Glassmorphism Console Box */}
      <div className="border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 p-6 rounded-none space-y-5 backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span>THEME_ENGINE // CUSTOMIZATION_REGISTRY</span>
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">
              Developer Theme Console
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Select your preferred high-contrast developer theme. The top header button dynamically switches between Light Mode and your chosen Developer Palette.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDeveloperThemeId("obsidian")}
              className="px-3 py-1.5 border border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white text-xs uppercase flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Reset theme to default Obsidian Monochrome Black & White"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>[RESET_OBSIDIAN]</span>
            </button>

            <div className="flex items-center gap-2 px-3.5 py-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ACTIVE: {mode === "light" ? "LIGHT THEME" : activeDeveloperTheme.name}</span>
            </div>
          </div>
        </div>

        {/* Global Mode Select Toggle */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200 dark:border-neutral-800">
          <span className="text-xs text-slate-500 dark:text-neutral-400 uppercase font-bold">
            ACTIVE_MODE:
          </span>
          <button
            onClick={() => setMode("light")}
            className={`px-3.5 py-1.5 text-xs uppercase flex items-center gap-2 border transition-all cursor-pointer ${
              mode === "light"
                ? "bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white font-bold"
                : "bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>LIGHT THEME</span>
          </button>

          <button
            onClick={() => setMode("developer")}
            className={`px-3.5 py-1.5 text-xs uppercase flex items-center gap-2 border transition-all cursor-pointer ${
              mode === "developer"
                ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                : "bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span>DEVELOPER THEME [{activeDeveloperTheme.name.toUpperCase()}]</span>
          </button>
        </div>
      </div>

      {/* Interactive Developer Theme Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>CURATED_DEVELOPER_THEMES ({DEVELOPER_THEME_LIST.length})</span>
          </h2>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500 uppercase font-mono">
            [CLICK_CARD_TO_APPLY]
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEVELOPER_THEME_LIST.map((theme: ThemeDefinition) => {
            const isSelected = developerThemeId === theme.id;
            const isCurrentActive = mode === "developer" && isSelected;

            return (
              <motion.div
                key={theme.id}
                whileHover={{ y: -2 }}
                onClick={() => setDeveloperThemeId(theme.id as DeveloperThemeId)}
                className={`p-4 border transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                  isCurrentActive
                    ? "border-emerald-500 bg-slate-900/90 text-white shadow-[0_0_16px_rgba(16,185,129,0.15)]"
                    : isSelected
                    ? "border-slate-400 dark:border-neutral-600 bg-white dark:bg-neutral-950"
                    : "border-slate-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/60 hover:border-slate-300 dark:hover:border-neutral-700"
                }`}
                style={{
                  background: isCurrentActive ? theme.colors.background : undefined,
                  borderColor: isCurrentActive ? theme.colors.primary : undefined,
                  color: isCurrentActive ? theme.colors.foreground : undefined,
                }}
              >
                {/* Theme Header & Status Badge */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold tracking-tight uppercase">
                      {theme.name}
                    </span>
                    {isCurrentActive && (
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-widest flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] opacity-75">
                    <span>{theme.author}</span>
                    <span className="text-[9px] tracking-widest uppercase">{theme.tag}</span>
                  </div>
                </div>

                {/* Color Swatch Preview Palette */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/40 dark:border-neutral-800/60">
                  <span className="text-[9px] uppercase tracking-widest opacity-60">
                    PALETTE_SWATCHES:
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 h-6">
                    <div
                      className="h-full border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: theme.palette.bg }}
                      title={`Background: ${theme.palette.bg}`}
                    />
                    <div
                      className="h-full border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: theme.palette.surface }}
                      title={`Surface: ${theme.palette.surface}`}
                    />
                    <div
                      className="h-full border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: theme.palette.primary }}
                      title={`Primary: ${theme.palette.primary}`}
                    />
                    <div
                      className="h-full border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: theme.palette.accent }}
                      title={`Accent: ${theme.palette.accent}`}
                    />
                    <div
                      className="h-full border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: theme.palette.border }}
                      title={`Border: ${theme.palette.border}`}
                    />
                  </div>
                </div>

                {/* Select Button Indicator */}
                <button
                  type="button"
                  className={`w-full py-1.5 text-[10px] uppercase font-bold tracking-widest transition-colors cursor-pointer ${
                    isCurrentActive
                      ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                      : "bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-800"
                  }`}
                >
                  {isCurrentActive ? "[THEME_APPLIED]" : "[SELECT_THEME]"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Live Telemetry Preview Window */}
      <div className="border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 p-6 rounded-none space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              LIVE_TELEMETRY_PREVIEW // [{mode === "light" ? "LIGHT" : activeDeveloperTheme.name.toUpperCase()}]
            </span>
          </div>
          <span className="text-[10px] text-emerald-500 uppercase tracking-widest flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            REALTIME_SYNC
          </span>
        </div>

        <div className="p-4 border border-slate-200 dark:border-neutral-800 bg-slate-50/70 dark:bg-neutral-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold">[NODE_US_EAST_1]</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">99.99% UPTIME</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-neutral-800 flex gap-0.5 overflow-hidden">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className={`h-full flex-1 ${
                  i === 18 ? "bg-amber-500" : "bg-emerald-500"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-neutral-400">
            <span>P99_LATENCY: 14ms</span>
            <span>STATUS: HEALTHY</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeSettings;
