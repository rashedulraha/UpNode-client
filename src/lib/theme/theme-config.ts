export type ThemeMode = "light" | "developer";

export type DeveloperThemeId =
  | "dracula"
  | "nord"
  | "tokyo-night"
  | "one-dark"
  | "github-dark"
  | "material-dark"
  | "catppuccin"
  | "gruvbox"
  | "monokai"
  | "solarized-dark";

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
  tag: "LIGHT // CLEAN",
  isDark: false,
  colors: {
    background: "#f8fafc",
    foreground: "#0f172a",
    card: "#ffffff",
    cardForeground: "#0f172a",
    popover: "#ffffff",
    popoverForeground: "#0f172a",
    primary: "#2563eb",
    primaryForeground: "#ffffff",
    secondary: "#f1f5f9",
    secondaryForeground: "#0f172a",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    accent: "#e2e8f0",
    accentForeground: "#0f172a",
    border: "#e2e8f0",
    input: "#e2e8f0",
    ring: "#2563eb",

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
    primary: "#2563eb",
    accent: "#64748b",
    border: "#e2e8f0",
  },
};

export const DEVELOPER_THEMES: Record<DeveloperThemeId, ThemeDefinition> = {
  dracula: {
    id: "dracula",
    name: "Dracula",
    author: "Zeno Rocha",
    tag: "DEV // GOTHIC_VAMPIRE",
    isDark: true,
    palette: {
      bg: "#282a36",
      surface: "#44475a",
      primary: "#ff79c6",
      accent: "#8be9fd",
      border: "#6272a4",
    },
    colors: {
      background: "#282a36",
      foreground: "#f8f8f2",
      card: "#21222c",
      cardForeground: "#f8f8f2",
      popover: "#21222c",
      popoverForeground: "#f8f8f2",
      primary: "#ff79c6",
      primaryForeground: "#282a36",
      secondary: "#44475a",
      secondaryForeground: "#f8f8f2",
      muted: "#44475a",
      mutedForeground: "#6272a4",
      accent: "#bd93f9",
      accentForeground: "#282a36",
      border: "#44475a",
      input: "#44475a",
      ring: "#ff79c6",

      lpBg: "#282a36",
      lpBgAlt: "#21222c",
      lpSurface: "rgba(33, 34, 44, 0.9)",
      lpSurfaceHover: "rgba(68, 71, 90, 0.8)",
      lpBorder: "#44475a",
      lpBorderTop: "#6272a4",
      lpTextPrimary: "#f8f8f2",
      lpTextMid: "#8be9fd",
      lpTextDim: "#6272a4",
      lpTextFaint: "#50fa7b",
      lpDot: "#6272a4",
      lpScanLine: "rgba(255, 121, 198, 0.08)",
      lpCtaBg: "#ff79c6",
      lpCtaText: "#282a36",
      lpNavBg: "rgba(40, 42, 54, 0.9)",
      lpStroke: "#6272a4",
    },
  },

  nord: {
    id: "nord",
    name: "Nord Frost",
    author: "Arctic Ice Studio",
    tag: "DEV // ARCTIC_ICE",
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
      accent: "#81a1c1",
      accentForeground: "#2e3440",
      border: "#4c566a",
      input: "#4c566a",
      ring: "#88c0d0",

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
    name: "Tokyo Night",
    author: "folke",
    tag: "DEV // NEON_CYBERPUNK",
    isDark: true,
    palette: {
      bg: "#1a1b26",
      surface: "#24283b",
      primary: "#7aa2f7",
      accent: "#bb9af7",
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
      accent: "#bb9af7",
      accentForeground: "#1a1b26",
      border: "#414868",
      input: "#414868",
      ring: "#7aa2f7",

      lpBg: "#1a1b26",
      lpBgAlt: "#16161e",
      lpSurface: "rgba(36, 40, 59, 0.9)",
      lpSurfaceHover: "rgba(41, 46, 66, 0.8)",
      lpBorder: "#414868",
      lpBorderTop: "#7aa2f7",
      lpTextPrimary: "#c0caf5",
      lpTextMid: "#bb9af7",
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
    name: "One Dark Pro",
    author: "Atom / GitHub",
    tag: "DEV // ATOM_SYNTAX",
    isDark: true,
    palette: {
      bg: "#282c34",
      surface: "#3e4451",
      primary: "#61afef",
      accent: "#c678dd",
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
      accent: "#c678dd",
      accentForeground: "#282c34",
      border: "#4b5263",
      input: "#4b5263",
      ring: "#61afef",

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

  "github-dark": {
    id: "github-dark",
    name: "GitHub Dark",
    author: "GitHub Inc.",
    tag: "DEV // OCTOCAT_DARK",
    isDark: true,
    palette: {
      bg: "#0d1117",
      surface: "#161b22",
      primary: "#58a6ff",
      accent: "#bc8cff",
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
      accent: "#bc8cff",
      accentForeground: "#0d1117",
      border: "#30363d",
      input: "#30363d",
      ring: "#58a6ff",

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

  "material-dark": {
    id: "material-dark",
    name: "Material Ocean",
    author: "Google Material",
    tag: "DEV // MATERIAL_DESIGN",
    isDark: true,
    palette: {
      bg: "#121212",
      surface: "#1e1e1e",
      primary: "#80deea",
      accent: "#bb86fc",
      border: "#333333",
    },
    colors: {
      background: "#121212",
      foreground: "#e0e0e0",
      card: "#1e1e1e",
      cardForeground: "#e0e0e0",
      popover: "#1e1e1e",
      popoverForeground: "#e0e0e0",
      primary: "#80deea",
      primaryForeground: "#121212",
      secondary: "#2c2c2c",
      secondaryForeground: "#e0e0e0",
      muted: "#2c2c2c",
      mutedForeground: "#9e9e9e",
      accent: "#bb86fc",
      accentForeground: "#121212",
      border: "#333333",
      input: "#333333",
      ring: "#80deea",

      lpBg: "#121212",
      lpBgAlt: "#0a0a0a",
      lpSurface: "rgba(30, 30, 30, 0.9)",
      lpSurfaceHover: "rgba(44, 44, 44, 0.8)",
      lpBorder: "#333333",
      lpBorderTop: "#80deea",
      lpTextPrimary: "#e0e0e0",
      lpTextMid: "#80deea",
      lpTextDim: "#9e9e9e",
      lpTextFaint: "#424242",
      lpDot: "#424242",
      lpScanLine: "rgba(128, 222, 234, 0.08)",
      lpCtaBg: "#80deea",
      lpCtaText: "#121212",
      lpNavBg: "rgba(18, 18, 18, 0.9)",
      lpStroke: "#80deea",
    },
  },

  catppuccin: {
    id: "catppuccin",
    name: "Catppuccin Mocha",
    author: "Catppuccin Org",
    tag: "DEV // PASTEL_PAWS",
    isDark: true,
    palette: {
      bg: "#1e1e2e",
      surface: "#313244",
      primary: "#89b4fa",
      accent: "#cba6f7",
      border: "#45475a",
    },
    colors: {
      background: "#1e1e2e",
      foreground: "#cdd6f4",
      card: "#181825",
      cardForeground: "#cdd6f4",
      popover: "#181825",
      popoverForeground: "#cdd6f4",
      primary: "#89b4fa",
      primaryForeground: "#1e1e2e",
      secondary: "#313244",
      secondaryForeground: "#cdd6f4",
      muted: "#313244",
      mutedForeground: "#9399b2",
      accent: "#cba6f7",
      accentForeground: "#1e1e2e",
      border: "#45475a",
      input: "#45475a",
      ring: "#89b4fa",

      lpBg: "#1e1e2e",
      lpBgAlt: "#181825",
      lpSurface: "rgba(24, 24, 37, 0.9)",
      lpSurfaceHover: "rgba(49, 50, 68, 0.8)",
      lpBorder: "#45475a",
      lpBorderTop: "#89b4fa",
      lpTextPrimary: "#cdd6f4",
      lpTextMid: "#89b4fa",
      lpTextDim: "#9399b2",
      lpTextFaint: "#45475a",
      lpDot: "#45475a",
      lpScanLine: "rgba(137, 180, 250, 0.08)",
      lpCtaBg: "#89b4fa",
      lpCtaText: "#1e1e2e",
      lpNavBg: "rgba(30, 30, 46, 0.9)",
      lpStroke: "#89b4fa",
    },
  },

  gruvbox: {
    id: "gruvbox",
    name: "Gruvbox Dark",
    author: "Pavel Pertsev",
    tag: "DEV // RETRO_GROOVY",
    isDark: true,
    palette: {
      bg: "#282828",
      surface: "#3c3836",
      primary: "#83a598",
      accent: "#d3869b",
      border: "#504945",
    },
    colors: {
      background: "#282828",
      foreground: "#ebdbb2",
      card: "#1d2021",
      cardForeground: "#ebdbb2",
      popover: "#1d2021",
      popoverForeground: "#ebdbb2",
      primary: "#83a598",
      primaryForeground: "#282828",
      secondary: "#3c3836",
      secondaryForeground: "#ebdbb2",
      muted: "#3c3836",
      mutedForeground: "#a89984",
      accent: "#d3869b",
      accentForeground: "#282828",
      border: "#504945",
      input: "#504945",
      ring: "#83a598",

      lpBg: "#282828",
      lpBgAlt: "#1d2021",
      lpSurface: "rgba(29, 32, 33, 0.9)",
      lpSurfaceHover: "rgba(60, 56, 54, 0.8)",
      lpBorder: "#504945",
      lpBorderTop: "#83a598",
      lpTextPrimary: "#ebdbb2",
      lpTextMid: "#83a598",
      lpTextDim: "#a89984",
      lpTextFaint: "#504945",
      lpDot: "#504945",
      lpScanLine: "rgba(131, 165, 152, 0.08)",
      lpCtaBg: "#83a598",
      lpCtaText: "#282828",
      lpNavBg: "rgba(40, 40, 40, 0.9)",
      lpStroke: "#83a598",
    },
  },

  monokai: {
    id: "monokai",
    name: "Monokai Pro",
    author: "Wimer Hazenberg",
    tag: "DEV // HIGH_CONTRAST",
    isDark: true,
    palette: {
      bg: "#2d2a2e",
      surface: "#403e41",
      primary: "#78dce8",
      accent: "#ff6188",
      border: "#5b595c",
    },
    colors: {
      background: "#2d2a2e",
      foreground: "#fcfcfa",
      card: "#221f22",
      cardForeground: "#fcfcfa",
      popover: "#221f22",
      popoverForeground: "#fcfcfa",
      primary: "#78dce8",
      primaryForeground: "#2d2a2e",
      secondary: "#403e41",
      secondaryForeground: "#fcfcfa",
      muted: "#403e41",
      mutedForeground: "#939293",
      accent: "#ff6188",
      accentForeground: "#2d2a2e",
      border: "#5b595c",
      input: "#5b595c",
      ring: "#78dce8",

      lpBg: "#2d2a2e",
      lpBgAlt: "#221f22",
      lpSurface: "rgba(34, 31, 34, 0.9)",
      lpSurfaceHover: "rgba(64, 62, 65, 0.8)",
      lpBorder: "#5b595c",
      lpBorderTop: "#78dce8",
      lpTextPrimary: "#fcfcfa",
      lpTextMid: "#78dce8",
      lpTextDim: "#939293",
      lpTextFaint: "#5b595c",
      lpDot: "#5b595c",
      lpScanLine: "rgba(120, 220, 232, 0.08)",
      lpCtaBg: "#78dce8",
      lpCtaText: "#2d2a2e",
      lpNavBg: "rgba(45, 42, 46, 0.9)",
      lpStroke: "#78dce8",
    },
  },

  "solarized-dark": {
    id: "solarized-dark",
    name: "Solarized Dark",
    author: "Ethan Schoonover",
    tag: "DEV // SOLAR_CYAN",
    isDark: true,
    palette: {
      bg: "#002b36",
      surface: "#073642",
      primary: "#268bd2",
      accent: "#2aa198",
      border: "#586e75",
    },
    colors: {
      background: "#002b36",
      foreground: "#839496",
      card: "#073642",
      cardForeground: "#93a1a1",
      popover: "#073642",
      popoverForeground: "#93a1a1",
      primary: "#268bd2",
      primaryForeground: "#002b36",
      secondary: "#073642",
      secondaryForeground: "#839496",
      muted: "#073642",
      mutedForeground: "#657b83",
      accent: "#2aa198",
      accentForeground: "#002b36",
      border: "#586e75",
      input: "#586e75",
      ring: "#268bd2",

      lpBg: "#002b36",
      lpBgAlt: "#00212b",
      lpSurface: "rgba(7, 54, 66, 0.9)",
      lpSurfaceHover: "rgba(10, 68, 83, 0.8)",
      lpBorder: "#586e75",
      lpBorderTop: "#268bd2",
      lpTextPrimary: "#93a1a1",
      lpTextMid: "#268bd2",
      lpTextDim: "#657b83",
      lpTextFaint: "#586e75",
      lpDot: "#586e75",
      lpScanLine: "rgba(38, 139, 210, 0.08)",
      lpCtaBg: "#268bd2",
      lpCtaText: "#002b36",
      lpNavBg: "rgba(0, 43, 54, 0.9)",
      lpStroke: "#268bd2",
    },
  },
};

export const DEVELOPER_THEME_LIST = Object.values(DEVELOPER_THEMES);
