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
    <TouchableOpacity onPress={onPress} className="w-48 mr-4">
      <View className="bg-surface-container rounded-2xl overflow-hidden p-3 shadow-lg">
        <View className="w-full aspect-[4/5] bg-surface-container-lowest rounded-xl mb-3 overflow-hidden">
          <Image
            source={{ uri: item.primary_image || 'https://placehold.co/400x400/142034/74b8d3?text=Producto' }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {hasDiscount && (
            <View className="absolute top-2 left-2 bg-error-container px-2 py-1 rounded-full">
              <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-error text-[10px]">
                -{item.discount_percent}%
              </Text>
            </View>
          )}

          {/* Wishlist Button - Tinted Shadow effect */}
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); toggleLike(item.id); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-highest/90 items-center justify-center shadow-sm"
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={16}
              color={isLiked ? '#ffb4ab' : '#d7e2ff'}
            />
          </TouchableOpacity>
        </View>

        <View className="px-1">
          <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-on-surface text-sm line-clamp-1" numberOfLines={1}>
            {item.name}
          </Text>

          <View className="flex-row items-center gap-2 mt-1">
            <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-primary text-base">
              ${item.final_price}
            </Text>
            {hasDiscount && (
              <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-on-surface-variant text-xs line-through">
                ${item.base_price}
              </Text>
            )}
          </View>

          {item.total_stock <= item.stock_alert_threshold && item.total_stock > 0 && (
            <Text style={{ fontFamily: 'Manrope_500Medium' }} className="text-yellow-400 text-xs mt-1">
              Quedan {item.total_stock}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Category icons mapping
const categoryIcons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  'moda': 'shirt-outline',
  'accesorios': 'watch-outline',
  'hogar': 'home-outline',
  'cosmeticos': 'sparkles-outline',
  'salud': 'fitness-outline',
  'decoracion': 'color-palette-outline',
};

function CategoryPill({ item, onPress }: { item: any; onPress: () => void }) {
  const iconName = categoryIcons[item.slug] || 'pricetag-outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center gap-2 bg-surface-container px-5 py-3 rounded-full mr-3 active:bg-surface-container-high transition-colors"
    >
      <Ionicons name={iconName} size={18} color="#90d4ef" />
      <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-on-surface text-sm">
        {item.name}
      </Text>
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
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* ── Header ─────────────────────────────────── */}
      <View className="px-6 pt-16 pb-6">
        <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-on-surface-variant text-sm">
          {greeting} 👋
        </Text>
        <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-on-surface text-2xl mt-1">
          Descubre las tendencias
        </Text>
      </View>

      {/* ── Search Bar ─────────────────────────────── */}
      <View className="px-6 mb-8">
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/catalog')}
          activeOpacity={0.8}
          className="flex-row items-center bg-surface-container rounded-xl px-4 py-3.5"
        >
          <Ionicons name="search-outline" size={20} color="#899297" />
          <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-outline ml-3 flex-1">
            Buscar productos...
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Categories ─────────────────────────────── */}
      <View className="mb-10">
        <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-on-surface text-lg px-6 mb-4">
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
      <View className="mb-10">
        <View className="flex-row justify-between items-center px-6 mb-4">
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-on-surface text-lg">
            Destacados
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/catalog')}>
            <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-primary text-sm">
              Ver todo
            </Text>
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

      {/* ── Bestsellers ───────────────────────────── */}
      <View className="mb-10">
        <View className="flex-row justify-between items-center px-6 mb-4">
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-on-surface text-lg">
            Los más vendidos
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/catalog')}>
            <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-primary text-sm">
              Ver todo
            </Text>
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

      {/* ── Curated Float Banner ───────────────────── */}
      <View className="px-6 mb-10">
        <View className="bg-surface-container-high rounded-3xl p-6 min-h-[280px] overflow-hidden relative">
          {/* Content */}
          <View className="relative z-10 max-w-[60%] pt-4">
            <Text style={{ fontFamily: 'Manrope_800ExtraBold' }} className="text-primary uppercase text-[10px] tracking-[0.2em] mb-2">
              Edición Limitada
            </Text>
            <Text style={{ fontFamily: 'Manrope_800ExtraBold' }} className="text-white text-2xl leading-tight mb-4">
              Colección Invierno 2024
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/catalog')}
              activeOpacity={0.9}
              className="bg-primary-container px-6 py-3 rounded-xl active:scale-95 transition-transform self-start"
            >
              <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-background text-sm">
                Descubrir
              </Text>
            </TouchableOpacity>
          </View>

          {/* Decorative Image Placeholder */}
          <View className="absolute right-0 top-0 bottom-0 w-1/2 bg-surface-container-highest">
            <Image
              source={{ uri: 'https://placehold.co/400x400/2a354a/74b8d3?text=KUMAR' }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      {/* ── Sale Items ─────────────────────────────── */}
      <View className="px-6 mb-10">
        <View className="flex-row justify-between items-center mb-4">
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-on-surface text-lg">
            En Oferta
          </Text>
          <View className="bg-error-container px-2 py-1 rounded">
            <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-error text-[10px] uppercase tracking-widest">
              Hot Deals
            </Text>
          </View>
        </View>

        {/* Sale Grid - 2 columns */}
        <View className="flex-row flex-wrap gap-4">
          {[1, 2].map((i) => (
            <TouchableOpacity
              key={i}
              className="flex-1 bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10 min-w-[45%]"
            >
              <View className="relative">
                <View className="absolute top-2 right-2 z-10 bg-error px-2 py-1 rounded-full">
                  <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-background text-[10px]">
                    -25%
                  </Text>
                </View>
                <Image
                  source={{ uri: 'https://placehold.co/300x300/142034/74b8d3?text=Sale' }}
                  className="w-full aspect-square"
                  resizeMode="cover"
                />
              </View>

              <View className="p-3">
                <Text style={{ fontFamily: 'Manrope_500Medium' }} className="text-xs text-on-surface-variant mb-1">
                  Producto en Oferta {i}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-primary">
                    $45.00
                  </Text>
                  <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-[10px] text-outline line-through">
                    $60.00
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
