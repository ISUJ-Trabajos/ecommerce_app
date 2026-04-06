import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useProductDetail } from '../../hooks/useCatalog';
import { useCartStore } from '../../store/cart.store';
import { useWishlistStore } from '../../store/wishlist.store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.9;

export default function ProductDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { data, isLoading } = useProductDetail(slug);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [addError, setAddError] = useState<string | null>(null);
  const addItem = useCartStore(state => state.addItem);
  const isAdding = useCartStore(state => state.isLoading);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#74b8d3" />
      </View>
    );
  }

  const product = data?.data;
  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Ionicons name="alert-circle-outline" size={48} color="#7d8489" />
        <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text-secondary text-lg mt-4">
          Producto no encontrado
        </Text>
      </View>
    );
  }

  const images = product.images?.length > 0
    ? product.images
    : [{ id: 'placeholder', image_url: 'https://placehold.co/600x600/132149/74b8d3?text=Sin+Imágen' }];

  const hasDiscount = product.discount_percent > 0;
  const stockLow = product.total_stock <= product.stock_alert_threshold && product.total_stock > 0;
  const outOfStock = product.total_stock === 0;

  const activeVariant = product.variants?.find((v: any) => v.id === selectedVariant);
  const displayPrice = activeVariant?.price_override 
    ? activeVariant.price_override 
    : product.final_price;

  const handleAddToCart = async () => {
    setAddError(null);
    if (product.variants?.length > 0 && !selectedVariant) {
      setAddError('Por favor selecciona una variante');
      return;
    }
    
    try {
      await addItem(product.id, selectedVariant, 1);
      // Feedback visual se podría agregar aquí (como un pequeño toast animado)
    } catch (error: any) {
      setAddError(error.message);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* ── Image Carousel ─────────────────── */}
        <View className="relative">
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item: any) => item.id}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentImageIndex(index);
            }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.image_url }}
                style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}
                resizeMode="cover"
              />
            )}
          />

          {/* Nav buttons overlay */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-14 left-5 bg-background/60 w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color="#ededea" />
          </TouchableOpacity>

          {/* Corazón wishlist flotante */}
          <TouchableOpacity
            onPress={() => useWishlistStore.getState().toggleLike(product.id)}
            className="absolute top-14 right-5 bg-background/60 w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons
              name={useWishlistStore.getState().likedIds.has(product.id) ? 'heart' : 'heart-outline'}
              size={22}
              color={useWishlistStore.getState().likedIds.has(product.id) ? '#f87171' : '#ededea'}
            />
          </TouchableOpacity>

          {/* Image indicators */}
          {images.length > 1 && (
            <View className="absolute bottom-4 w-full flex-row justify-center gap-2">
              {images.map((_: any, i: number) => (
                <View
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-primary' : 'bg-surface-high'}`}
                />
              ))}
            </View>
          )}
        </View>

        {/* ── Product Info ────────────────────── */}
        <View className="px-6 pt-6">
          {/* Categories */}
          <View className="flex-row flex-wrap gap-2 mb-3">
            {product.categories?.map((cat: any) => (
              <View key={cat.id} className="bg-surface px-3 py-1 rounded-lg">
                <Text className="text-primary text-xs">{cat.name}</Text>
              </View>
            ))}
          </View>

          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-2xl">
            {product.name}
          </Text>

          {/* Price */}
          <View className="flex-row items-center gap-3 mt-3">
            <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-primary text-2xl">
              ${displayPrice}
            </Text>
            {hasDiscount && (
              <>
                <Text className="text-text-secondary text-base line-through">${product.base_price}</Text>
                <View className="bg-red-500/90 px-2 py-1 rounded-lg">
                  <Text className="text-white text-xs font-bold">-{product.discount_percent}%</Text>
                </View>
              </>
            )}
          </View>

          {/* Stock */}
          <View className="mt-3">
            {stockLow && (
              <Text className="text-yellow-400 text-sm">⚠ ¡Solo quedan {product.total_stock} disponibles!</Text>
            )}
            {outOfStock && (
              <Text className="text-red-400 text-sm">Producto agotado</Text>
            )}
            {!stockLow && !outOfStock && (
              <Text className="text-green-400 text-sm">En stock</Text>
            )}
          </View>

          {/* Description */}
          <View className="mt-6">
            <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-lg mb-2">Descripción</Text>
            <Text style={{ fontFamily: 'Manrope_400Regular' }} className="text-text-secondary leading-6">
              {product.description}
            </Text>
          </View>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <View className="mt-6">
              <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-lg mb-3">Variantes</Text>
              <View className="flex-row flex-wrap gap-3">
                {product.variants.map((variant: any) => {
                  const isSelected = selectedVariant === variant.id;
                  const isAvailable = variant.stock > 0;
                  return (
                    <TouchableOpacity
                      key={variant.id}
                      disabled={!isAvailable}
                      onPress={() => {
                        setSelectedVariant(isSelected ? null : variant.id);
                        setAddError(null);
                      }}
                      className={`px-4 py-3 rounded-xl border ${
                        isSelected
                          ? 'bg-primary/20 border-primary'
                          : isAvailable
                          ? 'bg-surface border-surface-high'
                          : 'bg-surface/50 border-surface-high opacity-40'
                      }`}
                    >
                      <Text className={`text-sm ${isSelected ? 'text-primary' : 'text-text'}`}
                        style={{ fontFamily: 'Manrope_600SemiBold' }}
                      >
                        {variant.name}
                      </Text>
                      <Text className="text-text-secondary text-xs mt-1">
                        {isAvailable ? `Stock: ${variant.stock}` : 'Agotado'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Tax info */}
          {product.tax_name && (
            <View className="mt-6 bg-surface-low rounded-xl p-4">
              <Text className="text-text-secondary text-xs">
                Impuesto: {product.tax_name} ({(product.tax_rate * 100).toFixed(0)}%)
              </Text>
            </View>
          )}

          {/* Related products */}
          {product.related?.length > 0 && (
            <View className="mt-8">
              <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-lg mb-4">
                Productos Relacionados
              </Text>
              <FlatList
                data={product.related}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => router.push(`/product/${item.slug}`)}
                    className="w-36 mr-4"
                  >
                    <View className="bg-surface rounded-2xl overflow-hidden">
                      <Image
                        source={{ uri: item.primary_image || 'https://placehold.co/400x400/132149/74b8d3?text=Producto' }}
                        className="w-full h-36"
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text text-xs mt-2" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-primary text-sm">
                      ${item.final_price}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Sticky Bottom CTA ────────────────── */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface-low/95 px-6 pt-4 pb-8 border-t border-surface-high">
        {addError && (
          <Text className="text-red-400 text-sm text-center mb-2" style={{ fontFamily: 'Manrope_600SemiBold' }}>
            {addError}
          </Text>
        )}
        <TouchableOpacity
          disabled={outOfStock || isAdding}
          onPress={handleAddToCart}
          className={`w-full h-14 rounded-2xl items-center justify-center flex-row gap-2 ${
            outOfStock || isAdding ? 'bg-surface-high' : 'bg-primary'
          }`}
        >
          {isAdding ? (
            <ActivityIndicator color="#071327" />
          ) : (
            <>
              <Ionicons name="cart-outline" size={22} color={outOfStock ? '#7d8489' : '#071327'} />
              <Text
                style={{ fontFamily: 'Manrope_700Bold' }}
                className={`text-lg ${outOfStock ? 'text-text-secondary' : 'text-background'}`}
              >
                {outOfStock ? 'Sin Stock' : 'Añadir al Carrito'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
