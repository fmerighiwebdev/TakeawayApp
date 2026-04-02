import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  buildCartItemKey,
  buildCartSelectionKey,
  calculateCartTotal,
  normalizeCartItem,
} from "@/lib/cart/cart";
import {
  CART_SESSION_STORAGE_KEY,
  clearLegacyCartCountCookie,
  createCartSessionStorage,
  readLegacyCartFromLocalStorage,
  removeLegacyCartFromLocalStorage,
} from "@/lib/cart/cartSession";

const cartSessionStorage = createCartSessionStorage();

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      migrateLegacyCart: () => {
        const currentCart = get().cart;

        if (currentCart.length > 0) {
          clearLegacyCartCountCookie();
          removeLegacyCartFromLocalStorage();
          return;
        }

        const legacyCart = readLegacyCartFromLocalStorage();

        if (legacyCart.length === 0) {
          clearLegacyCartCountCookie();
          return;
        }

        set({ cart: legacyCart.map((item) => normalizeCartItem(item)) });
        clearLegacyCartCountCookie();
        removeLegacyCartFromLocalStorage();
      },
      addToCart: (
        product,
        selectedDough = null,
        selectedExtras = [],
        selectedRemovals = [],
        selectedCookingOption = null,
        selectedSpiceLevel = null,
      ) => {
        const nextItem = normalizeCartItem(product, {
          quantity: 1,
          selectedDough,
          selectedExtras,
          selectedRemovals,
          selectedCookingOption,
          selectedSpiceLevel,
        });
        const nextItemKey = buildCartItemKey(nextItem);

        set((state) => {
          const existingItem = state.cart.find(
            (item) => buildCartItemKey(item) === nextItemKey,
          );

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                buildCartItemKey(item) === nextItemKey
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            cart: [...state.cart, nextItem],
          };
        });
      },
      removeFromCart: (
        productId,
        selectedDough = null,
        selectedExtras = [],
        selectedRemovals = [],
        selectedCookingOption = null,
        selectedSpiceLevel = null,
      ) => {
        const targetItemKey = buildCartSelectionKey(productId, {
          selectedDough,
          selectedExtras,
          selectedRemovals,
          selectedCookingOption,
          selectedSpiceLevel,
        });

        set((state) => ({
          cart: state.cart.filter(
            (item) => buildCartItemKey(item) !== targetItemKey,
          ),
        }));
      },
      updateQuantity: (
        productId,
        quantity,
        selectedDough = null,
        selectedExtras = [],
        selectedRemovals = [],
        selectedCookingOption = null,
        selectedSpiceLevel = null,
      ) => {
        if (quantity <= 0) {
          get().removeFromCart(
            productId,
            selectedDough,
            selectedExtras,
            selectedRemovals,
            selectedCookingOption,
            selectedSpiceLevel,
          );
          return;
        }

        const targetItemKey = buildCartSelectionKey(productId, {
          selectedDough,
          selectedExtras,
          selectedRemovals,
          selectedCookingOption,
          selectedSpiceLevel,
        });

        set((state) => ({
          cart: state.cart.map((item) =>
            buildCartItemKey(item) === targetItemKey
              ? { ...item, quantity }
              : item,
          ),
        }));
      },
      clearCart: () => {
        clearLegacyCartCountCookie();
        set({ cart: [] });
      },
      getTotalPrice: () => calculateCartTotal(get().cart),
    }),
    {
      name: CART_SESSION_STORAGE_KEY,
      storage: createJSONStorage(() => cartSessionStorage),
      partialize: (state) => ({ cart: state.cart }),
      onRehydrateStorage: () => (state) => {
        state?.migrateLegacyCart?.();
        state?.setHydrated?.();
      },
    },
  ),
);
