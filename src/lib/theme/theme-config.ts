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
      bg: "#000000",
      surface: "#0a0a0a",
      primary: "#ffffff",
      accent: "#a3a3a3",
      border: "#262626",
    },
    colors: {
      background: "#000000",
      foreground: "#ffffff",
      card: "#0a0a0a",
      cardForeground: "#ffffff",
      popover: "#0a0a0a",
      popoverForeground: "#ffffff",
      primary: "#ffffff",
      primaryForeground: "#000000",
      secondary: "#171717",
      secondaryForeground: "#ffffff",
      muted: "#171717",
      mutedForeground: "#a3a3a3",
      accent: "#262626",
      accentForeground: "#ffffff",
      border: "#262626",
      input: "#262626",
      ring: "#ffffff",
      sidebar: "#050505",
      sidebarForeground: "#ffffff",
      sidebarBorder: "#262626",

      lpBg: "#000000",
      lpBgAlt: "#0a0a0a",
      lpSurface: "rgba(23, 23, 23, 0.85)",
      lpSurfaceHover: "rgba(38, 38, 38, 0.9)",
      lpBorder: "#262626",
      lpBorderTop: "#404040",
      lpTextPrimary: "#ffffff",
      lpTextMid: "#a3a3a3",
      lpTextDim: "#737373",
      lpTextFaint: "#525252",
      lpDot: "#525252",
      lpScanLine: "rgba(255, 255, 255, 0.08)",
      lpCtaBg: "#ffffff",
      lpCtaText: "#000000",
      lpNavBg: "rgba(0, 0, 0, 0.85)",
      lpStroke: "#404040",
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
      surface: "#161b22",
      primary: "#58a6ff",
      accent: "#8b949e",
      border: "#30363d",
    },
    colors: {
      background: "#0d1117",
      foreground: "#c9d1d9",
      card: "#161b22",
      cardForeground: "#c9d1d9",
      popover: "#161b22",
      popoverForeground: "#c9d1d9",
      primary: "#58a6ff",
      primaryForeground: "#0d1117",
      secondary: "#21262d",
      secondaryForeground: "#c9d1d9",
      muted: "#21262d",
      mutedForeground: "#8b949e",
      accent: "#30363d",
      accentForeground: "#c9d1d9",
      border: "#30363d",
      input: "#30363d",
      ring: "#58a6ff",
      sidebar: "#0d1117",
      sidebarForeground: "#c9d1d9",
      sidebarBorder: "#30363d",

      lpBg: "#0d1117",
      lpBgAlt: "#010409",
      lpSurface: "rgba(22, 27, 34, 0.9)",
      lpSurfaceHover: "rgba(33, 38, 45, 0.8)",
      lpBorder: "#30363d",
      lpBorderTop: "#58a6ff",
      lpTextPrimary: "#c9d1d9",
      lpTextMid: "#58a6ff",
      lpTextDim: "#8b949e",
      lpTextFaint: "#30363d",
      lpDot: "#30363d",
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
      bg: "#2e3440",
      surface: "#3b4252",
      primary: "#88c0d0",
      accent: "#81a1c1",
      border: "#4c566a",
    },
    colors: {
      background: "#2e3440",
      foreground: "#eceff4",
      card: "#3b4252",
      cardForeground: "#eceff4",
      popover: "#3b4252",
      popoverForeground: "#eceff4",
      primary: "#88c0d0",
      primaryForeground: "#2e3440",
      secondary: "#434c5e",
      secondaryForeground: "#eceff4",
      muted: "#434c5e",
      mutedForeground: "#d8dee9",
      accent: "#4c566a",
      accentForeground: "#eceff4",
      border: "#4c566a",
      input: "#4c566a",
      ring: "#88c0d0",
      sidebar: "#272c36",
      sidebarForeground: "#eceff4",
      sidebarBorder: "#4c566a",

      lpBg: "#2e3440",
      lpBgAlt: "#272c36",
      lpSurface: "rgba(59, 66, 82, 0.9)",
      lpSurfaceHover: "rgba(67, 76, 94, 0.8)",
      lpBorder: "#4c566a",
      lpBorderTop: "#81a1c1",
      lpTextPrimary: "#eceff4",
      lpTextMid: "#88c0d0",
      lpTextDim: "#d8dee9",
      lpTextFaint: "#4c566a",
      lpDot: "#4c566a",
      lpScanLine: "rgba(136, 192, 208, 0.08)",
      lpCtaBg: "#88c0d0",
      lpCtaText: "#2e3440",
      lpNavBg: "rgba(46, 52, 64, 0.9)",
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
      bg: "#1a1b26",
      surface: "#24283b",
      primary: "#7aa2f7",
      accent: "#7dcfff",
      border: "#414868",
    },
    colors: {
      background: "#1a1b26",
      foreground: "#c0caf5",
      card: "#24283b",
      cardForeground: "#c0caf5",
      popover: "#24283b",
      popoverForeground: "#c0caf5",
      primary: "#7aa2f7",
      primaryForeground: "#1a1b26",
      secondary: "#292e42",
      secondaryForeground: "#c0caf5",
      muted: "#292e42",
      mutedForeground: "#787c99",
      accent: "#414868",
      accentForeground: "#c0caf5",
      border: "#414868",
      input: "#414868",
      ring: "#7aa2f7",
      sidebar: "#16161e",
      sidebarForeground: "#c0caf5",
      sidebarBorder: "#414868",

      lpBg: "#1a1b26",
      lpBgAlt: "#16161e",
      lpSurface: "rgba(36, 40, 59, 0.9)",
      lpSurfaceHover: "rgba(41, 46, 66, 0.8)",
      lpBorder: "#414868",
      lpBorderTop: "#7aa2f7",
      lpTextPrimary: "#c0caf5",
      lpTextMid: "#7aa2f7",
      lpTextDim: "#787c99",
      lpTextFaint: "#414868",
      lpDot: "#414868",
      lpScanLine: "rgba(122, 162, 247, 0.08)",
      lpCtaBg: "#7aa2f7",
      lpCtaText: "#1a1b26",
      lpNavBg: "rgba(26, 27, 38, 0.9)",
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
      bg: "#282c34",
      surface: "#3e4451",
      primary: "#61afef",
      accent: "#5c6370",
      border: "#4b5263",
    },
    colors: {
      background: "#282c34",
      foreground: "#abb2bf",
      card: "#21252b",
      cardForeground: "#abb2bf",
      popover: "#21252b",
      popoverForeground: "#abb2bf",
      primary: "#61afef",
      primaryForeground: "#282c34",
      secondary: "#3e4451",
      secondaryForeground: "#abb2bf",
      muted: "#3e4451",
      mutedForeground: "#5c6370",
      accent: "#4b5263",
      accentForeground: "#abb2bf",
      border: "#4b5263",
      input: "#4b5263",
      ring: "#61afef",
      sidebar: "#1e2227",
      sidebarForeground: "#abb2bf",
      sidebarBorder: "#4b5263",

      lpBg: "#282c34",
      lpBgAlt: "#21252b",
      lpSurface: "rgba(33, 37, 43, 0.9)",
      lpSurfaceHover: "rgba(62, 68, 81, 0.8)",
      lpBorder: "#4b5263",
      lpBorderTop: "#61afef",
      lpTextPrimary: "#abb2bf",
      lpTextMid: "#61afef",
      lpTextDim: "#5c6370",
      lpTextFaint: "#4b5263",
      lpDot: "#4b5263",
      lpScanLine: "rgba(97, 175, 239, 0.08)",
      lpCtaBg: "#61afef",
      lpCtaText: "#282c34",
      lpNavBg: "rgba(40, 44, 52, 0.9)",
      lpStroke: "#61afef",
    },
  },
};

export const DEVELOPER_THEME_LIST = Object.values(DEVELOPER_THEMES);
