import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/auth.store';

interface MenuItem {
  icon: string;
  label: string;
  subtitle: string;
  onPress: () => void;
  accent?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const menuItems: MenuItem[] = [
    {
      icon: 'receipt-outline',
      label: 'Mis Pedidos',
      subtitle: 'Historial y seguimiento de compras',
      onPress: () => router.push('/orders'),
    },
    {
      icon: 'heart-outline',
      label: 'Lista de Deseos',
      subtitle: 'Productos guardados',
      onPress: () => router.push('/(tabs)/wishlist'),
    },
    {
      icon: 'location-outline',
      label: 'Mis Direcciones',
      subtitle: 'Gestiona tus direcciones de entrega',
      onPress: () => {}, // Próximamente
    },
    {
      icon: 'settings-outline',
      label: 'Configuración',
      subtitle: 'Preferencias de la app',
      onPress: () => {}, // Próximamente
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* ── User Card ────────── */}
      <View className="mx-6 mt-6 bg-surface rounded-3xl p-6 items-center">
        <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-3">
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-primary text-3xl">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-xl">
          {user?.full_name || 'Usuario'}
        </Text>
        <Text className="text-text-secondary text-sm mt-1">{user?.email || ''}</Text>
      </View>

      {/* ── Menu Items ────────── */}
      <View className="mx-6 mt-6">
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={item.onPress}
            className="flex-row items-center bg-surface rounded-2xl p-4 mb-3"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
              <Ionicons name={item.icon as any} size={20} color="#74b8d3" />
            </View>
            <View className="flex-1 ml-3">
              <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text text-base">
                {item.label}
              </Text>
              <Text className="text-text-secondary text-xs">{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#7d8489" />
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Logout ────────── */}
      <View className="mx-6 mt-6">
        <TouchableOpacity
          onPress={() => {
            logout();
            router.replace('/(auth)/login');
          }}
          className="flex-row items-center justify-center bg-red-500/10 rounded-2xl p-4"
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#f87171" />
          <Text style={{ fontFamily: 'Manrope_700Bold', color: '#f87171', marginLeft: 8 }}>
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

