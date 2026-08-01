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
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Layers,
  Radio,
  Terminal,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-mono text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400 dark:text-neutral-500" />
          </div>
        }
      >
        <RegisterFormContent />
      </Suspense>
    </ProtectedRoute>
  );
}

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const { refetchSession } = useAuth();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Registration failed. Please try again.");
      } else {
        setSuccessMessage("Account created successfully! Redirecting...");
        await refetchSession();
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 500);
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

      {/* LEFT COLUMN: AUTH FORM */}
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
              href="/"
              className="text-xs text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>[HOME]</span>
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="my-auto py-6 max-w-sm w-full mx-auto space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-black border border-slate-200 dark:border-neutral-800 font-mono text-[10px] text-slate-600 dark:text-neutral-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>NEW ACCOUNT // REGISTRATION</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
              Create an account
            </h1>
            <p className="text-xs font-mono text-slate-500 dark:text-neutral-400 leading-relaxed">
              Get started with sub-second incident alerting and non-blocking queue ingestion.
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
                <p className="font-bold uppercase">[REGISTRATION_FAILED]</p>
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
              <p className="font-bold uppercase">{successMessage}</p>
            </motion.div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 font-mono">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-700 dark:text-neutral-300">
                [FULL_NAME]
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-neutral-500" />
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Alex Rivers"
                  disabled={isSubmitting}
                  className={`w-full pl-9 pr-3.5 py-2 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-all ${
                    errors.name ? "border-rose-500" : ""
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[10px] text-rose-500 font-mono tracking-wide">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
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

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-700 dark:text-neutral-300">
                [PASSWORD]
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-neutral-500" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  disabled={isSubmitting}
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
            <div className="space-y-1">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-700 dark:text-neutral-300">
                [CONFIRM_PASSWORD]
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-neutral-500" />
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-black font-mono font-bold uppercase tracking-wider text-xs border border-slate-900 dark:border-white hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-3 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  CREATING ACCOUNT...
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  [CREATE_ACCOUNT]
                </>
              )}
            </button>
          </form>

          {/* Toggle Link to Login */}
          <div className="text-center font-mono text-xs text-slate-500 dark:text-neutral-400 pt-3 border-t border-slate-200 dark:border-neutral-800">
            Already have an account?{" "}
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
          <span>v2.6 SOC2 COMPLIANT</span>
        </div>
      </motion.div>

      {/* RIGHT COLUMN: DASHBOARD STYLE SRE TELEMETRY SHOWCASE */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 bg-slate-100/60 dark:bg-neutral-950/60 border-l border-slate-200 dark:border-neutral-800 relative overflow-hidden"
      >
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white text-xs font-mono uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
            <span>SETUP IN UNDER 3 MINUTES</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug font-sans">
            Built for Reliability Engineers who demand{" "}
            <span className="font-mono text-slate-500 dark:text-neutral-400 underline decoration-emerald-500/50">Zero Downtime</span>.
          </h2>

          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed font-mono">
            Start monitoring your infrastructure with full SSE telemetry, isolated BullMQ background workers, and built-in incident status pages.
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                title: "[14_DAY_UNLIMITED_TRIAL]",
                desc: "Full access to all SRE features and telemetry logs.",
                icon: ShieldCheck,
                iconColor: "text-emerald-500",
              },
              {
                title: "[ASYNC_QUEUE_ENGINE]",
                desc: "Powered by BullMQ and Redis memory buffers.",
                icon: Layers,
                iconColor: "text-amber-500",
              },
              {
                title: "[SLACK_PAGERDUTY_SYNC]",
                desc: "Automated alert escalation and status updates.",
                icon: Radio,
                iconColor: "text-slate-900 dark:text-white",
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

        {/* Live Status Bar Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="relative z-10 p-4 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono max-w-lg shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="text-slate-600 dark:text-neutral-400 uppercase tracking-widest text-[10px]">ALL INGESTION NODES OPERATIONAL</span>
          </div>
          <span className="text-emerald-500 font-bold text-[10px] tracking-wider">99.999% SLA</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
