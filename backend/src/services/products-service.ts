import Product, { IProduct } from "../models/product-model";

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
type TResponse = {
  success: boolean;
  data?: IProduct | IProduct[];
  message?: string;
};

export const getAllProductsService = async (): Promise<TResponse> => {
  try {
    const products = await Product.find();

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("all-products-error:", error.message);
    }

    return {
      success: false,
      message: "Failed to fetch products.",
    };
  }
};

export const addProductService = async (product: IProduct): Promise<TResponse> => {
  const newProduct = new Product(product);

  try {
    const savedProduct = await newProduct.save();

    return {
      success: true,
      data: savedProduct,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("new-product-error:", error.message);
    }

    return {
      success: false,
      message: "Failed to add new product.",
    };
  }
};

export const updateProductService = async (id: string, product: IProduct): Promise<TResponse> => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });

    if (!updatedProduct) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    return {
      success: true,
      data: updatedProduct.toObject(),
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
    await Product.findByIdAndDelete({ _id: id });

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
