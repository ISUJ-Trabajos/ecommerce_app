import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';
import { useCartStore } from '../../store/cart.store';
import { useWishlistStore } from '../../store/wishlist.store';
import { useEffect } from 'react';
import { BlurView } from 'expo-blur';

export default function TabsLayout() {
  const router = useRouter();
  const fetchCart = useCartStore(state => state.fetchCart);
  const cart = useCartStore(state => state.cart);
  const fetchLikedIds = useWishlistStore(state => state.fetchLikedIds);

  useEffect(() => {
    fetchCart();
    fetchLikedIds();
  }, [fetchCart, fetchLikedIds]);

  const itemsCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  const CustomHeader = () => (
    <View className="flex-row items-center justify-between px-6 pt-14 pb-4 bg-background/95">
      <View className="flex-row items-center gap-3">
        <Ionicons name="menu-outline" size={24} color="#74b8d3" />
        <Text style={{ fontFamily: 'Manrope_800ExtraBold' }} className="text-xl text-primary-container tracking-tight">
          KUMAR Store
        </Text>
      </View>

      <TouchableOpacity className="relative">
        <Ionicons name="notifications-outline" size={24} color="#74b8d3" />
        <View className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full" />
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
          backgroundColor: 'rgba(16, 27, 48, 0.95)', // surface-container-low with transparency
          borderTopWidth: 0, // No-Line Rule
          height: 80,
          paddingBottom: 12,
          paddingTop: 8,
          position: 'absolute',
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.4,
          shadowRadius: 24,
        },
        tabBarLabelStyle: {
          fontFamily: 'Manrope_600SemiBold',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center">
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
              {focused && <View className="w-1 h-1 bg-primary-container rounded-full mt-1" />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center">
              <Ionicons name={focused ? 'grid' : 'grid-outline'} size={24} color={color} />
              {focused && <View className="w-1 h-1 bg-primary-container rounded-full mt-1" />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center relative">
              <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
              {focused && <View className="w-1 h-1 bg-primary-container rounded-full mt-1" />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrito',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center relative">
              <Ionicons name={focused ? 'cart' : 'cart-outline'} size={24} color={color} />
              {itemsCount > 0 && (
                <View className="absolute -top-1 -right-2 bg-primary-container min-w-[16px] h-4 rounded-full items-center justify-center px-1">
                  <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-[8px] text-background">
                    {itemsCount}
                  </Text>
                </View>
              )}
              {focused && itemsCount === 0 && <View className="w-1 h-1 bg-primary-container rounded-full mt-1" />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center">
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
              {focused && <View className="w-1 h-1 bg-primary-container rounded-full mt-1" />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
