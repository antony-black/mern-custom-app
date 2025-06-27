import fs from "fs";

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import express from "express";
import { RequestHandler } from "express";
import multer from "multer";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    console.log("originalname:", file);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const uploadHandler: RequestHandler = async (req, res) => {
  try {
    console.log("request:", req);
    const filePath = req.file?.path;
    if (!filePath) {
      res.status(400).json({ success: false, message: "No image uploaded" });
      return;
    }
    console.log("filePath:", filePath);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "mern-products",
      transformation: [
        { width: 800, height: 800, crop: "limit" }, // ⬅ Resize, max 800x800
        { quality: "auto" }, // ⬅ Auto-compression
        { fetch_format: "auto" }, // ⬅ WebP/AVIF/etc if supported
      ],
    });

    fs.unlinkSync(filePath);
    console.log("result:", result);
    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error("upload-error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

uploadRouter.post("/", upload.single("image"), uploadHandler);

export default uploadRouter;
