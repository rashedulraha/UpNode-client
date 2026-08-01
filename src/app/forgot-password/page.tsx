"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
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
  Mail,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Zap,
  Layers
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-mono text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400 dark:text-neutral-500" />
          </div>
        }
      >
        <ForgotFormContent />
      </Suspense>
    </ProtectedRoute>
  );
}

function ForgotFormContent() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Failed to trigger password reset. Please try again.");
      } else {
        setSuccessMessage("Password reset email sent! Check your inbox or server console in development.");
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

          <div className="flex items-center gap-3 font-mono">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-xs text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>[BACK_TO_LOGIN]</span>
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="my-auto py-8 max-w-sm w-full mx-auto space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-black border border-slate-200 dark:border-neutral-800 font-mono text-[10px] text-slate-600 dark:text-neutral-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>PASSWORD RECOVERY // ACCESS CONTROL</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
              Forgot password?
            </h1>
            <p className="text-xs font-mono text-slate-500 dark:text-neutral-400 leading-relaxed">
              Enter your email address and we'll send you a secure link to reset your account credentials.
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
                <p className="font-bold uppercase">[RECOVERY_FAILED]</p>
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
                <p className="font-bold uppercase">[EMAIL_DISPATCHED]</p>
                <p className="mt-0.5 text-[11px]">{successMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-mono">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-700 dark:text-neutral-300">
                [WORK_EMAIL]
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-neutral-500" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@company.com"
                  disabled={isSubmitting}
                  className={`w-full pl-9 pr-3.5 py-2 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-all ${
                    errors.email ? "border-rose-500" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-rose-500 font-mono tracking-wide">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-black font-mono font-bold uppercase tracking-wider text-xs border border-slate-900 dark:border-white hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-3 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  DISPATCHING LINK...
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  [SEND_RECOVERY_EMAIL]
                </>
              )}
            </button>
          </form>

          {/* Toggle back to Login */}
          <div className="text-center font-mono text-xs text-slate-500 dark:text-neutral-400 pt-3 border-t border-slate-200 dark:border-neutral-800">
            Remembered your credentials?{" "}
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
          <span>v2.6 SECURE KEYEX</span>
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
            <span>SECURE ACCOUNT DECOUPLING</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug font-sans">
            Encrypted Session Store & Password{" "}
            <span className="font-mono text-slate-500 dark:text-neutral-400 underline decoration-amber-500/50">Decoupling</span>.
          </h2>

          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed font-mono">
            Password recovery links expire after 1 hour and are tied to a single-use verification token, complying with strict SOC2 access management principles.
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                title: "[ONE_TIME_TOKENS]",
                desc: "Unique validation hashes invalidating after a single request.",
                icon: KeyRound,
                iconColor: "text-amber-500",
              },
              {
                title: "[SSL_ENCRYPTION_LAYERS]",
                desc: "All traffic is routed through encrypted SSL/TLS channels.",
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
