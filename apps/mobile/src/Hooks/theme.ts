import { useColorScheme } from "react-native";
import { defaultTheme, Theme as CoreTheme } from "@react-native-material/core";

// your custom color tokens
export const lightTokens = {
  // background: "#f7f7f7",
  secondaryBackGround: "#E1D9D1",
  // card: "#E1D9D1",
  // text: "#1c1f21",
  secondaryText: "#a7a8ac",
  highlightedText: "#1c1f21",
  secondaryButton: "#f2b794",
  primaryCard: "#83a9b1",
  secondaryCard: "#cec7da",
  // notification: "#fe6a55",
  button: "#bfb4f9",
  // border: "#E5E5EA",
  // Base
  background: "#F7F8FA",
  surface: "#FFFFFF",
  surfaceVariant: "#F1F1F4",

  // Text
  text: "#1C1F21",
  textSecondary: "#6F737A",
  textMuted: "#A4A7AB",

  // Cards
  card: "#FFFFFF",
  cardSoft: "#E6F0F3",
  elevationShadow: "rgba(0,0,0,0.06)",

  // Borders
  border: "#E3E4E8",
  borderSoft: "#F1F2F4",

  // Brand Colors
  primary: "#4C82FB",     // modern blue accent
  primarySoft: "#E7EEFF",

  secondary: "#83A9B1",
  secondarySoft: "#E4EEF0",

  accent: "#BFB4F9",
  accentSoft: "#EFEAFC",

  // Finance Colors
  success: "#2ECC71",     // You get
  successSoft: "#E7F9EE",

  danger: "#FF6B6B",      // You owe
  dangerSoft: "#FFECEE",

  warning: "#FFBA49",
  warningSoft: "#FFF4DD",

  info: "#50C7F7",
  infoSoft: "#E7F7FF",

  // Buttons
  buttonPrimary: "#4C82FB",
  buttonSecondary: "#F2B794",

  // Special UI
  notification: "#FE6A55",
  highlight: "#FFF4D2",

  // Extras
  black: "#000000",
  white: "#FFFFFF",

} as const;

export const darkTokens = {
  background: "#0f1113",
  secondaryBackGround: "#202427",
  // card: "#1C1C1E",
  // text: "#fcfcfc",
  secondaryText: "#9a9fa5",
  highlightedText: "#fcfcfc",
  secondaryButton: "#f2b794",
  primaryCard: "#83a9b1",
  secondaryCard: "#cec7da",
  // notification: "#fe6a55",
  button: "#bfb4f9",
  // border: "#3A3A3C",
  // black: "#000000",
  // Text
  text: "#FFFFFF",
  textSecondary: "#B3B7BD",
  textMuted: "#7D8185",

  // Cards
  card: "#1C1C1E",
  cardSoft: "#2A2E31",
  elevationShadow: "rgba(0,0,0,0.35)",

  // Borders
  border: "#34383C",
  borderSoft: "#2A2D30",

  // Brand Colors
  primary: "#6D9AFD",
  primarySoft: "#2A3A58",

  secondary: "#8FBAC2",
  secondarySoft: "#2C3A3D",

  accent: "#BFB4F9",
  accentSoft: "#3A355A",

  // Finance Colors
  success: "#5EDA91",
  successSoft: "#22372B",

  danger: "#FF6B6B",
  dangerSoft: "#3B1F1F",

  warning: "#FFBA49",
  warningSoft: "#3B331F",

  info: "#50C7F7",
  infoSoft: "#1F3A44",

  // Buttons
  buttonPrimary: "#6D9AFD",
  buttonSecondary: "#F2B794",

  // Special UI
  notification: "#FE6A55",
  highlight: "#3A2B18",

  // Extras
  black: "#000000",
  white: "#FFFFFF",
} as const;

type ColorTokens = typeof lightTokens | typeof darkTokens;

export type AppTheme = Omit<CoreTheme, "colors"> & {
  colors: ColorTokens;
};

// helper to build a full Material theme
const createAppTheme = (scheme: "light" | "dark" | null): AppTheme => {
  const isDark = scheme === "dark";

  const tokens = isDark ? darkTokens : lightTokens;

  return {
    ...defaultTheme,
    colorScheme: isDark ? "dark" : "light",
    // tweak palette if you want
    palette: {
      ...defaultTheme.palette,
      primary: {
        ...defaultTheme.palette.primary,
        main: "#007AFF", // your primary color
      },
    },
    // keep library colors, but merge your own tokens in
    colors: {
      ...defaultTheme.colors,
      ...tokens,
    },
  };
};

// ⚠️ rename to avoid confusion with lib's useTheme
export const useTheme = (): AppTheme => {
  const scheme = useColorScheme();
  if (scheme) {
     return createAppTheme(scheme); 
  }
  return createAppTheme("dark");
};
