import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import { useAuthStore } from '../store/auth.store'; // We will define this next

// export const BASE_URL = 'http://10.0.2.2:3000'; // Emulador Android
// export const BASE_URL = 'http://192.168.52.3:3000'; // Dispositivo Físico (ejemplo con puerto)
export const BASE_URL = 'http://localhost:3000'; // Entorno Web (tu navegador y el backend están en la misma PC)

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Handle 401 error and try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          // If offline, we don't logout, we reject so queries use cache if available
          return Promise.reject(error);
        }

        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (refreshToken) {
          const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          if (res.data.success) {
            const newAccessToken = res.data.data.accessToken;
            useAuthStore.getState().setAccessToken(newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          }
        }
      } catch (e) {
        // Refresh failed
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
