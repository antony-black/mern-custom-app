import express from "express";
import { getAllProducts, addProduct, updateProduct, removeProduct } from "../controllers/products-controller";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.post("/", addProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", removeProduct);

export default productRouter;
