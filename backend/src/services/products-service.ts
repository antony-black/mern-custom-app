import Product, { type IProduct } from "../models/product-model";
import { removeFromCloudinaryService } from "./cloudinary-service";

export type TResponse<T = IProduct> = {
  success: boolean;
  message: string;
  data?: T;
};

export const getAllProductsService = async (): Promise<TResponse<IProduct[]>> => {
  try {
    const products = await Product.find();
    if (products.length <= 0) {
      return {
        success: false,
        message: "Products not found.",
      };
    }

    return {
      success: true,
      message: "Products are available.",
      data: products,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("all-products-error:", error.message);
    }

    return {
      success: false,
      message: "Server error while fetching products.",
    };
  }
};

export const addProductService = async (product: IProduct): Promise<TResponse> => {
  const newProduct = new Product(product);
  if (!newProduct) {
    return {
      success: false,
      message: "A new product is not found.",
    };
  }

  try {
    const savedProduct = await newProduct.save();
    if (!savedProduct) {
      return {
        success: false,
        message: "Incorrect stored product.",
      };
    }

    return {
      success: true,
      message: "A new product added.",
      data: savedProduct,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("updated-product-error:", error.message);
      return {
        success: false,
        message: "Server error while adding a new product.",
      };
    }

    return {
      success: false,
      message: "Unknown error occurred.",
    };
  }
};

export const updateProductService = async (id: string, updatedProductData: IProduct): Promise<TResponse> => {
  try {
    const hasProduct = await Product.findById({ _id: id });
    if (!hasProduct) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    if (hasProduct.publicId !== updatedProductData.publicId) {
      await removeFromCloudinaryService(hasProduct.publicId);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, {
      new: true,
    });

    return {
      success: true,
      message: "Product updated.",
      data: updatedProduct?.toObject(),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("updated-product-error:", error.message);
      return {
        success: false,
        message: "Server error while updating product.",
      };
    }

    return {
      success: false,
      message: "Unknown error occurred.",
    };
  }
};

export const removeProductsService = async (id: string): Promise<TResponse> => {
  try {
    const product = await Product.findById({ _id: id });
    if (!product) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    await removeFromCloudinaryService(product.publicId);
    await product.deleteOne();

    return {
      success: true,
      message: "Product has been removed.",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("remove-products-error:", error.message);
    }

    return {
      success: false,
      message: "Failed to delete products.",
    };
  }
};
