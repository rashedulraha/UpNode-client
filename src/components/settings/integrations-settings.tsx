"use client";

import React, { useState, useEffect } from "react";
import {
  integrationsService,
  ProjectIntegrationSetting,
} from "@/services/integrations.service";
import {
  Hash,
  Mail,
  CheckCircle2,
  AlertCircle,
  Save,
  BellRing,
  Layers,
  Sparkles,
} from "lucide-react";
import { MaintenanceSettings } from "@/components/settings/maintenance-settings";

export function IntegrationsSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [orgSlackWebhook, setOrgSlackWebhook] = useState("");
  const [orgAlertEmail, setOrgAlertEmail] = useState("");
  const [projects, setProjects] = useState<ProjectIntegrationSetting[]>([]);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await integrationsService.getIntegrations();
      setOrgSlackWebhook(data.slackWebhookUrl || "");
      setOrgAlertEmail(data.alertEmail || "");
      setProjects(data.projects || []);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to load integration settings.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSettingChange = (
    projectId: string,
    field: "slackWebhookUrl" | "alertEmail",
    value: string,
  ) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, [field]: value } : p)),
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const updated = await integrationsService.updateIntegrations({
        slackWebhookUrl: orgSlackWebhook.trim() || null,
        alertEmail: orgAlertEmail.trim() || null,
        projects: projects.map((p) => ({
          id: p.id,
          slackWebhookUrl: p.slackWebhookUrl?.trim() || null,
          alertEmail: p.alertEmail?.trim() || null,
        })),
      });

      setOrgSlackWebhook(updated.slackWebhookUrl || "");
      setOrgAlertEmail(updated.alertEmail || "");
      setProjects(updated.projects || []);
      setSuccessMessage("Integration alert settings updated successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to update integration settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 bg-card/30 rounded-2xl border border-border/40" />
        <div className="h-64 bg-card/30 rounded-2xl border border-border/40" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 font-sans">
      {/* Feedback alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. Global / Organization Level Alert Integrations Card */}
      <div className="p-6 rounded-2xl bg-card/30 border border-border/40 backdrop-blur-2xl glass-card-floating space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Organization Alert Integrations
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Default Slack Webhook URL and email recipients for all incident
                notifications across your organization.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold uppercase">
            ORGANIZATION DEFAULT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slack Webhook Input */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-400" />
                Slack Incoming Webhook URL
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/70">
                Target: #incidents
              </span>
            </label>
            <input
              type="url"
              value={orgSlackWebhook}
              onChange={(e) => setOrgSlackWebhook(e.target.value)}
              placeholder="https://hooks.slack.com/services/T000/B000/XXXX"
              className="w-full px-3.5 py-2.5 bg-card/50 border border-border/40 rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
              Slack Webhook posts rich, block-formatted alerts to your
              team&apos;s Slack channel when an incident triggers.
            </p>
          </div>

          {/* Alert Email Input */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400" />
                Transactional Alert Emails
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/70">
                Resend / SMTP
              </span>
            </label>
            <input
              type="text"
              value={orgAlertEmail}
              onChange={(e) => setOrgAlertEmail(e.target.value)}
              placeholder="sre@company.com, alerts@company.com"
              className="w-full px-3.5 py-2.5 bg-card/50 border border-border/40 rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
              Comma-separated email addresses to receive instant incident email
              notifications via Resend API.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Per-Project Alert Overrides */}
      <div className="p-6 rounded-2xl bg-card/30 border border-border/40 backdrop-blur-2xl glass-card-floating space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-muted/40 text-foreground border border-border/40">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Project Specific Overrides
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Optionally configure dedicated Slack webhooks or email channels
                for specific microservices or projects.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border/40 font-semibold uppercase">
            {projects.length} PROJECTS
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground font-mono">
            No projects available in this organization yet.
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl bg-card/40 border border-border/30 space-y-3 transition-all hover:border-border/60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <h3 className="text-xs font-bold text-foreground font-mono">
                      {proj.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/60">
                    ID: {proj.id.slice(0, 8)}...
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-[11px] font-mono text-muted-foreground mb-1 block">
                      Slack Webhook URL (Override)
                    </label>
                    <input
                      type="url"
                      value={proj.slackWebhookUrl || ""}
                      onChange={(e) =>
                        handleProjectSettingChange(
                          proj.id,
                          "slackWebhookUrl",
                          e.target.value,
                        )
                      }
                      placeholder="Inherits organization Slack Webhook URL"
                      className="w-full px-3 py-2 bg-background/60 border border-border/30 rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-muted-foreground mb-1 block">
                      Alert Emails (Override)
                    </label>
                    <input
                      type="text"
                      value={proj.alertEmail || ""}
                      onChange={(e) =>
                        handleProjectSettingChange(
                          proj.id,
                          "alertEmail",
                          e.target.value,
                        )
                      }
                      placeholder="Inherits organization alert emails"
                      className="w-full px-3 py-2 bg-background/60 border border-border/30 rounded-xl text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Maintenance Window — per project */}
                <div
                  className="pt-3 mt-1"
                  style={{
                    borderTop:
                      "0.5px solid var(--border, rgba(255,255,255,0.08))",
                  }}
                >
                  <MaintenanceSettings
                    projectId={proj.id}
                    projectName={proj.name}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 active:scale-95 shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>
            {saving ? "Saving Changes..." : "Save Integration Settings"}
          </span>
        </button>
      </div>
    </form>
  );
}

export default IntegrationsSettings;
