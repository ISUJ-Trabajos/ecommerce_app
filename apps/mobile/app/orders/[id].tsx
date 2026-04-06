import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { OrdersAPI } from '../../services/orders.service';

// ── Timeline Config ──────────────────────────────────────────────
// Orden lineal que representa la progresión natural de un pedido
const TIMELINE_STEPS = [
  { status: 'PENDIENTE_PAGO',  label: 'Pendiente',    icon: 'time-outline',               color: '#fbbf24' },
  { status: 'PAGO_CONFIRMADO', label: 'Confirmado',   icon: 'checkmark-circle-outline',   color: '#74b8d3' },
  { status: 'ENVIADO',         label: 'Enviado',       icon: 'cube-outline',               color: '#818cf8' },
  { status: 'EN_CAMINO',       label: 'En Camino',     icon: 'bicycle-outline',            color: '#38bdf8' },
  { status: 'ENTREGADO',       label: 'Entregado',     icon: 'home-outline',               color: '#4ade80' },
];

// Statuses que rompen el flujo normal
const BREAK_STATUSES: Record<string, { label: string; icon: string; color: string }> = {
  CANCELADO: { label: 'Cancelado', icon: 'close-circle-outline', color: '#f87171' },
  DEVUELTO:  { label: 'Devuelto',  icon: 'return-down-back-outline', color: '#fb923c' },
};

function getStepIndex(status: string): number {
  return TIMELINE_STEPS.findIndex(s => s.status === status);
}

// ── Timeline Component ──────────────────────────────────────────
function OrderTimeline({ currentStatus, history }: { currentStatus: string; history: any[] }) {
  const isBroken = !!BREAK_STATUSES[currentStatus];
  const currentIdx = isBroken ? -1 : getStepIndex(currentStatus);

  // Obtener la fecha del historial por status
  const getDateForStatus = (status: string) => {
    const entry = history.find((h: any) => h.status === status);
    if (!entry) return null;
    return new Date(entry.created_at).toLocaleDateString('es-EC', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <View className="mt-2">
      {TIMELINE_STEPS.map((step, idx) => {
        const isCompleted = !isBroken && idx <= currentIdx;
        const isCurrent = !isBroken && idx === currentIdx;
        const isLast = idx === TIMELINE_STEPS.length - 1;
        const dateStr = getDateForStatus(step.status);

        return (
          <View key={step.status} className="flex-row">
            {/* Columna del icono y línea */}
            <View className="items-center" style={{ width: 48 }}>
              {/* Círculo con ícono */}
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  isCompleted ? '' : 'border border-surface-high'
                }`}
                style={isCompleted ? { backgroundColor: step.color + '22' } : {}}
              >
                <Ionicons
                  name={step.icon as any}
                  size={20}
                  color={isCompleted ? step.color : '#444b52'}
                />
              </View>

              {/* Línea vertical que conecta al siguiente paso */}
              {!isLast && (
                <View
                  className="w-[2px] flex-1 min-h-[32px]"
                  style={{ backgroundColor: (isCompleted && idx < currentIdx) ? step.color : '#1a2d4d' }}
                />
              )}
            </View>

            {/* Columna del texto */}
            <View className="flex-1 ml-3 pb-6">
              <Text
                style={{ fontFamily: isCurrent ? 'Manrope_700Bold' : 'Manrope_600SemiBold' }}
                className={`text-sm ${isCompleted ? 'text-text' : 'text-text-secondary/50'}`}
              >
                {step.label}
              </Text>
              {dateStr && (
                <Text className="text-text-secondary text-xs mt-0.5">{dateStr}</Text>
              )}
              {isCurrent && (
                <View className="mt-1.5 px-2.5 py-1 rounded-full self-start" style={{ backgroundColor: step.color + '22' }}>
                  <Text style={{ color: step.color, fontFamily: 'Manrope_600SemiBold', fontSize: 10 }}>
                    Estado actual
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}

      {/* Status roto (cancelado/devuelto) */}
      {isBroken && (
        <View className="flex-row mt-2">
          <View className="items-center" style={{ width: 48 }}>
            <View className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: BREAK_STATUSES[currentStatus].color + '22' }}
            >
              <Ionicons
                name={BREAK_STATUSES[currentStatus].icon as any}
                size={20}
                color={BREAK_STATUSES[currentStatus].color}
              />
            </View>
          </View>
          <View className="flex-1 ml-3">
            <Text style={{ fontFamily: 'Manrope_700Bold', color: BREAK_STATUSES[currentStatus].color }} className="text-sm">
              {BREAK_STATUSES[currentStatus].label}
            </Text>
            <Text className="text-text-secondary text-xs mt-0.5">
              Este pedido fue {currentStatus === 'CANCELADO' ? 'cancelado' : 'devuelto'}.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ── Main Screen ──────────────────────────────────────────────────
export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await OrdersAPI.getOrderDetail(id);
        setOrder(res.data);
      } catch (e) { /* silencioso */ }
      setIsLoading(false);
    })();
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#74b8d3" />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={48} color="#7d8489" />
        <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text-secondary text-lg mt-4">
          Pedido no encontrado
        </Text>
      </View>
    );
  }

  const createdDate = new Date(order.created_at).toLocaleDateString('es-EC', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <View className="flex-1 bg-background">
      {/* ── Header ─────────── */}
      <View className="flex-row items-center px-6 pt-14 pb-4 bg-background border-b border-surface">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#ededea" />
        </TouchableOpacity>
        <View>
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-lg">
            #{order.order_number}
          </Text>
          <Text className="text-text-secondary text-xs">{createdDate}</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Timeline Section ─────────── */}
        <View className="mx-6 mt-6 bg-surface rounded-3xl p-5">
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-base mb-4">
            <Ionicons name="location-outline" size={16} color="#74b8d3" /> Seguimiento del Pedido
          </Text>
          <OrderTimeline currentStatus={order.status} history={order.status_history || []} />
        </View>

        {/* ── Dirección de Envío ─────────── */}
        <View className="mx-6 mt-4 bg-surface rounded-3xl p-5">
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-base mb-2">
            <Ionicons name="navigate-outline" size={16} color="#74b8d3" /> Dirección de Entrega
          </Text>
          <Text className="text-text-secondary text-sm">{order.address_label}</Text>
          <Text className="text-text text-sm">{order.address_street}</Text>
          <Text className="text-text-secondary text-sm">{order.address_city}, {order.address_province}</Text>
        </View>

        {/* ── Artículos del Pedido ─────────── */}
        <View className="mx-6 mt-4 bg-surface rounded-3xl p-5">
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-base mb-4">
            <Ionicons name="bag-handle-outline" size={16} color="#74b8d3" /> Artículos ({order.items.length})
          </Text>

          {order.items.map((item: any) => (
            <View key={item.id} className="flex-row items-center mb-4 last:mb-0">
              <Image
                source={{ uri: item.primary_image || 'https://placehold.co/80x80/132149/74b8d3?text=Img' }}
                className="w-14 h-14 rounded-xl"
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text text-sm" numberOfLines={1}>
                  {item.product_name}
                </Text>
                {item.variant_name && (
                  <Text className="text-text-secondary text-xs">{item.variant_name}</Text>
                )}
                <Text className="text-text-secondary text-xs">
                  {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                </Text>
              </View>
              <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-sm">
                ${Number(item.subtotal).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Resumen Financiero ─────────── */}
        <View className="mx-6 mt-4 bg-surface rounded-3xl p-5">
          <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-base mb-4">
            <Ionicons name="receipt-outline" size={16} color="#74b8d3" /> Resumen de Pago
          </Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-text-secondary text-sm">Subtotal</Text>
            <Text className="text-text text-sm">${Number(order.subtotal).toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-text-secondary text-sm">Impuestos (IVA)</Text>
            <Text className="text-text text-sm">${Number(order.tax_amount).toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-text-secondary text-sm">Envío ({order.shipping_zone_name})</Text>
            <Text className="text-text text-sm">${Number(order.shipping_cost).toFixed(2)}</Text>
          </View>

          <View className="h-[1px] bg-surface-high my-3" />

          <View className="flex-row justify-between items-center">
            <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-lg">Total</Text>
            <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-primary text-xl">
              ${Number(order.total).toFixed(2)}
            </Text>
          </View>

          <View className="flex-row items-center mt-4 bg-surface-low rounded-xl p-3">
            <Ionicons name="card-outline" size={18} color="#7d8489" />
            <Text className="text-text-secondary text-sm ml-2">
              Pagado con: {order.payment_method === 'TARJETA' ? 'Tarjeta' : order.payment_method === 'PAYPHONE' ? 'Payphone' : 'Contra Entrega'}
            </Text>
          </View>
        </View>

        {/* ── Notas ─────────── */}
        {order.notes && (
          <View className="mx-6 mt-4 bg-surface rounded-3xl p-5">
            <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-base mb-2">
              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#74b8d3" /> Notas
            </Text>
            <Text className="text-text-secondary text-sm">{order.notes}</Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}
