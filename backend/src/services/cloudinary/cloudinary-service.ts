import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { TApiResponse } from "../../../../shared/src/types/index";
import { env } from "../../utils/env";
import { logger } from "../logger/logger-service";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinaryService = async (filePath: string): Promise<TApiResponse<UploadApiResponse>> => {
  try {
    const image = await cloudinary.uploader.upload(filePath, {
      folder: "mern-products",
      transformation: [
        { width: 200, height: 200, crop: "limit" }, // ⬅ Resize, max 800x800
        { quality: "auto" }, // ⬅ Auto-compression
        { fetch_format: "auto" }, // ⬅ WebP/AVIF/etc if supported
      ],
    });

    logger.info({
      logType: "cloudinary",
      message: "uploadToCloudinaryService.",
      logData: image,
    });

    return {
      success: true,
      message: "Upload to cloudinary.",
      data: image,
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error({
        logType: "cloudinary/uploadToCloudinaryService",
        error,
        logData: { filePath },
      });
    }

    throw new Error("Cloudinary upload failed");
  }
};

export const removeFromCloudinaryService = async (publicId: string): Promise<TApiResponse<void>> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok" && result.result !== "not_found") {
      throw new Error(`Unexpected Cloudinary response: ${result.result}`);
    }

    logger.info({
      logType: "cloudinary/removeFromCloudinaryService",
      message: `Image ${result.result === "ok" ? "deleted" : "not found"}`,
    });

    return {
      success: true,
      message: `Image ${result.result === "ok" ? "deleted" : "not found"}`,
    };
  } catch (error) {
    logger.error({
      logType: "cloudinary/removeFromCloudinaryService",
      error,
      logData: { publicId },
    });

    return {
      success: false,
      message: "Cloudinary image deletion failed.",
    };
  }
};
