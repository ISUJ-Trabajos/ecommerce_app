import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../services/api.client';
import { useAuthStore } from '../../store/auth.store';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    <View className="flex-1 bg-background relative overflow-hidden">
      {/* Celestial gradient background */}
      <LinearGradient
        colors={['rgba(116, 184, 211, 0.08)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '40%' }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(116, 184, 211, 0.05)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '30%' }}
      />

      {/* Content */}
      <View className="flex-1 px-6 pt-20 pb-8">
        {/* Header Branding */}
        <View className="items-center mb-12">
          <Text style={{ fontFamily: 'Manrope_800ExtraBold' }} className="text-3xl text-primary-container tracking-tighter mb-2">
            KUMAR
          </Text>
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-2xl text-on-surface tracking-tight text-center">
            Bienvenido de nuevo
          </Text>
          <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-on-surface-variant mt-2">
            Ingresa tus credenciales para continuar
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-6">
          {/* Email Input */}
          <View className="relative">
            <View className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Ionicons name="mail-outline" size={20} color="#7d8489" />
            </View>
            <TextInput
              className="w-full bg-surface-container rounded-xl py-4 pl-12 pr-4 text-on-surface"
              style={{ fontFamily: 'Manrope_400Regular' }}
              placeholder="Correo electrónico"
              placeholderTextColor="#7d8489"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View className="relative">
            <View className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Ionicons name="lock-closed-outline" size={20} color="#7d8489" />
            </View>
            <TextInput
              className="w-full bg-surface-container rounded-xl py-4 pl-12 pr-12 text-on-surface"
              style={{ fontFamily: 'Manrope_400Regular' }}
              placeholder="Contraseña"
              placeholderTextColor="#7d8489"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#7d8489"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity className="items-end">
            <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-sm text-primary-container">
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          {/* Error Message */}
          {error ? (
            <View className="bg-error-container/40 p-4 rounded-xl">
              <Text style={{ fontFamily: 'Manrope_500Medium' }} className="text-error">
                {error}
              </Text>
            </View>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.9}
            className="w-full h-14 bg-primary-container rounded-2xl items-center justify-center active:scale-[0.98] transition-transform shadow-xl shadow-black/20"
          >
            {loading ? (
              <ActivityIndicator color="#071327" />
            ) : (
              <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-background text-lg">
                Iniciar Sesión
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center py-2">
            <View className="flex-1 h-[1px] bg-outline-variant/20" />
            <Text style={{ fontFamily: 'Manrope_500Medium' }} className="mx-4 text-on-surface-variant text-xs uppercase tracking-widest">
              O
            </Text>
            <View className="flex-1 h-[1px] bg-outline-variant/20" />
          </View>

          {/* Google Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            className="w-full h-14 bg-transparent border border-primary/40 rounded-2xl flex-row items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <Ionicons name="logo-google" size={20} color="#74b8d3" />
            <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-on-surface">
              Iniciar con Google
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-auto items-center gap-8">
          {/* Biometric Option */}
          <TouchableOpacity className="items-center gap-2">
            <View className="w-16 h-16 rounded-full border border-primary-container/20 items-center justify-center bg-surface-container">
              <Ionicons name="scan-outline" size={28} color="#74b8d3" />
            </View>
            <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-xs text-on-surface-variant uppercase tracking-widest">
              Usar Biometría
            </Text>
          </TouchableOpacity>

          {/* Registration Link */}
          <View className="flex-row">
            <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-on-surface-variant">
              ¿No tienes cuenta?
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-primary-container ml-1">
                Regístrate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
