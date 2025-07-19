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
  const { success, message } = await handleProduct(data);

  toast({
    title: success ? "Success" : "Error",
    description: message,
    status: success ? "success" : "error",
    isClosable: true,
  });
};
