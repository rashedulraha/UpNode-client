"use client";

import React from "react";
import { LogOut, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-sm bg-card border border-border rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 relative"
        >
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-5 right-5 p-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shrink-0">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Confirm Sign Out</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                UpNode Telemetry Session
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to sign out of your account? You will need to log back in to access the real-time incident monitoring dashboard.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-destructive/20 cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoading ? "Signing Out..." : "Sign Out"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default LogoutConfirmModal;
