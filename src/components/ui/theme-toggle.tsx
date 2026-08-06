"use client";

import React from "react";
import { useCustomTheme } from "@/hooks/use-custom-theme";
import { Sun, Palette, Terminal } from "lucide-react";

export function ThemeToggle() {
  const { mode, activeDeveloperTheme, toggleTheme, isMounted } = useCustomTheme();

  if (!isMounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="h-8 px-2.5 flex items-center justify-center border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-slate-400 shrink-0 font-mono text-[10px]"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
    );
  }

  const isLight = mode === "light";
  const devThemeName = activeDeveloperTheme.name;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isLight ? `Switch to ${devThemeName} Developer Theme` : "Switch to Light Theme"}
      aria-label={isLight ? `Switch to ${devThemeName}` : "Switch to Light Theme"}
      className="h-8 px-2.5 flex items-center gap-1.5 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-all cursor-pointer shrink-0 font-mono text-[10px] tracking-wider rounded-none uppercase group"
    >
      {isLight ? (
        <>
          <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span className="hidden sm:inline-block text-slate-600 dark:text-neutral-400 font-bold">
            [LIGHT]
          </span>
        </>
      ) : (
        <>
          <Palette className="h-3.5 w-3.5 text-emerald-400 shrink-0 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline-block text-emerald-500 dark:text-emerald-400 font-bold">
            [{devThemeName.toUpperCase()}]
          </span>
        </>
      )}
    </button>
  );
}

export default ThemeToggle;
