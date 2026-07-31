"use client";

import React from "react";

export function LandingFooter() {
  return (
    <footer
      className="py-8 relative"
      style={{
        background: "#000",
        borderTop: "0.5px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-white/22 tracking-widest">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white/45">UpNode</span>
          <span className="text-white/15">—</span>
          <span>© 2026 UpNode Inc.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-white/50 transition-colors">
            Privacy
          </a>
          <a href="#terms" className="hover:text-white/50 transition-colors">
            Terms
          </a>
          <a
            href="#status"
            className="hover:text-white/50 transition-colors flex items-center gap-1.5"
          >
            <span className="relative flex h-1 w-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50 opacity-60" />
              <span className="relative inline-flex rounded-full h-1 w-1 bg-white/70" />
            </span>
            99.999% Operational
          </a>
        </div>
      </div>
    </footer>
  );
}
