import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      hydrated: false,
      setHydrated: () => set(() => ({ hydrated: true })),

      addToCart: (
        product,
        selectedDough = null,
        selectedExtras = [],
        selectedRemovals = [],
        selectedCookingOption = null,
        selectedSpiceLevel = null
      ) => {
        const cart = get().cart;

        const existingItem = cart.find(
          (item) =>
            item.id === product.id &&
            item.selectedDough === selectedDough &&
            JSON.stringify(item.selectedExtras) ===
              JSON.stringify(selectedExtras) &&
            JSON.stringify(item.selectedRemovals) ===
              JSON.stringify(selectedRemovals) &&
            item.selectedCookingOption === selectedCookingOption &&
            item.selectedSpiceLevel === selectedSpiceLevel
        );

        if (existingItem) {
          // If item exists, update its quantity
          set({
            cart: cart.map((item) =>
              item.id === product.id &&
              item.selectedDough === selectedDough &&
              JSON.stringify(item.selectedExtras) ===
                JSON.stringify(selectedExtras) &&
              JSON.stringify(item.selectedRemovals) ===
                JSON.stringify(selectedRemovals) &&
              item.selectedCookingOption === selectedCookingOption &&
              item.selectedSpiceLevel === selectedSpiceLevel
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // Otherwise, add it as a new item
          set({
            cart: [
              ...cart,
              {
                ...product,
                quantity: 1,
                selectedDough,
                selectedExtras,
                selectedRemovals,
                selectedCookingOption,
                selectedSpiceLevel,
              },
            ],
          });
        }
      },

      // Remove an item from the cart
      removeFromCart: (
        productId,
        selectedDough = null,
        selectedExtras = [],
        selectedRemovals = [],
        selectedCookingOption = null,
        selectedSpiceLevel = null
      ) => {
        set({
          cart: get().cart.filter(
            (item) =>
              item.id !== productId ||
              item.selectedDough !== selectedDough ||
              JSON.stringify(item.selectedExtras) !==
                JSON.stringify(selectedExtras) ||
              JSON.stringify(item.selectedRemovals) !==
                JSON.stringify(selectedRemovals) ||
              item.selectedCookingOption !== selectedCookingOption ||
              item.selectedSpiceLevel !== selectedSpiceLevel
          ),
        });
      },

      // Update item quantity
      updateQuantity: (
        productId,
        quantity,
        selectedDough = null,
        selectedExtras = [],
        selectedRemovals = [],
        selectedCookingOption = null,
        selectedSpiceLevel = null
      ) => {
        if (quantity <= 0) {
          // Remove the item if quantity is 0 or less
          get().removeFromCart(
            productId,
            selectedDough,
            selectedExtras,
            selectedRemovals,
            selectedCookingOption,
            selectedSpiceLevel
          );
        } else {
          set({
            cart: get().cart.map((item) =>
              item.id === productId &&
              item.selectedDough === selectedDough &&
              JSON.stringify(item.selectedExtras) ===
                JSON.stringify(selectedExtras) &&
              JSON.stringify(item.selectedRemovals) ===
                JSON.stringify(selectedRemovals) &&
              item.selectedCookingOption === selectedCookingOption &&
              item.selectedSpiceLevel === selectedSpiceLevel
                ? { ...item, quantity }
                : item
            ),
          });
        }
      },

      // Clear the entire cart
      clearCart: () => set({ cart: [] }),

      // Get total cart price
      getTotalPrice: () => {
        return get()
          .cart.filter((item) => !!item)
          .reduce(
            (total, item) =>
              total +
              item.price * item.quantity +
              (item.selectedDough?.price || 0) * item.quantity +
              item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0) *
                item.quantity,
            0
          )
          .toFixed(2);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const hostname =
            typeof window !== "undefined"
              ? window.location.hostname
              : "default";
          return localStorage.getItem(`${name}-${hostname}`);
        },
        setItem: (name, value) => {
          const hostname =
            typeof window !== "undefined"
              ? window.location.hostname
              : "default";
          return localStorage.setItem(`${name}-${hostname}`, value);
        },
        removeItem: (name) => {
          const hostname =
            typeof window !== "undefined"
              ? window.location.hostname
              : "default";
          return localStorage.removeItem(`${name}-${hostname}`);
        },
      })),
      partialize: (state) => ({ cart: state.cart }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated?.();
      },
    }
  )
);
