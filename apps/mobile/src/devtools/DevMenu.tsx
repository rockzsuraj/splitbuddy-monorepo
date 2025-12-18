import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import  EnvManager  from '@/native/EnvManager';
import EncryptedStorage from 'react-native-encrypted-storage';
import { DEV_ENCRYPTED_KEYS } from '@/devtools/devEncryptedKeys';
import { DevSettings } from 'react-native';


type Props = {
  visible: boolean;
  onClose: () => void;
};

type BuildInfo = {
    version: string;
    buildNumber: string;
    platform: string;
    isRelease: boolean;
  }

type AppEnv = 'dev' | 'staging' | 'prod';

export default function DevMenuModal({ visible, onClose }: Props) {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const [env, setEnv] = useState<AppEnv | null>(null);

  const [showSecrets, setShowSecrets] = useState(false);
  const [secretData, setSecretData] = useState<
    Record<string, { value: string; sensitive: boolean }>
  >({});

useEffect(() => {
  if (!visible || !__DEV__) return;

  Promise.all([
    EnvManager.getBuildInfo(),  // ✅ Promise resolves
    EnvManager.getEnv(),        // ✅ Promise resolves
  ]).then(([build, currentEnv]) => {
    setBuildInfo(build);
    setEnv(currentEnv);
  });
}, [visible]);
  /* -------------------- ENV SWITCH -------------------- */

  const switchEnv = (nextEnv: AppEnv) => {
    console.log('nextEnv', nextEnv);
    console.log('env', env);
    
    
    if (nextEnv === env) return;
    EnvManager.switchEnv(nextEnv);
    DevSettings.reload();
  };

  const confirmProdSwitch = () => {
    Alert.alert(
      '⚠️ Switch to PRODUCTION',
      'This will log you out and connect to LIVE production servers.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch to PROD',
          style: 'destructive',
          onPress: () => switchEnv('prod'),
        },
      ],
    );
  };

  /* -------------------- SECURE STORAGE -------------------- */

  const loadEncryptedStorage = async () => {
    const map: Record<string, { value: string; sensitive: boolean }> = {};

    for (const item of DEV_ENCRYPTED_KEYS) {
      try {
        const value = await EncryptedStorage.getItem(item.key);
        if (value != null) {
          map[item.label] = {
            value,
            sensitive: item.sensitive,
          };
        }
      } catch {
        // ignore
      }
    }

    setSecretData(map);
    setShowSecrets(true);
  };

  if (!buildInfo || buildInfo?.isRelease) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* ---------- Header ---------- */}
          <Text style={styles.title}>Developer Menu</Text>

          {/* ---------- Env Status ---------- */}
          <View style={styles.envRow}>
            <Text style={styles.label}>Current Environment</Text>
            <View style={[styles.envPill, envStyles[env ?? 'dev']]}>
              <Text style={styles.envText}>
                {env?.toUpperCase() ?? '—'}
              </Text>
            </View>
          </View>

          {/* ---------- Build Info ---------- */}
          <View style={styles.buildBox}>
            <Text style={styles.buildText}>
              Version {buildInfo?.version ?? '—'}
            </Text>
            <Text style={styles.buildText}>
              Build {buildInfo?.buildNumber ?? '—'}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* ---------- Env Switch ---------- */}
          <Text style={styles.section}>Switch Environment</Text>

          <Pressable
            style={[
              styles.envButton,
              env === 'dev' && styles.envButtonActive,
            ]}
            disabled={env === 'dev'}
            onPress={() => switchEnv('dev')}
          >
            <Text style={styles.envButtonText}>DEV</Text>
          </Pressable>

          <Pressable
            style={[
              styles.envButton,
              env === 'staging' && styles.envButtonActive,
            ]}
            disabled={env === 'staging'}
            onPress={() => switchEnv('staging')}
          >
            <Text style={styles.envButtonText}>STAGING</Text>
          </Pressable>

          <Pressable
            style={styles.prodButton}
            onPress={confirmProdSwitch}
          >
            <Text style={styles.prodText}>PRODUCTION</Text>
          </Pressable>

          <View style={styles.divider} />

          {/* ---------- Storage Inspectors ---------- */}
          <Text style={styles.section}>Storage Inspectors</Text>

          <Pressable
            style={styles.envButton}
            onPress={loadEncryptedStorage}
          >
            <Text style={styles.envButtonText}>
              View Secure Storage
            </Text>
          </Pressable>

          {showSecrets && (
            <>
              <View style={styles.divider} />
              <Text style={styles.section}>Encrypted Storage</Text>

              <ScrollView style={{ maxHeight: 220 }}>
                {Object.entries(secretData).map(
                  ([label, { value, sensitive }]) => (
                    <View key={label} style={styles.kvRow}>
                      <Text style={styles.kvKey}>{label}</Text>
                      <Text style={styles.kvValue}>
                        {sensitive
                          ? value.slice(0, 12) + '••••••'
                          : value}
                      </Text>
                    </View>
                  ),
                )}
              </ScrollView>

              <Pressable
                onPress={() => setShowSecrets(false)}
                style={styles.closeInline}
              >
                <Text style={styles.closeText}>Hide</Text>
              </Pressable>
            </>
          )}

          {/* ---------- Footer ---------- */}
          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  envRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  envPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  envText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  buildBox: {
    marginTop: 12,
  },
  buildText: {
    fontSize: 13,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  section: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  envButton: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    alignItems: 'center',
  },
  envButtonActive: {
    backgroundColor: '#d1e7dd',
  },
  envButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
  prodButton: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fdecea',
    alignItems: 'center',
  },
  prodText: {
    color: '#d32f2f',
    fontWeight: '800',
  },
  kvRow: {
    marginBottom: 12,
  },
  kvKey: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  kvValue: {
    fontSize: 11,
    color: '#555',
  },
  closeInline: {
    marginTop: 8,
    alignItems: 'center',
  },
  close: {
    marginTop: 16,
    alignItems: 'center',
  },
  closeText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

const envStyles: Record<AppEnv, any> = {
  dev: { backgroundColor: '#2ecc71' },
  staging: { backgroundColor: '#f1c40f' },
  prod: { backgroundColor: '#e74c3c' },
};