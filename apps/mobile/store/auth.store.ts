import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';

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

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: async (accessToken, refreshToken, user) => {
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    // Ideally user data is also cached or we just rely on fetch
    await SecureStore.setItemAsync('user_data', JSON.stringify(user));
    set({ accessToken, user, isAuthenticated: true });
  },

  setAccessToken: (accessToken) => set({ accessToken }),

  logout: async () => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      // Offline script: defer logout till online.
      // But we clear state so they can't do requests, keeping data in cache. 
      // Actually, if we want offline view, we might not want to clear user data.
      return; 
    }
    
    await SecureStore.deleteItemAsync('refresh_token');
    await SecureStore.deleteItemAsync('user_data');
    set({ accessToken: null, user: null, isAuthenticated: false });
  },

  checkSession: async () => {
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    const userDataStr = await SecureStore.getItemAsync('user_data');
    
    if (refreshToken && userDataStr) {
      set({ 
        isAuthenticated: true, 
        user: JSON.parse(userDataStr) 
      });
    } else {
      set({ isAuthenticated: false, user: null, accessToken: null });
    }
  }
}));
