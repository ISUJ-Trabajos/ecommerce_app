import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cart.store';

export default function CartScreen() {
  const router = useRouter();
  const { cart, isLoading, updateQuantity, removeItem, fetchCart } = useCartStore();

  const handleUpdate = async (item: any, newQuantity: number) => {
    try {
      await updateQuantity(item.id, newQuantity);
    } catch (error: any) {
      Alert.alert('Aviso', error.message);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const items = cart?.items || [];
  const summary = cart?.summary || { subtotal: 0, tax_amount: 0, total: 0 };

  const renderItem = (item: any) => (
    <View key={item.id} className="flex-row items-center bg-surface p-4 rounded-2xl mb-3">
      <Image
        source={{ uri: item.primary_image || 'https://placehold.co/100x100/132149/74b8d3?text=Img' }}
        className="w-16 h-16 rounded-xl"
        resizeMode="cover"
      />
      <View className="flex-1 ml-4 justify-between h-16">
        <View>
          <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text text-sm" numberOfLines={1}>
            {item.product_name}
          </Text>
          {item.variant_name && (
            <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-text-secondary text-xs">
              {item.variant_name}
            </Text>
          )}
        </View>
        <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-primary text-base">
          ${item.unit_price}
        </Text>
      </View>

      {/* Selector de cantidad y borrar */}
      <View className="items-end h-16 justify-between">
        <TouchableOpacity onPress={() => handleRemove(item.id)}>
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
        
        <View className="flex-row items-center border border-surface-high rounded-full bg-background px-2 py-1">
          <TouchableOpacity onPress={() => handleUpdate(item, item.quantity - 1)}>
            <Ionicons name="remove" size={16} color="#ededea" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text mx-3 text-sm">
            {item.quantity}
          </Text>
          <TouchableOpacity onPress={() => handleUpdate(item, item.quantity + 1)}>
            <Ionicons name="add" size={16} color="#ededea" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      {/* ── Header ───────────────────────────────── */}
      <View className="flex-row items-center justify-between px-6 pt-14 pb-4 bg-background border-b border-surface">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#ededea" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-xl">
            Mi Carrito
          </Text>
        </View>
        <TouchableOpacity onPress={() => fetchCart()}>
          <Ionicons name="refresh" size={20} color="#74b8d3" />
        </TouchableOpacity>
      </View>

      {/* ── Body ──────────────────────────────────── */}
      {isLoading && items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#74b8d3" />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cart-outline" size={64} color="#7d8489" />
          <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text-secondary text-lg mt-4 mb-6">
            Tu carrito está vacío
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/catalog')}
            className="bg-primary px-6 py-3 rounded-xl"
          >
            <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-background">Ir de compras</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
            {items.map(renderItem)}
            
            {/* Aviso de impuestos */}
            <View className="mt-4 bg-surface-low rounded-xl p-4">
              <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-text-secondary text-xs text-center flex-row">
                <Ionicons name="information-circle-outline" size={14} color="#7d8489" />
                {' '} Los precios pueden variar en la pantalla de pago según la zona de envío seleccionada.
              </Text>
            </View>
          </ScrollView>

          {/* ── Summary & Checkout Bottom ──────────── */}
          <View className="bg-surface-low border-t border-surface px-6 pt-5 pb-8 overflow-hidden rounded-t-[32px]">
            <View className="flex-row justify-between mb-2">
              <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-text-secondary">Subtotal</Text>
              <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text">${summary.subtotal}</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-text-secondary">Impuestos (IVA)</Text>
              <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text">${summary.tax_amount}</Text>
            </View>
            <View className="flex-row justify-between mb-6">
              <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-xl">Total</Text>
              <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-primary text-xl">${summary.total}</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/placeholder-checkout')}
              className="bg-primary w-full h-14 rounded-2xl items-center justify-center flex-row gap-2"
            >
              <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-background text-lg">
                Proceder al Pago
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#071327" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
