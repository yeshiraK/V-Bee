import Constants from 'expo-constants';

/**
 * Global Configuration
 * 
 * Uses EXPO_PUBLIC_API_BASE_URL from environment variables (.env file).
 * When running in Expo Go on a physical device, set EXPO_PUBLIC_API_BASE_URL=http://<YOUR_LAN_IP>:3000
 */
export const API_BASE_URL = 
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  'http://127.0.0.1:3000';

export const CONFIG = {
  apiBaseUrl: API_BASE_URL.replace(/\/+$/, ''), // strip trailing slash
  timeoutMs: 15000,
  attendanceThreshold: 75,
};
