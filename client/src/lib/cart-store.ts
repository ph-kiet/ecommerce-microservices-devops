import { create, StateCreator } from "zustand";
import { IProduct } from "./types";
import { createJSONStorage, persist } from "zustand/middleware";

interface Store {
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  addItem: (item: IProduct) => void;
  removeItem: (item: IProduct) => void;
  clearCart: () => void;
}

const cartStore: StateCreator<Store> = (set) => ({
  items: [],
  addItem: (item: IProduct) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      } else {
        return {
          items: [...state.items, { ...item, quantity: 1 }],
        };
      }
    });
  },
  removeItem: (item: IProduct) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== item.id) }));
  },
  clearCart: () => {
    set({ items: [] });
  },
});

const useCartStore = create(
  persist(cartStore, {
    name: "cart",
    storage: createJSONStorage(() => localStorage),
  })
);

export default useCartStore;
