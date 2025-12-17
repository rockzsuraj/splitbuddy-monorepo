import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

/**
 * GradientBackground: wraps children with a black & white diagonal gradient,
 * subtle dot texture using Svg overlay, and a centered frosted card.
 */
const GradientBackground: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <LinearGradient
      colors={['#0a0a0a', '#1e1e1e', '#f6f6f6', '#ffffff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Lightweight SVG dot texture overlay in top-left area (repeat-ish feel) */}
      <Svg
        width="120"
        height="120"
        style={styles.svgOverlay}
        viewBox="0 0 20 20"
      >
        {/* small dots with subtle opacity */}
        <Circle cx="2" cy="2" r="0.6" fill="#000" opacity="0.06" />
        <Circle cx="12" cy="12" r="0.6" fill="#fff" opacity="0.04" />
      </Svg>

      {/* Main content holder (frosted card look by semi-transparent bg) */}
      <View style={styles.card}>
        {children}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  svgOverlay: {
    position: 'absolute',
    left: -10,
    top: -10,
    opacity: 0.36,
    transform: [{ scale: 2 }],
  },
  card: {
    width: '100%',
    maxWidth: 560,
    padding: 20,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 10 },
    // shadowOpacity: 0.45,
    // shadowRadius: 25,
    elevation: 10,
  }
});

export default GradientBackground;