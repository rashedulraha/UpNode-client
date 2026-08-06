"use client";

import React, { useState } from "react";
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
  Cpu,
  Server,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeSettings() {
  const {
    mode,
    developerThemeId,
    activeDeveloperTheme,
    activeTheme,
    setMode,
    setDeveloperThemeId,
  } = useCustomTheme();

  const [isSwitching, setIsSwitching] = useState(false);

  const handleSelectTheme = (id: DeveloperThemeId) => {
    setIsSwitching(true);
    setDeveloperThemeId(id);
    setTimeout(() => {
      setIsSwitching(false);
    }, 450);
  };

  const handleSelectMode = (newMode: "light" | "developer") => {
    setIsSwitching(true);
    setMode(newMode);
    setTimeout(() => {
      setIsSwitching(false);
    }, 450);
  };

  return (
    <div className="space-y-6 font-mono text-xs selection:bg-slate-800">
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
          <span className="font-bold text-slate-900 dark:text-white uppercase">
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

      {/* PART 1: Theme Header Selector Bar (Header Buttons for all themes) */}
      <div className="border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 p-5 rounded-none space-y-4 backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span>THEME_ENGINE // DYNAMIC_PALETTE_SELECTOR</span>
            </div>
            <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">
              Developer Theme Console
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSelectTheme("obsidian")}
              className="px-3 py-1.5 border border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white text-xs uppercase flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Reset to default Obsidian Monochrome"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>[RESET_OBSIDIAN]</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>ACTIVE: {mode === "light" ? "LIGHT THEME" : activeDeveloperTheme.name}</span>
            </div>
          </div>
        </div>

        {/* Global Mode Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 dark:border-neutral-800">
          <span className="text-xs text-slate-500 dark:text-neutral-400 uppercase font-bold mr-1">
            MODE_SELECT:
          </span>
          <button
            onClick={() => handleSelectMode("light")}
            className={`px-3 py-1.5 text-xs uppercase flex items-center gap-2 border transition-all cursor-pointer ${
              mode === "light"
                ? "bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white font-bold"
                : "bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>LIGHT THEME</span>
          </button>

          <button
            onClick={() => handleSelectMode("developer")}
            className={`px-3 py-1.5 text-xs uppercase flex items-center gap-2 border transition-all cursor-pointer ${
              mode === "developer"
                ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                : "bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span>DEVELOPER THEME [{activeDeveloperTheme.name.toUpperCase()}]</span>
          </button>
        </div>

        {/* Header Action Buttons for ALL Developer Themes */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-neutral-800">
          <span className="text-[10px] text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-bold">
            QUICK_THEME_SWITCH_BUTTONS:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {DEVELOPER_THEME_LIST.map((t) => {
              const isSelected = developerThemeId === t.id && mode === "developer";
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id as DeveloperThemeId)}
                  className={`px-3 py-1 text-[11px] uppercase font-mono font-bold tracking-wider transition-all border cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                      : "bg-slate-100 dark:bg-neutral-900/90 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-800 hover:border-slate-400 dark:hover:border-neutral-600 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full border border-black/20"
                    style={{ backgroundColor: t.palette.primary }}
                  />
                  <span>[{t.name.toUpperCase()}]</span>
                  {isSelected && <Check className="w-3 h-3 text-slate-950" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PART 2: DYNAMIC THEME-CONTROLLED CONTENT PREVIEW (100% Theme Tokens Driven) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>DYNAMIC_THEME_PREVIEW // [{activeTheme.name.toUpperCase()}]</span>
          </h2>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500 uppercase font-mono">
            [100%_THEME_TOKEN_STYLED]
          </span>
        </div>

        <AnimatePresence mode="wait">
          {isSwitching ? (
            /* High-Tech Telemetry Skeleton Loader during Theme Change */
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border border-slate-200 dark:border-neutral-800 bg-slate-100/50 dark:bg-neutral-950/50 p-6 space-y-5 animate-pulse"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                    [SYNCING_THEME_TOKENS...]
                  </span>
                </div>
                <div className="w-24 h-4 bg-slate-200 dark:bg-neutral-800 rounded-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 border border-slate-200 dark:border-neutral-800 bg-slate-200/50 dark:bg-neutral-900/50 space-y-2"
                  >
                    <div className="w-24 h-4 bg-slate-300 dark:bg-neutral-800 rounded-none" />
                    <div className="w-36 h-3 bg-slate-200 dark:bg-neutral-800 rounded-none" />
                    <div className="w-20 h-5 bg-slate-300 dark:bg-neutral-800 rounded-none pt-2" />
                  </div>
                ))}
              </div>

              <div className="p-4 border border-slate-200 dark:border-neutral-800 bg-slate-200/50 dark:bg-neutral-900/50 space-y-3">
                <div className="w-48 h-4 bg-slate-300 dark:bg-neutral-800 rounded-none" />
                <div className="w-full h-12 bg-slate-200 dark:bg-neutral-800 rounded-none" />
              </div>
            </motion.div>
          ) : (
            /* Theme-Controlled Dynamic Content Component */
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border p-6 space-y-6 font-mono transition-colors"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              {/* Card Title Bar */}
              <div
                className="flex items-center justify-between pb-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4" style={{ color: "var(--primary)" }} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    ACTIVE_THEME_CANVAS // {activeTheme.name} ({activeTheme.tag})
                  </span>
                </div>
                <span
                  className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 border"
                  style={{
                    backgroundColor: "var(--accent)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  TOKEN_SYNC: OK
                </span>
              </div>

              {/* 3 Telemetry Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className="p-4 border space-y-1.5 transition-colors"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-70">
                    <span>EDGE_CLUSTER</span>
                    <Server className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
                  </div>
                  <p className="text-base font-bold uppercase tracking-tight">
                    48 NODES
                  </p>
                  <p className="text-[10px] opacity-60">P99 LATENCY: 14MS</p>
                </div>

                <div
                  className="p-4 border space-y-1.5 transition-colors"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-70">
                    <span>UPTIME_SLA</span>
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <p className="text-base font-bold uppercase tracking-tight text-emerald-500">
                    99.999%
                  </p>
                  <p className="text-[10px] opacity-60">INCIDENTS: 0 OPEN</p>
                </div>

                <div
                  className="p-4 border space-y-1.5 transition-colors"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-70">
                    <span>THEME_PRIMARY</span>
                    <Zap className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
                  </div>
                  <p
                    className="text-base font-bold uppercase tracking-tight truncate"
                    style={{ color: "var(--primary)" }}
                  >
                    {activeTheme.palette.primary}
                  </p>
                  <p className="text-[10px] opacity-60">HEX_PALETTE_PRIMARY</p>
                </div>
              </div>

              {/* Terminal Code Snippet in Active Theme Style */}
              <div
                className="p-4 border space-y-2 transition-colors font-mono text-[11px]"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center justify-between opacity-60 text-[10px] uppercase border-b pb-2" style={{ borderColor: "var(--border)" }}>
                  <span>terminal // telemetry.stream</span>
                  <span>theme_vars.json</span>
                </div>
                <div className="space-y-1 pt-1 leading-relaxed">
                  <p>
                    <span style={{ color: "var(--primary)" }}>const</span> theme ={" "}
                    <span className="text-emerald-500">"{activeTheme.id}"</span>;
                  </p>
                  <p className="opacity-75">
                    // All dashboard components read variables directly from CSS tokens:
                  </p>
                  <p>
                    background: <span style={{ color: "var(--primary)" }}>"{activeTheme.colors.background}"</span>
                  </p>
                  <p>
                    card_surface: <span style={{ color: "var(--primary)" }}>"{activeTheme.colors.card}"</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ThemeSettings;
