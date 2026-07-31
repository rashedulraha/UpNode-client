"use client";

import React from "react";

export type StatusDotVariant =
  | "OPERATIONAL"
  | "RESOLVED"
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "INVESTIGATING"
  | "IDENTIFIED"
  | "MONITORING"
  | "LIVE"
  | "OFFLINE";

interface StatusDotProps {
  variant: StatusDotVariant | string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

export function StatusDot({
  variant,
  size = "md",
  pulse = true,
  className = "",
}: StatusDotProps) {
  const getDotColors = (v: string) => {
    switch (v?.toUpperCase()) {
      case "OPERATIONAL":
      case "RESOLVED":
      case "LIVE":
      case "LOW":
        return {
          dot: "bg-emerald-500",
          ring: "bg-emerald-500/30",
        };
      case "CRITICAL":
      case "MAJOR_OUTAGE":
      case "OFFLINE":
        return {
          dot: "bg-rose-500",
          ring: "bg-rose-500/30",
        };
      case "HIGH":
      case "PARTIAL_OUTAGE":
      case "INVESTIGATING":
        return {
          dot: "bg-amber-500",
          ring: "bg-amber-500/30",
        };
      case "MEDIUM":
      case "DEGRADED_PERFORMANCE":
      case "IDENTIFIED":
      case "MONITORING":
      default:
        return {
          dot: "bg-indigo-500",
          ring: "bg-indigo-500/30",
        };
    }
  };

  const { dot, ring } = getDotColors(variant);

  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  const outerSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <span className={`relative inline-flex items-center justify-center ${outerSizeClasses[size]} ${className}`}>
      {pulse && (
        <>
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${ring}`}
          />
          <span
            className={`absolute inline-flex h-3/4 w-3/4 rounded-full opacity-40 animate-pulse ${ring}`}
          />
        </>
      )}
      <span className={`relative inline-flex rounded-full ${sizeClasses[size]} ${dot}`} />
    </span>
  );
}

export default StatusDot;
