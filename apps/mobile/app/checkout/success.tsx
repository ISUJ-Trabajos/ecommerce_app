import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useRef, useEffect } from 'react';

export default function CheckoutSuccessScreen() {
  const router = useRouter();
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    // Timeout artificial para redirigir automático si no se presiona el botón, pero no en este caso.
  }, []);

  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <LottieView
        autoPlay
        ref={animation}
        style={{ width: 250, height: 250 }}
        source={require('../../assets/success.json')}
        loop={false}
      />
      
      <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-3xl mt-4 text-center">
        ¡Pago Exitoso!
      </Text>
      
      <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-text-secondary mt-3 text-center text-base leading-6">
        Tu pedido fue aceptado e ingresado en nuestro sistema logístico. Prepara tu espacio para recibirlo.
      </Text>

      <TouchableOpacity
        onPress={() => router.replace('/(tabs)')}
        className="mt-12 bg-surface w-full h-14 rounded-2xl items-center justify-center"
      >
        <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-primary text-lg">
          Volver a la tienda
        </Text>
      </TouchableOpacity>
    </View>
  );
}
