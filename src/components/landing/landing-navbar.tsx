"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, LayoutDashboard, LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { LogoutConfirmModal } from "@/components/auth/logout-confirm-modal";

export function LandingNavbar() {
  const { isAuthenticated, user, signOut } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    setIsLogoutModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-transform group-hover:scale-105">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-base tracking-tight text-foreground flex items-center gap-2">
            UpNode
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
              v2.6
            </span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-muted-foreground">
          <a
            href="#platform"
            className="hover:text-foreground transition-colors py-1"
          >
            Platform
          </a>
          <a
            href="#features"
            className="hover:text-foreground transition-colors py-1"
          >
            Features
          </a>
          <a
            href="#architecture"
            className="hover:text-foreground transition-colors py-1"
          >
            Architecture
          </a>
          <a
            href="#pricing"
            className="hover:text-foreground transition-colors py-1"
          >
            Pricing
          </a>
        </nav>

        {/* Right Action Links */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-muted border border-border text-xs font-mono text-muted-foreground">
                <User className="w-3.5 h-3.5 text-primary" />
                <span className="truncate max-w-[120px] font-medium text-foreground">
                  {user?.name || user?.email}
                </span>
              </div>
              <Link
                href="/dashboard"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors px-2 py-1 flex items-center gap-1 cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Sign up</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isSigningOut}
      />
    </header>
  );
}
