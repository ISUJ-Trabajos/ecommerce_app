import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';
import { useCartStore } from '../../store/cart.store';
import { useEffect } from 'react';

export default function TabsLayout() {
  const router = useRouter();
  const fetchCart = useCartStore(state => state.fetchCart);
  const cart = useCartStore(state => state.cart);
  
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const itemsCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  const CustomHeader = () => (
    <View className="flex-row items-center justify-between px-6 pt-14 pb-4 bg-background border-b border-surface">
      <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-xl">
        KUMAR Store
      </Text>
      <TouchableOpacity 
        className="relative"
        onPress={() => router.push('/cart')}
      >
        <Ionicons name="cart-outline" size={26} color="#ededea" />
        {itemsCount > 0 && (
          <View className="absolute -top-1 -right-2 bg-primary w-5 h-5 rounded-full items-center justify-center">
            <Text className="text-[10px] font-bold text-background">{itemsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarActiveTintColor: '#74b8d3',
        tabBarInactiveTintColor: '#7d8489',
        tabBarStyle: {
          backgroundColor: '#0d1e3a',
          borderTopColor: '#1a2d4d',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: 'Manrope_400Regular',
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

