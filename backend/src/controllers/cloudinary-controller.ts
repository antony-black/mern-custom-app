import fs from "fs";

import { RequestHandler } from "express";
import { removeFromCloudinaryService, uploadToCloudinaryService } from "../services/cloudinary-service";
import { TResponse } from "../services/products-service";

export const uploadToCloudinary: RequestHandler = async (req, res) => {
  const filePath = req.file?.path;
  if (!filePath) {
    res.status(400).json({ success: false, message: "No image uploaded" });
    return;
  }

  const image = await uploadToCloudinaryService(filePath);

  fs.unlinkSync(filePath);

  res.json({
    success: true,
    url: image.secure_url,
    publicId: image.public_id,
  });
};

export const removeFromCloudinary: RequestHandler = async (req, res) => {
  const { publicId } = req.params;

  const dataAfterDeletion: TResponse = await removeFromCloudinaryService(publicId);

  res.json(dataAfterDeletion);
};
