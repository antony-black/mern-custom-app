import fs from "fs";

import express from "express";
import { RequestHandler } from "express";
import multer from "multer";
import { uploadToCloudinary } from "../services/cloudinary-service";

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
// TODO: separate on service & controler
const uploadHandler: RequestHandler = async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (!filePath) {
      res.status(400).json({ success: false, message: "No image uploaded" });
      return;
    }

    const image = await uploadToCloudinary(filePath);

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      url: image.secure_url,
    });
  } catch (error) {
    console.error("upload-error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

uploadRouter.post("/", upload.single("image"), uploadHandler);

export default uploadRouter;
