import { create } from "zustand";
import type { IProduct as IProductBase } from "../../../backend/src/models/product-model";
import type { TResponse } from "../../../backend/src/services/products-service";

// Extend the backend model to include MongoDB-specific properties
export interface IProduct extends IProductBase {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TProduct = {
  name: string;
  price: number;
  image: string;
  publicId?: string;
};

type ProductStore = {
  products: IProduct[];
  setProducts: (products: IProduct[]) => void;
  createProduct: (product: TProduct) => Promise<TResponse>;
  fetchProducts: () => Promise<TResponse<IProduct[]>>;
  deleteProduct: (productId: string) => Promise<TResponse>;
  updateProduct: (productId: string, updatedProduct: IProduct) => Promise<TResponse>;
};

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => {
    set({ products });
  },

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

    const { success, message, data } = await res.json();

    set((state) => ({ products: { ...state.products, ...data } }));

    return { success, message, data };
  },

  fetchProducts: async () => {
    const res = await fetch("/api/products");

    const { success, message, data } = await res.json();

    set({ products: data });

    return { success, message, data };
  },

  deleteProduct: async (productId) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    const { success, message } = await res.json();

    if (!success) return success;

    set((state) => ({
      products: state.products.filter((product) => product._id !== productId),
    }));

    return { success, message };
  },

  updateProduct: async (productId, updatedProduct) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });

    const { success, message, data } = await res.json();

    if (!success || !data) {
      return { success, message };
    }

    set((state) => ({
      products: state.products.map((product) => (product._id === productId ? data : product)),
    }));

    return { success, message, data };
  },
}));
