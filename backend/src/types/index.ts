import { Document, Types } from "mongoose";

export interface IProduct {
  name: string;
  price: number;
  image: string;
  publicId?: string;
}

export type TDbDoc = Document &
  IProduct & {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  };

export type TProduct = IProduct & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TApiResponse<T = TProduct> = {
  success: boolean;
  message: string;
  data?: T;
};
