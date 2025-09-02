import fs from "fs";

import { RequestHandler } from "express";
import { uploadToCloudinaryService, removeFromCloudinaryService } from "../services/cloudinary/cloudinary-service";

export const uploadToCloudinary: RequestHandler = async (req, res) => {
  const filePath = req.file?.path;
  console.log("filePath:", filePath);
  if (!filePath) {
    res.status(400).json({ success: false, message: "No image uploaded" });
    return;
  }

  const { success, message, data } = await uploadToCloudinaryService(filePath);

  fs.unlinkSync(filePath);

  res.json({ success, message, data });
};

export const removeFromCloudinary: RequestHandler = async (req, res) => {
  const { publicId } = req.params;

  const dataAfterDeletion = await removeFromCloudinaryService(publicId);

  res.json(dataAfterDeletion);
};
