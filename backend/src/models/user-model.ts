// import mongoose from "mongoose";
import { Schema, model } from "mongoose";
// import { TProductBase } from "../../../shared/src/types/index";

export type TUser = {
  name: string;
  email: string;
  password: string;
};

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

const User = model<TUser>("User", userSchema);

export default User;
