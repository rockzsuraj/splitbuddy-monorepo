// ThemedStatusBar.tsx
import React, { useContext } from 'react';
import { StatusBar } from 'react-native';
import { AppContext } from '../Context/AppProvider';
import { useTheme } from '../Hooks/theme';

const ThemedStatusBar = () => {
  const { state } = useContext(AppContext);
  const theme = useTheme();
  const isDark = state.theme === 'dark';

  return (
    <StatusBar backgroundColor={theme.colors.background} barStyle={isDark ? "light-content" : "dark-content"} />
  );
};

export default ThemedStatusBar;
