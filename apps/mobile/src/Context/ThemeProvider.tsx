import React from "react";
import { Provider } from "@react-native-material/core";
import { useTheme } from "../Hooks/theme";

export const ThemeProvider = ({ children }: {children: React.ReactNode}) => {
  const theme = useTheme();

  return <Provider theme={theme}>{children}</Provider>;
};
