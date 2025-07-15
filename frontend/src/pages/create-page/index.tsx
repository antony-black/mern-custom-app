import { Box, Container, Heading, useColorModeValue, useToast, VStack } from "@chakra-ui/react";

import { useRef, useState } from "react";

import type { TCloudinaryImageRaw } from "@/types/cloudinary-type";
import type { TProductBase, TApiResponse } from "@shared/types";
import { PageWrapperComponent } from "@/components/page-wrapper-component";
import { ProductForm } from "@/components/product-form";
import { useProductStore } from "@/store";

export const CreatePage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [newProduct, setNewProduct] = useState<TProductBase>({
    name: "",
    price: 0,
    image: "",
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const { createProduct } = useProductStore();

  const handleAddProduct = async (): Promise<void> => {
    const { success, message } = await createProduct(newProduct);
    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      isClosable: true,
    });

    setNewProduct({ name: "", price: 0, image: "" });

    fileInputRef.current && (fileInputRef.current.value = "");
  };

  const processFileBeforeUpload = async (file: File): Promise<TApiResponse<TCloudinaryImageRaw>> => {
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

      setNewProduct((prev) => ({ ...prev, image: data.secure_url, publicId: data.public_id }));

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
      setLoading(true);

      const data = await processFileBeforeUpload(file);

      if (data) {
        setLoading(!data.success);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Upload error.", error.message);
      }
    } finally {
      setLoading(!true);
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
            <ProductForm
              formId="create"
              product={newProduct}
              setProduct={setNewProduct}
              onFileSelect={handleUploadFile}
              onAddProduct={handleAddProduct}
              isLoading={isLoading}
              fileInputRef={fileInputRef}
            />
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
