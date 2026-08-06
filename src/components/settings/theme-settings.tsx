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
  ShieldCheck,
  Bell,
  Code,
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
    if (developerThemeId === id && mode === "developer") return;
    setIsSwitching(true);
    setDeveloperThemeId(id);
    if (mode === "light") {
      setMode("developer");
    }
    setTimeout(() => {
      setIsSwitching(false);
    }, 400);
  };

  const handleSelectMode = (newMode: "light" | "developer") => {
    if (mode === newMode) return;
    setIsSwitching(true);
    setMode(newMode);
    setTimeout(() => {
      setIsSwitching(false);
    }, 400);
  };

  return (
    <div className="space-y-6 font-mono text-xs selection:bg-slate-800 text-[var(--foreground)]">
      {/* Top Header Navigation & Settings Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-3 py-1.5 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:opacity-80 transition-all text-xs font-mono uppercase flex items-center gap-1.5 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[BACK_TO_DASHBOARD]</span>
          </Link>
          <span className="text-[var(--muted-foreground)]">/</span>
          <span className="font-bold text-[var(--foreground)] uppercase">
            SETTINGS // THEME_CONSOLE
          </span>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <Link
            href="/dashboard/settings/profile"
            className="px-3 py-1.5 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:opacity-80 uppercase transition-colors shrink-0 flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>[MY_ACCOUNT]</span>
          </Link>

          <Link
            href="/dashboard/settings/theme"
            className="px-3 py-1.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 font-bold uppercase transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <Palette className="w-3.5 h-3.5 text-emerald-500" />
            <span>[THEME_CONSOLE]</span>
          </Link>

          <Link
            href="/dashboard/settings/team"
            className="px-3 py-1.5 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:opacity-80 uppercase transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>[TEAM_MANAGEMENT]</span>
          </Link>

          <Link
            href="/dashboard/settings/integrations"
            className="px-3 py-1.5 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:opacity-80 uppercase transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>[INTEGRATIONS]</span>
          </Link>
        </div>
      </div>

      {/* Main Console Header Box */}
      <div className="border border-[var(--border)] bg-[var(--card)] p-5 rounded-none space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span>THEME_ENGINE // DYNAMIC_PALETTE_REGISTRY</span>
            </div>
            <h1 className="text-xl font-bold uppercase tracking-tight text-[var(--foreground)]">
              Developer Theme Console
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] max-w-xl leading-relaxed">
              Select your active developer color palette. The header toggle dynamically switches between Light Mode and your active theme.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSelectTheme("obsidian")}
              className="px-3 py-1.5 border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] hover:opacity-80 text-xs uppercase flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Reset to default Obsidian Black & White"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>[RESET_OBSIDIAN]</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>ACTIVE: {mode === "light" ? "LIGHT THEME" : activeDeveloperTheme.name}</span>
            </div>
          </div>
        </div>

        {/* Global Mode Switcher & Quick Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--muted-foreground)] uppercase font-bold mr-1">
              MODE_SELECT:
            </span>
            <button
              onClick={() => handleSelectMode("light")}
              className={`px-3 py-1.5 text-xs uppercase flex items-center gap-2 border transition-all cursor-pointer ${
                mode === "light"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-bold"
                  : "bg-[var(--secondary)] text-[var(--foreground)] border-[var(--border)] hover:opacity-80"
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
                  : "bg-[var(--secondary)] text-[var(--foreground)] border-[var(--border)] hover:opacity-80"
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span>DEVELOPER THEME [{activeDeveloperTheme.name.toUpperCase()}]</span>
            </button>
          </div>

          {/* Quick Pill Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {DEVELOPER_THEME_LIST.map((t) => {
              const isSelected = developerThemeId === t.id && mode === "developer";
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id as DeveloperThemeId)}
                  className={`px-2.5 py-1 text-[10px] uppercase font-mono font-bold tracking-wider transition-all border cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-emerald-500 text-slate-950 border-emerald-400"
                      : "bg-[var(--secondary)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: t.palette.primary }}
                  />
                  <span>[{t.name.split(" ")[0].toUpperCase()}]</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-COLUMN SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 5 Developer Theme Gallery Cards (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>CURATED_THEMES ({DEVELOPER_THEME_LIST.length})</span>
            </h2>
            <span className="text-[10px] text-[var(--muted-foreground)] uppercase">
              [CLICK_CARD_TO_APPLY]
            </span>
          </div>

          <div className="space-y-3">
            {DEVELOPER_THEME_LIST.map((theme: ThemeDefinition) => {
              const isSelected = developerThemeId === theme.id;
              const isCurrentActive = mode === "developer" && isSelected;

              return (
                <motion.div
                  key={theme.id}
                  whileHover={{ x: 2 }}
                  onClick={() => handleSelectTheme(theme.id as DeveloperThemeId)}
                  className={`p-4 border transition-all cursor-pointer relative space-y-3 ${
                    isCurrentActive
                      ? "border-emerald-500 bg-[var(--card)] text-[var(--foreground)] shadow-[0_0_16px_rgba(16,185,129,0.15)]"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] text-[var(--foreground)] opacity-90 hover:opacity-100"
                  }`}
                >
                  {/* Theme Header & Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tracking-tight uppercase">
                          {theme.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[var(--muted-foreground)]">
                        <span>{theme.author}</span>
                        <span>•</span>
                        <span className="tracking-widest uppercase">{theme.tag.split("//")[1]?.trim() || theme.tag}</span>
                      </div>
                    </div>

                    {isCurrentActive && (
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-widest flex items-center gap-1 shrink-0">
                        <Check className="w-3 h-3" />
                        ACTIVE
                      </span>
                    )}
                  </div>

                  {/* Swatches Palette */}
                  <div className="grid grid-cols-5 gap-1.5 h-5 pt-1">
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
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Telemetry Canvas Playground (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <span>TELEMETRY_CANVAS_PREVIEW</span>
            </h2>
            <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              LIVE_TOKENS_SYNCED
            </span>
          </div>

          <AnimatePresence mode="wait">
            {isSwitching ? (
              /* High-Tech Pulse Skeleton Loader */
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border border-[var(--border)] bg-[var(--card)] p-6 space-y-5 animate-pulse min-h-[420px]"
              >
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-xs font-mono font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
                      [APPLYING_THEME_TOKENS...]
                    </span>
                  </div>
                  <div className="w-24 h-4 bg-[var(--secondary)] rounded-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-[var(--border)] bg-[var(--secondary)] h-20" />
                  <div className="p-4 border border-[var(--border)] bg-[var(--secondary)] h-20" />
                </div>

                <div className="p-4 border border-[var(--border)] bg-[var(--secondary)] h-32" />
                <div className="p-4 border border-[var(--border)] bg-[var(--secondary)] h-24" />
              </motion.div>
            ) : (
              /* Live Component Playground styled 100% by activeTheme CSS variables */
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="border p-6 space-y-6 font-mono transition-colors shadow-md"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                {/* Title & Badge */}
                <div
                  className="flex items-center justify-between pb-3 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" style={{ color: "var(--primary)" }} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {activeTheme.name} // WORKSPACE PREVIEW
                    </span>
                  </div>
                  <span
                    className="text-[10px] uppercase font-bold px-2 py-0.5 border"
                    style={{
                      backgroundColor: "var(--secondary)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    100% DYNAMIC
                  </span>
                </div>

                {/* 2 Telemetry Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className="p-4 border space-y-1.5 transition-colors"
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-70">
                      <span>PRIMARY_TOKEN</span>
                      <Zap className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
                    </div>
                    <p
                      className="text-lg font-bold uppercase tracking-tight"
                      style={{ color: "var(--primary)" }}
                    >
                      {activeTheme.palette.primary}
                    </p>
                    <p className="text-[10px] opacity-60">HEX_PRIMARY_ACCENT</p>
                  </div>

                  <div
                    className="p-4 border space-y-1.5 transition-colors"
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-70">
                      <span>SYSTEM_HEALTH</span>
                      <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <p className="text-lg font-bold uppercase tracking-tight text-emerald-500">
                      99.99% OK
                    </p>
                    <p className="text-[10px] opacity-60">STREAM: CONNECTED</p>
                  </div>
                </div>

                {/* Interactive Form Controls & Buttons Showcase */}
                <div className="space-y-3 pt-1">
                  <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest font-bold">
                    UI_COMPONENT_PREVIEW:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="px-3.5 py-1.5 text-xs font-bold uppercase transition-opacity border"
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-foreground)",
                        borderColor: "var(--primary)",
                      }}
                    >
                      [PRIMARY_ACTION]
                    </button>

                    <button
                      className="px-3.5 py-1.5 text-xs font-bold uppercase transition-opacity border"
                      style={{
                        backgroundColor: "var(--secondary)",
                        color: "var(--foreground)",
                        borderColor: "var(--border)",
                      }}
                    >
                      [SECONDARY_BTN]
                    </button>

                    <span
                      className="px-2.5 py-1 text-[10px] font-bold uppercase border flex items-center gap-1"
                      style={{
                        backgroundColor: "var(--secondary)",
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                    >
                      <Bell className="w-3 h-3 text-amber-500" />
                      ALERTS_ENABLED
                    </span>
                  </div>
                </div>

                {/* Code Snippet Box */}
                <div
                  className="p-4 border space-y-2 transition-colors font-mono text-[11px]"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div
                    className="flex items-center justify-between opacity-60 text-[10px] uppercase border-b pb-2"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span className="flex items-center gap-1">
                      <Code className="w-3 h-3 text-emerald-500" />
                      tokens // css_variables.json
                    </span>
                    <span>{activeTheme.id}</span>
                  </div>
                  <div className="space-y-1 pt-1 leading-relaxed">
                    <p>
                      <span style={{ color: "var(--primary)" }}>:root</span> [data-theme=
                      <span className="text-emerald-500">"{activeTheme.id}"</span>] &#123;
                    </p>
                    <p className="pl-4">
                      --background: <span style={{ color: "var(--primary)" }}>"{activeTheme.colors.background}"</span>;
                    </p>
                    <p className="pl-4">
                      --card: <span style={{ color: "var(--primary)" }}>"{activeTheme.colors.card}"</span>;
                    </p>
                    <p className="pl-4">
                      --primary: <span style={{ color: "var(--primary)" }}>"{activeTheme.colors.primary}"</span>;
                    </p>
                    <p>&#125;</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ThemeSettings;
