import { TDbDoc, TProduct } from "../types";

export const transformDbResponse = (product: TDbDoc): TProduct => {
  const obj = product.toObject?.() || product;
  return {
    ...obj,
    _id: obj._id.toString(),
    createdAt: obj.createdAt?.toISOString?.(),
    updatedAt: obj.updatedAt?.toISOString?.(),
  };
};

export const transformDbResponseList = (products: TDbDoc[]): TProduct[] => {
  return products.map(transformDbResponse);
};
