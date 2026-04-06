import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useProducts, useCategories } from '../../hooks/useCatalog';

export default function CatalogScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(params.category);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: categoriesData } = useCategories();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts({
    category: selectedCategory,
    search: debouncedSearch || undefined,
  });

  const products = data?.pages.flatMap((page: any) => page.data) || [];

  const handleCategorySelect = useCallback((slug: string | undefined) => {
    setSelectedCategory(prev => (prev === slug ? undefined : slug));
  }, []);

  const renderProduct = ({ item }: { item: any }) => {
    const hasDiscount = item.discount_percent > 0;
    return (
      <TouchableOpacity
        onPress={() => router.push(`/product/${item.slug}`)}
        className="flex-1 m-2 max-w-[48%]"
      >
        <View className="bg-surface rounded-2xl overflow-hidden">
          <Image
            source={{ uri: item.primary_image || 'https://placehold.co/400x400/132149/74b8d3?text=Producto' }}
            className="w-full h-44"
            resizeMode="cover"
          />
          {hasDiscount && (
            <View className="absolute top-2 left-2 bg-red-500/90 px-2 py-1 rounded-lg">
              <Text className="text-white text-xs font-bold">-{item.discount_percent}%</Text>
            </View>
          )}
        </View>
        <View className="mt-2 px-1">
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
          {item.total_stock <= item.stock_alert_threshold && item.total_stock > 0 && (
            <Text className="text-yellow-400 text-xs mt-1">Quedan {item.total_stock}</Text>
          )}
          {item.total_stock === 0 && (
            <Text className="text-red-400 text-xs mt-1">Agotado</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* ── Search Bar ────────────────────── */}
      <View className="px-6 pt-16 pb-4">
        <View className="bg-surface-low flex-row items-center rounded-xl px-4 h-12">
          <Ionicons name="search" size={20} color="#7d8489" />
          <TextInput
            className="flex-1 ml-3 text-text"
            placeholder="Buscar productos..."
            placeholderTextColor="#7d8489"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#7d8489" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Category Pills ────────────────── */}
      <View className="mb-4">
        <FlatList
          data={[{ id: 'all', name: 'Todos', slug: undefined }, ...(categoriesData?.data || [])]}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => {
            const isActive = item.slug === selectedCategory || (!selectedCategory && item.id === 'all');
            return (
              <TouchableOpacity
                onPress={() => handleCategorySelect(item.slug)}
                className={`px-5 py-2 rounded-xl mr-3 ${isActive ? 'bg-primary' : 'bg-surface'}`}
              >
                <Text
                  style={{ fontFamily: 'Manrope_600SemiBold' }}
                  className={`text-sm ${isActive ? 'text-background' : 'text-text'}`}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* ── Product Grid ──────────────────── */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#74b8d3" />
        </View>
      ) : products.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="bag-outline" size={48} color="#7d8489" />
          <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text-secondary text-lg mt-4">
            No se encontraron productos
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          keyExtractor={(item: any) => item.id}
          renderItem={renderProduct}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator color="#74b8d3" className="py-6" />
            ) : null
          }
        />
      )}
    </View>
  );
}
