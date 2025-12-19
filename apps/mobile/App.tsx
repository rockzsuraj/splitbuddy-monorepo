import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider, AppContext } from './src/Context/AppProvider';
import AuthListener from './src/Context/AuthListener';
import AppNavigation from './src/Navigation';
import ThemedStatusBar from './src/Components/ThemedStatusBar';
import GroupProvider from './src/Context/GroupContext';
import DevBadge from './src/devtools/DevBadge';
import DevMenuModal from './src/devtools/DevMenu';
import { ErrorBoundary } from './src/devtools/ErrorBoundary';
import apiClient, { initApiClient } from './src/api/apiClient';
import './src/devtools/Logger'; // Initialize logger

function InnerApp() {
  const [devMenuVisible, setDevMenuVisible] = useState(false);
  const { buildInfo } = useContext(AppContext);

   useEffect(() => {
    initApiClient().then(() => {
      console.log(
        'AXIOS BASE URL (AFTER INIT) =>',
        apiClient.defaults.baseURL
      );
    });
  }, []);

  console.log('buildinfio', buildInfo);
  

  return (
    <ErrorBoundary>
      <AuthListener />
      <GroupProvider>
        <AppNavigation />
      </GroupProvider>

      {/* 🔴 Dev tools gated ONLY by buildInfo */}
      {!buildInfo?.isRelease && (
        <>
          <DevBadge onPress={() => setDevMenuVisible(true)} />
          <DevMenuModal
            visible={devMenuVisible}
            onClose={() => setDevMenuVisible(false)}
          />
        </>
      )}
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemedStatusBar />
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left', 'bottom']}>
        <AppProvider>
          <InnerApp />
        </AppProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});