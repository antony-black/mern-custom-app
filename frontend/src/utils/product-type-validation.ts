import type { TProduct, TProductBase } from "@shared/types";

export const productTypeValidation = (product: TProduct | TProductBase): TProduct | TProductBase => {
  if ("_id" in product && typeof product._id === "string") {
    return product as TProduct;
  }

  return product as TProductBase;
};
