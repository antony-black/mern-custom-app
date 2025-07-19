import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { zProductBaseSchema } from "@shared/types/zod";
import { useState } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import type { TProductBase } from "@shared/types";
import { PageWrapperComponent } from "@/components/page-wrapper-component";
import { useProductStore } from "@/store";
import { productActionHandler } from "@/utils/product-action-handler";
import { handleUploadFile } from "@/utils/upload-file";

const initialFormState = {
  name: "",
  price: 0,
  image: "",
} satisfies TProductBase;

export const CreatePage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue,
  } = useForm<TProductBase>({
    defaultValues: initialFormState,
    resolver: zodResolver(zProductBaseSchema),
  });

  const [isUploading, setUploading] = useState<boolean>(false);
  const toast = useToast();
  const { createProduct } = useProductStore();

  const onSubmit: SubmitHandler<TProductBase> = async (data) => {
    await productActionHandler({ actionHandler: createProduct, toast, data });
    reset();
  };

  return (
    <Container maxW={"container.sm"}>
      <PageWrapperComponent title="add new | Product Store" content="Add a new amazing product!" />

      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Create New Product
        </Heading>

        <Box w={"full"} bg={useColorModeValue("white", "gray.800")} p={6} rounded={"lg"} shadow={"md"}>
          <VStack spacing={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                Submit
              </Button>
            </form>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
