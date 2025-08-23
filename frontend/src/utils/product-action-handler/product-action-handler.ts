import type { UseToastOptions } from "@chakra-ui/react";
import type { TProductApiResponse } from "@shared/types";

interface IProductActionHandler<T> {
  data: T;
  toast: (options: UseToastOptions) => void;
  handleProduct: (data: T) => Promise<TProductApiResponse>;
}

export const productActionHandler = async <T>({
  handleProduct,
  toast,
  data,
}: IProductActionHandler<T>): Promise<void> => {
  try {
    const { success, message } = await handleProduct(data);

    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      isClosable: true,
    });
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Unexpected error occurred.",
      status: "error",
      isClosable: true,
    });
  }
};
