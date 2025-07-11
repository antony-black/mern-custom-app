import { create } from "zustand";
import type { IProduct, TApiResponse, TProduct } from "../../../backend/src/types";

type ProductStore = {
  products: TProduct[];
  page: number;
  hasMore: boolean;
  setProducts: (products: TProduct[]) => void;
  createProduct: (product: IProduct) => Promise<TApiResponse<TProduct>>;
  fetchProducts: () => Promise<TApiResponse<TProduct[]>>;
  loadMoreProducts: () => Promise<void>;
  deleteProduct: (productId: string) => Promise<TApiResponse>;
  updateProduct: (productId: string, updatedProduct: TProduct) => Promise<TApiResponse<TProduct>>;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  page: 1,
  hasMore: true,
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

    set((state) => ({ products: [...state.products, data] }));

    return { success, message, data };
  },

  fetchProducts: async () => {
    const res = await fetch(`/api/products?page=1&limit=6`);
    const { success, message, data } = await res.json();

    set({ products: data, page: 2, hasMore: data.length === 6 });

    return { success, message, data };
  },

  loadMoreProducts: async () => {
    const { page, products, hasMore } = get();
    if (!hasMore) return;

    const res = await fetch(`/api/products?page=${page}&limit=6`);
    const json: TApiResponse<TProduct[]> = await res.json();
    const data = json.data ?? [];

    const newProducts = data.filter((newProd) => !products.some((prod) => prod._id === newProd._id));

    set({
      products: [...products, ...newProducts],
      page: page + 1,
      hasMore: data.length === 6,
    });
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
