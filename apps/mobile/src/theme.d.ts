import '@react-native-material/core';
import { lightTokens, darkTokens } from '../Hooks/theme';

declare module '@react-native-material/core' {
  interface Theme {
    colors: typeof lightTokens | typeof darkTokens;
  }
}