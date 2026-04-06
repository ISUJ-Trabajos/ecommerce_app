import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  FadeIn,
  FadeInUp
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function WelcomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Shimmer animation for logo glow
  const shimmerOpacity = useSharedValue(0.3);
  const shimmerScale = useSharedValue(0.98);

  useEffect(() => {
    // Shimmer animation
    shimmerOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 })
      ),
      -1,
      true
    );

    shimmerScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.98, { duration: 1500 })
      ),
      -1,
      true
    );

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
    transform: [{ scale: shimmerScale.value }],
  }));

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center relative overflow-hidden">
        {/* Celestial Glows Background */}
        <View className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <View className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />

        {/* Central Branding */}
        <View className="items-center gap-12">
          {/* Logo with Glassmorphism */}
          <View className="relative">
            {/* Animated Glow */}
            <AnimatedView
              style={shimmerStyle}
              className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl"
            />

            {/* Logo Container */}
            <View className="relative w-32 h-32 rounded-[2.5rem] bg-surface-container-low items-center justify-center p-6 border border-outline-variant/10 shadow-2xl shadow-black/40 overflow-hidden">
              <Text style={{ fontFamily: 'Manrope_800ExtraBold' }} className="text-primary-container text-5xl">
                K
              </Text>
            </View>
          </View>

          {/* Typography */}
          <View className="items-center gap-3">
            <Text style={{ fontFamily: 'Manrope_800ExtraBold' }} className="text-4xl text-primary-container tracking-tighter uppercase">
              KUMAR Store
            </Text>
            <Text style={{ fontFamily: 'Manrope_300Light' }} className="text-on-surface-variant text-sm tracking-[0.2em] uppercase opacity-60">
              The Celestial Curator
            </Text>
          </View>

          {/* Loading Indicator */}
          <View className="items-center gap-4 mt-8">
            <ActivityIndicator size="large" color="#74b8d3" />
            <Text style={{ fontFamily: 'Manrope_500Medium' }} className="text-xs text-outline tracking-widest uppercase">
              Inicializando
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="absolute bottom-12 items-center">
          <View className="flex-row items-center gap-2 text-outline-variant/50">
            <View className="h-[1px] w-8 bg-outline-variant/50" />
            <Text style={{ fontFamily: 'Manrope_500Medium' }} className="text-[10px] text-outline-variant/50 tracking-widest uppercase">
              Premium Retail Experience
            </Text>
            <View className="h-[1px] w-8 bg-outline-variant/50" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background items-center justify-center relative overflow-hidden">
      {/* Celestial Glows Background */}
      <View className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <View className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />

      {/* Central Content */}
      <AnimatedView
        entering={FadeIn.duration(800)}
        className="items-center gap-12 px-8"
      >
        {/* Logo with Glassmorphism */}
        <View className="relative">
          <AnimatedView
            entering={FadeInUp.duration(600).delay(200)}
            style={shimmerStyle}
            className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl"
          />

          <View className="relative w-32 h-32 rounded-[2.5rem] bg-surface-container-low items-center justify-center p-6 border border-outline-variant/10 shadow-2xl shadow-black/40 overflow-hidden">
            <Text style={{ fontFamily: 'Manrope_800ExtraBold' }} className="text-primary-container text-5xl">
              K
            </Text>
          </View>
        </View>

        {/* Typography */}
        <AnimatedView entering={FadeInUp.duration(600).delay(400)} className="items-center gap-3">
          <Text style={{ fontFamily: 'Manrope_800ExtraBold' }} className="text-4xl text-primary-container tracking-tighter uppercase">
            KUMAR Store
          </Text>
          <Text style={{ fontFamily: 'Manrope_300Light' }} className="text-on-surface-variant text-sm tracking-[0.2em] uppercase opacity-60">
            The Celestial Curator
          </Text>
        </AnimatedView>

        {/* Action Buttons */}
        <AnimatedView entering={FadeInUp.duration(600).delay(600)} className="w-full max-w-sm gap-4 mt-8">
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.9}
            className="w-full h-14 bg-primary-container rounded-2xl items-center justify-center active:scale-[0.98] transition-transform"
          >
            <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-background text-lg">
              Iniciar Sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.9}
            className="w-full h-14 bg-transparent border border-primary/40 rounded-2xl items-center justify-center active:scale-[0.98] transition-all"
          >
            <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-primary text-lg">
              Crear Cuenta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)')}
            className="w-full h-14 py-2 items-center justify-center"
          >
            <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-on-surface-variant">
              Explorar como invitado
            </Text>
          </TouchableOpacity>
        </AnimatedView>
      </AnimatedView>
    </View>
  );
}
