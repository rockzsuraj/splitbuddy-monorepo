import React, { useContext, useEffect, useState } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import EnvManager  from '@/native/EnvManager';
import { AppContext } from '@/Context/AppProvider';

type Props = {
  onPress: () => void;
};

type BuildInfo = {
  version: string;
  buildNumber: string;
  isRelease: boolean;
};

type AppEnv = 'dev' | 'staging' | 'prod';

export default function DevBadge({ onPress }: Props) {
  const { appEnv, buildInfo } = useContext(AppContext);

  if (!buildInfo || buildInfo.isRelease) return null;
   if (!appEnv) return null;

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <Pressable
        style={[styles.badge, stylesByEnv[appEnv]]}
        onPress={onPress}
      >
        <Text style={styles.text}>
          {appEnv.toUpperCase()} • v{buildInfo.version} ({buildInfo.buildNumber})
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 16,
    right: 12,
    zIndex: 9999,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});

/**
 * Optional but VERY useful:
 * Color-code badge by env
 */
const stylesByEnv: Record<AppEnv, any> = {
  dev: {
    backgroundColor: 'rgba(46, 204, 113, 0.7)', // green
  },
  staging: {
    backgroundColor: 'rgba(241, 196, 15, 0.75)', // yellow
  },
  prod: {
    backgroundColor: 'rgba(231, 76, 60, 0.75)', // red
  },
};