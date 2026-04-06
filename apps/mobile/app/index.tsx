import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <View className="mb-12 items-center">
        <View className="w-24 h-24 bg-surface rounded-3xl items-center justify-center mb-6">
          <Text className="text-primary font-bold text-3xl">K</Text>
        </View>
        <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-3xl text-center">
          KUMAR Store
        </Text>
        <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-text-secondary text-center mt-2">
          El portal premium para tus compras en Quito
        </Text>
      </View>

      <View className="w-full gap-4">
        <TouchableOpacity 
          onPress={() => router.push('/(auth)/login')}
          className="w-full h-14 bg-primary rounded-2xl items-center justify-center"
        >
          <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-background text-lg">
            Iniciar Sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/(auth)/register')}
          className="w-full h-14 bg-surface-high border border-primary/40 rounded-2xl items-center justify-center"
        >
          <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-primary text-lg">
            Crear Cuenta
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/(tabs)')}
          className="w-full h-14 py-2 items-center justify-center"
        >
          <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-text-secondary">
            Explorar como invitado
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
