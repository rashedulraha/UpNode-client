"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  KeyRound
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-mono text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400 dark:text-neutral-500" />
          </div>
        }
      >
        <ResetFormContent />
      </Suspense>
    </ProtectedRoute>
  );
}

function ResetFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [errorMessage, setErrorMessage] = useState<string | null>(
    token ? null : "Missing password reset token. Please check the link in your email."
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    if (!token) {
      setErrorMessage("No token found. Cannot reset password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await authClient.resetPassword({
        newPassword: values.password,
        token: token,
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Failed to reset password. The link may have expired.");
      } else {
        setSuccessMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-sans grid grid-cols-1 lg:grid-cols-12 overflow-x-hidden relative selection:bg-slate-800">
      {/* Background Noise Grid Overlay matching Dashboard */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* LEFT COLUMN: FORM */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-neutral-800 relative z-10 bg-white/70 dark:bg-black/80 backdrop-blur-md"
      >
        {/* Top Header Logo */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-bold text-sm tracking-widest uppercase font-mono text-slate-900 dark:text-white">
              UPNODE
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-100 dark:bg-black text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800">
              v2.6
            </span>
          </Link>

          <ThemeToggle />
        </div>

        {/* Form Container */}
        <div className="my-auto py-8 max-w-sm w-full mx-auto space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-black border border-slate-200 dark:border-neutral-800 font-mono text-[10px] text-slate-600 dark:text-neutral-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>CREDENTIALS UPDATE // SYSTEM RESET</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
              Reset password
            </h1>
            <p className="text-xs font-mono text-slate-500 dark:text-neutral-400 leading-relaxed">
              Define a strong, secure new password for your UpNode infrastructure telemetry account.
            </p>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase">[RESET_FAILED]</p>
                <p className="mt-0.5 text-[11px]">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase">[PASSWORD_RESET_SUCCESS]</p>
                <p className="mt-0.5 text-[11px]">{successMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-mono">
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-700 dark:text-neutral-300">
                [NEW_PASSWORD]
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-neutral-500" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  disabled={isSubmitting || !token}
                  className={`w-full pl-9 pr-3.5 py-2 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-all ${
                    errors.password ? "border-rose-500" : ""
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-[10px] text-rose-500 font-mono tracking-wide">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-700 dark:text-neutral-300">
                [CONFIRM_NEW_PASSWORD]
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-neutral-500" />
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  disabled={isSubmitting || !token}
                  className={`w-full pl-9 pr-3.5 py-2 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-all ${
                    errors.confirmPassword ? "border-rose-500" : ""
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[10px] text-rose-500 font-mono tracking-wide">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="w-full py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-black font-mono font-bold uppercase tracking-wider text-xs border border-slate-900 dark:border-white hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-3 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  RESETTING PASSWORD...
                </>
              ) : (
                <>
                  <ArrowRight className="w-3.5 h-3.5" />
                  [RESET_PASSWORD]
                </>
              )}
            </button>
          </form>

          {/* Toggle link back to Login */}
          <div className="text-center font-mono text-xs text-slate-500 dark:text-neutral-400 pt-3 border-t border-slate-200 dark:border-neutral-800">
            Go back to login?{" "}
            <Link
              href="/login"
              className="font-bold text-slate-900 dark:text-white hover:underline transition-all uppercase"
            >
              [SIGN_IN]
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 flex items-center justify-between tracking-widest uppercase">
          <span>UPNODE INCIDENT PLATFORM</span>
          <span>v2.6 TRUST GATE</span>
        </div>
      </motion.div>

      {/* RIGHT COLUMN: SHOWCASE */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 bg-slate-100/60 dark:bg-neutral-950/60 border-l border-slate-200 dark:border-neutral-800 relative overflow-hidden"
      >
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white text-xs font-mono uppercase tracking-wider">
            <span>SECURE SYSTEM OVERRIDE</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug font-sans">
            Resetting password with cryptographically{" "}
            <span className="font-mono text-slate-500 dark:text-neutral-400 underline decoration-rose-500/50">secure tokens</span>.
          </h2>

          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed font-mono">
            New passwords are hashed using salt hashes on the server before database storage, protecting against database dumps and sniffing attacks.
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                title: "[BCRYPT_PASSWORD_HASHING]",
                desc: "Secure Bcrypt algorithm with high cost parameters.",
                icon: KeyRound,
                iconColor: "text-amber-500",
              },
              {
                title: "[TLS_TRANSPORT_PROTECTION]",
                desc: "All session tokens and credentials sent securely via TLS.",
                icon: ShieldCheck,
                iconColor: "text-emerald-500",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
                className="p-4 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 flex items-start gap-3 shadow-sm font-mono"
              >
                <div className="p-2 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white mt-0.5">
                  <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-wider">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5 font-sans">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
