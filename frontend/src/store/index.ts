import {
  zProductBaseSchema,
  zProductResponseSchema,
  zProductListResponseSchema,
  zIdSchema,
} from "@shared/types/zod";
import { createZodValidator, getProducts, handleRequest, storeLogger, runStoreAction } from "utils";
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
  deleteProduct: (id: string) => Promise<TProductApiResponse>;
  updateProduct: (id: string, updatedProduct: TProductBase) => Promise<TProductApiResponse>;
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
      inputValidator: createZodValidator(zProductBaseSchema),
      action: async (data) => await handleRequest({ method: "POST", data }),
      responseValidator: createZodValidator(zProductResponseSchema),
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
      responseValidator: createZodValidator(zProductListResponseSchema),
      action: async () => await getProducts(),
      onSuccess: async (data) => {
        set({ products: data, page: 2, hasMore: data.length === 6 });
      },
    });
  },

  loadMoreProducts: async () => {
    const { page, products, hasMore } = get();
    if (!hasMore) {
      storeLogger.debug("No more products to load");
      storeLogger.groupEnd();

      return { success: false, message: "No more products to load." };
    }

    return runStoreAction<number, TProduct[], TProductListApiResponse>({
      label: "load-more-products",
      action: async () => getProducts({ page }),
      responseValidator: createZodValidator(zProductListResponseSchema),
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
      inputValidator: createZodValidator(zIdSchema),
      action: (id) => handleRequest({ method: "DELETE", id }),
      responseValidator: createZodValidator(zProductResponseSchema),
      onDelete: async () => {
        set((state) => ({
          products: state.products.filter((product) => product._id !== productId),
        }));
      },
    });
  },

  updateProduct: async (id, updatedProduct) => {
    return runStoreAction<TProductBase, TProduct, TProductApiResponse>({
      label: "update-product",
      inputData: updatedProduct,
      inputValidator: createZodValidator(zProductBaseSchema),
      action: async (data) => await handleRequest({ method: "PUT", id, data }),
      responseValidator: createZodValidator(zProductResponseSchema),
      onSuccess: async (data) => {
        set((state) => ({
          products: state.products.map((product) => (product._id === id ? data : product)),
        }));
      },
    });
  },
}));
