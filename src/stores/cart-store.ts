'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useSyncExternalStore, useCallback } from 'react';
import { STORAGE_KEYS } from '@/config/constants';

// ==========================================
// CART STORE TYPES
// ==========================================

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  unit?: string;
  maxStock?: number;
}

interface CartState {
  items: CartItem[];
  isHydrated: boolean;
}

interface CartActions {
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  incrementQty: (id: string) => void;
  decrementQty: (id: string) => void;
  clearCart: () => void;
  setHydrated: () => void;
}

type CartStore = CartState & CartActions;

// ==========================================
// CART STORE
// ==========================================

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isHydrated: false,

      addItem: (item, qty = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === item.id);

          if (existingIndex !== -1) {
            const newItems = [...state.items];
            const newQty = newItems[existingIndex].qty + qty;

            if (item.maxStock && newQty > item.maxStock) {
              newItems[existingIndex].qty = item.maxStock;
            } else {
              newItems[existingIndex].qty = newQty;
            }

            return { items: newItems };
          }

          return {
            items: [...state.items, { ...item, qty }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQty: (id, qty) => {
        if (qty < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, qty: item.maxStock ? Math.min(qty, item.maxStock) : qty }
              : item
          ),
        }));
      },

      incrementQty: (id) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item;

            const newQty = item.qty + 1;
            if (item.maxStock && newQty > item.maxStock) return item;

            return { ...item, qty: newQty };
          }),
        }));
      },

      decrementQty: (id) => {
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;

          if (item.qty <= 1) {
            return { items: state.items.filter((i) => i.id !== id) };
          }

          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, qty: i.qty - 1 } : i
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: STORAGE_KEYS.CART,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

// ==========================================
// SELECTORS (Memoized)
// ==========================================

export const selectCartItems = (state: CartStore) => state.items;
export const selectCartIsHydrated = (state: CartStore) => state.isHydrated;

export const selectCartTotalItems = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.qty, 0);

export const selectCartTotalPrice = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.price * item.qty, 0);

export const selectCartIsEmpty = (state: CartStore) =>
  state.items.length === 0;

export const selectCartItem = (id: string) => (state: CartStore) =>
  state.items.find((item) => item.id === id);

export const selectItemQty = (id: string) => (state: CartStore) =>
  state.items.find((item) => item.id === id)?.qty || 0;

// ==========================================
// HOOKS (Optimized)
// ==========================================

// ✅ FIX: Proper sync external store subscription
export const useCartHydrated = (): boolean => {
  return useSyncExternalStore(
    (callback) => useCartStore.subscribe(callback),
    () => useCartStore.getState().isHydrated,
    () => false
  );
};

// ✅ FIX: Memoized selectors
export const useCartItems = () => {
  const selector = useCallback((state: CartStore) => state.items, []);
  return useCartStore(selector);
};

export const useCartTotalItems = () => {
  const selector = useCallback(
    (state: CartStore) => state.items.reduce((sum, item) => sum + item.qty, 0),
    []
  );
  return useCartStore(selector);
};

export const useCartTotalPrice = () => {
  const selector = useCallback(
    (state: CartStore) => state.items.reduce((sum, item) => sum + item.price * item.qty, 0),
    []
  );
  return useCartStore(selector);
};

export const useCartIsEmpty = () => {
  const selector = useCallback((state: CartStore) => state.items.length === 0, []);
  return useCartStore(selector);
};

export const useCartItem = (id: string) => {
  const selector = useCallback(
    (state: CartStore) => state.items.find((item) => item.id === id),
    [id]
  );
  return useCartStore(selector);
};

export const useItemQty = (id: string): number => {
  const selector = useCallback(
    (state: CartStore) => {
      const item = state.items.find((item) => item.id === id);
      return item?.qty || 0;
    },
    [id]
  );
  return useCartStore(selector);
};

export const useCartActions = () => {
  return {
    addItem: useCartStore.getState().addItem,
    removeItem: useCartStore.getState().removeItem,
    updateQty: useCartStore.getState().updateQty,
    incrementQty: useCartStore.getState().incrementQty,
    decrementQty: useCartStore.getState().decrementQty,
    clearCart: useCartStore.getState().clearCart,
  };
};