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
  Activity,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Layers,
  Radio,
  Terminal,
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
          <div className="flex min-h-screen items-center justify-center bg-background text-foreground font-mono text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
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
  const redirectTo = searchParams.get("redirectTo") || "/";
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
    <div className="min-h-screen bg-background text-foreground font-sans grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
      {/* LEFT COLUMN: AUTH FORM */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 border-r border-border relative z-10 bg-background"
      >
        {/* Top Header Logo */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">
              UpNode
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              &larr; Back to home
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="my-auto py-8 max-w-sm w-full mx-auto space-y-5">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Get started with sub-second incident alerting and non-blocking queue ingestion.
            </p>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">Registration Failed</p>
                <p className="mt-0.5 text-destructive">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="font-medium text-emerald-500">{successMessage}</p>
            </motion.div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-foreground">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Alex Rivers"
                  disabled={isSubmitting}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-muted/60 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all ${
                    errors.name ? "ring-1 ring-destructive" : ""
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-destructive font-mono">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-foreground">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@company.com"
                  disabled={isSubmitting}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-muted/60 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all ${
                    errors.email ? "ring-1 ring-destructive" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-destructive font-mono">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-muted/60 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all ${
                    errors.password ? "ring-1 ring-destructive" : ""
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-destructive font-mono">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-muted/60 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all ${
                    errors.confirmPassword ? "ring-1 ring-destructive" : ""
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-destructive font-mono">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-md shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Toggle Link to Login */}
          <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between">
          <span>PulseScale Incident Platform</span>
          <span>v2.6 Security Compliant</span>
        </div>
      </motion.div>

      {/* RIGHT COLUMN: CLEAN SHOWCASE */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 bg-muted/40 relative overflow-hidden"
      >
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-foreground text-xs font-mono">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>Setup in 3 minutes</span>
          </div>

          <h2 className="text-3xl font-semibold text-foreground tracking-tight leading-snug">
            Built for Site Reliability Engineers who demand{" "}
            <span className="text-primary font-normal">zero downtime</span>.
          </h2>

          <p className="text-xs text-muted-foreground leading-relaxed font-normal">
            Start monitoring your infrastructure with full SSE telemetry, isolated background workers, and built-in incident status pages.
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                title: "14-Day Unlimited Trial",
                desc: "Full access to all SRE features and telemetry logs.",
                icon: ShieldCheck,
                iconColor: "text-emerald-500",
              },
              {
                title: "Asynchronous Queue Engine",
                desc: "Powered by BullMQ and Redis memory buffers.",
                icon: Layers,
                iconColor: "text-amber-500",
              },
              {
                title: "Instant Slack & PagerDuty Sync",
                desc: "Automated alert escalation and status updates.",
                icon: Radio,
                iconColor: "text-primary",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
                className="p-4 rounded-2xl bg-card border border-border flex items-start gap-3 shadow-sm"
              >
                <div className="p-2 rounded-xl bg-muted border border-border text-foreground mt-0.5">
                  <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
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
          className="relative z-10 p-4 rounded-2xl bg-card border border-border flex items-center justify-between text-xs font-mono max-w-lg shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">All Telemetry Ingestion Nodes Operational</span>
          </div>
          <span className="text-emerald-500 font-semibold text-[10px]">99.999% SLA</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
