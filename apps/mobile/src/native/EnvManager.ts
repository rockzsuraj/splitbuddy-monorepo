import { NativeModules } from 'react-native';

export type Env = 'dev' | 'staging' | 'prod';

export type BuildInfo = {
  version: string;
  buildNumber: string;
};

interface EnvManagerType {
  // READ
  getEnv(): Promise<Env>;
  getBuildInfo(): Promise<BuildInfo>;

  // SINGLE ACTION (native-owned)
  switchEnv(env: Env): void;
}

export const EnvManager = NativeModules.EnvManager as EnvManagerType;