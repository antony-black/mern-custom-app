import Product, { type IProduct } from "../models/product-model";
import { removeFromCloudinaryService } from "./cloudinary-service";

//   try {
//     const products = await Product.find();

//     if (!products) {
//       throw Error("Products are undefined.");
//     }

//     return products;
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("all-products-error:", error.message);
//     }
//   }
// };
export type TResponse = {
  success: boolean;
  data?: IProduct;
  message?: string;
};

export type TProduct = Omit<IProduct, "publicId">;

export const getAllProductsService = async (): Promise<IProduct[] | undefined> => {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    if (error instanceof Error) {
      console.error("all-products-error:", error.message);
    }

    return [];
  }
};

export const addProductService = async (product: IProduct): Promise<TProduct | undefined> => {
  const newProduct = new Product(product);

  try {
    const savedProduct = await newProduct.save();
    console.log("savedProduct:", savedProduct);
    return savedProduct;
  } catch (error) {
    if (error instanceof Error) {
      console.error("new-product-error:", error.message);
    }
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
