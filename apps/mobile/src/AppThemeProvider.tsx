import React from "react";
import { Provider as MaterialProvider, Theme } from "@react-native-material/core";
import { View } from "react-native";
import { useTheme } from "./Hooks/theme";

interface Props {
  children?: React.ReactNode;
}

export default function AppThemeProvider({ children }: Props) {
  const custom = useTheme();

const materialTheme: Theme = {
  palette: {
    primary: {
      main: custom.colors.primary,
      on: custom.colors.highlightedText,
    },
    secondary: {
      main: custom.colors.secondaryButton,
      on: custom.colors.text,
    },
    surface: {
      main: custom.colors.card,
      on: custom.colors.text,
    },
    background: {
      main: custom.colors.background,
      on: custom.colors.text,
    },
    error: {
      main: custom.colors.notification,
      on: "#ffffff",
    },
    text: {
      primary: custom.colors.text,
      secondary: custom.colors.secondaryText,
    },
  },
};

  return (
    <>
      {/* Provider must NOT wrap children directly */}
      <MaterialProvider theme={materialTheme} />

      {/* Now wrap your app manually */}
      <View style={{ flex: 1, backgroundColor: custom.colors.background }}>
        {children}
      </View>
    </>
  );
}