import { Request, Response } from "express";

import {
  addProductService,
  getAllProductsService,
  removeProductsService,
  updateProductService,
} from "../services/products-service";

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;

  const { success, message, data } = await getAllProductsService(page, limit);
  if (!success) {
    res.status(500).json({ success, message });
    return;
  }

  res.status(200).json({ success, message, data });
};

export const addProduct = async (req: Request, res: Response): Promise<void> => {
  const { name, price, image, publicId } = req.body;

  if (!name || !price || !image || !publicId) {
    res.status(400).json({
      success: false,
      message: "Please provide all fields (data).",
    });

    return;
  }

  const { success, message, data } = await addProductService({ name, price, image, publicId });
  if (!success) {
    res.status(500).json({ success, message });
    return;
  }

  res.status(200).json({ success, message, data });
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updatedProductData = req.body;

  const { success, message, data } = await updateProductService(id, updatedProductData);

  if (!success) {
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }

  res.status(200).json({ success, data, message });
};

export const removeProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const { success, message } = await removeProductsService(id);

  if (!success) {
    res.status(500).json({ success, message });
    return;
  }

  res.status(200).json({ success, message });
};
