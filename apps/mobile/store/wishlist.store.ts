import { create } from 'zustand';
import { WishlistAPI } from '../services/wishlist.service';

interface WishlistState {
  /** IDs de producto en el wishlist — para checks O(1) */
  likedIds: Set<string>;
  isLoading: boolean;
  fetchLikedIds: () => Promise<void>;
  toggleLike: (productId: string) => Promise<void>;
  isLiked: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  likedIds: new Set<string>(),
  isLoading: false,

  fetchLikedIds: async () => {
    try {
      const res = await WishlistAPI.getWishlistIds();
      set({ likedIds: new Set(res.data) });
    } catch {
      // silencioso
    }
  },

  toggleLike: async (productId: string) => {
    const current = get().likedIds;
    const isCurrentlyLiked = current.has(productId);

    // Optimistic update — cambia inmediatamente en UI
    const next = new Set(current);
    if (isCurrentlyLiked) {
      next.delete(productId);
    } else {
      next.add(productId);
    }
    set({ likedIds: next });

    try {
      if (isCurrentlyLiked) {
        await WishlistAPI.removeItem(productId);
      } else {
        await WishlistAPI.addItem(productId);
      }
    } catch {
      // Revertir en caso de error
      set({ likedIds: current });
    }
  },

  isLiked: (productId: string) => {
    return get().likedIds.has(productId);
  },

  clearWishlist: () => {
    set({ likedIds: new Set() });
  }
}));
