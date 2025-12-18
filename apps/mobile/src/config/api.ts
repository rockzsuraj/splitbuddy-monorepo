import EnvManager  from '../native/EnvManager';
import { Platform } from 'react-native';

const DEV_PORT = 8888;
const API_PATH = '/api/v1';

export async function getBaseUrl() {
  const env = await EnvManager.getEnv();

  if (env === 'dev' || env === 'staging') {
    if (Platform.OS === 'android') {
      // Android emulator → host machine
      return `http://10.0.2.2:${DEV_PORT}${API_PATH}`;
    }

    // iOS simulator
    return `http://localhost:${DEV_PORT}${API_PATH}`;
  }

  // Production
  return `https://splitbuddy-monorepo-api.vercel.app/${API_PATH}`;
}