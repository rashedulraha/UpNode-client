"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Mail, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-mono text-xs">
          <Loader2 className="h-5 w-5 animate-spin text-slate-400 dark:text-neutral-500" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user, refetchSession } = useAuth();

  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      handleTokenVerification(token);
    }
  }, [token]);

  const handleTokenVerification = async (verifyToken: string) => {
    setStatus("verifying");
    setMessage(null);

    try {
      const res = await authClient.verifyEmail({
        query: { token: verifyToken },
      });

      if (res.error) {
        setStatus("error");
        setMessage(res.error.message || "Failed to verify email token.");
      } else {
        setStatus("success");
        setMessage("Email address verified successfully!");
        await refetchSession();
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "An unexpected error occurred during verification.");
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsResending(true);
    setResendSuccess(false);
    setMessage(null);

    try {
      const res = await authClient.sendVerificationEmail({
        email: user.email,
        callbackURL: "/dashboard",
      });

      if (res.error) {
        setMessage(res.error.message || "Failed to resend verification email.");
      } else {
        setResendSuccess(true);
      }
    } catch (err: any) {
      setMessage(err?.message || "Failed to send verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-sans flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Background Noise Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-sm tracking-widest uppercase font-mono text-slate-900 dark:text-white">
            UPNODE
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-100 dark:bg-black text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800">
            EMAIL VERIFICATION
          </span>
        </Link>

        <div className="flex items-center gap-3 font-mono">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-xs text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[LOGIN]</span>
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="my-auto max-w-md w-full mx-auto p-6 sm:p-8 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-lg shadow-sm relative z-10 font-mono text-xs space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3.5 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-full text-slate-900 dark:text-white">
            <Mail className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-lg font-bold uppercase tracking-wide text-slate-900 dark:text-white">
            {status === "success" ? "Email Verified" : "Verify Your Email Address"}
          </h1>
          <p className="text-slate-500 dark:text-neutral-400 text-[11px] leading-relaxed">
            {status === "success"
              ? "Your email has been verified. Redirecting you to dashboard..."
              : `A verification link has been sent to ${user?.email || "your registered email"}. Please verify to access your dashboard.`}
          </p>
        </div>

        {status === "verifying" && (
          <div className="p-4 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-center space-y-2 rounded">
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-600 dark:text-neutral-400" />
            <p className="text-slate-600 dark:text-neutral-300 font-bold uppercase">Verifying Email Token...</p>
          </div>
        )}

        {status === "success" && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-2 rounded text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
            <p className="font-bold uppercase">[VERIFICATION_SUCCESSFUL]</p>
            <p className="text-[11px]">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 space-y-2 rounded">
            <div className="flex items-center gap-2 font-bold uppercase">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>[VERIFICATION_FAILED]</span>
            </div>
            <p className="text-[11px]">{message}</p>
          </div>
        )}

        {resendSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] rounded flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Verification email resent! Please check your inbox.</span>
          </div>
        )}

        {status !== "success" && user?.email && (
          <div className="space-y-3 pt-2">
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider text-xs border border-slate-900 dark:border-white hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  RESENDING EMAIL...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Resend Verification Email
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 text-center tracking-widest uppercase relative z-10">
        UPNODE ACCOUNT GATEWAY // MANDATORY EMAIL VERIFICATION
      </div>
    </div>
  );
}
