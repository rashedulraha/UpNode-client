"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Code2,
  Copy,
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
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";

// ─── Design Tokens ──────────────────────────────────────────────────────────────
const GLASS: React.CSSProperties = {
  background: "var(--lp-surface)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "0.5px solid var(--lp-border)",
  borderTop: "0.5px solid var(--lp-border-top)",
};

// ─── Types ───────────────────────────────────────────────────────────────────────
interface DocSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  subsections: { id: string; label: string }[];
}

// ─── Sections Config ─────────────────────────────────────────────────────────────
const SECTIONS: DocSection[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    subsections: [
      { id: "what-is-upnode", label: "What is UpNode?" },
      { id: "create-account", label: "Create an Account" },
      { id: "create-project", label: "Create Your First Project" },
      { id: "generate-api-key", label: "Generate an API Key" },
    ],
  },
  {
    id: "api-integration",
    label: "API Integration",
    icon: <Code2 className="w-3.5 h-3.5" />,
    subsections: [
      { id: "authentication", label: "Authentication" },
      { id: "heartbeat-ping", label: "Heartbeat / Ping Endpoint" },
      { id: "status-report", label: "Status Report Endpoint" },
      { id: "incident-create", label: "Create an Incident" },
      { id: "sdk-usage", label: "SDK Usage" },
    ],
  },
  {
    id: "configuring-alerts",
    label: "Configuring Alerts",
    icon: <Bell className="w-3.5 h-3.5" />,
    subsections: [
      { id: "alert-channels", label: "Alert Channels" },
      { id: "alert-rules", label: "Alert Rules & Thresholds" },
      { id: "escalation-policy", label: "Escalation Policies" },
      { id: "silence-windows", label: "Silence Windows" },
    ],
  },
];

// ─── CopyButton ───────────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded transition-all cursor-pointer hover:opacity-80"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "0.5px solid rgba(255,255,255,0.1)",
        color: copied ? "#22c55e" : "rgba(255,255,255,0.5)",
      }}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

// ─── Basic Syntax Highlighter ─────────────────────────────────────────────────────
function highlightCode(code: string, lang: string): string {
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (lang === "bash" || lang === "shell") {
    escaped = escaped.replace(
      /(#.*)$/gm,
      '<span style="color:#6b7280">$1</span>',
    );
    escaped = escaped.replace(
      /"([^"]*)"/g,
      '<span style="color:#86efac">"$1"</span>',
    );
    escaped = escaped.replace(
      /(\$[A-Z_]+)/g,
      '<span style="color:#f9a8d4">$1</span>',
    );
    escaped = escaped.replace(
      /\b(curl|wget|npm|npx|node|python|pip|export|echo|cat)\b/g,
      '<span style="color:#93c5fd">$1</span>',
    );
    escaped = escaped.replace(
      /(\s-{1,2}[\w-]+)/g,
      '<span style="color:#fcd34d">$1</span>',
    );
  } else if (lang === "json") {
    escaped = escaped.replace(
      /"([^"]+)":/g,
      '<span style="color:#93c5fd">"$1"</span>:',
    );
    escaped = escaped.replace(
      /: "([^"]*)"/g,
      ': <span style="color:#86efac">"$1"</span>',
    );
    escaped = escaped.replace(
      /: (true|false|null|\d+)/g,
      ': <span style="color:#fcd34d">$1</span>',
    );
  } else if (lang === "typescript" || lang === "javascript") {
    escaped = escaped.replace(
      /\b(const|let|var|async|await|function|return|import|from|export|default|if|else|new|class|extends|this|typeof|interface|type)\b/g,
      '<span style="color:#93c5fd">$1</span>',
    );
    escaped = escaped.replace(
      /`([^`]*)`/g,
      '<span style="color:#86efac">`$1`</span>',
    );
    escaped = escaped.replace(
      /"([^"]*)"/g,
      '<span style="color:#86efac">"$1"</span>',
    );
    escaped = escaped.replace(
      /'([^']*)'/g,
      "<span style=\"color:#86efac\">'$1'</span>",
    );
    escaped = escaped.replace(
      /(\/\/.*)$/gm,
      '<span style="color:#6b7280">$1</span>',
    );
  }
  return escaped;
}

// ─── Terminal Code Block ──────────────────────────────────────────────────────────
function TerminalBlock({
  title,
  lang = "bash",
  code,
}: {
  title?: string;
  lang?: string;
  code: string;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden my-5"
      style={{
        background: "rgba(0,0,0,0.75)",
        border: "0.5px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {title || lang}
          </span>
        </div>
        <CopyButton text={code} />
      </div>
      <pre
        className="overflow-x-auto px-5 py-4 font-mono text-[12px] leading-relaxed"
        style={{ color: "rgba(255,255,255,0.85)" }}
      >
        <code dangerouslySetInnerHTML={{ __html: highlightCode(code, lang) }} />
      </pre>
    </div>
  );
}

// ─── Info Box ────────────────────────────────────────────────────────────────────
function InfoBox({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "success";
  children: React.ReactNode;
}) {
  const config = {
    info: {
      icon: <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />,
      color: "#60a5fa",
      bg: "rgba(96,165,250,0.08)",
      border: "rgba(96,165,250,0.2)",
    },
    warning: {
      icon: <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />,
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.08)",
      border: "rgba(251,191,36,0.2)",
    },
    success: {
      icon: <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />,
      color: "#34d399",
      bg: "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.2)",
    },
  }[type];
  return (
    <div
      className="flex items-start gap-2.5 px-4 py-3 rounded-xl my-4 font-mono text-[12px] leading-relaxed"
      style={{
        background: config.bg,
        border: `0.5px solid ${config.border}`,
        color: config.color,
      }}
    >
      {config.icon}
      <span>{children}</span>
    </div>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────────
function SectionHeading({
  id,
  level,
  children,
}: {
  id: string;
  level: 1 | 2 | 3;
  children: React.ReactNode;
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3";
  const sizeMap = {
    1: "text-2xl font-bold tracking-tight mb-4 mt-10",
    2: "text-base font-semibold tracking-tight mb-3 mt-8 flex items-center gap-2",
    3: "text-sm font-semibold tracking-tight mb-2 mt-6",
  };
  return (
    <Tag
      id={id}
      className={`group scroll-mt-20 ${sizeMap[level]}`}
      style={{ color: "var(--lp-text-primary)" }}
    >
      {children}
      {level !== 1 && (
        <a
          href={`#${id}`}
          className="opacity-0 group-hover:opacity-40 transition-opacity"
          style={{ color: "var(--lp-text-mid)" }}
        >
          <Hash className="w-3.5 h-3.5" />
        </a>
      )}
    </Tag>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────────
function Badge({
  children,
  color = "blue",
}: {
  children: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}) {
  const colors = {
    blue: {
      bg: "rgba(96,165,250,0.15)",
      text: "#93c5fd",
      border: "rgba(96,165,250,0.3)",
    },
    green: {
      bg: "rgba(52,211,153,0.15)",
      text: "#6ee7b7",
      border: "rgba(52,211,153,0.3)",
    },
    yellow: {
      bg: "rgba(251,191,36,0.15)",
      text: "#fcd34d",
      border: "rgba(251,191,36,0.3)",
    },
    red: {
      bg: "rgba(248,113,113,0.15)",
      text: "#fca5a5",
      border: "rgba(248,113,113,0.3)",
    },
    purple: {
      bg: "rgba(167,139,250,0.15)",
      text: "#c4b5fd",
      border: "rgba(167,139,250,0.3)",
    },
  }[color];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] tracking-wider uppercase font-semibold"
      style={{
        background: colors.bg,
        color: colors.text,
        border: `0.5px solid ${colors.border}`,
      }}
    >
      {children}
    </span>
  );
}

// ─── Getting Started Section ──────────────────────────────────────────────────────
function GettingStartedSection() {
  return (
    <div>
      <SectionHeading id="getting-started" level={1}>
        Getting Started
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-6"
        style={{ color: "var(--lp-text-mid)" }}
      >
        Welcome to UpNode — the modern infrastructure monitoring and incident
        management platform. This guide walks you through setting up your
        account, creating your first project, and generating the API key you
        need to start monitoring.
      </p>

      <SectionHeading id="what-is-upnode" level={2}>
        <BookOpen className="w-4 h-4 opacity-60" />
        What is UpNode?
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-3"
        style={{ color: "var(--lp-text-mid)" }}
      >
        UpNode is a production-grade uptime monitoring platform that lets you:
      </p>
      <ul
        className="space-y-2 text-sm mb-6 font-mono pl-4"
        style={{ color: "var(--lp-text-mid)" }}
      >
        {[
          "Monitor HTTP, TCP, and gRPC endpoints with second-level granularity",
          "Receive real-time incident alerts via Slack, PagerDuty, email, or webhooks",
          "Publish a branded public status page for your users",
          "Integrate CI/CD pipelines using the REST API and API Keys",
          "Collaborate with team members using RBAC (Admin, Engineer, Auditor)",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span style={{ color: "#22d3ee" }}>→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <SectionHeading id="create-account" level={2}>
        <Key className="w-4 h-4 opacity-60" />
        Create an Account
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-3"
        style={{ color: "var(--lp-text-mid)" }}
      >
        Navigate to{" "}
        <Link
          href="/register"
          className="font-mono underline underline-offset-2"
          style={{ color: "#60a5fa" }}
        >
          /register
        </Link>{" "}
        and complete the sign-up form. You'll receive a verification email —
        click the link to activate your workspace.
      </p>
      <InfoBox type="info">
        UpNode supports OAuth 2.0 (Google, GitHub). You can also register with
        any email and a password of at least 8 characters.
      </InfoBox>

      <SectionHeading id="create-project" level={2}>
        <Zap className="w-4 h-4 opacity-60" />
        Create Your First Project
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-3"
        style={{ color: "var(--lp-text-mid)" }}
      >
        A <strong style={{ color: "var(--lp-text-primary)" }}>Project</strong>{" "}
        is the top-level grouping for all monitors, alerts, and status pages.
      </p>
      <ol
        className="space-y-2 text-sm font-mono pl-4 mb-4"
        style={{ color: "var(--lp-text-mid)" }}
      >
        {[
          'Go to Dashboard → click "New Project"',
          "Enter a project name and optional description",
          "Select the default check interval (30s, 60s, 5m, 15m)",
          'Click "Create Project" — your project is live',
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-2">
            <span style={{ color: "#a78bfa" }}>0{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <SectionHeading id="generate-api-key" level={2}>
        <Terminal className="w-4 h-4 opacity-60" />
        Generate an API Key
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-3"
        style={{ color: "var(--lp-text-mid)" }}
      >
        API Keys authenticate your monitors, CI pipelines, and third-party
        integrations with the UpNode REST API. Each key is scoped to a single
        project.
      </p>
      <ol
        className="space-y-2 text-sm font-mono pl-4 mb-4"
        style={{ color: "var(--lp-text-mid)" }}
      >
        {[
          "Open your project → Settings → API Keys",
          'Click "Generate New Key"',
          'Give the key a descriptive name (e.g. "ci-pipeline-prod")',
          "Copy and securely store your key — it will only be shown once",
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-2">
            <span style={{ color: "#a78bfa" }}>0{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <InfoBox type="warning">
        Your API key grants write access to your project. Never commit it to
        source control. Use environment variables or a secret manager.
      </InfoBox>
      <TerminalBlock
        title="shell — storing your key"
        lang="bash"
        code={`# Set as environment variable (do NOT hardcode)
export UPNODE_API_KEY="upn_live_xxxxxxxxxxxxxxxxxxxx"

# Verify it's available
echo $UPNODE_API_KEY`}
      />
    </div>
  );
}

// ─── API Integration Section ──────────────────────────────────────────────────────
function ApiIntegrationSection() {
  return (
    <div>
      <SectionHeading id="api-integration" level={1}>
        API Integration
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-6"
        style={{ color: "var(--lp-text-mid)" }}
      >
        The UpNode REST API lets you programmatically send heartbeats, report
        status, create incidents, and manage monitors. All endpoints use JSON
        and require your project-scoped API Key.
      </p>

      <SectionHeading id="authentication" level={2}>
        <Key className="w-4 h-4 opacity-60" />
        Authentication
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-3"
        style={{ color: "var(--lp-text-mid)" }}
      >
        Pass your API key in the{" "}
        <code
          className="font-mono text-[12px] px-1.5 py-0.5 rounded"
          style={{ background: "rgba(255,255,255,0.08)", color: "#86efac" }}
        >
          Authorization
        </code>{" "}
        header as a Bearer token:
      </p>
      <TerminalBlock
        title="shell — authenticated request"
        lang="bash"
        code={`curl -X GET https://api.upnode.io/v1/projects \\
  --header "Authorization: Bearer $UPNODE_API_KEY" \\
  --header "Content-Type: application/json"`}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
        {[
          { label: "Base URL", value: "https://api.upnode.io/v1" },
          { label: "Protocol", value: "HTTPS only" },
          { label: "Format", value: "application/json" },
        ].map((item) => (
          <div
            key={item.label}
            className="p-3 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid var(--lp-border)",
            }}
          >
            <p
              className="font-mono text-[9px] tracking-widest uppercase mb-1.5"
              style={{ color: "var(--lp-text-faint)" }}
            >
              {item.label}
            </p>
            <p
              className="font-mono text-[11px]"
              style={{ color: "var(--lp-text-primary)" }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <SectionHeading id="heartbeat-ping" level={2}>
        <Zap className="w-4 h-4 opacity-60" />
        Heartbeat / Ping Endpoint
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-3"
        style={{ color: "var(--lp-text-mid)" }}
      >
        A heartbeat tells UpNode your service is alive. If UpNode stops
        receiving pings within the configured interval, an incident is
        automatically opened.
      </p>
      <div className="flex items-center gap-2 mb-3">
        <Badge color="green">POST</Badge>
        <code
          className="font-mono text-[11px]"
          style={{ color: "var(--lp-text-primary)" }}
        >
          /v1/monitors/{"{monitorId}"}/ping
        </code>
      </div>
      <TerminalBlock
        title="shell — send heartbeat"
        lang="bash"
        code={`curl -X POST https://api.upnode.io/v1/monitors/mon_abc123/ping \\
  --header "Authorization: Bearer $UPNODE_API_KEY" \\
  --header "Content-Type: application/json" \\
  --data '{
    "status": "ok",
    "latency_ms": 42,
    "message": "All systems operational"
  }'`}
      />
      <TerminalBlock
        title="json — response 200 OK"
        lang="json"
        code={`{
  "success": true,
  "monitor_id": "mon_abc123",
  "received_at": "2026-08-01T11:14:02.891Z",
  "next_expected": "2026-08-01T11:15:02.891Z",
  "status": "ok"
}`}
      />

      <SectionHeading id="status-report" level={2}>
        <CheckCircle2 className="w-4 h-4 opacity-60" />
        Status Report Endpoint
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-3"
        style={{ color: "var(--lp-text-mid)" }}
      >
        Report the current status of a monitored component — useful for pushing
        status from health check endpoints.
      </p>
      <div className="flex items-center gap-2 mb-3">
        <Badge color="yellow">PATCH</Badge>
        <code
          className="font-mono text-[11px]"
          style={{ color: "var(--lp-text-primary)" }}
        >
          /v1/monitors/{"{monitorId}"}/status
        </code>
      </div>
      <TerminalBlock
        title="shell — update status"
        lang="bash"
        code={`curl -X PATCH https://api.upnode.io/v1/monitors/mon_abc123/status \\
  --header "Authorization: Bearer $UPNODE_API_KEY" \\
  --header "Content-Type: application/json" \\
  --data '{
    "status": "degraded",
    "message": "Database response time > 800ms. Investigating.",
    "affected_regions": ["us-east-1", "eu-west-1"]
  }'`}
      />
      <InfoBox type="info">
        Valid status values: <code style={{ color: "#86efac" }}>ok</code>,{" "}
        <code style={{ color: "#86efac" }}>degraded</code>,{" "}
        <code style={{ color: "#86efac" }}>down</code>, and{" "}
        <code style={{ color: "#86efac" }}>maintenance</code>.
      </InfoBox>

      <SectionHeading id="incident-create" level={2}>
        <AlertTriangle className="w-4 h-4 opacity-60" />
        Create an Incident
      </SectionHeading>
      <div className="flex items-center gap-2 mb-3">
        <Badge color="green">POST</Badge>
        <code
          className="font-mono text-[11px]"
          style={{ color: "var(--lp-text-primary)" }}
        >
          /v1/projects/{"{projectId}"}/incidents
        </code>
      </div>
      <TerminalBlock
        title="shell — create incident"
        lang="bash"
        code={`curl -X POST https://api.upnode.io/v1/projects/proj_xyz/incidents \\
  --header "Authorization: Bearer $UPNODE_API_KEY" \\
  --header "Content-Type: application/json" \\
  --data '{
    "title": "Payment API Latency Spike",
    "severity": "high",
    "description": "P99 latency exceeded 2000ms on payment-gateway.",
    "monitor_ids": ["mon_abc123"],
    "notify": true
  }'`}
      />
      <TerminalBlock
        title="json — response 201 Created"
        lang="json"
        code={`{
  "id": "inc_8402",
  "title": "Payment API Latency Spike",
  "severity": "high",
  "status": "investigating",
  "created_at": "2026-08-01T11:14:05.220Z",
  "alert_sent": true,
  "channels_notified": ["slack", "pagerduty", "email"]
}`}
      />

      <SectionHeading id="sdk-usage" level={2}>
        <Code2 className="w-4 h-4 opacity-60" />
        SDK Usage (TypeScript/Node.js)
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-3"
        style={{ color: "var(--lp-text-mid)" }}
      >
        Install the official UpNode SDK from npm for a type-safe experience:
      </p>
      <TerminalBlock
        title="shell — install sdk"
        lang="bash"
        code={`npm install @upnode/sdk`}
      />
      <TerminalBlock
        title="typescript — monitor a project"
        lang="typescript"
        code={`import { UpNodeClient } from "@upnode/sdk";

const upnode = new UpNodeClient({
  apiKey: process.env.UPNODE_API_KEY,
  projectId: process.env.UPNODE_PROJECT_ID,
});

// Send a heartbeat ping
await upnode.monitors.ping("mon_abc123", {
  status: "ok",
  latency_ms: performance.now(),
});

// Open an incident when a health check fails
await upnode.incidents.create({
  title: "DB Connection Pool Exhausted",
  severity: "critical",
  notify: true,
});`}
      />
      <InfoBox type="success">
        The SDK ships with full TypeScript types, automatic retry logic with
        exponential backoff, and built-in request telemetry.
      </InfoBox>
    </div>
  );
}

// ─── Configuring Alerts Section ───────────────────────────────────────────────────
function ConfiguringAlertsSection() {
  return (
    <div>
      <SectionHeading id="configuring-alerts" level={1}>
        Configuring Alerts
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-6"
        style={{ color: "var(--lp-text-mid)" }}
      >
        Alerts are the notification layer of UpNode. Configure where, when, and
        how your team gets paged when a monitor detects an issue.
      </p>

      <SectionHeading id="alert-channels" level={2}>
        <Bell className="w-4 h-4 opacity-60" />
        Alert Channels
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-4"
        style={{ color: "var(--lp-text-mid)" }}
      >
        Navigate to{" "}
        <strong style={{ color: "var(--lp-text-primary)" }}>
          Project → Settings → Alert Channels
        </strong>{" "}
        to configure notification destinations.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {[
          {
            name: "Slack",
            desc: "Post rich alert cards to any channel",
            badge: "webhook",
            color: "purple" as const,
          },
          {
            name: "PagerDuty",
            desc: "Trigger PagerDuty incidents & escalations",
            badge: "native",
            color: "red" as const,
          },
          {
            name: "Email",
            desc: "Send to individuals or distribution lists",
            badge: "smtp",
            color: "blue" as const,
          },
          {
            name: "Webhook",
            desc: "POST JSON payload to any URL",
            badge: "custom",
            color: "green" as const,
          },
          {
            name: "Microsoft Teams",
            desc: "Adaptive card alerts in your team channel",
            badge: "webhook",
            color: "purple" as const,
          },
          {
            name: "SMS / Twilio",
            desc: "Critical-only SMS for on-call engineers",
            badge: "api",
            color: "yellow" as const,
          },
        ].map((ch) => (
          <div
            key={ch.name}
            className="flex items-start gap-3 p-3.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid var(--lp-border)",
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "0.5px solid var(--lp-border)",
              }}
            >
              <Bell
                className="w-3.5 h-3.5"
                style={{ color: "var(--lp-text-mid)" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p
                  className="font-mono text-[12px] font-semibold"
                  style={{ color: "var(--lp-text-primary)" }}
                >
                  {ch.name}
                </p>
                <Badge color={ch.color}>{ch.badge}</Badge>
              </div>
              <p
                className="text-[11px]"
                style={{ color: "var(--lp-text-dim)" }}
              >
                {ch.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      <TerminalBlock
        title="shell — configure slack webhook"
        lang="bash"
        code={`curl -X POST https://api.upnode.io/v1/projects/proj_xyz/alert-channels \\
  --header "Authorization: Bearer $UPNODE_API_KEY" \\
  --header "Content-Type: application/json" \\
  --data '{
    "type": "slack",
    "name": "Engineering Alerts",
    "config": {
      "webhook_url": "https://hooks.slack.com/services/T00000/B00000/XXXXXX",
      "channel": "#incidents",
      "mention_on_critical": "@oncall"
    }
  }'`}
      />

      <SectionHeading id="alert-rules" level={2}>
        <Zap className="w-4 h-4 opacity-60" />
        Alert Rules & Thresholds
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-4"
        style={{ color: "var(--lp-text-mid)" }}
      >
        Alert rules define when a notification fires. Each rule is attached to a
        monitor and specifies a condition, threshold, and severity.
      </p>
      <div className="overflow-x-auto mb-5">
        <table
          className="w-full font-mono text-[11px]"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ borderBottom: "0.5px solid var(--lp-border)" }}>
              {["Condition", "Example Threshold", "Severity"].map((h) => (
                <th
                  key={h}
                  className="text-left py-2 px-3"
                  style={{ color: "var(--lp-text-faint)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["response_time_ms > X", "> 500ms", "warning", "blue"],
              ["response_time_ms > X", "> 2000ms", "critical", "red"],
              ["status_code != 200", "4xx / 5xx", "high", "yellow"],
              ["heartbeat_missed", "1 missed ping", "critical", "red"],
              ["ssl_expiry_days < X", "< 7 days", "high", "yellow"],
              ["uptime_pct < X", "< 99.9%", "warning", "blue"],
            ].map(([cond, val, sev, badgeColor], i) => (
              <tr
                key={i}
                style={{ borderBottom: "0.5px solid var(--lp-border)" }}
              >
                <td className="py-2.5 px-3" style={{ color: "#86efac" }}>
                  {cond}
                </td>
                <td
                  className="py-2.5 px-3"
                  style={{ color: "var(--lp-text-mid)" }}
                >
                  {val}
                </td>
                <td className="py-2.5 px-3">
                  <Badge color={badgeColor as "blue" | "red" | "yellow"}>
                    {sev}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TerminalBlock
        title="shell — create alert rule"
        lang="bash"
        code={`curl -X POST https://api.upnode.io/v1/monitors/mon_abc123/alert-rules \\
  --header "Authorization: Bearer $UPNODE_API_KEY" \\
  --header "Content-Type: application/json" \\
  --data '{
    "condition": "response_time_ms",
    "operator": "gt",
    "threshold": 2000,
    "severity": "critical",
    "channels": ["chan_slack_01", "chan_pagerduty_01"],
    "consecutive_failures": 2
  }'`}
      />

      <SectionHeading id="escalation-policy" level={2}>
        <ExternalLink className="w-4 h-4 opacity-60" />
        Escalation Policies
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-4"
        style={{ color: "var(--lp-text-mid)" }}
      >
        If an alert goes unacknowledged, escalation policies ensure the right
        person is reached.
      </p>
      <TerminalBlock
        title="json — escalation policy config"
        lang="json"
        code={`{
  "name": "On-Call Engineering Escalation",
  "steps": [
    {
      "delay_minutes": 0,
      "notify": ["user_alice@acme.com"],
      "channels": ["slack", "email"]
    },
    {
      "delay_minutes": 5,
      "notify": ["user_bob@acme.com"],
      "channels": ["pagerduty", "sms"]
    },
    {
      "delay_minutes": 15,
      "notify": ["user_manager@acme.com"],
      "channels": ["pagerduty", "email", "sms"]
    }
  ],
  "repeat_after_minutes": 30
}`}
      />

      <SectionHeading id="silence-windows" level={2}>
        <X className="w-4 h-4 opacity-60" />
        Silence Windows
      </SectionHeading>
      <p
        className="text-sm leading-relaxed mb-4"
        style={{ color: "var(--lp-text-mid)" }}
      >
        Silence Windows suppress alerts during scheduled maintenance. No
        incidents are created and no notifications are sent while a window is
        active.
      </p>
      <TerminalBlock
        title="shell — create silence window"
        lang="bash"
        code={`curl -X POST https://api.upnode.io/v1/projects/proj_xyz/silence-windows \\
  --header "Authorization: Bearer $UPNODE_API_KEY" \\
  --header "Content-Type: application/json" \\
  --data '{
    "name": "Weekly DB Maintenance",
    "start": "2026-08-03T02:00:00Z",
    "end": "2026-08-03T04:00:00Z",
    "recurrence": "weekly",
    "monitor_ids": ["mon_abc123", "mon_db_replica"]
  }'`}
      />
      <InfoBox type="success">
        Silence windows can be created up to 90 days in advance. Recurring
        windows support daily, weekly, and monthly cadences.
      </InfoBox>
    </div>
  );
}

// ─── Main Docs Page ───────────────────────────────────────────────────────────────
export default function DocsPage() {
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("getting-started");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<
    { id: string; label: string; parent: string }[]
  >([]);

  const allSubsections = SECTIONS.flatMap((s) =>
    s.subsections.map((sub) => ({ ...sub, parent: s.label })),
  );

  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const q = search.toLowerCase();
    setSearchResults(
      allSubsections.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.parent.toLowerCase().includes(q),
      ),
    );
  }, [search]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
      setMobileNavOpen(false);
      setSearch("");
      setSearchResults([]);
    }
  };

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
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen transition-colors"
      style={{ background: "var(--lp-bg)", color: "var(--lp-text-primary)" }}
    >
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <LandingNavbar />

      {/* Hero */}
      <div
        className="relative z-10 border-b"
        style={{ borderColor: "var(--lp-border)", background: "var(--lp-bg)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase mb-5"
            style={{
              background: "var(--lp-surface)",
              border: "0.5px solid var(--lp-border)",
              color: "var(--lp-text-dim)",
            }}
          >
            <span className="w-1 h-1 rounded-full bg-current inline-block" />
            Documentation
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{ color: "var(--lp-text-primary)" }}
          >
            Help Center
          </h1>
          <p
            className="text-sm leading-relaxed mb-8 max-w-2xl"
            style={{ color: "var(--lp-text-mid)" }}
          >
            Everything you need to integrate UpNode into your stack — from
            generating your first API key to configuring escalation policies.
          </p>

          {/* Search */}
          <div className="relative max-w-xl">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus-within:ring-1 focus-within:ring-blue-500/30"
              style={{
                background: "var(--lp-surface)",
                border: "0.5px solid var(--lp-border)",
                backdropFilter: "blur(20px)",
              }}
            >
              <Search
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "var(--lp-text-faint)" }}
              />
              <input
                id="docs-search"
                type="text"
                placeholder="Search documentation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none font-mono text-[12px] placeholder:opacity-40"
                style={{ color: "var(--lp-text-primary)" }}
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSearchResults([]);
                  }}
                  className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                >
                  <X
                    className="w-3 h-3"
                    style={{ color: "var(--lp-text-mid)" }}
                  />
                </button>
              )}
              <span
                className="hidden sm:flex font-mono text-[9px] tracking-widest px-1.5 py-1 rounded"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid var(--lp-border)",
                  color: "var(--lp-text-faint)",
                }}
              >
                ⌘K
              </span>
            </div>

            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 left-0 right-0 rounded-xl z-50 overflow-hidden py-1"
                  style={{ ...GLASS, boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}
                >
                  {searchResults.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => scrollTo(r.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all cursor-pointer hover:bg-white/5"
                    >
                      <Hash
                        className="w-3 h-3 flex-shrink-0"
                        style={{ color: "var(--lp-text-faint)" }}
                      />
                      <div>
                        <p
                          className="font-mono text-[11px]"
                          style={{ color: "var(--lp-text-primary)" }}
                        >
                          {r.label}
                        </p>
                        <p
                          className="font-mono text-[9px] tracking-widest uppercase"
                          style={{ color: "var(--lp-text-faint)" }}
                        >
                          {r.parent}
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Jump */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <span
              className="font-mono text-[9px] tracking-widest uppercase"
              style={{ color: "var(--lp-text-faint)" }}
            >
              Jump to
            </span>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] tracking-wider uppercase transition-all cursor-pointer hover:opacity-100 opacity-70"
                style={{
                  background: "var(--lp-surface)",
                  border: "0.5px solid var(--lp-border)",
                  color: "var(--lp-text-primary)",
                }}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              {SECTIONS.map((section) => (
                <div key={section.id} className="mb-6">
                  <button
                    onClick={() => scrollTo(section.id)}
                    className="w-full flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase font-semibold mb-2 cursor-pointer text-left transition-colors"
                    style={{
                      color:
                        activeSection === section.id ||
                        section.subsections.some((s) => s.id === activeSection)
                          ? "var(--lp-text-primary)"
                          : "var(--lp-text-faint)",
                    }}
                  >
                    {section.icon}
                    {section.label}
                  </button>
                  <div
                    className="space-y-0.5 pl-2 border-l"
                    style={{ borderColor: "var(--lp-border)" }}
                  >
                    {section.subsections.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => scrollTo(sub.id)}
                        className="w-full text-left px-3 py-1.5 font-mono text-[11px] transition-all cursor-pointer block"
                        style={{
                          color:
                            activeSection === sub.id
                              ? "var(--lp-text-primary)"
                              : "var(--lp-text-dim)",
                          background:
                            activeSection === sub.id
                              ? "rgba(255,255,255,0.06)"
                              : "transparent",
                          borderLeft:
                            activeSection === sub.id
                              ? "1px solid #60a5fa"
                              : "1px solid transparent",
                          marginLeft: "-1px",
                        }}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div
                className="mt-8 p-3.5 rounded-xl"
                style={{
                  background: "rgba(96,165,250,0.06)",
                  border: "0.5px solid rgba(96,165,250,0.2)",
                }}
              >
                <p
                  className="font-mono text-[10px] font-semibold mb-1"
                  style={{ color: "#93c5fd" }}
                >
                  Need Help?
                </p>
                <p
                  className="font-mono text-[10px] mb-3"
                  style={{ color: "var(--lp-text-dim)" }}
                >
                  Our support team responds in &lt; 2 hours.
                </p>
                <a
                  href="mailto:support@upnode.io"
                  className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase"
                  style={{ color: "#60a5fa" }}
                >
                  Contact Support <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* Mobile Nav FAB */}
          <div className="lg:hidden fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full font-mono text-[11px] font-semibold shadow-2xl cursor-pointer transition-all active:scale-95"
              style={{
                background: "var(--lp-cta-bg)",
                color: "var(--lp-cta-text)",
                border: "0.5px solid var(--lp-border-top)",
              }}
            >
              <Menu className="w-3.5 h-3.5" />
              Sections
            </button>
          </div>

          {/* Mobile Bottom Sheet */}
          <AnimatePresence>
            {mobileNavOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileNavOpen(false)}
                  className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                />
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 250 }}
                  className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto lg:hidden"
                  style={{
                    ...GLASS,
                    boxShadow: "0 -16px 40px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <p
                      className="font-mono text-[10px] tracking-widest uppercase"
                      style={{ color: "var(--lp-text-faint)" }}
                    >
                      Sections
                    </p>
                    <button
                      onClick={() => setMobileNavOpen(false)}
                      className="cursor-pointer opacity-60 hover:opacity-100"
                    >
                      <X
                        className="w-4 h-4"
                        style={{ color: "var(--lp-text-mid)" }}
                      />
                    </button>
                  </div>
                  {SECTIONS.map((section) => (
                    <div key={section.id} className="mb-5">
                      <p
                        className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase font-semibold mb-2"
                        style={{ color: "var(--lp-text-mid)" }}
                      >
                        {section.icon}
                        {section.label}
                      </p>
                      <div className="space-y-1 pl-3">
                        {section.subsections.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => scrollTo(sub.id)}
                            className="w-full text-left py-1.5 font-mono text-[12px] cursor-pointer transition-colors hover:opacity-100 opacity-70"
                            style={{ color: "var(--lp-text-primary)" }}
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

          {/* Main Content */}
          <main className="flex-1 min-w-0 max-w-3xl">
            {/* Breadcrumb */}
            <div
              className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase mb-8"
              style={{ color: "var(--lp-text-faint)" }}
            >
              <Link
                href="/"
                className="hover:opacity-100 transition-opacity opacity-60"
                style={{ color: "var(--lp-text-mid)" }}
              >
                UpNode
              </Link>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <span>Docs</span>
            </div>

            {/* Section Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12">
              {SECTIONS.map((s, i) => (
                <motion.button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                  className="text-left p-4 rounded-xl transition-all cursor-pointer group"
                  style={{ ...GLASS, borderRadius: "14px" }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center mb-3"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "0.5px solid var(--lp-border)",
                      color: "var(--lp-text-mid)",
                    }}
                  >
                    {s.icon}
                  </div>
                  <p
                    className="font-mono text-[12px] font-semibold mb-1 group-hover:text-blue-400 transition-colors"
                    style={{ color: "var(--lp-text-primary)" }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="font-mono text-[10px]"
                    style={{ color: "var(--lp-text-faint)" }}
                  >
                    {s.subsections.length} topics
                  </p>
                </motion.button>
              ))}
            </div>

            <div
              className="w-full h-px mb-12"
              style={{ background: "var(--lp-border)" }}
            />

            {/* Doc Content */}
            <div className="space-y-16">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <GettingStartedSection />
              </motion.section>
              <div
                className="w-full h-px"
                style={{ background: "var(--lp-border)" }}
              />
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <ApiIntegrationSection />
              </motion.section>
              <div
                className="w-full h-px"
                style={{ background: "var(--lp-border)" }}
              />
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <ConfiguringAlertsSection />
              </motion.section>
            </div>

            {/* Footer Nav */}
            <div
              className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8"
              style={{ borderTop: "0.5px solid var(--lp-border)" }}
            >
              <div>
                <p
                  className="font-mono text-[10px] tracking-widest uppercase mb-1"
                  style={{ color: "var(--lp-text-faint)" }}
                >
                  Need more help?
                </p>
                <a
                  href="mailto:support@upnode.io"
                  className="flex items-center gap-1.5 font-mono text-[12px] transition-opacity hover:opacity-80"
                  style={{ color: "#60a5fa" }}
                >
                  Contact support <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-[11px] font-semibold transition-all active:scale-95 cursor-pointer"
                style={{
                  background: "var(--lp-cta-bg)",
                  color: "var(--lp-cta-text)",
                  border: "0.5px solid var(--lp-border-top)",
                }}
              >
                Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </main>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
