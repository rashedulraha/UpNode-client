import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
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
						<span className="px-2.5 py-0.5 border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
							[TERMS_OF_SERVICE_AGREEMENT] // EFFECTIVE: 2026-08-01
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
						Terms of Service
					</h1>
					<p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
						Please read these Terms of Service carefully before accessing or
						using the UpNode infrastructure uptime monitoring platform.
					</p>
				</div>

				{/* Overview Banner */}
				<div className="p-4 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 flex items-start gap-3">
					<Scale className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
					<div className="space-y-1 text-xs">
						<p className="font-bold text-slate-900 dark:text-white uppercase">
							[SERVICE_CONTRACT_SUMMARY]
						</p>
						<p className="text-slate-600 dark:text-neutral-400 text-[11px] leading-relaxed">
							By creating an account or subscribing to UpNode services, you
							agree to comply with our uptime monitoring service policies, fair
							usage ping limits, and SLA commitments outlined below.
						</p>
					</div>
				</div>

				{/* Terms Content Sections */}
				<div className="space-y-8 text-xs leading-relaxed text-slate-700 dark:text-neutral-300">
					{/* Section 01 */}
					<div className="p-6 bg-white/70 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 space-y-3">
						<div className="flex items-center gap-2">
							<span className="px-2 py-0.5 bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-[9px] font-bold text-slate-800 dark:text-neutral-200">
								[01_SERVICE_PROVISION]
							</span>
							<h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase">
								1. Acceptance &amp; Service Provision
							</h2>
						</div>
						<p>
							UpNode provides cloud infrastructure monitoring, automated HTTP
							ping health checks, latency tracking, and incident notification
							alerts. We grant you a non-exclusive, non-transferable license to
							access our platform according to your chosen plan tier.
						</p>
					</div>

					{/* Section 02 */}
					<div className="p-6 bg-white/70 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 space-y-3">
						<div className="flex items-center gap-2">
							<span className="px-2 py-0.5 bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-[9px] font-bold text-slate-800 dark:text-neutral-200">
								[02_ACCEPTABLE_USE]
							</span>
							<h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase">
								2. Acceptable Use &amp; Target Monitoring
							</h2>
						</div>
						<p>
							You agree to monitor only servers, endpoints, websites, or
							services for which you are the rightful owner or have explicit
							authorization to ping. You must not use UpNode to perform Denial
							of Service (DoS) attacks, unauthorized network probing, or
							malicious exploitation.
						</p>
					</div>

					{/* Section 03 */}
					<div className="p-6 bg-white/70 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 space-y-3">
						<div className="flex items-center gap-2">
							<span className="px-2 py-0.5 bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-[9px] font-bold text-slate-800 dark:text-neutral-200">
								[03_ACCOUNT_IAM_ROLES]
							</span>
							<h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase">
								3. User Accounts &amp; IAM Security
							</h2>
						</div>
						<p>
							You are responsible for maintaining the confidentiality of your
							account credentials and managing team member roles (ADMIN,
							ENGINEER, VIEWER) within your Organization. UpNode is not liable
							for unauthorized access resulting from compromised user
							credentials.
						</p>
					</div>

					{/* Section 04 */}
					<div className="p-6 bg-white/70 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 space-y-3">
						<div className="flex items-center gap-2">
							<span className="px-2 py-0.5 bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-[9px] font-bold text-slate-800 dark:text-neutral-200">
								[04_SLA_LIMITATION]
							</span>
							<h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase">
								4. Service Availability &amp; Liability Disclaimer
							</h2>
						</div>
						<p>
							While UpNode strives for 99.999% platform availability, service
							uptime monitoring is provided "as is". UpNode shall not be held
							liable for indirect, incidental, or consequential damages
							resulting from network latency, missed incident notifications, or
							downstream service outages.
						</p>
					</div>

					{/* Section 05 */}
					<div className="p-6 bg-white/70 dark:bg-black/60 border border-slate-200 dark:border-neutral-800 space-y-3">
						<div className="flex items-center gap-2">
							<span className="px-2 py-0.5 bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-[9px] font-bold text-slate-800 dark:text-neutral-200">
								[05_TERMINATION]
							</span>
							<h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase">
								5. Termination &amp; Contact
							</h2>
						</div>
						<p>
							We reserve the right to suspend or terminate accounts that violate
							these Terms. If you have any inquiries regarding these terms,
							please contact our legal team at{" "}
							<a
								href="mailto:legal@upnode.io"
								className="text-slate-900 dark:text-white underline font-bold"
							>
								legal@upnode.io
							</a>
							.
						</p>
					</div>
				</div>
			</main>

			<LandingFooter />
		</div>
	);
}
