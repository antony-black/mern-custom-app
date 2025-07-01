import { Request, Response } from "express";

import {
  addProductService,
  getAllProductsService,
  removeProductsService,
  updateProductService,
} from "../services/products-service";

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  const products = await getAllProductsService();
  if (!products) {
    res.status(500).json({ success: false, message: "There are no products." });
    return;
  }

  res.status(200).json({
    success: products.success,
    data: products.data,
    message: products.message,
  });
};

export const addProduct = async (req: Request, res: Response): Promise<void> => {
  const product = req.body;

  if (!product.name || !product.price || !product.image || !product.publicId) {
    res.status(400).json({
      success: false,
      message: "Please provide all fields (data).",
    });

    return;
  }

  const newProduct = await addProductService(product);
  if (!newProduct) {
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }

  res.status(200).json({
    success: newProduct.success,
    message: newProduct.message,
    data: newProduct,
  });
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updatedProductData = req.body;

  const updatedProduct = await updateProductService(id, updatedProductData);

  if (!updatedProduct) {
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }

  res.status(200).json({
    success: updatedProduct.success,
    data: updatedProduct.data,
    message: updatedProduct.message,
  });
};

export const removeProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const deleteInfo = await removeProductsService(id);

  if (!deleteInfo) {
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }

  res.status(200).json({
    success: deleteInfo.success,
    message: deleteInfo.message,
  });
};
