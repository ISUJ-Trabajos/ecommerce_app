import { apiClient } from './api.client';

export const WishlistAPI = {
  getWishlist: async () => {
    const res = await apiClient.get('/wishlist');
    return res.data;
  },

  getWishlistIds: async () => {
    const res = await apiClient.get('/wishlist/ids');
    return res.data;
  },

  addItem: async (productId: string) => {
    const res = await apiClient.post('/wishlist/items', { productId });
    return res.data;
  },

  removeItem: async (productId: string) => {
    const res = await apiClient.delete(`/wishlist/items/${productId}`);
    return res.data;
  }
};
