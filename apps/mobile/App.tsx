import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider } from './src/Context/AppProvider';
import AuthListener from './src/Context/AuthListener';
import AppNavigation from './src/Navigation';
import ThemedStatusBar from './src/Components/ThemedStatusBar';
import GroupProvider from './src/Context/GroupContext';
import apiClient, { initApiClient } from './src/api/apiClient';
import EnvManager from './src/native/EnvManager';
import DevBadge from './src/devtools/DevBadge';
import DevMenuModal from './src/devtools/DevMenu';
import { NativeModules } from 'react-native';

console.log('NativeModules.EnvManager:', NativeModules.EnvManager);

function App() {
  const [devMenuVisible, setDevMenuVisible] = useState(false);

  useEffect(() => {
    initApiClient().then(() => {
      console.log(
        'AXIOS BASE URL (AFTER INIT) =>',
        apiClient.defaults.baseURL
      );
    });
  }, []);

  useEffect(() => {
    EnvManager.getEnv().then(env => {
      console.log('ENV FROM NATIVE MODULE:', env);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ThemedStatusBar />
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left', 'bottom']}>
        <AppProvider>
          <AuthListener />
          <GroupProvider>
            <AppNavigation />
          </GroupProvider>
        </AppProvider>

        {__DEV__ && <DevBadge onPress={() => setDevMenuVisible(true)} />}
        {__DEV__ && (
          <DevMenuModal
            visible={devMenuVisible}
            onClose={() => setDevMenuVisible(false)}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;