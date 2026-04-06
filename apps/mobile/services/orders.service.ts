import { apiClient } from './api.client';

export const OrdersAPI = {
  getOrders: async () => {
    const res = await apiClient.get('/orders');
    return res.data;
  },

  getOrderDetail: async (orderId: string) => {
    const res = await apiClient.get(`/orders/${orderId}`);
    return res.data;
  }
};
