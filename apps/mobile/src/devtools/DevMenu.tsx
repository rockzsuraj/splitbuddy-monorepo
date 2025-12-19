import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { DEV_ENCRYPTED_KEYS } from '@/devtools/devEncryptedKeys';
import { AppContext } from '@/Context/AppProvider';
import LogViewer from './LogViewer';

type Props = {
  visible: boolean;
  onClose: () => void;
};

type AppEnv = 'dev' | 'staging' | 'prod';

export default function DevMenuModal({ visible, onClose }: Props) {
  const { appEnv, buildInfo, setAppEnv } = useContext(AppContext);
  const [showSecrets, setShowSecrets] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [secretData, setSecretData] = useState<
    Record<string, { value: string; sensitive: boolean }>
  >({});

  // 🔴 Hide in release builds
  if (!buildInfo || buildInfo.isRelease) return null;

  const switchEnv = (nextEnv: AppEnv) => {
    if (nextEnv === appEnv) return;

    setAppEnv(nextEnv);
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

  const loadEncryptedStorage = async () => {
    const map: Record<string, { value: string; sensitive: boolean }> = {};

    for (const item of DEV_ENCRYPTED_KEYS) {
      const value = await EncryptedStorage.getItem(item.key);
      if (value != null) {
        map[item.label] = {
          value,
          sensitive: item.sensitive,
        };
      }
    }

    setSecretData(map);
    setShowSecrets(true);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Developer Menu</Text>

          {/* ENV STATUS */}
          <View style={styles.envRow}>
            <Text style={styles.label}>Current Environment</Text>
            <View style={[styles.envPill, envStyles[appEnv ?? 'dev']]}>
              <Text style={styles.envText}>
                {appEnv?.toUpperCase() ?? '—'}
              </Text>
            </View>
          </View>

          {/* BUILD INFO */}
          <View style={styles.buildBox}>
            <Text style={styles.buildText}>
              Version {buildInfo.version}
            </Text>
            <Text style={styles.buildText}>
              Build {buildInfo.buildNumber}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.section}>Switch Environment</Text>

          <Pressable
            style={[styles.envButton, appEnv === 'dev' && styles.envButtonActive]}
            disabled={appEnv === 'dev'}
            onPress={() => switchEnv('dev')}
          >
            <Text>DEV</Text>
          </Pressable>

          <Pressable
            style={[styles.envButton, appEnv === 'staging' && styles.envButtonActive]}
            disabled={appEnv === 'staging'}
            onPress={() => switchEnv('staging')}
          >
            <Text>STAGING</Text>
          </Pressable>

          <Pressable style={styles.prodButton} onPress={confirmProdSwitch}>
            <Text style={styles.prodText}>PRODUCTION</Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.envButton} onPress={loadEncryptedStorage}>
            <Text>View Secure Storage</Text>
          </Pressable>

          <Pressable style={styles.logButton} onPress={() => setShowLogs(true)}>
            <Text style={styles.logButtonText}>📋 View Debug Logs</Text>
          </Pressable>

          {showSecrets && (
            <ScrollView style={{ maxHeight: 220 }}>
              {Object.entries(secretData).map(([k, v]) => (
                <Text key={k}>
                  {k}: {v.sensitive ? v.value.slice(0, 8) + '••••' : v.value}
                </Text>
              ))}
            </ScrollView>
          )}
          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
      
      <LogViewer 
        visible={showLogs} 
        onClose={() => setShowLogs(false)} 
      />
    </Modal>
  );
}

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
  logButton: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#e3f2fd',
    marginBottom: 10,
    alignItems: 'center',
  },
  logButtonText: {
    color: '#1976d2',
    fontWeight: '700',
  },
});

const envStyles: Record<AppEnv, any> = {
  dev: { backgroundColor: '#2ecc71' },
  staging: { backgroundColor: '#f1c40f' },
  prod: { backgroundColor: '#e74c3c' },
};