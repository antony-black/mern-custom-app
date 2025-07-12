import { IProduct, TApiResponse, TProduct } from "@shared/types";
import { removeFromCloudinaryService } from "./cloudinary-service";
import Product from "@/models/product-model";
import { transformDbResponseList, transformDbResponse } from "@/utility/transform-db-response";

export const getAllProductsService = async (page = 1, limit = 6): Promise<TApiResponse<TProduct[]>> => {
  try {
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);
    if (products.length <= 0) {
      return {
        success: true,
        message: products.length ? "Products are available." : "No more products.",
        data: [],
      };
    }

    return {
      success: true,
      message: "Products are available.",
      data: transformDbResponseList(products),
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

export const addProductService = async (product: IProduct): Promise<TApiResponse> => {
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
      data: transformDbResponse(savedProduct),
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

export const updateProductService = async (id: string, updatedProductData: IProduct): Promise<TApiResponse> => {
  try {
    const hasProduct = await Product.findById({ _id: id });
    if (!hasProduct) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    if (hasProduct.publicId && hasProduct.publicId !== updatedProductData.publicId) {
      await removeFromCloudinaryService(hasProduct.publicId);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, {
      new: true,
    });

    if (!updatedProduct) {
      return {
        success: false,
        message: "False during updating process.",
      };
    }

    return {
      success: true,
      message: "Product updated.",
      data: transformDbResponse(updatedProduct),
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

export const removeProductsService = async (id: string): Promise<TApiResponse> => {
  try {
    const product = await Product.findById({ _id: id });
    if (!product) {
      return {
        success: false,
        message: "Product not found.",
      };
    }
    if (!product.publicId) {
      return {
        success: false,
        message: "Image not found.",
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
