import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { WishlistAPI } from '../../services/wishlist.service';
import { useWishlistStore } from '../../store/wishlist.store';
import { useCartStore } from '../../store/cart.store';

export default function WishlistScreen() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const toggleLike = useWishlistStore(state => state.toggleLike);
  const addToCart = useCartStore(state => state.addItem);

  const loadWishlist = useCallback(async () => {
    try {
      const res = await WishlistAPI.getWishlist();
      setItems(res.data.items);
    } catch { /* silencioso */ }
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadWishlist();
      setIsLoading(false);
    })();
  }, [loadWishlist]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWishlist();
    setRefreshing(false);
  };

  const handleRemove = async (productId: string) => {
    // Optimistic: quitar de la UI local inmediatamente
    setItems(prev => prev.filter(i => i.product_id !== productId));
    await toggleLike(productId);
  };

  const handleAddToCart = async (item: any) => {
    try {
      await addToCart(item.product_id, null, 1);
    } catch { /* el store ya maneja errores */ }
  };

  const renderItem = ({ item }: { item: any }) => {
    const hasDiscount = item.discount_percent > 0;
    const outOfStock = item.total_stock === 0;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/product/${item.slug}`)}
        className="bg-surface rounded-2xl overflow-hidden mb-4 mx-6"
        activeOpacity={0.8}
      >
        <View className="flex-row">
          {/* Imagen */}
          <View className="relative">
            <Image
              source={{ uri: item.primary_image || 'https://placehold.co/200x200/132149/74b8d3?text=Img' }}
              className="w-28 h-28 rounded-l-2xl"
              resizeMode="cover"
            />
            {hasDiscount && (
              <View className="absolute bottom-2 left-2 bg-red-500/90 px-1.5 py-0.5 rounded-md">
                <Text className="text-white text-[10px] font-bold">-{item.discount_percent}%</Text>
              </View>
            )}
          </View>

          {/* Info */}
          <View className="flex-1 p-3 justify-between">
            <View>
              <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text text-sm" numberOfLines={2}>
                {item.name}
              </Text>
              <View className="flex-row items-center gap-2 mt-1">
                <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-primary text-base">
                  ${item.final_price}
                </Text>
                {hasDiscount && (
                  <Text className="text-text-secondary text-xs line-through">${item.base_price}</Text>
                )}
              </View>
            </View>

            {/* Botón rápido de añadir al carrito */}
            {!outOfStock && (
              <TouchableOpacity
                onPress={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                className="flex-row items-center self-start bg-primary/15 px-3 py-1.5 rounded-lg mt-2"
              >
                <Ionicons name="cart-outline" size={14} color="#74b8d3" />
                <Text style={{ fontFamily: 'Manrope_600SemiBold', fontSize: 11, color: '#74b8d3', marginLeft: 4 }}>
                  Añadir
                </Text>
              </TouchableOpacity>
            )}
            {outOfStock && (
              <Text className="text-red-400 text-xs mt-2">Agotado</Text>
            )}
          </View>

          {/* Botón X de eliminación (esquina superior derecha — patrón corporativo) */}
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); handleRemove(item.product_id); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/70 items-center justify-center"
          >
            <Ionicons name="close" size={16} color="#7d8489" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#74b8d3" />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="heart-outline" size={64} color="#7d8489" />
          <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text-secondary text-lg mt-4 mb-2">
            Tu lista de deseos está vacía
          </Text>
          <Text className="text-text-secondary text-sm text-center mb-6">
            Toca el corazón ♡ en cualquier producto para guardarlo aquí.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/catalog')}
            className="bg-primary px-6 py-3 rounded-xl"
          >
            <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-background">Explorar Tienda</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.wishlist_item_id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#74b8d3" />
          }
        />
      )}
    </View>
  );
}

