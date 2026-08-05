"use client";

import React, { useState } from "react";
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";

export interface AuthFormProps {
  mode?: "signin" | "signup";
  onSubmit?: (data: { email: string; password: string; name?: string }) => Promise<void> | void;
  isLoading?: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
}

export function AuthForm({
  mode = "signin",
  onSubmit,
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
