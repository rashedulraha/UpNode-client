import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { cn } from "@/lib/utils";

const fontSans = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
});

const fontMono = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "UpNode - Infrastructure Monitoring & Alerting",
	description:
		"Modern production-ready uptime and incident management platform.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn(
				"h-full",
				"antialiased",
				fontSans.variable,
				fontMono.variable,
				"font-sans",
			)}
		>
			<body
				suppressHydrationWarning
				className="min-h-full flex flex-col bg-background text-foreground font-sans relative selection:bg-primary selection:text-primary-foreground"
			>
				{/* Subtle Apple SVG Noise Texture Overlay */}
				<div
					aria-hidden="true"
					className="fixed inset-0 pointer-events-none z-50 opacity-[0.035] mix-blend-overlay"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
					}}
				/>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
