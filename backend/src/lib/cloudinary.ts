import fs from "fs/promises";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

type UploadOptions = {
  filePath: string;
  folder?: string;
  transformation?: object[];
};

export const uploadToCloudinary = async ({
  filePath,
  folder = "mern-products",
  transformation = [{ width: 800, height: 800, crop: "limit" }, { quality: "auto" }, { fetch_format: "auto" }],
}: UploadOptions): Promise<{ success: boolean; url?: string; public_id?: string; message?: string }> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      transformation,
    });

    // Clean up local file
    await fs.unlink(filePath);

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      message: "Upload failed",
    };
  }
};
