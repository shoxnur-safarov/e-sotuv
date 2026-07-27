import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "../types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;
        const existing = items.find((i) => i.product.id === product.id);

        if (existing) {
          // Ombordagi sonidan oshib ketmasligini tekshiramiz
          if (existing.quantity >= product.stock) {
            return; // Agar teng yoki ko'p bo'lsa, ortiqcha qo'shmaymiz
          }
          set({
            items: items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          // Omborda kamida 1 ta mahsulot bo'lsagina savatga qo'shamiz
          if (product.stock > 0) {
            set({ items: [...items, { product, quantity: 1 }] });
          }
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((i) => {
            if (i.product.id === productId) {
              // So'ralayotgan soni ombor qoldig'idan oshsa, maksimal stock sonini beramiz
              const maxQuantity = Math.min(quantity, i.product.stock);
              return { ...i, quantity: maxQuantity };
            }
            return i;
          }),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: "e-sotuv-cart",
    }
  )
);