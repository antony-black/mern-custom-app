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
import type { TCloudinaryImageRaw } from "@/types/cloudinary-type";
import type { TApiResponse, TProductBase } from "@shared/types";
import { PageWrapperComponent } from "@/components/page-wrapper-component";
import { useProductStore } from "@/store";

const initialFormState: TProductBase = {
  name: "",
  price: 0,
  image: "",
};

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
    await handleAddProduct(data);
    reset();
  };

  const handleAddProduct = async (data: TProductBase): Promise<void> => {
    console.log("🚀 Submitting product data:", data);
    const { success, message } = await createProduct(data);
    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      isClosable: true,
    });
  };

  const uploadFile = async (file: File): Promise<TApiResponse<TCloudinaryImageRaw>> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadedImage: TApiResponse<TCloudinaryImageRaw> = await res.json();
      const { success, message, data } = uploadedImage;

      if (!res.ok || !data?.secure_url) {
        throw new Error("Upload succeeded but no image URL was returned.");
      }

      toast({
        title: "Image uploaded",
        description: message,
        status: "success",
        isClosable: true,
      });

      return { success, message, data };
    } catch (error) {
      if (error instanceof Error) {
        console.error("Upload error.", error.message);
      }

      toast({
        title: "Upload failed",
        description: (error as Error).message ?? "Something went wrong during upload.",
        status: "error",
        isClosable: true,
      });

      throw new Error("Upload error.");
    }
  };

  const handleUploadFile = async (file: File): Promise<void> => {
    try {
      setUploading(true);

      const uploadedFileData = await uploadFile(file);
      const { data, success } = uploadedFileData;

      if (success && data?.secure_url) {
        setValue("image", data.secure_url, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("publicId", data.public_id, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Upload error.", error.message);
      }
    } finally {
      setUploading(false);
    }
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

                    await handleUploadFile(file);
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
