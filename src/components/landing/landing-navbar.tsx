"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { LogoutConfirmModal } from "@/components/auth/logout-confirm-modal";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function LandingNavbar() {
  const { isAuthenticated, user, signOut } = useAuth();
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleConfirmLogout = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    setIsLogoutModalOpen(false);
    setIsDrawerOpen(false);
  };

  const isLandingPage = pathname === "/";

  const navLinks = [
    { label: "Platform", href: isLandingPage ? "#platform" : "/#platform" },
    { label: "Features", href: isLandingPage ? "#features" : "/#features" },
    {
      label: "Architecture",
      href: isLandingPage ? "#architecture" : "/#architecture",
    },
    { label: "Pricing", href: isLandingPage ? "#pricing" : "/#pricing" },
    { label: "Docs", href: "/docs" },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full transition-colors"
        style={{
          background: "var(--lp-nav-bg)",
          backdropFilter: "blur(20px) saturate(1.2)",
          WebkitBackdropFilter: "blur(20px) saturate(1.2)",
          borderBottom: "0.5px solid var(--lp-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between relative">
          {/* Logo & Stream Status */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-bold text-sm tracking-widest uppercase font-mono text-slate-900 dark:text-white">
                UPNODE
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-100 dark:bg-black text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800">
                v2.6
              </span>
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-neutral-800 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="font-semibold tracking-wider text-slate-500 dark:text-neutral-400 uppercase text-[9px]">
                STREAM ACTIVE
              </span>
            </div>
          </div>

          {/* Desktop Center Nav - Absolutely Centered */}
          <nav
            className="hidden md:flex items-center gap-7 font-mono text-[11px] tracking-widest uppercase absolute left-1/2 -translate-x-1/2"
            style={{ color: "var(--lp-text-mid)" }}
          >
            {navLinks.map((l) => {
              const isActive = 
                (l.href === "/docs" && pathname.startsWith("/docs")) ||
                (l.href === "/" && pathname === "/") ||
                (pathname === l.href);
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`hover:opacity-100 transition-opacity py-1 ${
                    isActive
                      ? "text-emerald-500 dark:text-emerald-450 font-bold opacity-100 border-b border-emerald-500 dark:border-emerald-400"
                      : "opacity-75"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <div
                  className="flex items-center gap-2 px-2.5 py-1 font-mono text-[11px]"
                  style={{
                    color: "var(--lp-text-mid)",
                    border: "0.5px solid var(--lp-border)",
                    borderRadius: "8px",
                  }}
                >
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">
                    {user?.name || user?.email}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-[11px] font-semibold transition-all active:scale-95 cursor-pointer"
                  style={{
                    background: "var(--lp-cta-bg)",
                    color: "var(--lp-cta-text)",
                    border: "0.5px solid var(--lp-border-top)",
                    borderRadius: "8px",
                  }}
                >
                  <LayoutDashboard className="w-3 h-3" />
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-mono text-[11px] hover:opacity-100 transition-opacity px-2 py-1"
                  style={{ color: "var(--lp-text-mid)" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-[11px] font-semibold transition-all active:scale-95 cursor-pointer"
                  style={{
                    background: "var(--lp-cta-bg)",
                    color: "var(--lp-cta-text)",
                    border: "0.5px solid var(--lp-border-top)",
                    borderRadius: "8px",
                  }}
                >
                  Get Started
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Controls (Hamburger Trigger + Theme Toggle) */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-lg border transition-all cursor-pointer"
              style={{
                background: "var(--lp-surface)",
                borderColor: "var(--lp-border)",
                color: "var(--lp-text-primary)",
              }}
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Slide-Over (Right Side) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-over Panel from Right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[80vw] p-6 flex flex-col justify-between shadow-2xl"
              style={{
                background: "var(--lp-bg)",
                borderLeft: "0.5px solid var(--lp-border)",
                backdropFilter: "blur(28px)",
              }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--lp-border)]">
                <Link
                  href="/"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center gap-2 font-bold text-sm tracking-tight"
                  style={{ color: "var(--lp-text-primary)" }}
                >
                  UpNode
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                    style={{
                      color: "var(--lp-text-dim)",
                      border: "0.5px solid var(--lp-border)",
                    }}
                  >
                    v2.6
                  </span>
                </Link>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg transition-colors cursor-pointer"
                  style={{
                    background: "var(--lp-surface)",
                    color: "var(--lp-text-dim)",
                    border: "0.5px solid var(--lp-border)",
                  }}
                  aria-label="Close Mobile Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Nav Links */}
              <div className="py-6 flex-1 space-y-4">
                <p
                  className="font-mono text-[9px] tracking-widest uppercase font-semibold"
                  style={{ color: "var(--lp-text-faint)" }}
                >
                  Navigation
                </p>
                <nav className="flex flex-col space-y-3 font-mono text-xs tracking-wider uppercase">
                  {navLinks.map((l) => {
                    const isActive = 
                      (l.href === "/docs" && pathname.startsWith("/docs")) ||
                      (l.href === "/" && pathname === "/") ||
                      (pathname === l.href);
                    return (
                      <Link
                        key={l.label}
                        href={l.href}
                        onClick={() => setIsDrawerOpen(false)}
                        className={`py-1.5 px-2 rounded-none transition-all ${
                          isActive
                            ? "bg-neutral-900 border border-neutral-800 text-emerald-400 font-bold"
                            : "text-[var(--lp-text-primary)] hover:bg-[var(--lp-surface-hover)]"
                        }`}
                      >
                        {l.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Footer / Auth Action CTAs */}
              <div className="pt-4 border-t border-[var(--lp-border)] space-y-3">
                {isAuthenticated ? (
                  <>
                    <div
                      className="flex items-center gap-2 px-3 py-2 font-mono text-xs rounded-lg"
                      style={{
                        color: "var(--lp-text-mid)",
                        background: "var(--lp-surface)",
                        border: "0.5px solid var(--lp-border)",
                      }}
                    >
                      <User className="w-3.5 h-3.5 text-[var(--lp-text-dim)]" />
                      <span className="truncate max-w-[170px]">
                        {user?.name || user?.email}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 font-mono text-xs font-semibold rounded-xl transition-all cursor-pointer"
                      style={{
                        background: "var(--lp-cta-bg)",
                        color: "var(--lp-cta-text)",
                        border: "0.5px solid var(--lp-border-top)",
                      }}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Go to Dashboard
                    </Link>

                    <button
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="flex items-center justify-center gap-2 w-full py-2 font-mono text-xs text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsDrawerOpen(false)}
                      className="block text-center w-full py-2 font-mono text-xs rounded-xl border transition-all"
                      style={{
                        color: "var(--lp-text-mid)",
                        borderColor: "var(--lp-border)",
                        background: "var(--lp-surface)",
                      }}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 font-mono text-xs font-semibold rounded-xl transition-all cursor-pointer"
                      style={{
                        background: "var(--lp-cta-bg)",
                        color: "var(--lp-cta-text)",
                        border: "0.5px solid var(--lp-border-top)",
                      }}
                    >
                      Get Started
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isSigningOut}
      />
    </>
  );
}
