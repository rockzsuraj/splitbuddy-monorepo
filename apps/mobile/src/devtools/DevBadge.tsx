import React, { useEffect, useState } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import EnvManager  from '@/native/EnvManager';

type Props = {
  onPress: () => void;
};

type BuildInfo = {
  version: string;
  buildNumber: string;
};

type AppEnv = 'dev' | 'staging' | 'prod';

export default function DevBadge({ onPress }: Props) {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const [env, setEnv] = useState<AppEnv | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      EnvManager.getBuildInfo(),
      EnvManager.getEnv(),
    ])
      .then(([build, currentEnv]) => {
        if (!mounted) return;
        setBuildInfo(build);
        setEnv(currentEnv);
      })
      .catch(err => {
        console.warn('DevBadge error', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!__DEV__ || !buildInfo || !env) return null;

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <Pressable
        style={[styles.badge, stylesByEnv[env]]}
        onPress={onPress}
      >
        <Text style={styles.text}>
          {env.toUpperCase()} • v{buildInfo.version} ({buildInfo.buildNumber})
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