"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="h-8 px-2.5 flex items-center justify-center border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-slate-400 shrink-0"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="h-8 px-2.5 flex items-center justify-center border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer shrink-0"
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5 text-amber-400" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-indigo-500" />
      )}
    </button>
  );
}

export default ThemeToggle;
