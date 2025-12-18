import { NativeModules, Platform } from 'react-native';

type EnvManagerType = {
  getEnv(): Promise<string>;
  switchEnv(env: string): void;
  getBuildInfo(): Promise<{
    version: string;
    buildNumber: string;
    platform: string;
  }>;
};

const EnvManager: EnvManagerType = NativeModules.EnvManager;

if (__DEV__ && !EnvManager) {
  throw new Error('EnvManager native module is not linked');
}

export default EnvManager;