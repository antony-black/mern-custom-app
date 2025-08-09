import {
  zProductBaseSchema,
  zProductResponseSchema,
  zProductListResponseSchema,
} from "@shared/types/zod";
import { storeLogger } from "utils/logger-handler";
import { runStoreAction } from "utils/run-store-action";
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
    storeLogger.debug("Setting products:", products);
    set({ products });
  },

  createProduct: async (newProduct) => {
    return runStoreAction<TProductBase, TProduct, TProductApiResponse>({
      label: "create-product",
      inputData: newProduct,
      inputValidator: (input) => zProductBaseSchema.safeParse(input),
      action: async (data) => {
        return await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      },
      responseValidator: (responseAPI) => zProductResponseSchema.safeParse(responseAPI),
      onSuccess: async (product) => {
        set((state) => ({
          products: [...state.products, product],
        }));
      },
    });
  },

  fetchProducts: async () => {
    return runStoreAction<undefined, TProduct[], TProductListApiResponse>({
      label: "fetch-products",
      action: async () => await fetch(`/api/products?page=1&limit=6`),
      responseValidator: (productsData) => zProductListResponseSchema.safeParse(productsData),
      onSuccess: async (data) => {
        set({ products: data, page: 2, hasMore: data.length === 6 });
      },
    });
  },

  loadMoreProducts: async () => {
    const { page, products, hasMore } = get();
    if (!hasMore) {
      storeLogger.debug("No more products to load");
      return { success: false, message: "No more products to load." };
    }

    return runStoreAction<number, TProduct[], TProductListApiResponse>({
      label: "load-more-products",
      action: async () => await fetch(`/api/products?page=${page}&limit=6`),
      responseValidator: (productsData) => zProductListResponseSchema.safeParse(productsData),
      onSuccess: async (nextProductsPart) => {
        const newProducts = nextProductsPart.filter(
          (newProd) => !products.some((prod) => prod._id === newProd._id),
        );
        set({
          products: [...products, ...newProducts],
          page: page + 1,
          hasMore: nextProductsPart.length === 6,
        });
      },
    });
  },

  deleteProduct: async (productId) => {
    return runStoreAction<
      string,
      undefined,
      { success: boolean; message: string; data?: undefined }
    >({
      label: "delete-product",
      inputData: productId,
      action: (id) => {
        return fetch(`/api/products/${id}`, {
          method: "DELETE",
        });
      },
      responseValidator: (removeData) => zProductResponseSchema.safeParse(removeData),
      onDelete: async () => {
        set((state) => ({
          products: state.products.filter((product) => product._id !== productId),
        }));
      },
    });
  },

  updateProduct: async (productId, updatedProduct) => {
    return runStoreAction<TProductBase, TProduct, TProductApiResponse>({
      label: "update-product",
      inputData: updatedProduct,
      inputValidator: (updatedProduct) => zProductBaseSchema.safeParse(updatedProduct),
      action: async (updatedProduct) =>
        fetch(`/api/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }),
      responseValidator: (product) => zProductResponseSchema.safeParse(product),
      onSuccess: async (data) => {
        set((state) => ({
          products: state.products.map((product) => (product._id === productId ? data : product)),
        }));
      },
    });
  },
}));
