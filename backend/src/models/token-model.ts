// const { Schema, model, SchemaTypes } = require("mongoose");
import { Schema, model, Types } from "mongoose";

type TToken = {
  userId: Types.ObjectId;
  refreshToken: string;
};

const tokenSchema = new Schema<TToken>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
});

const Token = model<TToken>("Token", tokenSchema);

export default Token;
