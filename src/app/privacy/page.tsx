import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { ShieldCheck, Lock, Eye, Server, FileText, ArrowLeft, Terminal } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-sans flex flex-col relative selection:bg-slate-800">
      {/* Background Noise Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Fully Responsive Theme Navbar */}
      <LandingNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 space-y-8 relative z-10 font-mono">
        {/* Title Header */}
        <div className="space-y-3 border-b border-slate-200 dark:border-neutral-800 pb-8">
          <div className="flex items-center justify-between gap-4">
            <span className="px-2.5 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
              [SECURITY_&amp;_PRIVACY_COMPLIANCE] // LAST_UPDATED: 2026-08-01
            </span>
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-1 uppercase"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>[BACK_TO_HOME]</span>
            </Link>
          </div>

          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 dark:text-white uppercase">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
            This Privacy Policy details how UpNode Inc. collects, processes, encrypts, and protects your telemetry diagnostic data, server uptime metrics, and account credentials.
          </p>
        </div>

        {/* Quick Highlights Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mb-2" />
            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">[END_TO_END_ENCRYPTION]</p>
            <p className="text-[11px] text-slate-500 dark:text-neutral-500 leading-normal">
              All telemetry metrics and API keys are encrypted at rest with AES-256-GCM.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
            <Lock className="w-4 h-4 text-blue-500 mb-2" />
            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">[NO_DATA_MONETIZATION]</p>
            <p className="text-[11px] text-slate-500 dark:text-neutral-500 leading-normal">
              We never sell or monetize your diagnostic telemetry metrics or user email lists.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
            <Server className="w-4 h-4 text-amber-500 mb-2" />
            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">[SOC2_READY_RETENTION]</p>
            <p className="text-[11px] text-slate-500 dark:text-neutral-500 leading-normal">
              Telemetry logs auto-purge according to your plan retention schedule.
            </p>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 text-xs leading-relaxed text-slate-700 dark:text-neutral-300">
          {/* Section 01 */}
          <div className="p-6 bg-white/70 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-[9px] font-bold text-slate-800 dark:text-neutral-200">
                [01_DATA_COLLECTION]
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase">
                Information We Collect
              </h2>
            </div>
            <p>
              When you register an account or monitor services with UpNode, we collect essential operational data required to deliver real-time uptime monitoring and incident alerting:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-neutral-400 pl-2">
              <li><strong className="text-slate-900 dark:text-white">Account Information:</strong> Name, work email address, hashed passwords, and organization team memberships.</li>
              <li><strong className="text-slate-900 dark:text-white">Monitoring Telemetry:</strong> Target ping URLs, response latency measurements (ms), HTTP status codes, and SSL certificate metadata.</li>
              <li><strong className="text-slate-900 dark:text-white">Alert Dispatch Hooks:</strong> Slack webhook URLs and email notification preferences configured in Integration Settings.</li>
            </ul>
          </div>

          {/* Section 02 */}
          <div className="p-6 bg-white/70 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-[9px] font-bold text-slate-800 dark:text-neutral-200">
                [02_TELEMETRY_STORAGE]
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase">
                How We Use Your Telemetry Data
              </h2>
            </div>
            <p>
              Your telemetry metrics are processed strictly for uptime health monitoring, generating diagnostic stream graphs, detecting downtime incidents, and dispatching real-time alerts. We do not inspect payload contents beyond standard HTTP status headers and response latency timing.
            </p>
          </div>

          {/* Section 03 */}
          <div className="p-6 bg-white/70 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-[9px] font-bold text-slate-800 dark:text-neutral-200">
                [03_ENCRYPTION_SAFETY]
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase">
                Data Protection &amp; Security Measures
              </h2>
            </div>
            <p>
              Security is our core priority. All connections to UpNode endpoints are secured over TLS 1.3 encryption in transit. Secrets, session tokens, and webhook URLs are stored using industry-standard AES-256 encryption. We regularly conduct automated vulnerability scans and security audits.
            </p>
          </div>

          {/* Section 04 */}
          <div className="p-6 bg-white/70 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-[9px] font-bold text-slate-800 dark:text-neutral-200">
                [04_DATA_RETENTION]
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase">
                Retention &amp; Account Deletion
              </h2>
            </div>
            <p>
              Telemetry stream metrics are retained based on your active subscription plan (e.g. 30 days for Free tier, 365 days for Pro/Enterprise). You may request full account and organization telemetry data deletion at any time through our support team or account settings.
            </p>
          </div>

          {/* Section 05 */}
          <div className="p-6 bg-white/70 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-[9px] font-bold text-slate-800 dark:text-neutral-200">
                [05_CONTACT_US]
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase">
                Privacy Enquiries &amp; Support
              </h2>
            </div>
            <p>
              If you have any questions regarding this Privacy Policy or wish to exercise data privacy rights, please reach out to our security engineering team at <a href="mailto:privacy@upnode.io" className="text-slate-900 dark:text-white underline font-bold">privacy@upnode.io</a>.
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
