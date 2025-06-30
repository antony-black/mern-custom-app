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
  fetchProducts: () => Promise<void>;
  deleteProduct: (productId: string) => Promise<TResponse>;
  updateProduct: (productId: string, updatedProduct: IProduct) => Promise<TResponse>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidProduct(obj: any): obj is IProduct {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj._id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.price === "number" &&
    typeof obj.image === "string"
  );
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [] as IProduct[],
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
    const data: TResponse = await res.json();
    set((state) => ({ products: { ...state.products, ...data.data } }));

    return { success: true, message: "Product created successfully" };
  },

  fetchProducts: async () => {
    const res = await fetch("/api/products");
    const data: { products: IProduct[] } = await res.json();

    set({ products: data.products });
  },

  deleteProduct: async (productId) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    const data: TResponse = await res.json();
    if (!data.success) return data;

    set((state) => ({
      products: state.products.filter((product) => product._id !== productId),
    }));

    return { success: true, message: "Product has been removed." };
  },

  updateProduct: async (productId, updatedProduct) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
    const data: TResponse = await res.json();
    if (!data.success || !data.data || !isValidProduct(data.data)) {
      return { success: false, message: data.message };
    }

    set((state) => ({
      products: state.products.map((product) => (product._id === productId ? (data.data as IProduct) : product)),
    }));

    return { success: data.success, message: data.message, data: data.data };
  },
}));
