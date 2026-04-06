import { apiClient } from './api.client';

export const CheckoutAPI = {
  getAddresses: async () => {
    const res = await apiClient.get('/users/me/addresses');
    return res.data;
  },

  addAddress: async (data: any) => {
    const res = await apiClient.post('/users/me/addresses', data);
    return res.data;
  },

  getShippingZones: async () => {
    const res = await apiClient.get('/shipping/zones');
    return res.data;
  },

  createOrder: async (data: {
    shippingAddressId: string;
    shippingZoneId: string;
    paymentMethod: string;
    notes?: string;
  }) => {
    const res = await apiClient.post('/orders', data);
    return res.data;
  }
};
