import fs from "fs";

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadToCloudinary = async (filePath: string): Promise<UploadApiResponse> => {
  try {
    const image = await cloudinary.uploader.upload(filePath, {
      folder: "mern-products",
      transformation: [
        { width: 200, height: 200, crop: "limit" }, // ⬅ Resize, max 800x800
        { quality: "auto" }, // ⬅ Auto-compression
        { fetch_format: "auto" }, // ⬅ WebP/AVIF/etc if supported
      ],
    });

    return image;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw new Error("Cloudinary upload failed");
  }
};
