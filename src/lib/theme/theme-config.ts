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
			bg: "#08090d",
			surface: "#121520",
			primary: "#ffffff",
			accent: "#a3a3a3",
			border: "#23283b",
		},
		colors: {
			background: "#08090d",
			foreground: "#f8fafc",
			card: "#121520",
			cardForeground: "#f8fafc",
			popover: "#121520",
			popoverForeground: "#f8fafc",
			primary: "#ffffff",
			primaryForeground: "#08090d",
			secondary: "#191d2c",
			secondaryForeground: "#ffffff",
			muted: "#191d2c",
			mutedForeground: "#8a95ab",
			accent: "#23283b",
			accentForeground: "#ffffff",
			border: "#23283b",
			input: "#23283b",
			ring: "#ffffff",
			sidebar: "#090b12",
			sidebarForeground: "#f8fafc",
			sidebarBorder: "#23283b",

			lpBg: "#08090d",
			lpBgAlt: "#121520",
			lpSurface: "rgba(18, 21, 32, 0.75)",
			lpSurfaceHover: "rgba(25, 29, 44, 0.85)",
			lpBorder: "#23283b",
			lpBorderTop: "#353d5a",
			lpTextPrimary: "#ffffff",
			lpTextMid: "#a3a3a3",
			lpTextDim: "#737373",
			lpTextFaint: "#525252",
			lpDot: "#32384e",
			lpScanLine: "rgba(255, 255, 255, 0.05)",
			lpCtaBg: "#ffffff",
			lpCtaText: "#08090d",
			lpNavBg: "rgba(8, 9, 13, 0.85)",
			lpStroke: "#353d5a",
		},
	},

	"github-dark": {
		id: "github-dark",
		name: "GitHub Deep Dark",
		author: "GitHub Inc.",
		tag: "DEV // OCTOCAT_DEEP_BLUE",
		isDark: true,
		palette: {
			bg: "#0c1017",
			surface: "#161b26",
			primary: "#58a6ff",
			accent: "#8b949e",
			border: "#2b3240",
		},
		colors: {
			background: "#0c1017",
			foreground: "#c9d1d9",
			card: "#161b26",
			cardForeground: "#c9d1d9",
			popover: "#161b26",
			popoverForeground: "#c9d1d9",
			primary: "#58a6ff",
			primaryForeground: "#0c1017",
			secondary: "#1f2635",
			secondaryForeground: "#c9d1d9",
			muted: "#1f2635",
			mutedForeground: "#8b949e",
			accent: "#2b3240",
			accentForeground: "#c9d1d9",
			border: "#2b3240",
			input: "#2b3240",
			ring: "#58a6ff",
			sidebar: "#0b0e13",
			sidebarForeground: "#c9d1d9",
			sidebarBorder: "#2b3240",

			lpBg: "#0c1017",
			lpBgAlt: "#0b0e13",
			lpSurface: "rgba(22, 27, 38, 0.75)",
			lpSurfaceHover: "rgba(31, 38, 53, 0.85)",
			lpBorder: "#2b3240",
			lpBorderTop: "#58a6ff",
			lpTextPrimary: "#c9d1d9",
			lpTextMid: "#58a6ff",
			lpTextDim: "#8b949e",
			lpTextFaint: "#2b3240",
			lpDot: "#2b3240",
			lpScanLine: "rgba(88, 166, 255, 0.08)",
			lpCtaBg: "#58a6ff",
			lpCtaText: "#0c1017",
			lpNavBg: "rgba(12, 16, 23, 0.85)",
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
			bg: "#202530",
			surface: "#2d3342",
			primary: "#88c0d0",
			accent: "#81a1c1",
			border: "#424b5e",
		},
		colors: {
			background: "#202530",
			foreground: "#eceff4",
			card: "#2d3342",
			cardForeground: "#eceff4",
			popover: "#2d3342",
			popoverForeground: "#eceff4",
			primary: "#88c0d0",
			primaryForeground: "#202530",
			secondary: "#373e50",
			secondaryForeground: "#eceff4",
			muted: "#373e50",
			mutedForeground: "#9aa5b8",
			accent: "#424b5e",
			accentForeground: "#eceff4",
			border: "#424b5e",
			input: "#424b5e",
			ring: "#88c0d0",
			sidebar: "#1c202a",
			sidebarForeground: "#eceff4",
			sidebarBorder: "#424b5e",

			lpBg: "#202530",
			lpBgAlt: "#1c202a",
			lpSurface: "rgba(45, 51, 66, 0.75)",
			lpSurfaceHover: "rgba(55, 62, 80, 0.85)",
			lpBorder: "#424b5e",
			lpBorderTop: "#81a1c1",
			lpTextPrimary: "#eceff4",
			lpTextMid: "#88c0d0",
			lpTextDim: "#9aa5b8",
			lpTextFaint: "#424b5e",
			lpDot: "#424b5e",
			lpScanLine: "rgba(136, 192, 208, 0.08)",
			lpCtaBg: "#88c0d0",
			lpCtaText: "#202530",
			lpNavBg: "rgba(32, 37, 48, 0.85)",
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
			bg: "#141420",
			surface: "#212334",
			primary: "#7aa2f7",
			accent: "#7dcfff",
			border: "#373a56",
		},
		colors: {
			background: "#141420",
			foreground: "#c0caf5",
			card: "#212334",
			cardForeground: "#c0caf5",
			popover: "#212334",
			popoverForeground: "#c0caf5",
			primary: "#7aa2f7",
			primaryForeground: "#141420",
			secondary: "#2c2f45",
			secondaryForeground: "#c0caf5",
			muted: "#2c2f45",
			mutedForeground: "#7a82ac",
			accent: "#373a56",
			accentForeground: "#c0caf5",
			border: "#373a56",
			input: "#373a56",
			ring: "#7aa2f7",
			sidebar: "#11111a",
			sidebarForeground: "#c0caf5",
			sidebarBorder: "#373a56",

			lpBg: "#141420",
			lpBgAlt: "#11111a",
			lpSurface: "rgba(33, 35, 52, 0.75)",
			lpSurfaceHover: "rgba(44, 47, 69, 0.85)",
			lpBorder: "#373a56",
			lpBorderTop: "#7aa2f7",
			lpTextPrimary: "#c0caf5",
			lpTextMid: "#7aa2f7",
			lpTextDim: "#7a82ac",
			lpTextFaint: "#373a56",
			lpDot: "#373a56",
			lpScanLine: "rgba(122, 162, 247, 0.08)",
			lpCtaBg: "#7aa2f7",
			lpCtaText: "#141420",
			lpNavBg: "rgba(20, 20, 32, 0.85)",
			lpStroke: "#7aa2f7",
		},
	},

	"one-dark": {
		id: "one-dark",
		name: "One Dark Deep Pro",
		author: "Binaryify",
		tag: "DEV // ATOM_ONE_DARK",
		isDark: true,
		palette: {
			bg: "#1f222a",
			surface: "#2a2e38",
			primary: "#69aef0",
			accent: "#c678dd",
			border: "#3f4554",
		},
		colors: {
			background: "#1f222a",
			foreground: "#abb2bf",
			card: "#2a2e38",
			cardForeground: "#abb2bf",
			popover: "#2a2e38",
			popoverForeground: "#abb2bf",
			primary: "#69aef0",
			primaryForeground: "#1f222a",
			secondary: "#333845",
			secondaryForeground: "#abb2bf",
			muted: "#333845",
			mutedForeground: "#7f848e",
			accent: "#3f4554",
			accentForeground: "#abb2bf",
			border: "#3f4554",
			input: "#3f4554",
			ring: "#69aef0",
			sidebar: "#1b1d24",
			sidebarForeground: "#abb2bf",
			sidebarBorder: "#3f4554",

			lpBg: "#1f222a",
			lpBgAlt: "#1b1d24",
			lpSurface: "rgba(42, 46, 56, 0.75)",
			lpSurfaceHover: "rgba(51, 56, 69, 0.85)",
			lpBorder: "#3f4554",
			lpBorderTop: "#69aef0",
			lpTextPrimary: "#abb2bf",
			lpTextMid: "#69aef0",
			lpTextDim: "#7f848e",
			lpTextFaint: "#3f4554",
			lpDot: "#3f4554",
			lpScanLine: "rgba(105, 174, 240, 0.08)",
			lpCtaBg: "#69aef0",
			lpCtaText: "#1f222a",
			lpNavBg: "rgba(31, 34, 42, 0.85)",
			lpStroke: "#69aef0",
		},
	},
};

export const DEVELOPER_THEME_LIST = Object.values(DEVELOPER_THEMES);
