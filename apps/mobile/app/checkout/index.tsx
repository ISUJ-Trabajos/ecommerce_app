import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cart.store';
import { CheckoutAPI } from '../../services/checkout.service';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, fetchCart, clearCartData } = useCartStore();
  
  // Checkout Steps State
  const [step, setStep] = useState(1);
  
  // Data States
  const [addresses, setAddresses] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  
  // Selections
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('TARJETA');
  const [notes, setNotes] = useState('');
  
  // New Address Form State
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Casa', street: '', city: 'Quito', province: 'Pichincha', is_default: true });

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [addrs, zns] = await Promise.all([
        CheckoutAPI.getAddresses(),
        CheckoutAPI.getShippingZones(),
      ]);
      setAddresses(addrs.data);
      if (addrs.data.length > 0) {
        setSelectedAddressId(addrs.data.find((a: any) => a.is_default)?.id || addrs.data[0].id);
      }
      setZones(zns.data);
    } catch (e: any) {
      Alert.alert('Error', 'Fallo cargando datos de checkout');
    }
    setIsLoading(false);
  };

  const handleSaveAddress = async () => {
    if (!newAddress.street || !newAddress.city) {
      return Alert.alert('Error', 'Calle y ciudad son obligatorios');
    }
    setIsProcessing(true);
    try {
      const resp = await CheckoutAPI.addAddress(newAddress);
      setAddresses(resp.data);
      setSelectedAddressId(resp.data[0].id);
      setShowNewAddress(false);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
    setIsProcessing(false);
  };

  const handleCheckout = async () => {
    if (!selectedAddressId || !selectedZoneId || !paymentMethod) return;
    setIsProcessing(true);
    try {
      const res = await CheckoutAPI.createOrder({
        shippingAddressId: selectedAddressId,
        shippingZoneId: selectedZoneId,
        paymentMethod,
        notes
      });
      // Vaciamos store y forzamos recarga paralela
      clearCartData();
      router.replace('/checkout/success');
    } catch (e: any) {
      Alert.alert('Checkout Fallido', e.message);
    }
    setIsProcessing(false);
  };

  // ── Cálculos al Vuelo ────────
  const totalWeight = cart?.items?.reduce((acc: number, item: any) => acc + (item.weight_kg * item.quantity), 0) || 0;
  const activeZone = zones.find(z => z.id === selectedZoneId);
  const shippingCost = activeZone ? Number(activeZone.base_price) + (totalWeight * Number(activeZone.price_per_kg)) : 0;
  const finalTotal = (cart?.summary?.total || 0) + shippingCost;

  if (isLoading || !cart) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#74b8d3" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* ── Header ───────────────────────────────── */}
      <View className="flex-row items-center px-6 pt-14 pb-4 bg-background border-b border-surface">
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#ededea" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-xl">
          Checkout (Paso {step} de 4)
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* ======================================================== */}
        {/* PASO 1: DIRECCIÓN                                        */}
        {/* ======================================================== */}
        {step === 1 && (
          <View>
            <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text-secondary text-base mb-4 uppercase">Dirección de Entrega</Text>
            
            {!showNewAddress ? (
              <>
                {addresses.length === 0 ? (
                  <Text className="text-text-secondary italic mb-4">No tienes direcciones guardadas.</Text>
                ) : (
                  addresses.map((addr) => (
                    <TouchableOpacity
                      key={addr.id}
                      onPress={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl mb-3 border ${selectedAddressId === addr.id ? 'border-primary bg-primary/10' : 'border-surface bg-surface'}`}
                    >
                      <View className="flex-row justify-between items-center mb-1">
                        <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text">{addr.label}</Text>
                        {selectedAddressId === addr.id && <Ionicons name="checkmark-circle" size={20} color="#74b8d3" />}
                      </View>
                      <Text className="text-text-secondary text-sm">{addr.street}</Text>
                      <Text className="text-text-secondary text-sm">{addr.city}, {addr.province}</Text>
                    </TouchableOpacity>
                  ))
                )}

                <TouchableOpacity onPress={() => setShowNewAddress(true)} className="flex-row items-center justify-center p-4 border border-dashed border-surface-high rounded-2xl mt-2 bg-surface">
                  <Ionicons name="add" size={20} color="#7d8489" />
                  <Text className="text-text-secondary ml-2 font-semibold">Agregar nueva dirección</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  disabled={!selectedAddressId}
                  onPress={() => setStep(2)}
                  className={`w-full h-14 rounded-2xl items-center justify-center mt-8 ${!selectedAddressId ? 'bg-surface-high' : 'bg-primary'}`}
                >
                  <Text style={{ fontFamily: 'Manrope_700Bold' }} className={`text-lg ${!selectedAddressId ? 'text-text-secondary' : 'text-background'}`}>Siguiente: Método Envío</Text>
                </TouchableOpacity>
              </>
            ) : (
              // Formulario Nueva Dirección
              <View className="bg-surface p-5 rounded-2xl">
                <Text className="text-text-secondary text-xs font-bold mb-1">CÓMO LLAMAR A ESTE LUGAR</Text>
                <TextInput className="bg-background text-text p-3 rounded-xl mb-4" placeholderTextColor="#7d8489" placeholder="Ej: Trabajo" value={newAddress.label} onChangeText={t => setNewAddress({...newAddress, label: t})} />
                
                <Text className="text-text-secondary text-xs font-bold mb-1">CALLE Y NÚMERO</Text>
                <TextInput className="bg-background text-text p-3 rounded-xl mb-4" placeholderTextColor="#7d8489" placeholder="Ej: Av. Principal 123" value={newAddress.street} onChangeText={t => setNewAddress({...newAddress, street: t})} />
                
                <Text className="text-text-secondary text-xs font-bold mb-1">CIUDAD</Text>
                <TextInput className="bg-background text-text p-3 rounded-xl mb-6" placeholderTextColor="#7d8489" value={newAddress.city} onChangeText={t => setNewAddress({...newAddress, city: t})} />

                <View className="flex-row justify-between gap-4">
                  <TouchableOpacity onPress={() => setShowNewAddress(false)} className="flex-1 bg-surface-high h-12 rounded-xl items-center justify-center">
                    <Text className="text-text-secondary font-bold">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveAddress} disabled={isProcessing} className="flex-1 bg-primary h-12 rounded-xl items-center justify-center">
                    {isProcessing ? <ActivityIndicator color="#071327" /> : <Text className="text-background font-bold">Guardar</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ======================================================== */}
        {/* PASO 2: ENVÍO                                            */}
        {/* ======================================================== */}
        {step === 2 && (
          <View>
            <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text-secondary text-base mb-4 uppercase">Zona de Cobertura</Text>
            
            {zones.map((zone) => {
              const costoZona = Number(zone.base_price) + (totalWeight * Number(zone.price_per_kg));
              return (
                <TouchableOpacity
                  key={zone.id}
                  onPress={() => setSelectedZoneId(zone.id)}
                  className={`p-4 rounded-2xl mb-3 border flex-row justify-between items-center ${selectedZoneId === zone.id ? 'border-primary bg-primary/10' : 'border-surface bg-surface'}`}
                >
                  <View>
                    <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-base">{zone.name}</Text>
                    <Text className="text-text-secondary text-sm">Tarifa Total Calculada: ${costoZona.toFixed(2)}</Text>
                  </View>
                  {selectedZoneId === zone.id && <Ionicons name="checkmark-circle" size={24} color="#74b8d3" />}
                </TouchableOpacity>
              )
            })}

            <TouchableOpacity 
              disabled={!selectedZoneId}
              onPress={() => setStep(3)}
              className={`w-full h-14 rounded-2xl items-center justify-center mt-8 ${!selectedZoneId ? 'bg-surface-high' : 'bg-primary'}`}
            >
              <Text style={{ fontFamily: 'Manrope_700Bold' }} className={`text-lg ${!selectedZoneId ? 'text-text-secondary' : 'text-background'}`}>Siguiente: Método de Pago</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================== */}
        {/* PASO 3: PAGO                                             */}
        {/* ======================================================== */}
        {step === 3 && (
          <View>
            <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text-secondary text-base mb-4 uppercase">Método de Pago</Text>
            
            {[
              { id: 'TARJETA', name: 'Tarjeta de Crédito/Débito', icon: 'card-outline' },
              { id: 'PAYPHONE', name: 'Payphone', icon: 'phone-portrait-outline' },
              { id: 'CONTRA_ENTREGA', name: 'Al momento de entrega en efectivo', icon: 'cash-outline' },
            ].map((pm) => (
              <TouchableOpacity
                key={pm.id}
                onPress={() => setPaymentMethod(pm.id)}
                className={`p-4 rounded-2xl mb-3 border flex-row items-center ${paymentMethod === pm.id ? 'border-primary bg-primary/10' : 'border-surface bg-surface'}`}
              >
                <Ionicons name={pm.icon as any} size={24} color={paymentMethod === pm.id ? '#74b8d3' : '#7d8489'} />
                <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-base ml-3 flex-1">{pm.name}</Text>
                {paymentMethod === pm.id && <Ionicons name="checkmark-circle" size={24} color="#74b8d3" />}
              </TouchableOpacity>
            ))}

            <Text className="text-text-secondary text-xs font-bold mt-4 mb-2">NOTAS DEL PEDIDO (Opcional)</Text>
            <TextInput 
              className="bg-surface text-text p-4 rounded-2xl mb-6 min-h-[100px]" 
              placeholderTextColor="#7d8489" 
              placeholder="Ej: Dejar en portería..."
              multiline
              textAlignVertical="top" 
              value={notes} 
              onChangeText={setNotes} 
            />

            <TouchableOpacity 
              onPress={() => setStep(4)}
              className="w-full h-14 rounded-2xl items-center justify-center mt-2 bg-primary"
            >
              <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-background text-lg">Siguiente: Resumen</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================== */}
        {/* PASO 4: RESUMEN                                          */}
        {/* ======================================================== */}
        {step === 4 && (
          <View>
            <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-xl mb-4 text-center">Resumen Final</Text>
            
            <View className="bg-surface p-5 rounded-3xl mb-6">
              <Text className="text-text-secondary text-xs uppercase font-bold mb-2">Artículos ({cart.items.length})</Text>
              {cart.items.map((i: any) => (
                 <View key={i.id} className="flex-row justify-between mb-1">
                   <Text className="text-text flex-1" numberOfLines={1}>{i.quantity}x {i.product_name}</Text>
                   <Text className="text-text-secondary ml-2">${(i.quantity * i.unit_price).toFixed(2)}</Text>
                 </View>
              ))}

              <View className="h-[1px] bg-surface-high my-4" />

              <Text className="text-text-secondary text-xs uppercase font-bold mb-2">Desglose de Costos</Text>
              
              <View className="flex-row justify-between mb-1">
                <Text className="text-text-secondary">Subtotal</Text>
                <Text className="text-text">${cart.summary.subtotal.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-text-secondary">Impuestos (IVA)</Text>
                <Text className="text-text">${cart.summary.tax_amount.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-text-secondary">Envío ({activeZone?.name})</Text>
                <Text className="text-text">${shippingCost.toFixed(2)}</Text>
              </View>
              
              <View className="h-[1px] bg-surface-high my-4" />

              <View className="flex-row justify-between items-center">
                <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-text text-xl">Balance</Text>
                <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-primary text-2xl">${finalTotal.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity 
              disabled={isProcessing}
              onPress={handleCheckout}
              className={`w-full h-14 rounded-2xl items-center justify-center flex-row gap-2 ${isProcessing ? 'bg-surface-high' : 'bg-primary'}`}
            >
              {isProcessing ? <ActivityIndicator color="#071327" /> : (
                <>
                  <Ionicons name="lock-closed" size={18} color="#071327" />
                  <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-background text-lg">Pagar Ahora</Text>
                </>
              )}
            </TouchableOpacity>

            <Text className="text-text-secondary text-xs text-center mt-6 px-4">
              Al confirmar, tu compra pasará directamente a nuestro sistema para despacho logístico.
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}
