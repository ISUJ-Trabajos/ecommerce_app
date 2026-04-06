import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { apiClient } from '../../services/api.client';
import { useAuthStore } from '../../store/auth.store';

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await apiClient.post('/auth/login', { email, password });
      
      if (res.data.success) {
        const { accessToken, refreshToken, user } = res.data.data;
        await setAuth(accessToken, refreshToken, user);
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 pt-24">
      <TouchableOpacity onPress={() => router.back()} className="mb-8">
        <Text className="text-primary">← Volver</Text>
      </TouchableOpacity>

      <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-3xl mb-2">
        Bienvenido de nuevo
      </Text>
      <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-text-secondary mb-10">
        Ingresa a tu cuenta para continuar
      </Text>

      {error ? (
        <View className="bg-red-900/40 p-4 rounded-xl mb-6">
          <Text className="text-red-300">{error}</Text>
        </View>
      ) : null}

      <View className="gap-4">
        <View className="bg-surface-low rounded-xl px-4 py-1">
          <Text className="text-text-secondary text-xs mt-2">Email</Text>
          <TextInput 
            className="h-10 text-text pb-2"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#7d8489"
          />
        </View>

        <View className="bg-surface-low rounded-xl px-4 py-1">
          <Text className="text-text-secondary text-xs mt-2">Contraseña</Text>
          <TextInput 
            className="h-10 text-text pb-2"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#7d8489"
          />
        </View>

        <TouchableOpacity className="items-end mt-2">
          <Text className="text-primary">¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={handleLogin}
        disabled={loading}
        className="w-full h-14 bg-primary rounded-2xl items-center justify-center mt-12"
      >
        {loading ? (
          <ActivityIndicator color="#071327" />
        ) : (
          <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-background text-lg">
            Ingresar
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
