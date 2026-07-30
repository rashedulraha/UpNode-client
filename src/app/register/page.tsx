"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Loader2, UserPlus, AlertCircle, CheckCircle2, ShieldCheck, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

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
          <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
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
    <div className="flex min-h-screen flex-col justify-center items-center px-4 py-12 bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-md space-y-8 bg-zinc-900/80 p-8 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 mb-2 border border-indigo-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create an Account</h1>
          <p className="text-sm text-zinc-400">Join UpNode to start monitoring your applications</p>
        </div>

        {/* Alert Messages */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Registration Error</p>
              <p className="mt-0.5 text-red-400">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-200 text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="mt-0.5 text-emerald-300 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950 border rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "border-zinc-800 focus:border-indigo-500"
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-red-400 font-medium">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                {...register("email")}
                type="email"
                placeholder="name@company.com"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950 border rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-zinc-800 focus:border-indigo-500"
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-400 font-medium">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950 border rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-zinc-800 focus:border-indigo-500"
                }`}
              />
            </div>
            {errors.password && <p className="text-xs text-red-400 font-medium">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 bg-zinc-950 border rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-zinc-800 focus:border-indigo-500"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Register
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-zinc-400 pt-2 border-t border-zinc-800/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
