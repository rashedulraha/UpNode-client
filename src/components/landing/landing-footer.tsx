"use client";

import React from "react";
import { Activity } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">UpNode</span>
          <span>© 2026 UpNode Inc.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#terms" className="hover:text-foreground transition-colors">
            Terms
          </a>
          <a
            href="#status"
            className="hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All Systems 99.999% Operational
          </a>
        </div>
      </div>
    </footer>
  );
}
