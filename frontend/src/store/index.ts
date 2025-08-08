import {
  zProductBaseSchema,
  zProductResponseSchema,
  zProductListResponseSchema,
} from "@shared/types/zod";
import { withLoggerGroup } from "utils/logger-group";
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
    const start = performance.now();
    console.groupCollapsed("create-product");

    const isValidInput = zProductBaseSchema.safeParse(newProduct);
    if (!isValidInput.success) {
      storeLogger.warn("Invalid product input", newProduct);
      console.groupEnd();

      return {
        success: false,
        message: isValidInput.error.message ?? "Please fill in all fields.",
      };
    }

    try {
      storeLogger.debug("Sending new product to API", newProduct);
      const apiResponse = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      const newProductData = await apiResponse.json();
      storeLogger.debug("API responded with:", newProductData);

      const isValidApiResponse = zProductResponseSchema.safeParse(newProductData);
      if (!isValidApiResponse.success) {
        storeLogger.error("Invalid product response schema", newProductData);
        console.groupEnd();

        return {
          success: false,
          message: isValidApiResponse.error.message ?? "Invalid API response",
        };
      }

      const { success, message, data } = newProductData;
      set((state) => ({ products: [...state.products, data] }));

      storeLogger.info("Product created:", data);
      const duration = performance.now() - start;
      storeLogger.debug(`create-product took ${duration.toFixed(2)}ms`);
      console.groupEnd();

      return { success, message, data };
    } catch (error) {
      storeLogger.error("Failed to create product", error);
      console.groupEnd();

      throw error;
    }
  },

  // createProduct: (newProduct) =>
  //   runStoreAction("create-product", {
  //     input: newProduct,
  //     inputValidator: (p) => zProductBaseSchema.safeParse(p),
  //     task: async () => {
  //       const apiResponse = await fetch("/api/products", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(newProduct),
  //       });
  //       return apiResponse.json();
  //     },
  //     responseValidator: (res) => zProductResponseSchema.safeParse(res),
  //     onSuccess: ({ data }) => {
  //       set((state) => ({ products: [...state.products, data] }));
  //       storeLogger.info("Product created:", data);
  //     },
  //   }),

  // createProduct: async (newProduct) =>
  //   withLoggerGroup("create-product", async () => {
  //     const isValidInput = zProductBaseSchema.safeParse(newProduct);
  //     if (!isValidInput.success) {
  //       storeLogger.warn("Invalid product input", newProduct);
  //       return {
  //         success: false,
  //         message: isValidInput.error.message ?? "Please fill in all fields.",
  //       };
  //     }

  //     storeLogger.debug("Sending new product to API", newProduct);
  //     const apiResponse = await fetch("/api/products", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(newProduct),
  //     });

  //     const newProductData = await apiResponse.json();
  //     const isValidApiResponse = zProductResponseSchema.safeParse(newProductData);
  //     if (!isValidApiResponse.success) {
  //       storeLogger.error("Invalid product response schema", newProductData);
  //       return {
  //         success: false,
  //         message: isValidApiResponse.error.message ?? "Invalid API response",
  //       };
  //     }

  //     const { success, message, data } = newProductData;
  //     set((state) => ({ products: [...state.products, data] }));
  //     storeLogger.info("Product created:", data);
  //     return { success, message, data };
  //   }),

  fetchProducts: async () => {
    const start = performance.now();
    console.groupCollapsed("fetch-products");
    try {
      storeLogger.debug("Fetching initial products...");
      const apiResponse = await fetch(`/api/products?page=1&limit=6`);
      const productsData = await apiResponse.json();

      const isValidApiResponse = zProductListResponseSchema.safeParse(productsData);
      if (!isValidApiResponse.success) {
        storeLogger.warn("Invalid product list response", productsData);
        console.groupEnd();
        return {
          success: false,
          message: isValidApiResponse.error.message ?? "Have no products.",
        };
      }

      const { success, message, data } = productsData;
      set({ products: data, page: 2, hasMore: data.length === 6 });
      storeLogger.info("Products fetched:", data);
      const duration = performance.now() - start;
      storeLogger.debug(`fetch-products took ${duration.toFixed(2)}ms`);
      console.groupEnd();
      return { success, message, data };
    } catch (error) {
      storeLogger.error("Failed to fetch products", error);
      console.groupEnd();
      throw error;
    }
  },

  loadMoreProducts: async () => {
    const { page, products, hasMore } = get();
    if (!hasMore) {
      storeLogger.debug("No more products to load");
      return;
    }

    const start = performance.now();
    console.groupCollapsed("load-more-products");
    try {
      storeLogger.debug(`Loading more products: page ${page}`);
      const apiResponse = await fetch(`/api/products?page=${page}&limit=6`);
      const productsData = await apiResponse.json();

      const isValidApiResponse = zProductListResponseSchema.safeParse(productsData);
      if (!isValidApiResponse.success) {
        storeLogger.warn("Invalid response on load-more-products", productsData);
        console.groupEnd();
        return {
          success: false,
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

      storeLogger.info(`Loaded ${newProducts.length} more products.`);
      // TODO: do something with start and duration consts in each endpoint
      const duration = performance.now() - start;
      storeLogger.debug(`load-more-products took ${duration.toFixed(2)}ms`);
      console.groupEnd();
      return { success: true, message: "More products loaded." };
    } catch (error) {
      storeLogger.error("Failed to load more products", error);
      console.groupEnd();
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    const start = performance.now();
    console.groupCollapsed("delete-product");
    try {
      storeLogger.debug(`Deleting product with ID: ${productId}`);
      const apiResponse = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const removeData = await apiResponse.json();
      const isValidApiResponse = zProductResponseSchema.safeParse(removeData);
      if (!isValidApiResponse.success) {
        storeLogger.warn("Invalid response on delete", removeData);
        console.groupEnd();
        return {
          success: false,
          message:
            isValidApiResponse.error.message ??
            `Failed during remove the product with id ${productId}`,
        };
      }

      const { success, message } = removeData;
      if (!success) return { success, message };

      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
      }));

      storeLogger.info(`Product ${productId} deleted`);
      const duration = performance.now() - start;
      storeLogger.debug(`delete-product took ${duration.toFixed(2)}ms`);
      console.groupEnd();
      return { success, message };
    } catch (error) {
      storeLogger.error("Failed to delete product", error);
      console.groupEnd();
      throw error;
    }
  },

  updateProduct: async (productId, updatedProduct) => {
    const start = performance.now();
    console.groupCollapsed("update-product");
    const isValidInput = zProductBaseSchema.safeParse(updatedProduct);
    if (!isValidInput.success) {
      storeLogger.warn("Invalid update input", updatedProduct);
      console.groupEnd();
      return {
        success: false,
        message: isValidInput.error.message ?? "Please fill in all fields.",
      };
    }

    try {
      storeLogger.debug(`Updating product ${productId}`, updatedProduct);
      const apiResponse = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      const product = await apiResponse.json();
      const isValidApiResponse = zProductResponseSchema.safeParse(product);
      if (!isValidApiResponse.success) {
        storeLogger.warn("Invalid product update response", product);
        console.groupEnd();
        return {
          success: false,
          message: isValidApiResponse.error.message ?? "Invalid API response",
        };
      }

      const { success, message, data } = product;
      if (!success || !data) return { success, message };

      set((state) => ({
        products: state.products.map((product) => (product._id === productId ? data : product)),
      }));

      storeLogger.info(`Product ${productId} updated`, data);
      const duration = performance.now() - start;
      storeLogger.debug(`update-product took ${duration.toFixed(2)}ms`);
      console.groupEnd();
      return { success, message, data };
    } catch (error) {
      storeLogger.error("Failed to update product", error);
      console.groupEnd();
      throw error;
    }
  },
}));
