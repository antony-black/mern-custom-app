import fs from "fs";

import { RequestHandler } from "express";
import { uploadToCloudinaryService } from "../services/cloudinary-service";

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
  });
};
