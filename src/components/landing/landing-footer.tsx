"use client";

import React from "react";

export function LandingFooter() {
  return (
    <footer
      className="py-8 relative"
      style={{
        background: "var(--lp-bg)",
        borderTop: "0.5px solid var(--lp-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] tracking-widest" style={{ color: "var(--lp-text-dim)" }}>
        <div className="flex items-center gap-3">
          <span className="font-bold" style={{ color: "var(--lp-text-primary)" }}>UpNode</span>
          <span style={{ color: "var(--lp-text-faint)" }}>—</span>
          <span>© 2026 UpNode Inc.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:opacity-100 transition-opacity" style={{ color: "var(--lp-text-mid)" }}>
            Privacy
          </a>
          <a href="#terms" className="hover:opacity-100 transition-opacity" style={{ color: "var(--lp-text-mid)" }}>
            Terms
          </a>
          <a
            href="#status"
            className="hover:opacity-100 transition-opacity flex items-center gap-1.5"
            style={{ color: "var(--lp-text-mid)" }}
          >
            <span className="relative flex h-1 w-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "var(--lp-text-mid)" }} />
              <span className="relative inline-flex rounded-full h-1 w-1" style={{ background: "var(--lp-text-primary)" }} />
            </span>
            99.999% Operational
          </a>
        </div>
      </div>
    </footer>
  );
}
