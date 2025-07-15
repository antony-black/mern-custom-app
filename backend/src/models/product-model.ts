import mongoose from "mongoose";
import { TProductBase } from "../../../shared/src/types/index";

const productSchema = new mongoose.Schema<TProductBase>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

const Product = mongoose.model<TProductBase>("Product", productSchema);

export default Product;
