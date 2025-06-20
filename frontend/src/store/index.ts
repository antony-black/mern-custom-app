import { create } from "zustand";
import type { IProduct as IProductBase } from "../../../backend/src/models/product-model";
import type { TResponse } from "../../../backend/src/services/products-service";

// Extend the backend model to include MongoDB-specific properties
export interface IProduct extends IProductBase {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductStore {
  products: IProduct[];
  setProducts: (products: IProduct[]) => void;
  createProduct: (product: IProductBase) => Promise<TResponse>;
  fetchProducts: () => Promise<void>;
  deleteProduct: (productId: string) => Promise<TResponse>;
  updateProduct: (productId: string, updatedProduct: IProductBase) => Promise<TResponse>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    const data = await res.json();
    set((state) => ({ products: [...state.products, data.data] }));
    return { success: true, message: "Product created successfully" };
  },

  fetchProducts: async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    set({ products: data.data });
  },

  deleteProduct: async (productId) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({ products: state.products.filter((product) => product._id !== productId) }));
    return { success: true, message: data.message };
  },

  updateProduct: async (productId, updatedProduct) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      products: state.products.map((product) => (product._id === productId ? data.data : product)),
    }));

    return { success: true, message: data.message };
  },
}));
