import { apiClient } from './api.client';

export const CartAPI = {
  getCart: async () => {
    const res = await apiClient.get('/cart');
    return res.data;
  },

  addItem: async (productId: string, variantId: string | null, quantity: number) => {
    const res = await apiClient.post('/cart/items', { productId, variantId, quantity });
    return res.data;
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const res = await apiClient.patch(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },

  removeItem: async (itemId: string) => {
    const res = await apiClient.delete(`/cart/items/${itemId}`);
    return res.data;
  }
};
