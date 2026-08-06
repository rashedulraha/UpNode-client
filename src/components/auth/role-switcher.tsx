"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ShieldCheck, Cpu, Eye, ChevronDown, RefreshCw, Sparkles, X } from "lucide-react";

export type RolePreview = "ADMIN" | "ENGINEER" | "VIEWER";

export function RoleSwitcher() {
  const { user } = useAuth();
  const [activeRole, setActiveRole] = useState<RolePreview>("ADMIN");
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("simulatedRole") as RolePreview | null;
      if (stored && ["ADMIN", "ENGINEER", "VIEWER"].includes(stored)) {
        setActiveRole(stored);
      }
    }
  }, []);

  if (!isMounted || !user) return null;

  const userRole = user.role || "ADMIN";
  const canSwitchRole = userRole === "ADMIN";

  if (!canSwitchRole) return null;

  const handleRoleSelect = (role: RolePreview) => {
    setActiveRole(role);
    setIsOpen(false);
    if (role === "ADMIN") {
      localStorage.removeItem("simulatedRole");
    } else {
      localStorage.setItem("simulatedRole", role);
    }
    window.location.reload();
  };

  const roleConfigs: Record<RolePreview, { label: string; icon: React.ReactNode; color: string; desc: string }> = {
    ADMIN: {
      label: "ADMIN",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
      desc: "Full Control (Projects, Members, Settings)",
    },
    ENGINEER: {
      label: "ENGINEER",
      icon: <Cpu className="w-3.5 h-3.5 text-sky-400" />,
      color: "border-sky-500/30 text-sky-400 bg-sky-500/10",
      desc: "Ops Mode (Report/Resolve Incidents & Telemetry)",
    },
    VIEWER: {
      label: "VIEWER",
      icon: <Eye className="w-3.5 h-3.5 text-amber-400" />,
      color: "border-amber-500/30 text-amber-400 bg-amber-500/10",
      desc: "Read-Only Client Mode (View Dashboards)",
    },
  };

  const currentConfig = roleConfigs[activeRole];

  return (
    <div className="relative inline-block text-left font-mono">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-8 px-2.5 flex items-center gap-2 text-xs border transition-all cursor-pointer ${currentConfig.color}`}
        title="Switch Role View Mode"
      >
        <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
        <span className="text-[10px] text-neutral-400">ROLE:</span>
        <span className="font-bold tracking-wider">{currentConfig.label}</span>
        <ChevronDown className="w-3 h-3 text-neutral-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-neutral-950 border border-neutral-800 rounded-lg shadow-2xl z-50 p-2 text-xs space-y-1">
            <div className="px-2 py-1.5 text-[10px] text-neutral-400 uppercase tracking-wider font-bold border-b border-neutral-800 flex items-center justify-between">
              <span>[SIMULATE ROLE VIEW]</span>
              <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>

            {(["ADMIN", "ENGINEER", "VIEWER"] as RolePreview[]).map((r) => {
              const cfg = roleConfigs[r];
              const isSelected = activeRole === r;
              return (
                <button
                  key={r}
                  onClick={() => handleRoleSelect(r)}
                  className={`w-full text-left px-2.5 py-2 rounded flex flex-col gap-0.5 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-neutral-800 text-white font-bold"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs">
                    {cfg.icon}
                    <span>{cfg.label}</span>
                    {isSelected && <span className="ml-auto text-[9px] text-emerald-400 uppercase">[ACTIVE]</span>}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-normal leading-tight">
                    {cfg.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function RolePreviewBanner() {
  const [activeRole, setActiveRole] = useState<RolePreview | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedEmail, setImpersonatedEmail] = useState("");
  const [superAdminId, setSuperAdminId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("simulatedRole") as RolePreview | null;
      if (storedRole && ["ENGINEER", "VIEWER"].includes(storedRole)) {
        setActiveRole(storedRole);
      }
    }
  }, []);

  const handleResetRole = () => {
    localStorage.removeItem("simulatedRole");
    window.location.reload();
  };

  if (!activeRole) return null;

  return (
    <div className="w-full bg-amber-500/15 border-b border-amber-500/30 text-amber-300 px-4 py-1.5 text-xs font-mono flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        <span>
          🧪 <strong>ROLE PREVIEW MODE ACTIVE:</strong> You are currently viewing workspace as <strong>[{activeRole}]</strong>.
        </span>
      </div>
      <button
        onClick={handleResetRole}
        className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 border border-amber-500/40 rounded text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer transition-colors"
      >
        <RefreshCw className="w-3 h-3" />
        Reset to ADMIN
      </button>
    </div>
  );
}
