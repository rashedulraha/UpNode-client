"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function LandingNavbar() {
  return (
    <header className="sticky top-3 z-50 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="h-14 px-4 sm:px-6 rounded-2xl bg-card/75 backdrop-blur-xl border border-border/80 shadow-lg shadow-primary/5 flex items-center justify-between transition-all">
        {/* Left Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-transform group-hover:scale-105">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
            UpNode
            <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-muted/80 text-muted-foreground border border-border">
              v2.6
            </span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <a
            href="#platform"
            className="px-3 py-1.5 rounded-lg hover:bg-accent/60 hover:text-foreground transition-all"
          >
            Platform
          </a>
          <a
            href="#features"
            className="px-3 py-1.5 rounded-lg hover:bg-accent/60 hover:text-foreground transition-all"
          >
            Features
          </a>
          <a
            href="#architecture"
            className="px-3 py-1.5 rounded-lg hover:bg-accent/60 hover:text-foreground transition-all"
          >
            Architecture
          </a>
          <a
            href="#pricing"
            className="px-3 py-1.5 rounded-lg hover:bg-accent/60 hover:text-foreground transition-all"
          >
            Pricing
          </a>
        </nav>

        {/* Right Action Links */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Sign up</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
