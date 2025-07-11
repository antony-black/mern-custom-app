import mongoose from "mongoose";
import { IProduct } from "../types";

const productSchema = new mongoose.Schema<IProduct>(
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

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
