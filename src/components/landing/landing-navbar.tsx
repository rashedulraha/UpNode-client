"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-base tracking-tight text-foreground flex items-center gap-2">
            UpNode
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
              v2.6
            </span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-muted-foreground">
          <a href="#platform" className="hover:text-foreground transition-colors">
            Platform
          </a>
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#architecture" className="hover:text-foreground transition-colors">
            Architecture
          </a>
          <a href="#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </a>
        </nav>

        {/* Right Action Links */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Sign up</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
