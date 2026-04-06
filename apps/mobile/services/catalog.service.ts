import { apiClient } from './api.client';

export const CatalogAPI = {
  getCategories: async () => {
    const res = await apiClient.get('/categories');
    return res.data;
  },

  getFeatured: async () => {
    const res = await apiClient.get('/products/featured');
    return res.data;
  },

  getProducts: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  }) => {
    const res = await apiClient.get('/products', { params });
    return res.data;
  },

  getProductBySlug: async (slug: string) => {
    const res = await apiClient.get(`/products/${slug}`);
    return res.data;
  },
};
