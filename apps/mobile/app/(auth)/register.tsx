import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { apiClient } from '../../services/api.client';
import { useAuthStore } from '../../store/auth.store';

export default function RegisterScreen() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('1990-01-01'); // Simple string for proto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNext = () => {
    if (!fullName || !phone) {
      setError('Por favor llena los campos requeridos'); return;
    }
    setError('');
    setStep(2);
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setError('Email y contraseña son obligatorios'); return;
    }

    try {
      setLoading(true);
      setError('');
      const payload = {
        full_name: fullName,
        phone,
        birth_date: birthDate,
        email,
        password
      };

      const res = await apiClient.post('/auth/register', payload);
      
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
    <ScrollView className="flex-1 bg-background px-6 pt-24">
      <TouchableOpacity onPress={() => (step === 2 ? setStep(1) : router.back())} className="mb-8">
        <Text className="text-primary">← Volver</Text>
      </TouchableOpacity>

      <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-3xl mb-2">
        Crea tu cuenta
      </Text>
      <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-text-secondary mb-10">
        Paso {step} de 2
      </Text>

      {error ? (
        <View className="bg-red-900/40 p-4 rounded-xl mb-6">
          <Text className="text-red-300">{error}</Text>
        </View>
      ) : null}

      <View className="gap-4">
        {step === 1 ? (
          <>
            <View className="bg-surface-low rounded-xl px-4 py-1">
              <Text className="text-text-secondary text-xs mt-2">Nombre completo</Text>
              <TextInput 
                className="h-10 text-text pb-2"
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor="#7d8489"
              />
            </View>

            <View className="bg-surface-low rounded-xl px-4 py-1">
              <Text className="text-text-secondary text-xs mt-2">Teléfono</Text>
              <TextInput 
                className="h-10 text-text pb-2"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#7d8489"
              />
            </View>
            
            <View className="bg-surface-low rounded-xl px-4 py-1">
              <Text className="text-text-secondary text-xs mt-2">Fecha de nacimiento (YYYY-MM-DD)</Text>
              <TextInput 
                className="h-10 text-text pb-2"
                value={birthDate}
                onChangeText={setBirthDate}
                placeholderTextColor="#7d8489"
              />
            </View>

            <TouchableOpacity 
              onPress={handleNext}
              className="w-full h-14 bg-primary rounded-2xl items-center justify-center mt-8"
            >
              <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-background text-lg">
                Siguiente
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
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

            <View className="bg-surface-low rounded-xl px-4 py-1 opacity-50">
              <Text className="text-text-secondary text-xs mt-2">Dirección de entrega (Opcional)</Text>
               <Text className="text-text-secondary mb-2 text-sm italic">Configúrala después en tu perfil</Text>
            </View>

            <TouchableOpacity 
              onPress={handleRegister}
              disabled={loading}
              className="w-full h-14 bg-primary rounded-2xl items-center justify-center mt-8 mb-20"
            >
              {loading ? (
                <ActivityIndicator color="#071327" />
              ) : (
                <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-background text-lg">
                  Finalizar Registro
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}
