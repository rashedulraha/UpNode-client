"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Monitor,
  Bell,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Shield,
  Mail,
  Hash,
  Camera,
  LogOut,
  Smartphone,
  Globe,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import {
  profileService,
  ActiveSession,
  NotificationPreferences,
} from "@/services/profile.service";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseUA(ua: string | null | undefined): {
  browser: string;
  os: string;
  icon: React.ReactNode;
} {
  if (!ua)
    return {
      browser: "UNKNOWN_BROWSER",
      os: "UNKNOWN_OS",
      icon: <Globe className="w-4 h-4" />,
    };
  const isMobile = /mobile|android|iphone|ipad/i.test(ua);
  const isChrome = /chrome/i.test(ua) && !/edg|opr/i.test(ua);
  const isFirefox = /firefox/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua);
  const isEdge = /edg/i.test(ua);
  const browser = isChrome
    ? "Chrome"
    : isFirefox
      ? "Firefox"
      : isSafari
        ? "Safari"
        : isEdge
          ? "Edge"
          : "Browser";

  const isWindows = /windows/i.test(ua);
  const isMac = /macintosh|mac os x/i.test(ua);
  const isLinux = /linux/i.test(ua);
  const os = isMobile
    ? "Mobile"
    : isWindows
      ? "Windows"
      : isMac
        ? "macOS"
        : isLinux
          ? "Linux"
          : "Unknown OS";

  const icon = isMobile ? (
    <Smartphone className="w-4 h-4" />
  ) : (
    <Monitor className="w-4 h-4" />
  );
  return { browser, os, icon };
}

function getInitials(name?: string | null, email?: string): string {
  if (name && name.trim()) {
    return name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return (email?.[0] ?? "U").toUpperCase();
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 60000) return "JUST_NOW";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}M_AGO`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}H_AGO`;
  return `${Math.floor(diff / 86400000)}D_AGO`;
}

// ─── Toast Banner ────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono border ${
        type === "success"
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
          : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
      )}
      <span className="uppercase tracking-wide">{msg}</span>
    </motion.div>
  );
}

// ─── Section Card Wrapper ───────────────────────────────────────────────────

function Section({
  id,
  tag,
  title,
  subtitle,
  badge,
  children,
}: {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-6 rounded-2xl bg-white/70 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 backdrop-blur-3xl space-y-6 shadow-sm font-mono relative overflow-hidden"
    >
      {/* Top subtle highlight line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-neutral-700 to-transparent" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 border border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-900 text-slate-800 dark:text-neutral-200 font-mono text-[9px] font-bold uppercase tracking-widest">
              {tag}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-light tracking-tight text-slate-900 dark:text-white uppercase font-mono">
            {title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
            {subtitle}
          </p>
        </div>
        {badge}
      </div>
      {children}
    </motion.div>
  );
}

// ─── Field Input Component ───────────────────────────────────────────────────

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  suffix,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 font-mono">
      <label
        htmlFor={id}
        className="block text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:border-slate-500 dark:focus:border-neutral-500 focus:outline-none transition-all font-mono"
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Toggle Button ───────────────────────────────────────────────────────────

function Toggle({
  id,
  enabled,
  onChange,
  disabled,
}: {
  id: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={() => onChange(!enabled)}
      disabled={disabled}
      className="flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
      aria-pressed={enabled}
    >
      <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">
        {enabled ? "[ENABLED]" : "[DISABLED]"}
      </span>
      {enabled ? (
        <ToggleRight className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
      ) : (
        <ToggleLeft className="w-8 h-8 text-slate-400 dark:text-neutral-600" />
      )}
    </button>
  );
}

// ─── Action Button ───────────────────────────────────────────────────────────

function SubmitButton({
  loading,
  label = "[SAVE_CHANGES]",
}: {
  loading: boolean;
  label?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="px-4 py-2 border border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold text-xs transition-all cursor-pointer uppercase tracking-wider shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>[SAVING...]</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
}

// ─── Section 1: User Profile ─────────────────────────────────────────────────

function ProfileSection({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const { user, refetchSession } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [image, setImage] = useState(user?.image ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = getInitials(name || user?.name, user?.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await profileService.updateProfile({
        name: name.trim() || undefined,
        image: image.trim() || undefined,
      });
      await refetchSession();
      onSuccess("PROFILE UPDATED SUCCESSFULLY");
    } catch (err: any) {
      setError(err.message || "FAILED TO UPDATE PROFILE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      id="profile"
      tag="PROFILE // CREDENTIALS"
      title="User Identity"
      subtitle="Update public display name and avatar profile image link"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Card Header */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-xl">
          <div className="w-14 h-14 rounded-xl border border-slate-300 dark:border-neutral-700 bg-slate-200 dark:bg-neutral-900 flex items-center justify-center text-lg font-bold font-mono text-slate-800 dark:text-neutral-200 shrink-0 overflow-hidden">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="space-y-1 font-mono min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user?.name || "[UNSET_NAME]"}
              </span>
              <span className="px-2 py-0.5 border border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 text-[9px] font-bold uppercase tracking-widest">
                {user?.role || "VIEWER"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="profile-name"
            label="Display Name"
            value={name}
            onChange={setName}
            placeholder="Enter display name"
          />
          <Field
            id="profile-avatar"
            label="Avatar Image URL"
            value={image}
            onChange={setImage}
            placeholder="https://domain.com/avatar.jpg"
            suffix={
              <Camera className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-600" />
            }
          />
        </div>

        <AnimatePresence>
          {error && <Toast msg={error} type="error" />}
        </AnimatePresence>

        <div className="flex justify-end">
          <SubmitButton loading={loading} label="[UPDATE_PROFILE]" />
        </div>
      </form>
    </Section>
  );
}

// ─── Section 2: Password Security ───────────────────────────────────────────

function PasswordSection({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (next !== confirm) {
      setError("NEW PASSWORDS DO NOT MATCH");
      return;
    }
    if (next.length < 8) {
      setError("NEW PASSWORD MUST BE AT LEAST 8 CHARACTERS");
      return;
    }
    setLoading(true);
    try {
      await profileService.changePassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      onSuccess("PASSWORD CHANGED SUCCESSFULLY");
    } catch (err: any) {
      setError(err.message || "FAILED TO CHANGE PASSWORD");
    } finally {
      setLoading(false);
    }
  };

  const eyeToggle = (show: boolean, setShow: (v: boolean) => void) => (
    <button
      type="button"
      onClick={() => setShow(!show)}
      className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
    >
      {show ? (
        <EyeOff className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
      ) : (
        <Eye className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
      )}
    </button>
  );

  return (
    <Section
      id="password"
      tag="SECURITY // AUTHENTICATION"
      title="Change Password"
      subtitle="Update your password to protect your user credentials"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          id="password-current"
          label="Current Password"
          type={showCurrent ? "text" : "password"}
          value={current}
          onChange={setCurrent}
          placeholder="••••••••"
          suffix={eyeToggle(showCurrent, setShowCurrent)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="password-new"
            label="New Password"
            type={showNext ? "text" : "password"}
            value={next}
            onChange={setNext}
            placeholder="Min 8 characters"
            suffix={eyeToggle(showNext, setShowNext)}
          />
          <Field
            id="password-confirm"
            label="Confirm New Password"
            type="password"
            value={confirm}
            onChange={setConfirm}
            placeholder="Re-enter new password"
          />
        </div>

        {/* Technical Password Strength Indicator */}
        {next.length > 0 && (
          <div className="space-y-1 pt-1 font-mono">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-none transition-all"
                  style={{
                    background:
                      next.length >= i * 4
                        ? i <= 2
                          ? "#f59e0b"
                          : i === 3
                            ? "#3b82f6"
                            : "#10b981"
                        : "rgba(120,120,120,0.2)",
                  }}
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-wider">
              STRENGTH:{" "}
              <span className="text-slate-900 dark:text-white font-bold">
                {next.length < 8
                  ? "INSUFFICIENT"
                  : next.length < 12
                    ? "MODERATE"
                    : next.length < 16
                      ? "GOOD"
                      : "OPTIMAL"}
              </span>
            </p>
          </div>
        )}

        <AnimatePresence>
          {error && <Toast msg={error} type="error" />}
        </AnimatePresence>

        <div className="flex justify-end">
          <SubmitButton loading={loading} label="[UPDATE_PASSWORD]" />
        </div>
      </form>
    </Section>
  );
}

// ─── Section 3: Active Sessions ──────────────────────────────────────────────

function SessionsSection({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const { session: currentSession } = useAuth();
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.listSessions();
      setSessions(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "FAILED TO LOAD SESSIONS");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRevoke = async (token: string) => {
    setRevoking(token);
    try {
      await profileService.revokeSession(token);
      setSessions((prev) => prev.filter((s) => s.token !== token));
      onSuccess("SESSION TOKEN REVOKED");
    } catch {
      setError("FAILED TO REVOKE SESSION");
    } finally {
      setRevoking(null);
    }
  };

  return (
    <Section
      id="sessions"
      tag="TOKENS // ACTIVE SESSIONS"
      title="Active Sessions"
      subtitle="Authenticated devices and active token sessions connected to your account"
      badge={
        <button
          onClick={fetchSessions}
          disabled={loading}
          className="px-3 py-1 text-xs font-mono text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg transition-all cursor-pointer uppercase flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "[SYNCING...]" : "[REFRESH]"}</span>
        </button>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-8 text-xs font-mono text-slate-500 dark:text-neutral-500">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span>FETCHING SESSIONS...</span>
        </div>
      ) : (
        <div className="space-y-3 font-mono">
          <AnimatePresence>
            {error && <Toast msg={error} type="error" />}
          </AnimatePresence>

          {sessions.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-neutral-500 py-4 text-center border border-dashed border-slate-200 dark:border-neutral-800">
              NO ACTIVE SESSIONS RECORDED.
            </p>
          ) : (
            sessions.map((s) => {
              const { browser, os, icon } = parseUA(s.userAgent);
              const isCurrent = s.token === currentSession?.token;
              return (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-slate-100/80 dark:bg-neutral-900/80 border-slate-300 dark:border-neutral-700 shadow-sm"
                      : "bg-slate-50 dark:bg-black border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white"
                          : "bg-slate-100 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400"
                      }`}
                    >
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase truncate">
                          {browser} // {os}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                            [CURRENT_SESSION]
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-500 mt-0.5 truncate">
                        IP: {s.ipAddress || "INTERNAL"} · {timeAgo(s.createdAt)}{" "}
                        · EXPIRES: {new Date(s.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {!isCurrent && (
                    <button
                      id={`revoke-session-${s.id}`}
                      onClick={() => handleRevoke(s.token)}
                      disabled={revoking === s.token}
                      className="px-3 py-1 text-[11px] border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-bold uppercase transition-all cursor-pointer shrink-0 self-end sm:self-center flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {revoking === s.token ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      <span>[REVOKE]</span>
                    </button>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </Section>
  );
}

// ─── Section 4: Notification Rules ──────────────────────────────────────────

function NotificationsSection({
  onSuccess,
}: {
  onSuccess: (msg: string) => void;
}) {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    profileService
      .getNotificationPreferences()
      .then(setPrefs)
      .catch((err) =>
        setError(
          err?.response?.data?.error || "FAILED TO LOAD NOTIFICATION RULES",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (
    field: "emailEnabled" | "slackEnabled",
    value: boolean,
  ) => {
    if (savingRef.current || !prefs) return;
    const prev = { ...prefs };
    setPrefs({ ...prefs, [field]: value }); // Optimistic UI update
    savingRef.current = true;
    setSaving(true);
    try {
      const updated = await profileService.updateNotificationPreferences({
        [field]: value,
      });
      setPrefs(updated);
      onSuccess(`NOTIFICATION RULE [${field.toUpperCase()}] SAVED`);
    } catch (err: any) {
      setPrefs(prev); // Revert on failure
      setError(err.message || "FAILED TO SAVE NOTIFICATION PREFERENCE");
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  };

  const notifItems = [
    {
      key: "emailEnabled" as const,
      icon: <Mail className="w-4 h-4" />,
      title: "Transactional Email Notifications",
      desc: "Receive real-time incident alert notifications and critical uptime reports via email.",
      tag: "CHANNEL // SMTP",
    },
    {
      key: "slackEnabled" as const,
      icon: <Hash className="w-4 h-4" />,
      title: "Slack Webhook Notifications",
      desc: "Stream rich incident cards directly to configured Slack incoming webhooks.",
      tag: "CHANNEL // SLACK",
    },
  ];

  return (
    <Section
      id="notifications"
      tag="CHANNELS // NOTIFICATION PREFERENCES"
      title="Global Alert Preferences"
      subtitle="Enable or disable personal notification dispatch channels across all projects"
    >
      {loading ? (
        <div className="flex items-center justify-center py-8 text-xs font-mono text-slate-500 dark:text-neutral-500">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span>LOADING PREFERENCES...</span>
        </div>
      ) : (
        <div className="space-y-3 font-mono">
          <AnimatePresence>
            {error && <Toast msg={error} type="error" />}
          </AnimatePresence>

          {notifItems.map((item) => (
            <div
              key={item.key}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-neutral-800"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 text-slate-800 dark:text-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase truncate">
                      {item.title}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 dark:text-neutral-500 uppercase">
                      [{item.tag}]
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <Toggle
                id={`notif-toggle-${item.key}`}
                enabled={prefs?.[item.key] ?? true}
                onChange={(v) => handleToggle(item.key, v)}
                disabled={saving}
              />
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<
    "profile" | "password" | "sessions" | "notifications"
  >("profile");
  const [globalMsg, setGlobalMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (text: string, type: "success" | "error" = "success") => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setGlobalMsg({ text, type });
      toastTimer.current = setTimeout(() => setGlobalMsg(null), 4000);
    },
    [],
  );

  const navSections = [
    {
      id: "profile" as const,
      label: "[01_IDENTITY]",
      icon: <User className="w-3 h-3" />,
    },
    {
      id: "password" as const,
      label: "[02_PASSWORD]",
      icon: <Lock className="w-3 h-3" />,
    },
    {
      id: "sessions" as const,
      label: "[03_SESSIONS]",
      icon: <Shield className="w-3 h-3" />,
    },
    {
      id: "notifications" as const,
      label: "[04_NOTIFICATIONS]",
      icon: <Bell className="w-3 h-3" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-sans flex flex-col relative selection:bg-slate-800">
      {/* Background Noise Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Top Minimal Navigation Header */}
      <header className="border-b border-slate-200 dark:border-neutral-800 bg-white/70 dark:bg-black/70 backdrop-blur-3xl px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 font-mono">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
          <Link
            href="/dashboard"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            [DASHBOARD]
          </Link>
          <span className="text-slate-300 dark:text-neutral-700">/</span>
          <span>SETTINGS</span>
          <span className="text-slate-300 dark:text-neutral-700">/</span>
          <span className="font-bold text-slate-900 dark:text-white">
            [PROFILE_SECURITY]
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Toast alert banner */}
      <div className="sticky top-[53px] z-10 px-6 pt-3">
        <AnimatePresence>
          {globalMsg && <Toast msg={globalMsg.text} type={globalMsg.type} />}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-8 space-y-7 relative z-10">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 border border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-900 text-slate-800 dark:text-neutral-200 font-mono text-[10px] font-bold uppercase tracking-widest">
                USER // IDENTITY & SECURITY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-slate-900 dark:text-white font-mono uppercase">
              User Profile &amp; Security
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-xl leading-relaxed font-mono">
              Manage personal identity credentials, active token session
              devices, and global alert notification channels.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-4 py-2 border border-slate-300 dark:border-neutral-700 hover:border-slate-500 dark:hover:border-neutral-400 bg-slate-100 dark:bg-black text-slate-800 dark:text-neutral-200 font-mono text-xs transition-all duration-150 cursor-pointer uppercase tracking-wider shrink-0 self-start sm:self-center"
          >
            [&larr; BACK_TO_DASHBOARD]
          </Link>
        </div>

        {/* Mobile Horizontal Navigation Tabs */}
        <div className="lg:hidden border-b border-slate-200 dark:border-neutral-800 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none font-mono">
            {navSections.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs whitespace-nowrap border transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white font-bold"
                      : "bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {s.icon}
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Quick Jump Sidebar (Desktop) */}
          <aside className="hidden lg:block w-56 shrink-0 font-mono">
            <div className="sticky top-24 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest px-1 mb-2">
                [SECTIONS]
              </p>
              {navSections.map((s) => {
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-all cursor-pointer border ${
                      isActive
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white font-bold shadow-sm"
                        : "bg-slate-50 dark:bg-neutral-950 text-slate-700 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700"
                    }`}
                  >
                    {s.icon}
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Section Stack */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeSection === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <ProfileSection onSuccess={(msg) => showToast(msg)} />
                </motion.div>
              )}
              {activeSection === "password" && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <PasswordSection onSuccess={(msg) => showToast(msg)} />
                </motion.div>
              )}
              {activeSection === "sessions" && (
                <motion.div
                  key="sessions"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <SessionsSection onSuccess={(msg) => showToast(msg)} />
                </motion.div>
              )}
              {activeSection === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <NotificationsSection onSuccess={(msg) => showToast(msg)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
