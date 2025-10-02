import express from "express";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  removeProduct,
  getFullProduct,
} from "../controllers/products-controller";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getFullProduct);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", removeProduct);

export default router;
