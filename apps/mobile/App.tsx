import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider } from './src/Context/AppProvider';
import AuthListener from './src/Context/AuthListener';
import AppNavigation from './src/Navigation';
import ThemedStatusBar from './src/Components/ThemedStatusBar';
import GroupProvider from './src/Context/GroupContext';
import DevBadge from '@/devtools/DevBadge';
import DevMenuModal from '@/devtools/DevMenu';
import { apiClient, initApiClient } from '@/api/apiClient';
import { EnvManager } from '@/native/EnvManager';

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
    console.log('ENV FROM NATIVE (APP START) =>', env);
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

        {/* 👇 Floating Dev Badge */}
        {__DEV__ && (
          <DevBadge onPress={() => setDevMenuVisible(true)} />
        )}

        {/* 👇 Dev Menu Modal */}
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
  container: {
    flex: 1,
  },
});

export default App;