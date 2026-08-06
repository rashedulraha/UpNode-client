"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  ThemeMode,
  DeveloperThemeId,
  ThemeDefinition,
  LIGHT_THEME,
  DEVELOPER_THEMES,
} from "@/lib/theme/theme-config";

interface ThemeContextType {
  mode: ThemeMode;
  developerThemeId: DeveloperThemeId;
  activeTheme: ThemeDefinition;
  activeDeveloperTheme: ThemeDefinition;
  setMode: (mode: ThemeMode) => void;
  setDeveloperThemeId: (id: DeveloperThemeId) => void;
  toggleTheme: () => void;
  isMounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const MODE_STORAGE_KEY = "upnode_theme_mode";
const DEV_THEME_STORAGE_KEY = "upnode_dev_theme_id";

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("developer");
  const [developerThemeId, setDeveloperThemeIdState] = useState<DeveloperThemeId>("dracula");
  const [isMounted, setIsMounted] = useState(false);

  // Read saved values from localStorage on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;
      if (savedMode === "light" || savedMode === "developer") {
        setModeState(savedMode);
      }

      const savedDevTheme = localStorage.getItem(DEV_THEME_STORAGE_KEY) as DeveloperThemeId | null;
      if (savedDevTheme && DEVELOPER_THEMES[savedDevTheme]) {
        setDeveloperThemeIdState(savedDevTheme);
      }
    } catch {
      // Fallback to defaults if localStorage is unavailable
    } finally {
      setIsMounted(true);
    }
  }, []);

  const activeDeveloperTheme = DEVELOPER_THEMES[developerThemeId] || DEVELOPER_THEMES.dracula;
  const activeTheme = mode === "light" ? LIGHT_THEME : activeDeveloperTheme;

  // Apply CSS Variables to :root / document.documentElement whenever active theme changes
  const applyThemeTokens = useCallback((theme: ThemeDefinition) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    // Apply dark class for backward-compatibility with tailwind .dark variant
    if (theme.isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Set data-theme attribute
    root.setAttribute("data-theme", theme.id);

    // Map color tokens to CSS variables
    const { colors } = theme;
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--foreground", colors.foreground);
    root.style.setProperty("--card", colors.card);
    root.style.setProperty("--card-foreground", colors.cardForeground);
    root.style.setProperty("--popover", colors.popover);
    root.style.setProperty("--popover-foreground", colors.popoverForeground);
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-foreground", colors.primaryForeground);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--secondary-foreground", colors.secondaryForeground);
    root.style.setProperty("--muted", colors.muted);
    root.style.setProperty("--muted-foreground", colors.mutedForeground);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-foreground", colors.accentForeground);
    root.style.setProperty("--border", colors.border);
    root.style.setProperty("--input", colors.input);
    root.style.setProperty("--ring", colors.ring);

    // Landing Page Tokens
    root.style.setProperty("--lp-bg", colors.lpBg);
    root.style.setProperty("--lp-bg-alt", colors.lpBgAlt);
    root.style.setProperty("--lp-surface", colors.lpSurface);
    root.style.setProperty("--lp-surface-hover", colors.lpSurfaceHover);
    root.style.setProperty("--lp-border", colors.lpBorder);
    root.style.setProperty("--lp-border-top", colors.lpBorderTop);
    root.style.setProperty("--lp-text-primary", colors.lpTextPrimary);
    root.style.setProperty("--lp-text-mid", colors.lpTextMid);
    root.style.setProperty("--lp-text-dim", colors.lpTextDim);
    root.style.setProperty("--lp-text-faint", colors.lpTextFaint);
    root.style.setProperty("--lp-dot", colors.lpDot);
    root.style.setProperty("--lp-scan-line", colors.lpScanLine);
    root.style.setProperty("--lp-cta-bg", colors.lpCtaBg);
    root.style.setProperty("--lp-cta-text", colors.lpCtaText);
    root.style.setProperty("--lp-nav-bg", colors.lpNavBg);
    root.style.setProperty("--lp-stroke", colors.lpStroke);
  }, []);

  useEffect(() => {
    applyThemeTokens(activeTheme);
  }, [activeTheme, applyThemeTokens]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, newMode);
    } catch {
      // ignore
    }
  }, []);

  const setDeveloperThemeId = useCallback((id: DeveloperThemeId) => {
    if (DEVELOPER_THEMES[id]) {
      setDeveloperThemeIdState(id);
      setModeState("developer");
      try {
        localStorage.setItem(DEV_THEME_STORAGE_KEY, id);
        localStorage.setItem(MODE_STORAGE_KEY, "developer");
      } catch {
        // ignore
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextMode: ThemeMode = mode === "light" ? "developer" : "light";
    setMode(nextMode);
  }, [mode, setMode]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        developerThemeId,
        activeTheme,
        activeDeveloperTheme,
        setMode,
        setDeveloperThemeId,
        toggleTheme,
        isMounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useCustomTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useCustomTheme must be used within CustomThemeProvider");
  }
  return context;
}
