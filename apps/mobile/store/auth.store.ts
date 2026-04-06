import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  setAccessToken: (accessToken: string) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

// Storage helper para evitar crashes en Web
const setStorageItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const removeStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: async (accessToken, refreshToken, user) => {
    await setStorageItem('refresh_token', refreshToken);
    // Ideally user data is also cached or we just rely on fetch
    await setStorageItem('user_data', JSON.stringify(user));
    set({ accessToken, user, isAuthenticated: true });
  },

  setAccessToken: (accessToken) => set({ accessToken }),

  logout: async () => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      // Offline script: defer logout till online.
      return; 
    }
    
    await removeStorageItem('refresh_token');
    await removeStorageItem('user_data');
    set({ accessToken: null, user: null, isAuthenticated: false });
  },

  checkSession: async () => {
    try {
      const refreshToken = await getStorageItem('refresh_token');
      const userDataStr = await getStorageItem('user_data');
      
      if (refreshToken && userDataStr) {
        set({ 
          isAuthenticated: true, 
          user: JSON.parse(userDataStr) 
        });
      } else {
        set({ isAuthenticated: false, user: null, accessToken: null });
      }
    } catch (e) {
      set({ isAuthenticated: false, user: null, accessToken: null });
    }
  }
}));
