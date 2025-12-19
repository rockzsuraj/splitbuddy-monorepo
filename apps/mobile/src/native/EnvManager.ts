import { NativeModules, Platform } from 'react-native';

type BuildInfo = {
  version: string;
  buildNumber: string;
  platform: string;
  isRelease: boolean;
};

type EnvManagerType = {
  getEnv(): Promise<'dev' | 'staging' | 'prod'>;
  switchEnv(env: 'dev' | 'staging' | 'prod'): void;
  getBuildInfo(): Promise<BuildInfo>;
  restartApp(): void;
};

const NativeEnvManager = NativeModules.EnvManager;

function assertLinked() {
  if (!NativeEnvManager) {
    throw new Error(
      `[EnvManager] Native module is not linked on ${Platform.OS}. ` +
      `Make sure you rebuilt the app after adding the native module.`
    );
  }
}

const EnvManager: EnvManagerType = {
  async getEnv() {
    assertLinked();
    return NativeEnvManager.getEnv();
  },

  switchEnv(env) {
    assertLinked();
    NativeEnvManager.switchEnv(env);
  },

  restartApp() {
    assertLinked();
    NativeEnvManager.restartApp();
  },

  async getBuildInfo() {
    assertLinked();
    return NativeEnvManager.getBuildInfo();
  },
};

export default EnvManager;