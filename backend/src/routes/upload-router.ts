import express from "express";
import multer from "multer";
import { removeFromCloudinary, uploadToCloudinary } from "../controllers/cloudinary-controller";

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

uploadRouter.post("/", upload.single("image"), uploadToCloudinary);
uploadRouter.delete("/:publicId", removeFromCloudinary);

export default uploadRouter;
