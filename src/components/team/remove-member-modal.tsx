"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface RemoveMemberModalProps {
  isOpen: boolean;
  memberEmail: string | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function RemoveMemberModal({
  isOpen,
  memberEmail,
  onClose,
  onConfirm,
  isLoading = false,
}: RemoveMemberModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full max-w-sm bg-card/90 border border-border/40 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 relative glass-card-floating font-sans"
          >
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground tracking-tight">
                Remove Team Member
              </h3>
              <p className="text-xs font-mono text-muted-foreground truncate">
                {memberEmail}
              </p>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to remove this member from the organization? They will lose access to all telemetry streams and incident workspaces.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/30 font-mono">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/60 border border-border/40 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="px-4 py-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold rounded-xl text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Removing..." : "Remove Member"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default RemoveMemberModal;
