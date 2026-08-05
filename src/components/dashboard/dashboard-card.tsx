"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

export interface DashboardCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  changeType?: "positive" | "negative" | "neutral";
  status?: "OPERATIONAL" | "DEGRADED" | "CRITICAL" | "MAINTENANCE";
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  testId?: string;
}

export function DashboardCard({
  title,
  value,
  change,
  changeType = "neutral",
  status,
  subtitle,
  icon,
  onClick,
  testId = "dashboard-card",
}: DashboardCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "OPERATIONAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold uppercase rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            OPERATIONAL
          </span>
        );
      case "DEGRADED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold uppercase rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            DEGRADED
          </span>
        );
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[10px] font-mono font-bold uppercase rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            CRITICAL
          </span>
        );
      case "MAINTENANCE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-[10px] font-mono font-bold uppercase rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            MAINTENANCE
          </span>
        );
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    if (changeType === "positive") {
      return <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
    }
    if (changeType === "negative") {
      return <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
    }
    return <Minus className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
  };

  return (
    <div
      data-testid={testId}
      onClick={onClick}
      className={`p-5 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-lg shadow-sm font-sans flex flex-col justify-between transition-all ${
        onClick ? "cursor-pointer hover:border-slate-400 dark:hover:border-neutral-600 hover:shadow-md" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">{value}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status && getStatusBadge()}
          {icon ? (
            <div className="p-2 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded text-slate-700 dark:text-neutral-300">
              {icon}
            </div>
          ) : (
            !status && (
              <div className="p-2 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded text-slate-400">
                <Activity className="w-4 h-4" />
              </div>
            )
          )}
        </div>
      </div>

      {(change || subtitle) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-900 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-neutral-400">
          {change && (
            <div className="flex items-center gap-1 font-medium">
              {getTrendIcon()}
              <span
                className={
                  changeType === "positive"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : changeType === "negative"
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-slate-500 dark:text-neutral-400"
                }
              >
                {change}
              </span>
            </div>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

export default DashboardCard;
