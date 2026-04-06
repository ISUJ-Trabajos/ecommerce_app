import { create } from 'zustand';
import { CartAPI } from '../services/cart.service';

interface CartState {
  cart: any | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId: string | null, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCartData: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await CartAPI.getCart();
      if (response && response.data) {
        set({ cart: response.data, isLoading: false, error: null });
      } else {
        set({ cart: null, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Error al obtener el carrito', isLoading: false });
    }
  },

  addItem: async (productId, variantId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await CartAPI.addItem(productId, variantId, quantity);
      if (response && response.data) set({ cart: response.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al añadir ítem';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await CartAPI.updateQuantity(itemId, quantity);
      if (response && response.data) set({ cart: response.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al actualizar ítem';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await CartAPI.removeItem(itemId);
      if (response && response.data) set({ cart: response.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al eliminar ítem';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  clearCartData: () => {
    set({ cart: null, error: null, isLoading: false });
  }
}));
