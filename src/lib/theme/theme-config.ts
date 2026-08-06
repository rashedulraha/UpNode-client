export type ThemeMode = "light" | "developer";

export type DeveloperThemeId =
	| "obsidian"
	| "github-dark"
	| "nord"
	| "tokyo-night"
	| "one-dark";

export interface ThemeColors {
	background: string;
	foreground: string;
	card: string;
	cardForeground: string;
	popover: string;
	popoverForeground: string;
	primary: string;
	primaryForeground: string;
	secondary: string;
	secondaryForeground: string;
	muted: string;
	mutedForeground: string;
	accent: string;
	accentForeground: string;
	border: string;
	input: string;
	ring: string;
	sidebar: string;
	sidebarForeground: string;
	sidebarBorder: string;

	// Landing Page & Telemetry Specific Variables
	lpBg: string;
	lpBgAlt: string;
	lpSurface: string;
	lpSurfaceHover: string;
	lpBorder: string;
	lpBorderTop: string;
	lpTextPrimary: string;
	lpTextMid: string;
	lpTextDim: string;
	lpTextFaint: string;
	lpDot: string;
	lpScanLine: string;
	lpCtaBg: string;
	lpCtaText: string;
	lpNavBg: string;
	lpStroke: string;
}

export interface ThemeDefinition {
	id: DeveloperThemeId | "light";
	name: string;
	author: string;
	tag: string;
	isDark: boolean;
	colors: ThemeColors;
	palette: {
		bg: string;
		surface: string;
		primary: string;
		accent: string;
		border: string;
	};
}

export const LIGHT_THEME: ThemeDefinition = {
	id: "light",
	name: "Default Light",
	author: "UpNode Core",
	tag: "LIGHT // CLEAN_MINIMAL",
	isDark: false,
	colors: {
		background: "#f8fafc",
		foreground: "#0f172a",
		card: "#ffffff",
		cardForeground: "#0f172a",
		popover: "#ffffff",
		popoverForeground: "#0f172a",
		primary: "#0f172a",
		primaryForeground: "#ffffff",
		secondary: "#f1f5f9",
		secondaryForeground: "#0f172a",
		muted: "#f1f5f9",
		mutedForeground: "#64748b",
		accent: "#e2e8f0",
		accentForeground: "#0f172a",
		border: "#e2e8f0",
		input: "#e2e8f0",
		ring: "#0f172a",
		sidebar: "#ffffff",
		sidebarForeground: "#0f172a",
		sidebarBorder: "#e2e8f0",

		lpBg: "#f8fafc",
		lpBgAlt: "#f1f5f9",
		lpSurface: "rgba(255, 255, 255, 0.95)",
		lpSurfaceHover: "rgba(241, 245, 249, 0.85)",
		lpBorder: "#e2e8f0",
		lpBorderTop: "#cbd5e1",
		lpTextPrimary: "#0f172a",
		lpTextMid: "#475569",
		lpTextDim: "#64748b",
		lpTextFaint: "#94a3b8",
		lpDot: "#94a3b8",
		lpScanLine: "rgba(15, 23, 42, 0.08)",
		lpCtaBg: "#0f172a",
		lpCtaText: "#ffffff",
		lpNavBg: "rgba(255, 255, 255, 0.85)",
		lpStroke: "#cbd5e1",
	},
	palette: {
		bg: "#f8fafc",
		surface: "#ffffff",
		primary: "#0f172a",
		accent: "#64748b",
		border: "#e2e8f0",
	},
};

export const DEVELOPER_THEMES: Record<DeveloperThemeId, ThemeDefinition> = {
	obsidian: {
		id: "obsidian",
		name: "Obsidian Black & White",
		author: "UpNode Core",
		tag: "DEV // DEEP_BLACK_DEFAULT",
		isDark: true,
		palette: {
			bg: "#090a0f",
			surface: "#0f111a",
			primary: "#ffffff",
			accent: "#a3a3a3",
			border: "#1e2130",
		},
		colors: {
			background: "#090a0f",
			foreground: "#f8fafc",
			card: "#0f111a",
			cardForeground: "#f8fafc",
			popover: "#0f111a",
			popoverForeground: "#f8fafc",
			primary: "#ffffff",
			primaryForeground: "#090a0f",
			secondary: "#161824",
			secondaryForeground: "#ffffff",
			muted: "#161824",
			mutedForeground: "#808a9f",
			accent: "#1e2130",
			accentForeground: "#ffffff",
			border: "#1e2130",
			input: "#1e2130",
			ring: "#ffffff",
			sidebar: "#07080c",
			sidebarForeground: "#f8fafc",
			sidebarBorder: "#1e2130",

			lpBg: "#090a0f",
			lpBgAlt: "#0f111a",
			lpSurface: "rgba(15, 17, 26, 0.85)",
			lpSurfaceHover: "rgba(22, 24, 36, 0.9)",
			lpBorder: "#1e2130",
			lpBorderTop: "#2e334a",
			lpTextPrimary: "#ffffff",
			lpTextMid: "#a3a3a3",
			lpTextDim: "#737373",
			lpTextFaint: "#525252",
			lpDot: "#32384e",
			lpScanLine: "rgba(255, 255, 255, 0.05)",
			lpCtaBg: "#ffffff",
			lpCtaText: "#090a0f",
			lpNavBg: "rgba(9, 10, 15, 0.85)",
			lpStroke: "#2e334a",
		},
	},

	"github-dark": {
		id: "github-dark",
		name: "GitHub Deep Dark",
		author: "GitHub Inc.",
		tag: "DEV // OCTOCAT_DEEP_BLUE",
		isDark: true,
		palette: {
			bg: "#0d1117",
			surface: "#131720",
			primary: "#58a6ff",
			accent: "#8b949e",
			border: "#262c36",
		},
		colors: {
			background: "#0d1117",
			foreground: "#c9d1d9",
			card: "#131720",
			cardForeground: "#c9d1d9",
			popover: "#131720",
			popoverForeground: "#c9d1d9",
			primary: "#58a6ff",
			primaryForeground: "#0d1117",
			secondary: "#1c212a",
			secondaryForeground: "#c9d1d9",
			muted: "#1c212a",
			mutedForeground: "#8b949e",
			accent: "#262c36",
			accentForeground: "#c9d1d9",
			border: "#262c36",
			input: "#262c36",
			ring: "#58a6ff",
			sidebar: "#0b0e13",
			sidebarForeground: "#c9d1d9",
			sidebarBorder: "#262c36",

			lpBg: "#0d1117",
			lpBgAlt: "#0b0e13",
			lpSurface: "rgba(19, 23, 32, 0.9)",
			lpSurfaceHover: "rgba(28, 33, 42, 0.8)",
			lpBorder: "#262c36",
			lpBorderTop: "#58a6ff",
			lpTextPrimary: "#c9d1d9",
			lpTextMid: "#58a6ff",
			lpTextDim: "#8b949e",
			lpTextFaint: "#262c36",
			lpDot: "#262c36",
			lpScanLine: "rgba(88, 166, 255, 0.08)",
			lpCtaBg: "#58a6ff",
			lpCtaText: "#0d1117",
			lpNavBg: "rgba(13, 17, 23, 0.9)",
			lpStroke: "#58a6ff",
		},
	},

	nord: {
		id: "nord",
		name: "Nord Deep Frost",
		author: "Arctic Ice Studio",
		tag: "DEV // ARCTIC_DEEP_FROST",
		isDark: true,
		palette: {
			bg: "#242933",
			surface: "#2b303c",
			primary: "#88c0d0",
			accent: "#81a1c1",
			border: "#3e4556",
		},
		colors: {
			background: "#242933",
			foreground: "#eceff4",
			card: "#2b303c",
			cardForeground: "#eceff4",
			popover: "#2b303c",
			popoverForeground: "#eceff4",
			primary: "#88c0d0",
			primaryForeground: "#242933",
			secondary: "#343a49",
			secondaryForeground: "#eceff4",
			muted: "#343a49",
			mutedForeground: "#9aa5b8",
			accent: "#3e4556",
			accentForeground: "#eceff4",
			border: "#3e4556",
			input: "#3e4556",
			ring: "#88c0d0",
			sidebar: "#1f232c",
			sidebarForeground: "#eceff4",
			sidebarBorder: "#3e4556",

			lpBg: "#242933",
			lpBgAlt: "#1f232c",
			lpSurface: "rgba(43, 48, 60, 0.9)",
			lpSurfaceHover: "rgba(52, 58, 73, 0.8)",
			lpBorder: "#3e4556",
			lpBorderTop: "#81a1c1",
			lpTextPrimary: "#eceff4",
			lpTextMid: "#88c0d0",
			lpTextDim: "#9aa5b8",
			lpTextFaint: "#3e4556",
			lpDot: "#3e4556",
			lpScanLine: "rgba(136, 192, 208, 0.08)",
			lpCtaBg: "#88c0d0",
			lpCtaText: "#242933",
			lpNavBg: "rgba(36, 41, 51, 0.9)",
			lpStroke: "#81a1c1",
		},
	},

	"tokyo-night": {
		id: "tokyo-night",
		name: "Tokyo Night Storm",
		author: "folke",
		tag: "DEV // TOKYO_DEEP_NIGHT",
		isDark: true,
		palette: {
			bg: "#161622",
			surface: "#1f202e",
			primary: "#7aa2f7",
			accent: "#7dcfff",
			border: "#343750",
		},
		colors: {
			background: "#161622",
			foreground: "#c0caf5",
			card: "#1f202e",
			cardForeground: "#c0caf5",
			popover: "#1f202e",
			popoverForeground: "#c0caf5",
			primary: "#7aa2f7",
			primaryForeground: "#161622",
			secondary: "#282a3d",
			secondaryForeground: "#c0caf5",
			muted: "#282a3d",
			mutedForeground: "#7a82ac",
			accent: "#343750",
			accentForeground: "#c0caf5",
			border: "#343750",
			input: "#343750",
			ring: "#7aa2f7",
			sidebar: "#12121c",
			sidebarForeground: "#c0caf5",
			sidebarBorder: "#343750",

			lpBg: "#161622",
			lpBgAlt: "#12121c",
			lpSurface: "rgba(31, 32, 46, 0.9)",
			lpSurfaceHover: "rgba(40, 42, 61, 0.8)",
			lpBorder: "#343750",
			lpBorderTop: "#7aa2f7",
			lpTextPrimary: "#c0caf5",
			lpTextMid: "#7aa2f7",
			lpTextDim: "#7a82ac",
			lpTextFaint: "#343750",
			lpDot: "#343750",
			lpScanLine: "rgba(122, 162, 247, 0.08)",
			lpCtaBg: "#7aa2f7",
			lpCtaText: "#161622",
			lpNavBg: "rgba(22, 22, 34, 0.9)",
			lpStroke: "#7aa2f7",
		},
	},

	"one-dark": {
		id: "one-dark",
		name: "One Dark Deep Pro",
		author: "Atom / GitHub",
		tag: "DEV // ATOM_DEEP_SYNTAX",
		isDark: true,
		palette: {
			bg: "#1e222b",
			surface: "#232731",
			primary: "#61afef",
			accent: "#7f889b",
			border: "#323846",
		},
		colors: {
			background: "#1e222b",
			foreground: "#abb2bf",
			card: "#232731",
			cardForeground: "#abb2bf",
			popover: "#232731",
			popoverForeground: "#abb2bf",
			primary: "#61afef",
			primaryForeground: "#1e222b",
			secondary: "#2a2e39",
			secondaryForeground: "#abb2bf",
			muted: "#2a2e39",
			mutedForeground: "#7f889b",
			accent: "#323846",
			accentForeground: "#abb2bf",
			border: "#323846",
			input: "#323846",
			ring: "#61afef",
			sidebar: "#191c24",
			sidebarForeground: "#abb2bf",
			sidebarBorder: "#323846",

			lpBg: "#1e222b",
			lpBgAlt: "#191c24",
			lpSurface: "rgba(35, 39, 49, 0.9)",
			lpSurfaceHover: "rgba(42, 46, 57, 0.8)",
			lpBorder: "#323846",
			lpBorderTop: "#61afef",
			lpTextPrimary: "#abb2bf",
			lpTextMid: "#61afef",
			lpTextDim: "#7f889b",
			lpTextFaint: "#323846",
			lpDot: "#323846",
			lpScanLine: "rgba(97, 175, 239, 0.08)",
			lpCtaBg: "#61afef",
			lpCtaText: "#1e222b",
			lpNavBg: "rgba(30, 34, 43, 0.9)",
			lpStroke: "#61afef",
		},
	},
};

export const DEVELOPER_THEME_LIST = Object.values(DEVELOPER_THEMES);
