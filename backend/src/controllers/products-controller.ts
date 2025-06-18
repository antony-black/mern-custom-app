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
  }

  res.status(200).json({ success: true, data: products });
};

export const addProduct = async (req: Request, res: Response): Promise<void> => {
  const product = req.body;

  if (!product.name || !product.price || !product.image) {
    res.status(400).json({
      success: false,
      message: "Please provide all fields.",
    });
  }

  const newProduct = await addProductService(product);

  if (!newProduct) {
    res.status(500).json({ success: false, message: "Server Error" });
  }

  res.status(200).json({ success: true, data: newProduct });
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const product = req.body;

  const updatedProduct = await updateProductService(id, product);

  if (!updatedProduct) {
    res.status(500).json({ success: false, message: "Server Error" });
  }

  res.status(200).json({ success: true, message: updatedProduct });
};

export const removeProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const info = await removeProductsService(id);

  if (!info) {
    res.status(500).json({ success: false, message: "Server Error" });
  }

  res.status(200).json({ success: true, message: info });
};
