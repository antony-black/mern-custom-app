import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { zProductBaseSchema } from "@shared/types/zod";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { formLogger } from "utils/logger/logger-handler";
import { productActionHandler } from "utils/product-action-handler";
import { handleUploadFile } from "utils/upload-file";
import type { TProductApiResponse, TProductBase } from "@shared/types";

type TProductFormAction =
  | { type: "create"; actionHandler: (data: TProductBase) => Promise<TProductApiResponse> }
  | {
      type: "update";
      actionHandler: (productId: string, updatedData: TProductBase) => Promise<TProductApiResponse>;
      productId: string;
    };

type TProductForm = {
  initialFormState: TProductBase;
  action: TProductFormAction;
  shouldReset?: boolean;
  onSuccess?: () => void;
};

export const ProductForm: React.FC<TProductForm> = ({
  initialFormState,
  action,
  shouldReset,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    reset,
  } = useForm<TProductBase>({
    defaultValues: initialFormState,
    resolver: zodResolver(zProductBaseSchema),
  });

  const toast = useToast();

  const [isUploading, setUploading] = useState<boolean>(false);

  const isLoading = isSubmitting || isUploading;
  const isEnabled = !isValid || isSubmitting || isUploading;

  const onSubmit: SubmitHandler<TProductBase> = async (data) => {
    try {
      if (action.type === "create") {
        await productActionHandler({
          handleProduct: action.actionHandler,
          toast,
          data,
        });
      } else {
        await productActionHandler({
          toast,
          data: {
            productId: action.productId,
            updatedData: data,
          },
          handleProduct: async ({ productId, updatedData }) => {
            return action.actionHandler(productId, updatedData);
          },
        });

        onSuccess?.();
      }

      if (shouldReset) {
        reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Product Name</FormLabel>
          <Input
            placeholder="Product Name"
            {...register("name", {
              required: "Product name is required",
            })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.price}>
          <FormLabel>Price</FormLabel>
          <Input
            placeholder="Price"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
            })}
          />
          <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.image}>
          <FormLabel>Image</FormLabel>
          <Input
            name="image"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];

              if (!file) {
                return;
              }

              formLogger.info("User selected file:", file.name);

              // await handleUploadFile({ file, toast, setValue, setUploading });
              await handleUploadFile({ file, setValue, setUploading });

              formLogger.info("Upload process returned to form.");
            }}
          />
          <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          w="full"
          isLoading={isLoading}
          disabled={isEnabled}
        >
          {action.type === "create" ? "Submit" : "Update"}
        </Button>
      </VStack>
    </form>
  );
};
