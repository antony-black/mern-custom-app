import {
  zProductBaseSchema,
  zProductResponseSchema,
  zProductListResponseSchema,
} from "@shared/types/zod";
import { create } from "zustand";
import type {
  TProduct,
  TProductBase,
  TProductApiResponse,
  TProductListApiResponse,
} from "@shared/types";

type ProductStore = {
  products: TProduct[];
  page: number;
  hasMore: boolean;
  setProducts: (products: TProduct[]) => void;
  createProduct: (product: TProductBase) => Promise<TProductApiResponse>;
  fetchProducts: () => Promise<TProductListApiResponse>;
  loadMoreProducts: () => Promise<TProductApiResponse | undefined>;
  deleteProduct: (productId: string) => Promise<TProductApiResponse>;
  updateProduct: (productId: string, updatedProduct: TProductBase) => Promise<TProductApiResponse>;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  page: 1,
  hasMore: true,
  setProducts: (products) => {
    set({ products });
  },

  createProduct: async (newProduct) => {
    console.log("newProduct:", newProduct);
    const isValidInput = zProductBaseSchema.safeParse(newProduct);
    if (!isValidInput.success) {
      return {
        success: isValidInput.success,
        message: isValidInput.error.message ?? "Please fill in all fields.",
      };
    }

    const apiResponse = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    const newProductData = await apiResponse.json();
    console.log("newProductData:", newProductData);
    const isValidApiResponse = zProductResponseSchema.safeParse(newProductData);
    console.log("isValidApiResponse:", isValidApiResponse);
    if (!isValidApiResponse.success) {
      return {
        success: isValidApiResponse.success,
        message: isValidApiResponse.error.message ?? "Invalid API response",
      };
    }

    const { success, message, data } = newProductData;

    set((state) => ({ products: [...state.products, data] }));

    return { success, message, data };
  },

  fetchProducts: async () => {
    const apiResponse = await fetch(`/api/products?page=1&limit=6`);
    const productsData = await apiResponse.json();
    console.log("productsData:", productsData);
    const isValidApiResponse = zProductListResponseSchema.safeParse(productsData);
    console.log("isValidApiResponse:", isValidApiResponse);
    if (!isValidApiResponse.success) {
      return {
        success: isValidApiResponse.success,
        message: isValidApiResponse.error.message ?? "Have no products.",
      };
    }

    const { success, message, data } = productsData;

    set({ products: data, page: 2, hasMore: data.length === 6 });

    return { success, message, data };
  },

  loadMoreProducts: async () => {
    const { page, products, hasMore } = get();
    if (!hasMore) return;

    const apiResponse = await fetch(`/api/products?page=${page}&limit=6`);
    const productsData = await apiResponse.json();
    console.log("productsData:", productsData);
    const isValidApiResponse = zProductListResponseSchema.safeParse(productsData);
    console.log("isValidApiResponse:", isValidApiResponse);
    if (!isValidApiResponse.success) {
      return {
        success: isValidApiResponse.success,
        message: isValidApiResponse.error.message ?? "Have no products.",
      };
    }
    const nextProductsPart: TProduct[] = productsData.data ?? [];

    const newProducts = nextProductsPart.filter(
      (newProd) => !products.some((prod) => prod._id === newProd._id),
    );

    set({
      products: [...products, ...newProducts],
      page: page + 1,
      hasMore: nextProductsPart.length === 6,
    });

    return { success: isValidApiResponse.success, message: "More products are available." };
  },

  deleteProduct: async (productId) => {
    const apiResponse = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    const removeData = await apiResponse.json();
    console.log("removeData:", removeData);
    const isValidApiResponse = zProductResponseSchema.safeParse(removeData);
    console.log("isValidApiResponse:", isValidApiResponse);
    if (!isValidApiResponse.success) {
      return {
        success: isValidApiResponse.success,
        message:
          isValidApiResponse.error.message ??
          `Failed during remove the product with id ${productId}`,
      };
    }

    const { success, message } = removeData;

    if (!success) return success;

    set((state) => ({
      products: state.products.filter((product) => product._id !== productId),
    }));

    return { success, message };
  },

  updateProduct: async (productId, updatedProduct) => {
    const isValidInput = zProductBaseSchema.safeParse(updatedProduct);
    if (!isValidInput.success) {
      return {
        success: isValidInput.success,
        message: isValidInput.error.message ?? "Please fill in all fields.",
      };
    }

    const apiResponse = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });

    const product = await apiResponse.json();
    console.log("product:", product);
    const isValidApiResponse = zProductResponseSchema.safeParse(product);
    console.log("isValidApiResponse:", isValidApiResponse);
    if (!isValidApiResponse.success) {
      return {
        success: isValidApiResponse.success,
        message: isValidApiResponse.error.message ?? "Invalid API response",
      };
    }

    const { success, message, data } = product;

    if (!success || !data) {
      return { success, message };
    }

    set((state) => ({
      products: state.products.map((product) => (product._id === productId ? data : product)),
    }));

    return { success, message, data };
  },
}));
