"use client";

import React from "react";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer
      className="py-8 relative font-mono select-none"
      style={{
        background: "var(--lp-bg)",
        borderTop: "0.5px solid var(--lp-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] tracking-widest" style={{ color: "var(--lp-text-dim)" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="font-bold hover:underline" style={{ color: "var(--lp-text-primary)" }}>UpNode</Link>
          <span style={{ color: "var(--lp-text-faint)" }}>—</span>
          <span>© 2026 UpNode Inc.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:opacity-100 transition-opacity uppercase font-bold" style={{ color: "var(--lp-text-mid)" }}>
            [PRIVACY]
          </Link>
          <Link href="/terms" className="hover:opacity-100 transition-opacity uppercase font-bold" style={{ color: "var(--lp-text-mid)" }}>
            [TERMS]
          </Link>
          <Link
            href="/status/global"
            className="hover:opacity-100 transition-opacity flex items-center gap-1.5 uppercase"
            style={{ color: "var(--lp-text-mid)" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-emerald-500" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>99.999% OPERATIONAL</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
