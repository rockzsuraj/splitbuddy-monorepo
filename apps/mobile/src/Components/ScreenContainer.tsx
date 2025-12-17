import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../Hooks/theme';

interface ScreenContainerProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  isScroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>
}

const ScreenContainer = ({ children, style, isScroll, contentContainerStyle }: ScreenContainerProps) => {
  const schema = useTheme();
  const colors = schema?.colors;
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: colors.background,
      position: 'relative', // 👈 important for absolute children
    },
    contentContainerStyle: {
      flexGrow: 1,
      padding: 10,
      backgroundColor: colors.background,
    },
    viewContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  if (isScroll) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[contentContainerStyle, styles.contentContainerStyle]}
          style={[style, styles.container]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.viewContainer, style]}>
      <View style={styles.container}>
        {children}
      </View>
    </SafeAreaView>
  );
};



export default ScreenContainer;
