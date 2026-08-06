"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Code2,
  Check,
  Key,
  Search,
  Zap,
  Bell,
  Terminal,
  ExternalLink,
  Hash,
  Info,
  AlertTriangle,
  CheckCircle2,
  X,
  Menu,
  ShieldCheck,
  Layers,
  Cpu,
  Workflow,
  Sparkles,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";

import { DocsReadingProgress } from "@/components/docs/docs-reading-progress";
import { DocsCodeBlock, CodeSnippet } from "@/components/docs/docs-code-block";
import { DocsPlayground } from "@/components/docs/docs-playground";
import {
  DocsSearchModal,
  DocSearchItem,
} from "@/components/docs/docs-search-modal";
import { DocsFeedback } from "@/components/docs/docs-feedback";

// ─── Glass Container Style ───────────────────────────────────────────────────
const GLASS: React.CSSProperties = {
  background: "var(--lp-surface)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "0.5px solid var(--lp-border)",
  borderTop: "0.5px solid var(--lp-border-top)",
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface DocSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  subsections: { id: string; label: string }[];
}

// ─── Sections Config ─────────────────────────────────────────────────────────
const SECTIONS: DocSection[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    subsections: [
      { id: "what-is-upnode", label: "What is UpNode?" },
      { id: "create-account", label: "Create an Account" },
      { id: "create-project", label: "Create Your First Project" },
      { id: "generate-api-key", label: "Generate API Keys" },
      { id: "rbac-permissions", label: "RBAC & Team Permissions" },
    ],
  },
  {
    id: "api-integration",
    label: "API Reference",
    icon: <Code2 className="w-3.5 h-3.5" />,
    subsections: [
      { id: "authentication", label: "Authentication & Base URL" },
      { id: "heartbeat-ping", label: "Heartbeat / Ping Endpoint" },
      { id: "status-report", label: "Status Report Endpoint" },
      { id: "incident-create", label: "Create an Incident" },
      { id: "api-playground", label: "Interactive API Playground" },
      { id: "webhooks-security", label: "Webhooks & HMAC Verification" },
    ],
  },
  {
    id: "configuring-alerts",
    label: "Alerting & Notifications",
    icon: <Bell className="w-3.5 h-3.5" />,
    subsections: [
      { id: "alert-channels", label: "Alert Channels" },
      { id: "alert-rules", label: "Alert Rules & Thresholds" },
      { id: "escalation-policy", label: "Escalation Policies" },
      { id: "silence-windows", label: "Silence & Maintenance Windows" },
    ],
  },
  {
    id: "sdks-integrations",
    label: "SDKs & Integrations",
    icon: <Cpu className="w-3.5 h-3.5" />,
    subsections: [
      { id: "typescript-sdk", label: "TypeScript / Node.js SDK" },
      { id: "python-sdk", label: "Python SDK" },
      { id: "cicd-github-actions", label: "GitHub Actions CI/CD" },
      { id: "docker-k8s-probes", label: "Docker & Kubernetes Probes" },
    ],
  },
];

// ─── Theme-Aware Info Box ────────────────────────────────────────────────────
function InfoBox({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "success";
  children: React.ReactNode;
}) {
  const styles = {
    info: {
      label: "DIAGNOSTIC // INFO",
      icon: <Info className="w-3.5 h-3.5 flex-shrink-0 text-blue-500 dark:text-blue-400" />,
      container:
        "bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 text-slate-800 dark:text-slate-200",
    },
    warning: {
      label: "DIAGNOSTIC // WARNING",
      icon: (
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-500 dark:text-amber-400" />
      ),
      container:
        "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 text-slate-800 dark:text-slate-200",
    },
    success: {
      label: "DIAGNOSTIC // SUCCESS",
      icon: (
        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500 dark:text-emerald-400" />
      ),
      container:
        "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 text-slate-800 dark:text-slate-200",
    },
  }[type];

  return (
    <div
      className={`my-5 font-mono text-[11px] leading-relaxed border border-dashed p-4 rounded-xl ${styles.container}`}
    >
      <div className="flex items-center gap-2 mb-2 font-bold tracking-wider text-[10px] opacity-90">
        {styles.icon}
        <span>{styles.label}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

// ─── Section Heading with Copy Anchor ────────────────────────────────────────
function SectionHeading({
  id,
  level,
  children,
}: {
  id: string;
  level: 1 | 2 | 3;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const Tag = `h${level}` as "h1" | "h2" | "h3";
  const sizeMap = {
    1: "text-xl font-bold font-mono tracking-widest mb-5 mt-14 text-slate-900 dark:text-white pb-2 border-b border-dashed border-slate-200 dark:border-neutral-800 flex items-center gap-2 uppercase",
    2: "text-sm font-bold font-mono tracking-wider mb-4 mt-10 text-slate-900 dark:text-slate-100 flex items-center gap-2.5 uppercase",
    3: "text-xs font-bold font-mono tracking-wide mb-3 mt-8 text-slate-800 dark:text-slate-200 flex items-center gap-2 uppercase",
  };

  return (
    <Tag id={id} className={`group scroll-mt-24 relative ${sizeMap[level]}`}>
      {level === 1 && (
        <span className="text-emerald-500 dark:text-emerald-400 font-bold">&gt;&gt;</span>
      )}
      {children}
      {level !== 1 && (
        <button
          onClick={handleCopyLink}
          className="ml-2 inline-flex items-center text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          title="Copy direct link to section"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          ) : (
            <Hash className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </Tag>
  );
}

// ─── Theme-Aware Badge ───────────────────────────────────────────────────────
function Badge({
  children,
  color = "blue",
}: {
  children: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}) {
  const badgeStyles = {
    blue: "border-blue-300 dark:border-blue-900/80 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20",
    green: "border-emerald-300 dark:border-emerald-900/80 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20",
    yellow: "border-amber-300 dark:border-amber-900/80 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20",
    red: "border-rose-300 dark:border-rose-900/80 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20",
    purple: "border-purple-300 dark:border-purple-900/80 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20",
  }[color];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[9px] tracking-widest uppercase font-bold border ${badgeStyles}`}
    >
      [{children}]
    </span>
  );
}

// ─── Inline Code Tag ─────────────────────────────────────────────────────────
function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-neutral-800 font-bold">
      {children}
    </code>
  );
}

// ─── Getting Started Section Content ──────────────────────────────────────────
function GettingStartedSection() {
  return (
    <div className="font-mono">
      <SectionHeading id="getting-started" level={1}>
        Getting Started
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-6 text-slate-400">
        Welcome to UpNode — the modern infrastructure monitoring and incident
        management platform. This guide walks you through setting up your
        account, creating your first project, managing API keys, and assigning
        role-based permissions.
      </p>

      <SectionHeading id="what-is-upnode" level={2}>
        <BookOpen className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
        What is UpNode?
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-3 text-slate-400">
        UpNode is a high-availability infrastructure uptime monitoring platform
        that allows engineering teams to:
      </p>
      <ul className="space-y-2 text-xs mb-6 pl-2 text-slate-400">
        {[
          "Monitor HTTP, TCP, WebSocket, and gRPC endpoints with second-level accuracy",
          "Receive real-time multi-channel incident pages via Slack, PagerDuty, SMS, or webhooks",
          "Publish customizable, branded public status pages for your users",
          "Integrate CI/CD pipelines and microservices using REST APIs and SDKs",
          "Collaborate across teams with granular RBAC permissions (Admin, Engineer, Auditor)",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold font-mono">[+]</span>
            <span className="text-[11px]">{item}</span>
          </li>
        ))}
      </ul>

      <SectionHeading id="create-account" level={2}>
        <Key className="w-3.5 h-3.5 text-amber-400 opacity-80" />
        Create an Account
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-3 text-slate-400">
        Navigate to{" "}
        <Link
          href="/register"
          className="font-mono text-emerald-400 underline underline-offset-2 font-medium"
        >
          /register
        </Link>{" "}
        and complete the sign-up form. You will receive a confirmation link to
        activate your workspace.
      </p>
      <InfoBox type="info">
        UpNode supports OAuth 2.0 (Google, GitHub) for single sign-on. You can
        also register with standard email credentials with optional 2FA
        verification.
      </InfoBox>

      <SectionHeading id="create-project" level={2}>
        <Zap className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
        Create Your First Project
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-3 text-slate-400">
        A <strong className="text-white">Project</strong> is the top-level
        boundary for grouping monitors, alert channels, team members, and status
        pages.
      </p>
      <ol className="space-y-2.5 text-xs pl-2 mb-4 text-slate-400">
        {[
          'Go to Dashboard → Click "New Project"',
          "Enter your project name (e.g., prod-api-cluster) and optional environment tag",
          "Select the default heartbeat interval (10s, 30s, 60s, 5m)",
          'Click "Create Project" — your project workspace is immediately live',
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="px-1.5 py-0.5 border border-emerald-900/60 bg-emerald-950/20 text-emerald-400 text-[10px] font-bold">
              [0{i + 1}]
            </span>
            <span className="text-[11px] pt-0.5">{step}</span>
          </li>
        ))}
      </ol>

      <SectionHeading id="generate-api-key" level={2}>
        <Terminal className="w-3.5 h-3.5 text-blue-400 opacity-80" />
        Generate API Keys & Scopes
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-3 text-slate-400">
        API Keys authenticate your microservices, heartbeats, and CI pipelines
        with the REST API. Each key is scoped to a specific project.
      </p>

      <DocsCodeBlock
        title="bash — export environment variable"
        snippets={[
          {
            lang: "bash",
            label: "Shell / Bash",
            code: `# Set project API key in environment
export UPNODE_API_KEY="upn_live_9f823a0b12c4d5e6f7"
export UPNODE_PROJECT_ID="proj_prod_01"

# Test authentication status
curl -s -H "Authorization: Bearer $UPNODE_API_KEY" \\
  https://api.upnode.io/v1/projects/$UPNODE_PROJECT_ID`,
          },
        ]}
      />

      <InfoBox type="warning">
        Your API key grants write access to your project monitors. Never commit
        keys to public git repositories. Always use environment variables or
        secret vaults.
      </InfoBox>

      <SectionHeading id="rbac-permissions" level={2}>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
        RBAC & Team Permissions
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-4 text-slate-400">
        UpNode enforces strict Role-Based Access Control across team workspace
        members:
      </p>

      <div className="overflow-x-auto my-5 rounded-none border border-neutral-850 bg-black">
        <table className="w-full text-left font-mono text-[10px]">
          <thead className="bg-neutral-900 border-b border-neutral-850">
            <tr>
              <th className="py-2.5 px-4 text-neutral-400">Role</th>
              <th className="py-2.5 px-4 text-neutral-400">Monitor Config</th>
              <th className="py-2.5 px-4 text-neutral-400">API Key Gen</th>
              <th className="py-2.5 px-4 text-neutral-400">
                Billing / Members
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900 text-slate-300">
            <tr>
              <td className="py-2.5 px-4 font-bold text-white">
                Owner / Admin
              </td>
              <td className="py-2.5 px-4 text-emerald-400 font-semibold">
                [Full Access]
              </td>
              <td className="py-2.5 px-4 text-emerald-400 font-semibold">
                [Full Access]
              </td>
              <td className="py-2.5 px-4 text-emerald-400 font-semibold">
                [Full Access]
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-bold text-white">Engineer</td>
              <td className="py-2.5 px-4 text-emerald-400 font-semibold">
                [Create & Edit]
              </td>
              <td className="py-2.5 px-4 text-emerald-400 font-semibold">
                [Create Only]
              </td>
              <td className="py-2.5 px-4 text-rose-500 font-semibold">
                [Read Only]
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-bold text-white">
                Auditor / Viewer
              </td>
              <td className="py-2.5 px-4 text-slate-500">[Read Only]</td>
              <td className="py-2.5 px-4 text-rose-500">[Denied]</td>
              <td className="py-2.5 px-4 text-rose-500">[Denied]</td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocsFeedback sectionTitle="Getting Started" />
    </div>
  );
}

// ─── API Integration Section Content ──────────────────────────────────────────
function ApiIntegrationSection() {
  return (
    <div className="font-mono">
      <SectionHeading id="api-integration" level={1}>
        API Reference
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-6 text-slate-400">
        The UpNode REST API enables programmatically reporting service metrics,
        ping heartbeats, creating incidents, and fetching monitor states. All
        requests expect JSON and HTTPS.
      </p>

      <SectionHeading id="authentication" level={2}>
        <Key className="w-3.5 h-3.5 text-blue-400 opacity-80" />
        Authentication & Base URL
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-3 text-slate-400">
        All requests require your Bearer token provided via the{" "}
        <InlineCode>Authorization</InlineCode> HTTP header:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {[
          { label: "Base URL", value: "https://api.upnode.io/v1" },
          { label: "Protocol", value: "HTTPS / TLS 1.3" },
          { label: "Content-Type", value: "application/json" },
        ].map((item) => (
          <div
            key={item.label}
            className="p-3 rounded-none bg-black border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-1">
              {item.label}
            </p>
            <p className="font-mono text-xs font-semibold text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <SectionHeading id="heartbeat-ping" level={2}>
        <Zap className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
        Heartbeat / Ping Endpoint
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-3 text-slate-400">
        Heartbeats inform UpNode that your background worker, cron job, or
        microservice is alive. If pings stop, an incident automatically
        triggers.
      </p>

      <div className="flex items-center gap-2.5 mb-3">
        <Badge color="green">POST</Badge>
        <InlineCode>/v1/monitors/&#123;monitorId&#125;/ping</InlineCode>
      </div>

      <DocsCodeBlock
        title="heartbeat ping snippets"
        snippets={[
          {
            lang: "bash",
            label: "cURL",
            code: `curl -X POST https://api.upnode.io/v1/monitors/mon_prod_db/ping \\
  -H "Authorization: Bearer $UPNODE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "status": "ok",
    "latency_ms": 42,
    "message": "Database replica sync complete"
  }'`,
          },
          {
            lang: "typescript",
            label: "TypeScript",
            code: `import { UpNodeClient } from "@upnode/sdk";

const upnode = new UpNodeClient({ apiKey: process.env.UPNODE_API_KEY! });

await upnode.monitors.ping("mon_prod_db", {
  status: "ok",
  latency_ms: 42,
  message: "Database replica sync complete",
});`,
          },
          {
            lang: "python",
            label: "Python",
            code: `import requests, os

response = requests.post(
    "https://api.upnode.io/v1/monitors/mon_prod_db/ping",
    headers={"Authorization": f"Bearer {os.getenv('UPNODE_API_KEY')}"},
    json={"status": "ok", "latency_ms": 42, "message": "Sync complete"}
)
print(response.json())`,
          },
          {
            lang: "go",
            label: "Go",
            code: `req, _ := http.NewRequest("POST", "https://api.upnode.io/v1/monitors/mon_prod_db/ping", body)
req.Header.Set("Authorization", "Bearer " + os.Getenv("UPNODE_API_KEY"))
resp, _ := http.DefaultClient.Do(req)`,
          },
        ]}
      />

      <SectionHeading id="status-report" level={2}>
        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 opacity-80" />
        Status Report Endpoint
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-3 text-slate-400">
        Update component status states programmatically (valid states:{" "}
        <InlineCode>ok</InlineCode>, <InlineCode>degraded</InlineCode>,{" "}
        <InlineCode>down</InlineCode>, <InlineCode>maintenance</InlineCode>).
      </p>

      <div className="flex items-center gap-2.5 mb-3">
        <Badge color="yellow">PATCH</Badge>
        <InlineCode>/v1/monitors/&#123;monitorId&#125;/status</InlineCode>
      </div>

      <DocsCodeBlock
        title="patch status state"
        snippets={[
          {
            lang: "bash",
            label: "cURL",
            code: `curl -X PATCH https://api.upnode.io/v1/monitors/mon_api_gateway/status \\
  -H "Authorization: Bearer $UPNODE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "status": "degraded",
    "message": "Elevated DB latency in us-east-1 region"
  }'`,
          },
          {
            lang: "json",
            label: "JSON Response",
            code: `{
  "success": true,
  "monitor_id": "mon_api_gateway",
  "previous_status": "ok",
  "current_status": "degraded",
  "updated_at": "2026-08-05T13:30:00.000Z"
}`,
          },
        ]}
      />

      <SectionHeading id="incident-create" level={2}>
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 opacity-80" />
        Create an Incident
      </SectionHeading>
      <div className="flex items-center gap-2.5 mb-3">
        <Badge color="red">POST</Badge>
        <InlineCode>/v1/projects/&#123;projectId&#125;/incidents</InlineCode>
      </div>

      <DocsCodeBlock
        title="create incident request"
        snippets={[
          {
            lang: "bash",
            label: "cURL",
            code: `curl -X POST https://api.upnode.io/v1/projects/proj_live/incidents \\
  -H "Authorization: Bearer $UPNODE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Payment API Latency Spike",
    "severity": "critical",
    "description": "P99 latency > 2500ms on payment gateway",
    "notify": true
  }'`,
          },
        ]}
      />

      <SectionHeading id="api-playground" level={2}>
        <Sparkles className="w-3.5 h-3.5 text-blue-400 opacity-80" />
        Interactive API Playground
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-2 text-slate-400">
        Test requests live against our simulated sandbox API right inside the
        documentation:
      </p>

      <DocsPlayground />

      <SectionHeading id="webhooks-security" level={2}>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
        Webhooks & HMAC Verification
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-3 text-slate-400">
        UpNode sends HTTP POST payloads when incidents change status. Verify
        incoming payloads using the <InlineCode>X-UpNode-Signature</InlineCode>{" "}
        HMAC header.
      </p>

      <DocsCodeBlock
        title="typescript — verify webhook signature"
        snippets={[
          {
            lang: "typescript",
            label: "Node.js crypto",
            code: `import crypto from "crypto";

export function verifyUpNodeWebhook(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = "sha256=" + hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}`,
          },
        ]}
      />

      <DocsFeedback sectionTitle="API Reference" />
    </div>
  );
}

// ─── Alerting & Notifications Content ─────────────────────────────────────────
function ConfiguringAlertsSection() {
  return (
    <div className="font-mono">
      <SectionHeading id="configuring-alerts" level={1}>
        Alerting & Notifications
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-6 text-slate-400">
        Alerts ensure your on-call engineers are paged immediately when service
        degradation or outage occurs.
      </p>

      <SectionHeading id="alert-channels" level={2}>
        <Bell className="w-3.5 h-3.5 text-purple-400 opacity-80" />
        Alert Channels
      </SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {[
          {
            name: "Slack",
            desc: "Send rich block cards to #incidents channels",
            badge: "webhook",
            color: "purple" as const,
          },
          {
            name: "PagerDuty",
            desc: "Trigger PagerDuty incident escalations",
            badge: "native",
            color: "red" as const,
          },
          {
            name: "Email",
            desc: "Notify team distribution lists",
            badge: "smtp",
            color: "blue" as const,
          },
          {
            name: "Custom Webhook",
            desc: "POST JSON event payloads to any HTTPS URL",
            badge: "custom",
            color: "green" as const,
          },
          {
            name: "Microsoft Teams",
            desc: "Adaptive cards in Teams channels",
            badge: "webhook",
            color: "purple" as const,
          },
          {
            name: "Twilio SMS",
            desc: "Direct SMS pages for critical outages",
            badge: "sms",
            color: "yellow" as const,
          },
        ].map((ch) => (
          <div
            key={ch.name}
            className="flex items-start gap-3 p-3.5 rounded-none bg-black border border-neutral-800 hover:border-neutral-705 transition-all shadow-xs"
          >
            <div className="w-7 h-7 rounded-none bg-neutral-900 border border-neutral-800 flex items-center justify-center flex-shrink-0 text-neutral-400">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-mono text-xs font-semibold text-white">
                  {ch.name}
                </p>
                <Badge color={ch.color}>{ch.badge}</Badge>
              </div>
              <p className="text-[11px] text-neutral-500">{ch.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading id="alert-rules" level={2}>
        <Zap className="w-3.5 h-3.5 text-amber-400 opacity-80" />
        Alert Rules & Threshold Matrix
      </SectionHeading>
      <div className="overflow-x-auto my-5 rounded-none border border-neutral-850 bg-black">
        <table className="w-full text-left font-mono text-[10px]">
          <thead className="bg-neutral-900 border-b border-neutral-850">
            <tr>
              <th className="py-2.5 px-4 text-neutral-400">Condition</th>
              <th className="py-2.5 px-4 text-neutral-400">Threshold</th>
              <th className="py-2.5 px-4 text-neutral-400">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900 text-slate-300">
            {[
              ["response_time_ms > X", "> 500ms", "warning", "blue"],
              ["response_time_ms > X", "> 2000ms", "critical", "red"],
              ["status_code != 200", "4xx / 5xx error", "high", "yellow"],
              ["heartbeat_missed", "1 missed ping", "critical", "red"],
              ["ssl_expiry_days < X", "< 7 days remaining", "high", "yellow"],
            ].map(([cond, val, sev, badgeColor], i) => (
              <tr key={i}>
                <td className="py-2.5 px-4 text-emerald-400 font-semibold">
                  {cond}
                </td>
                <td className="py-2.5 px-4">{val}</td>
                <td className="py-2.5 px-4">
                  <Badge color={badgeColor as "blue" | "red" | "yellow"}>
                    {sev}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeading id="escalation-policy" level={2}>
        <Workflow className="w-3.5 h-3.5 text-blue-400 opacity-80" />
        Escalation Policies
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-3 text-slate-400">
        If an alert goes unacknowledged, escalation rules auto-page backup team
        members:
      </p>

      <DocsCodeBlock
        title="json — escalation policy structure"
        snippets={[
          {
            lang: "json",
            label: "JSON Policy",
            code: `{
  "name": "On-Call Tier 1 Escalation",
  "steps": [
    { "delay_min": 0, "targets": ["oncall_primary@acme.com"], "channels": ["slack"] },
    { "delay_min": 5, "targets": ["oncall_secondary@acme.com"], "channels": ["pagerduty", "sms"] },
    { "delay_min": 15, "targets": ["eng_lead@acme.com"], "channels": ["pagerduty", "sms", "email"] }
  ]
}`,
          },
        ]}
      />

      <SectionHeading id="silence-windows" level={2}>
        <X className="w-3.5 h-3.5 text-rose-400 opacity-80" />
        Silence & Maintenance Windows
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-3 text-slate-400">
        Suppress alert pages during scheduled server maintenance to avoid false
        alarms.
      </p>

      <DocsFeedback sectionTitle="Alerting & Notifications" />
    </div>
  );
}

// ─── SDKs & Integrations Section Content ──────────────────────────────────────
function SdksIntegrationsSection() {
  return (
    <div className="font-mono">
      <SectionHeading id="sdks-integrations" level={1}>
        SDKs & Integrations
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-6 text-slate-400">
        Integrate UpNode into Node.js, Python, GitHub Actions, Docker, or
        Kubernetes pipelines seamlessly.
      </p>

      <SectionHeading id="typescript-sdk" level={2}>
        <Code2 className="w-3.5 h-3.5 text-blue-400 opacity-80" />
        TypeScript / Node.js SDK
      </SectionHeading>

      <DocsCodeBlock
        title="typescript — install and initialize"
        snippets={[
          {
            lang: "bash",
            label: "npm / pnpm",
            code: "npm install @upnode/sdk",
          },
          {
            lang: "typescript",
            label: "index.ts",
            code: `import { UpNodeClient } from "@upnode/sdk";

const upnode = new UpNodeClient({
  apiKey: process.env.UPNODE_API_KEY!,
});

// Send continuous ping
await upnode.monitors.ping("mon_api", { status: "ok", latency_ms: 18 });`,
          },
        ]}
      />

      <SectionHeading id="python-sdk" level={2}>
        <Cpu className="w-3.5 h-3.5 text-purple-400 opacity-80" />
        Python SDK
      </SectionHeading>

      <DocsCodeBlock
        title="python — install and send ping"
        snippets={[
          {
            lang: "bash",
            label: "pip",
            code: "pip install upnode-python",
          },
          {
            lang: "python",
            label: "main.py",
            code: `from upnode import UpNode

client = UpNode(api_key="upn_live_xxxxxxxx")
client.ping("mon_worker_01", status="ok", latency_ms=35)`,
          },
        ]}
      />

      <SectionHeading id="cicd-github-actions" level={2}>
        <Layers className="w-3.5 h-3.5 text-amber-400 opacity-80" />
        GitHub Actions CI/CD Pipeline
      </SectionHeading>
      <p className="text-xs leading-relaxed mb-3 text-slate-400">
        Automatically notify UpNode of deployments or start maintenance windows
        inside your GitHub workflow:
      </p>

      <DocsCodeBlock
        title="yaml — .github/workflows/deploy.yml"
        snippets={[
          {
            lang: "bash",
            label: "GitHub Actions YAML",
            code: `name: Production Deployment
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Report Deployment to UpNode
        uses: upnode/github-action-ping@v1
        with:
          api-key: \${{ secrets.UPNODE_API_KEY }}
          monitor-id: "mon_production_api"
          status: "ok"`,
          },
        ]}
      />

      <SectionHeading id="docker-k8s-probes" level={2}>
        <Terminal className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
        Docker & Kubernetes Probes
      </SectionHeading>

      <DocsCodeBlock
        title="dockerfile & k8s health check"
        snippets={[
          {
            lang: "bash",
            label: "Dockerfile",
            code: `HEALTHCHECK --interval=30s --timeout=5s \\
  CMD curl -f -X POST https://api.upnode.io/v1/monitors/$MONITOR_ID/ping \\
      -H "Authorization: Bearer $UPNODE_API_KEY" || exit 1`,
          },
        ]}
      />

      <DocsFeedback sectionTitle="SDKs & Integrations" />
    </div>
  );
}

// ─── Main Docs Page Component ────────────────────────────────────────────────
export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({
    "getting-started": true,
    "api-integration": true,
    "configuring-alerts": true,
    "sdks-integrations": true,
  });

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => {
      const isCurrentlyCollapsed = prev[id];
      return {
        "getting-started": true,
        "api-integration": true,
        "configuring-alerts": true,
        "sdks-integrations": true,
        [id]: !isCurrentlyCollapsed,
      };
    });
  };

  // Flatten items for search palette
  const searchItems: DocSearchItem[] = SECTIONS.flatMap((s) =>
    s.subsections.map((sub) => ({
      id: sub.id,
      label: sub.label,
      category: s.label,
      description: `Documentation on ${sub.label} under ${s.label}`,
    })),
  );

  // Listen for global Cmd+K, Ctrl+K, or / keydown
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      } else if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
      setMobileNavOpen(false);

      // Expand only the parent of the active link, collapse others
      const parentSection = SECTIONS.find(
        (s) => s.id === id || s.subsections.some((sub) => sub.id === id),
      );
      if (parentSection) {
        setCollapsedSections(() => ({
          "getting-started": true,
          "api-integration": true,
          "configuring-alerts": true,
          "sdks-integrations": true,
          [parentSection.id]: false, // Expand this one
        }));
      }
    }
  };

  // Intersection Observer for Scrollspy
  useEffect(() => {
    const allIds = SECTIONS.flatMap((s) => [
      s.id,
      ...s.subsections.map((sub) => sub.id),
    ]);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen font-mono selection:bg-slate-800 selection:text-white transition-colors"
      style={{ background: "var(--lp-bg)", color: "var(--lp-text-primary)" }}
    >
      {/* Top Scroll Reading Progress */}
      <DocsReadingProgress />

      {/* Grid Pattern Background Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06] z-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--lp-dot) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <LandingNavbar />

      {/* Hero Header */}
      <div
        className="relative z-10 border-b transition-colors"
        style={{ background: "var(--lp-surface)", borderBottom: "0.5px solid var(--lp-border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[9px] tracking-widest uppercase mb-4"
            style={{
              background: "var(--lp-surface)",
              border: "0.5px solid var(--lp-border)",
              color: "var(--lp-text-dim)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            [System Documentation]
          </div>

          <h1
            className="text-2xl sm:text-4xl font-bold tracking-wider uppercase mb-3"
            style={{ color: "var(--lp-text-primary)" }}
          >
            UpNode Developer Hub
          </h1>
          <p
            className="text-xs sm:text-sm leading-relaxed mb-6 max-w-2xl"
            style={{ color: "var(--lp-text-mid)" }}
          >
            Comprehensive guides, REST API reference, and SDKs to monitor your
            services with second-level precision.
          </p>

          {/* Search Trigger Input Bar */}
          <div className="relative max-w-xl">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-left cursor-pointer font-mono text-xs group shadow-xs"
              style={{
                background: "var(--lp-surface)",
                border: "0.5px solid var(--lp-border)",
                color: "var(--lp-text-primary)",
              }}
            >
              <div className="flex items-center gap-3">
                <Search className="w-3.5 h-3.5 flex-shrink-0 transition-colors" style={{ color: "var(--lp-text-dim)" }} />
                <span className="font-mono text-xs" style={{ color: "var(--lp-text-dim)" }}>
                  Search documentation topics...
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd
                  className="font-mono text-[9px] tracking-widest px-2 py-0.5 rounded"
                  style={{
                    background: "var(--lp-bg)",
                    border: "0.5px solid var(--lp-border)",
                    color: "var(--lp-text-dim)",
                  }}
                >
                  [CMD+K]
                </kbd>
              </div>
            </button>
          </div>

          {/* Quick Jump Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-5 font-mono">
            <span className="text-[9px] tracking-widest uppercase mr-1" style={{ color: "var(--lp-text-dim)" }}>
              [Quick Jump]
            </span>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all cursor-pointer hover:opacity-90"
                style={{
                  background: "var(--lp-surface)",
                  border: "0.5px solid var(--lp-border)",
                  color: "var(--lp-text-mid)",
                }}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-10">
          {/* Desktop Left Navigation Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {SECTIONS.map((section) => {
                const isCollapsed = collapsedSections[section.id];
                const isSectionActive =
                  activeSection === section.id ||
                  section.subsections.some((s) => s.id === activeSection);
                return (
                  <div key={section.id} className="space-y-1.5 font-mono">
                    <button
                      onClick={() => {
                        toggleSection(section.id);
                        scrollTo(section.id);
                      }}
                      className="w-full flex items-center justify-between text-[11px] tracking-wider uppercase font-bold text-left transition-colors py-1 cursor-pointer group"
                      style={{
                        color: isSectionActive
                          ? "var(--lp-text-primary)"
                          : "var(--lp-text-dim)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="p-1 rounded text-emerald-500 dark:text-emerald-400"
                          style={{
                            background: "var(--lp-surface)",
                            border: "0.5px solid var(--lp-border)",
                          }}
                        >
                          {section.icon}
                        </span>
                        {section.label}
                      </div>
                      <ChevronRight
                        className="w-3.5 h-3.5 opacity-65 group-hover:opacity-100 transition-transform duration-200"
                        style={{
                          transform: isCollapsed
                            ? "rotate(0deg)"
                            : "rotate(90deg)",
                        }}
                      />
                    </button>

                    {!isCollapsed && (
                      <div className="space-y-0.5 pl-3 border-l border-dashed" style={{ borderColor: "var(--lp-border)" }}>
                        {section.subsections.map((sub) => {
                          const isActive = activeSection === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => scrollTo(sub.id)}
                              className={`w-full text-left px-3 py-1.5 font-mono text-[11px] transition-all cursor-pointer block rounded-lg ${
                                isActive
                                  ? "text-emerald-500 dark:text-emerald-400 font-bold border-l-2 border-emerald-500 dark:border-emerald-400 -ml-[13px] pl-3"
                                  : "hover:opacity-100 opacity-70"
                              }`}
                              style={{
                                background: isActive ? "var(--lp-surface)" : "transparent",
                                color: isActive ? "var(--lp-text-primary)" : "var(--lp-text-dim)",
                              }}
                            >
                              {isActive ? `▶ ${sub.label}` : `  ${sub.label}`}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Support Card */}
              <div className="mt-8 p-4 rounded-2xl font-mono" style={GLASS}>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--lp-text-primary)" }}>
                  Need Help?
                </p>
                <p className="text-[10px] mb-3 leading-relaxed" style={{ color: "var(--lp-text-dim)" }}>
                  Our engineering team responds in &lt; 2 hours.
                </p>
                <a
                  href="mailto:support@upnode.io"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-500 dark:text-emerald-400 font-semibold hover:underline"
                >
                  [Contact Support] <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* Mobile Navigation Trigger Floating Button */}
          <div className="lg:hidden fixed bottom-6 right-6 z-50 font-mono">
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl cursor-pointer transition-all active:scale-95"
              style={{
                background: "var(--lp-cta-bg)",
                color: "var(--lp-cta-text)",
                border: "0.5px solid var(--lp-border-top)",
              }}
            >
              <Menu className="w-4 h-4" />
              Sections
            </button>
          </div>

          {/* Mobile Bottom Navigation Sheet */}
          <AnimatePresence>
            {mobileNavOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileNavOpen(false)}
                  className="fixed inset-0 z-40 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm lg:hidden"
                />
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 250 }}
                  className="fixed bottom-0 left-0 right-0 z-50 p-6 max-h-[75vh] overflow-y-auto lg:hidden rounded-t-3xl shadow-2xl font-mono"
                  style={{ background: "var(--lp-bg)", borderTop: "0.5px solid var(--lp-border)" }}
                >
                  <div className="flex items-center justify-between mb-5 pb-3 border-b" style={{ borderColor: "var(--lp-border)" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--lp-text-dim)" }}>
                      [Documentation Topics]
                    </p>
                    <button
                      onClick={() => setMobileNavOpen(false)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {SECTIONS.map((section) => (
                    <div key={section.id} className="mb-5 space-y-2">
                      <p className="flex items-center gap-2 text-xs tracking-widest uppercase font-bold" style={{ color: "var(--lp-text-primary)" }}>
                        {section.icon}
                        {section.label}
                      </p>
                      <div className="space-y-1 pl-3 border-l border-dashed" style={{ borderColor: "var(--lp-border)" }}>
                        {section.subsections.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => scrollTo(sub.id)}
                            className="w-full text-left py-1.5 font-mono text-xs cursor-pointer block"
                            style={{ color: "var(--lp-text-mid)" }}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Documentation Article Content */}
          <main className="flex-1 min-w-0 max-w-3xl font-mono">
            {/* Top Breadcrumb Trail */}
            <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase mb-6" style={{ color: "var(--lp-text-dim)" }}>
              <Link href="/" className="hover:opacity-100 transition-opacity">
                UpNode
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold" style={{ color: "var(--lp-text-primary)" }}>Docs</span>
            </div>

            {/* Quick Overview Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
              {SECTIONS.map((s, i) => (
                <motion.button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  whileHover={{ y: -2 }}
                  className="text-left p-4 rounded-2xl transition-all cursor-pointer group relative overflow-hidden"
                  style={GLASS}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "var(--lp-text-dim)" }}>
                      MODULE 0{i + 1}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="font-mono text-xs font-bold transition-colors uppercase tracking-wider mb-2" style={{ color: "var(--lp-text-primary)" }}>
                    {s.label}
                  </p>
                  <p className="font-mono text-[18px] font-light" style={{ color: "var(--lp-text-mid)" }}>
                    {String(s.subsections.length).padStart(2, "0")}{" "}
                    <span className="text-[10px] uppercase" style={{ color: "var(--lp-text-dim)" }}>
                      topics
                    </span>
                  </p>
                </motion.button>
              ))}
            </div>

            <div className="w-full h-px mb-10 border-t border-dashed" style={{ borderColor: "var(--lp-border)" }} />

            {/* Documentation Sections */}
            <div className="space-y-16">
              <section>
                <GettingStartedSection />
              </section>

              <div className="w-full h-px border-t border-dashed" style={{ borderColor: "var(--lp-border)" }} />

              <section>
                <ApiIntegrationSection />
              </section>

              <div className="w-full h-px border-t border-dashed" style={{ borderColor: "var(--lp-border)" }} />

              <section>
                <ConfiguringAlertsSection />
              </section>

              <div className="w-full h-px border-t border-dashed" style={{ borderColor: "var(--lp-border)" }} />

              <section>
                <SdksIntegrationsSection />
              </section>
            </div>

            {/* Bottom Footer Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t border-dashed" style={{ borderColor: "var(--lp-border)" }}>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "var(--lp-text-dim)" }}>
                  Need custom assistance?
                </p>
                <a
                  href="mailto:support@upnode.io"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-500 dark:text-emerald-400 font-semibold hover:underline"
                >
                  Contact technical support <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold shadow-md transition-all cursor-pointer active:scale-95 hover:opacity-90"
                style={{
                  background: "var(--lp-cta-bg)",
                  color: "var(--lp-cta-text)",
                  border: "0.5px solid var(--lp-border-top)",
                }}
              >
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </main>
        </div>
      </div>

      {/* Global Command Palette Search Modal */}
      <DocsSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelect={scrollTo}
        items={searchItems}
      />

      <LandingFooter />
    </div>
  );
}
