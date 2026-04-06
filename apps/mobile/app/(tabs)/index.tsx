import { View, Text, ScrollView, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFeatured, useCategories } from '../../hooks/useCatalog';
import { useAuthStore } from '../../store/auth.store';
import { useWishlistStore } from '../../store/wishlist.store';

function ProductCard({ item, onPress }: { item: any; onPress: () => void }) {
  const hasDiscount = item.discount_percent > 0;
  const toggleLike = useWishlistStore(state => state.toggleLike);
  const isLiked = useWishlistStore(state => state.likedIds.has(item.id));

  return (
    <TouchableOpacity onPress={onPress} className="w-44 mr-4">
      <View className="bg-surface rounded-2xl overflow-hidden relative">
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
        {/* Corazón flotante */}
        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); toggleLike(item.id); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/60 items-center justify-center"
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={18}
            color={isLiked ? '#f87171' : '#ededea'}
          />
        </TouchableOpacity>
      </View>
      <View className="mt-2 px-1">
        <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text text-sm" numberOfLines={1}>
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
      </View>
    </TouchableOpacity>
  );
}

function CategoryPill({ item, onPress }: { item: any; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} className="bg-surface px-5 py-3 rounded-2xl mr-3">
      <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text text-sm">{item.name}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const { data: featuredData, isLoading: loadingFeatured } = useFeatured();
  const { data: categoriesData, isLoading: loadingCategories } = useCategories();

  const greeting = user ? `Hola, ${user.full_name.split(' ')[0]}` : 'Bienvenido';

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 30 }}>
      {/* ── Header ─────────────────────────────────── */}
      <View className="px-6 pt-16 pb-6">
        <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-text-secondary text-sm">
          {greeting} 👋
        </Text>
        <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-2xl mt-1">
          KUMAR Store
        </Text>
      </View>

      {/* ── Hero Banner ────────────────────────────── */}
      <View className="mx-6 rounded-3xl overflow-hidden bg-surface h-44 justify-end p-6 mb-8">
        <View className="absolute inset-0 bg-primary/10" />
        <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-xl">
          Nuevas colecciones
        </Text>
        <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-text-secondary mt-1">
          Descubre lo último en Moda y Accesorios
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/catalog')}
          className="bg-primary self-start mt-3 px-5 py-2 rounded-xl"
        >
          <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-background text-sm">
            Explorar
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Categories ─────────────────────────────── */}
      <View className="mb-8">
        <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-lg px-6 mb-4">
          Categorías
        </Text>
        {loadingCategories ? (
          <ActivityIndicator color="#74b8d3" className="py-4" />
        ) : (
          <FlatList
            data={categoriesData?.data || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }) => (
              <CategoryPill
                item={item}
                onPress={() => router.push({ pathname: '/(tabs)/catalog', params: { category: item.slug } })}
              />
            )}
          />
        )}
      </View>

      {/* ── Featured ───────────────────────────────── */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center px-6 mb-4">
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-lg">
            Destacados
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/catalog')}>
            <Text className="text-primary text-sm">Ver todo</Text>
          </TouchableOpacity>
        </View>
        {loadingFeatured ? (
          <ActivityIndicator color="#74b8d3" className="py-8" />
        ) : (
          <FlatList
            data={featuredData?.data?.featured || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }) => (
              <ProductCard item={item} onPress={() => router.push(`/product/${item.slug}`)} />
            )}
          />
        )}
      </View>

      {/* ── Bestsellers ────────────────────────────── */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center px-6 mb-4">
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-lg">
            Los más vendidos
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/catalog')}>
            <Text className="text-primary text-sm">Ver todo</Text>
          </TouchableOpacity>
        </View>
        {loadingFeatured ? (
          <ActivityIndicator color="#74b8d3" className="py-8" />
        ) : (
          <FlatList
            data={featuredData?.data?.bestsellers || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }) => (
              <ProductCard item={item} onPress={() => router.push(`/product/${item.slug}`)} />
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}
