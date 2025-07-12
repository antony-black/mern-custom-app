import type { TProduct, IProduct } from "@shared/types";

export const productTypeValidation = (product: TProduct | IProduct): TProduct | IProduct => {
  if ("_id" in product && typeof product._id === "string") {
    return product as TProduct;
  }

  return product as IProduct;
};
