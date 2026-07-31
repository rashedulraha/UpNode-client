"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { LogoutConfirmModal } from "@/components/auth/logout-confirm-modal";

export function LandingNavbar() {
  const { isAuthenticated, user, signOut } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleConfirmLogout = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    setIsLogoutModalOpen(false);
  };

  const navLinks = [
    { label: "Platform", href: "#platform" },
    { label: "Features", href: "#features" },
    { label: "Architecture", href: "#architecture" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(20px) saturate(1.2)",
          WebkitBackdropFilter: "blur(20px) saturate(1.2)",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
              UpNode
              <span
                className="text-[9px] font-mono px-1.5 py-0.5 rounded text-white/30"
                style={{ border: "0.5px solid rgba(255,255,255,0.12)" }}
              >
                v2.6
              </span>
            </span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-7 font-mono text-[11px] tracking-widest uppercase text-white/35">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="hover:text-white/80 transition-colors py-1"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div
                  className="hidden sm:flex items-center gap-2 px-2.5 py-1 font-mono text-[11px] text-white/40"
                  style={{ border: "0.5px solid rgba(255,255,255,0.10)", borderRadius: "8px" }}
                >
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{user?.name || user?.email}</span>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-[11px] font-semibold text-black transition-all active:scale-95 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.94)",
                    border: "0.5px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                >
                  <LayoutDashboard className="w-3 h-3" />
                  Dashboard
                </Link>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="p-1.5 text-white/25 hover:text-white/60 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-mono text-[11px] text-white/35 hover:text-white/70 transition-colors px-2 py-1"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-[11px] font-semibold text-black transition-all active:scale-95 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.94)",
                    border: "0.5px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                  }}
                >
                  Get Started
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isSigningOut}
      />
    </>
  );
}
