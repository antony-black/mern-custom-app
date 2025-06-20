import mongoose from "mongoose";

export interface IProduct {
  name: string;
  price: number;
  image: string;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
