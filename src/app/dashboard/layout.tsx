import React from "react";
import { Metadata } from "next";
import ProtectedRoute from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Dashboard - UpNode Infrastructure Monitoring",
  description:
    "Real-time incident monitoring stream and project management dashboard.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute requireAuth={true}>{children}</ProtectedRoute>;
}
