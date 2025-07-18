import type { UseToastOptions } from "@chakra-ui/react";
import type { TProductApiResponse } from "@shared/types";

interface IProductActionHandler<T> {
  data: T;
  toast: (options: UseToastOptions) => void;
  actionHandler: (data: T) => Promise<TProductApiResponse>;
}

export const productActionHandler = async <T>({
  actionHandler,
  toast,
  data,
}: IProductActionHandler<T>): Promise<void> => {
  const { success, message } = await actionHandler(data);

  toast({
    title: success ? "Success" : "Error",
    description: message,
    status: success ? "success" : "error",
    isClosable: true,
  });
};
