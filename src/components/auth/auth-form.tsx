"use client";

import React, { useState } from "react";
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";

export interface AuthFormProps {
  mode?: "signin" | "signup";
  onSubmit?: (data: { email: string; password: string; name?: string }) => Promise<void> | void;
  onSocialSubmit?: (provider: "google" | "github") => Promise<void> | void;
  isLoading?: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
}

export function AuthForm({
  mode = "signin",
  onSubmit,
  onSocialSubmit,
  isLoading = false,
  errorMessage = null,
  successMessage = null,
}: AuthFormProps) {
  const [currentMode, setCurrentMode] = useState<"signin" | "signup">(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!email.trim()) {
      setValidationError("Email is required");
      return;
    }
    if (!email.includes("@")) {
      setValidationError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setValidationError("Password is required");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }
    if (currentMode === "signup" && !name.trim()) {
      setValidationError("Full name is required");
      return;
    }

    if (onSubmit) {
      await onSubmit({
        email: email.trim(),
        password,
        ...(currentMode === "signup" ? { name: name.trim() } : {}),
      });
    }
  };

  const activeError = validationError || errorMessage;

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-lg shadow-sm font-sans">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900 dark:text-white font-mono">
          {currentMode === "signin" ? "[SIGN_IN]" : "[CREATE_ACCOUNT]"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-mono">
          {currentMode === "signin"
            ? "Enter your credentials to access the telemetry portal"
            : "Register your account to begin incident monitoring"}
        </p>
      </div>

      {activeError && (
        <div
          role="alert"
          className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2 rounded"
        >
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{activeError}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-start gap-2 rounded"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} aria-label="Authentication Form" className="space-y-4 font-mono text-xs">
        {currentMode === "signup" && (
          <div className="space-y-1">
            <label htmlFor="name-input" className="block font-bold text-slate-700 dark:text-neutral-300 uppercase">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-neutral-500" />
              <input
                id="name-input"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                disabled={isLoading}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white"
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="email-input" className="block font-bold text-slate-700 dark:text-neutral-300 uppercase">
            Work Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-neutral-500" />
            <input
              id="email-input"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              disabled={isLoading}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="password-input" className="block font-bold text-slate-700 dark:text-neutral-300 uppercase">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-neutral-500" />
            <input
              id="password-input"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider rounded border border-slate-900 dark:border-white hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>{currentMode === "signin" ? "Sign In" : "Create Account"}</span>
          )}
        </button>
      </form>

      {/* Social SSO Login Section */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-neutral-800" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-mono">
          <span className="bg-white dark:bg-black px-2 text-slate-400 dark:text-neutral-500">
            OR CONTINUE WITH
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <button
          type="button"
          onClick={() => onSocialSubmit && onSocialSubmit("google")}
          disabled={isLoading}
          aria-label="Sign in with Google"
          className="py-2 px-3 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded font-bold text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29c-1.64 3.26-1.64 7.13 0 10.39l3.99-2.7z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 2.7c.95-2.83 3.6-4.53 6.72-4.53z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => onSocialSubmit && onSocialSubmit("github")}
          disabled={isLoading}
          aria-label="Sign in with GitHub"
          className="py-2 px-3 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded font-bold text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </button>
      </div>

      <div className="mt-4 pt-4 text-center border-t border-slate-200 dark:border-neutral-800 text-xs font-mono text-slate-500 dark:text-neutral-400">
        {currentMode === "signin" ? (
          <p>
            Need an account?{" "}
            <button
              type="button"
              onClick={() => {
                setCurrentMode("signup");
                setValidationError(null);
              }}
              className="font-bold text-slate-900 dark:text-white hover:underline uppercase"
            >
              Sign Up
            </button>
          </p>
        ) : (
          <p>
            Already registered?{" "}
            <button
              type="button"
              onClick={() => {
                setCurrentMode("signin");
                setValidationError(null);
              }}
              className="font-bold text-slate-900 dark:text-white hover:underline uppercase"
            >
              Sign In
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
