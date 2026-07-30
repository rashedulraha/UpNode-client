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
  LogIn,
  AlertCircle,
  CheckCircle2,
  Activity,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
  Layers,
  Radio,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-[#050608] text-white font-mono text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </ProtectedRoute>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const { refetchSession } = useAuth();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Failed to sign in. Please check your credentials.");
      } else {
        setSuccessMessage("Sign in successful! Redirecting...");
        await refetchSession();
        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-zinc-100 font-sans selection:bg-zinc-800 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
      {/* LEFT COLUMN: AUTH FORM */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 border-r border-white/[0.06] relative z-10 bg-[#050608]"
      >
        {/* Top Header Logo */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-white/[0.04] text-white">
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">
              PulseScale
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            &larr; Back to home
          </Link>
        </div>

        {/* Form Container */}
        <div className="my-auto py-10 max-w-sm w-full mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Sign in to PulseScale
            </h1>
            <p className="text-xs text-zinc-400">
              Enter your credentials to access your real-time incident monitoring dashboard.
            </p>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-white/[0.03] text-rose-400 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-300">Authentication Failed</p>
                <p className="mt-0.5 text-rose-400">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-white/[0.03] text-emerald-400 text-xs flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="font-medium text-emerald-300">{successMessage}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@company.com"
                  disabled={isSubmitting}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-white/[0.03] rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:bg-white/[0.06] transition-all ${
                    errors.email ? "ring-1 ring-rose-500" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-400 font-mono">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-zinc-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-white/[0.03] rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:bg-white/[0.06] transition-all ${
                    errors.password ? "ring-1 ring-rose-500" : ""
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-400 font-mono">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Toggle to Register */}
          <div className="text-center text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-white hover:underline transition-all"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-between">
          <span>PulseScale Incident Platform</span>
          <span>v2.6 Security Compliant</span>
        </div>
      </motion.div>

      {/* RIGHT COLUMN: CLEAN SHOWCASE */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 bg-[#08090c] relative overflow-hidden"
      >
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] text-zinc-300 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Incident Stream Active</span>
          </div>

          <h2 className="text-3xl font-semibold text-white tracking-tight leading-snug">
            Real-Time Telemetry & On-Call Automation with{" "}
            <span className="text-indigo-400 font-normal">Zero DB Lockup</span>.
          </h2>

          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            PulseScale decouples ingestion gateways from relational SQL databases using non-blocking BullMQ Redis queues, ensuring sub-second SSE incident broadcasts during 500,000 req/sec spikes.
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                title: "Sub-Second SSE Push",
                desc: "Direct browser event streaming under 15ms globally.",
                icon: Zap,
                iconColor: "text-indigo-400",
              },
              {
                title: "BullMQ / Redis Buffer",
                desc: "Prevents Postgres locks during black swan traffic spikes.",
                icon: Layers,
                iconColor: "text-amber-400",
              },
              {
                title: "Role-Based IAM Scopes",
                desc: "Encrypted tenant boundaries & SOC2 compliant access control.",
                icon: ShieldCheck,
                iconColor: "text-emerald-400",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
                className="p-4 rounded-2xl bg-[#0d0e12] flex items-start gap-3"
              >
                <div className="p-2 rounded-xl bg-white/[0.04] text-white mt-0.5">
                  <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Testimonial Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="relative z-10 p-5 rounded-2xl bg-[#0d0e12] space-y-2 max-w-lg"
        >
          <p className="text-xs text-zinc-300 italic leading-relaxed">
            "PulseScale completely eliminated main-thread database locks during our Black Friday event. Our SRE team had live incident visibility within 0.4ms."
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[11px] font-mono text-zinc-400">
            <span className="font-semibold text-white">Principal Infrastructure Lead</span>
            <span className="text-indigo-400">Top 50 SaaS Enterprise</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
