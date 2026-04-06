import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { OrdersAPI } from '../../services/orders.service';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  PENDIENTE_PAGO:  { label: 'Pendiente',    color: '#fbbf24', bg: 'bg-yellow-500/15', icon: 'time-outline' },
  PAGO_CONFIRMADO: { label: 'Confirmado',   color: '#74b8d3', bg: 'bg-primary/15',    icon: 'checkmark-circle-outline' },
  ENVIADO:         { label: 'Enviado',       color: '#818cf8', bg: 'bg-indigo-500/15', icon: 'airplane-outline' },
  EN_CAMINO:       { label: 'En Camino',     color: '#38bdf8', bg: 'bg-sky-500/15',    icon: 'bicycle-outline' },
  ENTREGADO:       { label: 'Entregado',     color: '#4ade80', bg: 'bg-green-500/15',  icon: 'checkmark-done-outline' },
  CANCELADO:       { label: 'Cancelado',     color: '#f87171', bg: 'bg-red-500/15',    icon: 'close-circle-outline' },
  DEVUELTO:        { label: 'Devuelto',      color: '#fb923c', bg: 'bg-orange-500/15', icon: 'return-down-back-outline' },
};

export default function OrdersListScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      const res = await OrdersAPI.getOrders();
      setOrders(res.data);
    } catch (e) {
      // Silencioso
    }
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadOrders();
      setIsLoading(false);
    })();
  }, [loadOrders]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const renderOrder = ({ item }: { item: any }) => {
    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.PENDIENTE_PAGO;
    const date = new Date(item.created_at).toLocaleDateString('es-EC', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    return (
      <TouchableOpacity
        onPress={() => router.push(`/orders/${item.id}`)}
        className="bg-surface rounded-2xl p-5 mb-4"
        activeOpacity={0.7}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View>
            <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-base">
              #{item.order_number}
            </Text>
            <Text className="text-text-secondary text-xs mt-1">{date}</Text>
          </View>
          <View className={`flex-row items-center px-3 py-1.5 rounded-full ${cfg.bg}`}>
            <Ionicons name={cfg.icon as any} size={14} color={cfg.color} />
            <Text style={{ color: cfg.color, fontFamily: 'Manrope_600SemiBold', fontSize: 12, marginLeft: 4 }}>
              {cfg.label}
            </Text>
          </View>
        </View>

        <View className="h-[1px] bg-surface-high mb-3" />

        <View className="flex-row justify-between items-center">
          <Text className="text-text-secondary text-sm">
            {item.items_count} {item.items_count === 1 ? 'artículo' : 'artículos'}
          </Text>
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-primary text-lg">
            ${Number(item.total).toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* ── Header ─────────── */}
      <View className="flex-row items-center px-6 pt-14 pb-4 bg-background border-b border-surface">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#ededea" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-xl">
          Mis Pedidos
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#74b8d3" />
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="receipt-outline" size={64} color="#7d8489" />
          <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text-secondary text-lg mt-4 mb-2">
            No tienes pedidos aún
          </Text>
          <Text className="text-text-secondary text-sm text-center mb-6">
            Tus compras aparecerán aquí una vez que completes tu primer checkout.
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
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#74b8d3" />
          }
        />
      )}
    </View>
  );
}
