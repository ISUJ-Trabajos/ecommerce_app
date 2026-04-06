import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { View, ActivityIndicator } from 'react-native';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 2 * 60 * 1000,    // 2 minutes stale
      gcTime: 10 * 60 * 1000,       // 10 minutes garbage collection (in-memory only)
      refetchOnReconnect: true,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold
  });

  const checkSession = useAuthStore((state) => state.checkSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!fontsLoaded) return;
  }, [isAuthenticated, segments, fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#74b8d3" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#071327' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[slug]" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
