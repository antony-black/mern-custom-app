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
import type { TProductBase } from "@shared/types";
import { handleUploadFile } from "@/utils/upload-file";

type TProductForm = {
  formId: string;
  initialFormState: TProductBase;
  onSubmit: SubmitHandler<TProductBase>;
  shouldReset?: boolean;
};

export const ProductForm: React.FC<TProductForm> = ({
  formId,
  initialFormState,
  onSubmit,
  shouldReset,
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

  const handleFormSubmit: SubmitHandler<TProductBase> = async (data) => {
    await onSubmit(data);

    if (shouldReset) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
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

              await handleUploadFile({ file, toast, setValue, setUploading });
            }}
          />
          <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          w="full"
          isLoading={isUploading || isSubmitting}
          disabled={!isValid || isSubmitting}
        >
          {formId === "create" ? "Submit" : "Update"}
        </Button>
      </VStack>
    </form>
  );
};
