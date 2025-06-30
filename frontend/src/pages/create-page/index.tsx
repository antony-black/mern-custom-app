import { Box, Button, Container, Heading, Input, useColorModeValue, useToast, VStack } from "@chakra-ui/react";

import { useRef, useState } from "react";

import { useProductStore, type TProduct } from "@/store";

type TUpload = {
  success: boolean;
  url: string;
  publicId: string;
};

export const CreatePage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [newProduct, setNewProduct] = useState<TProduct>({
    name: "",
    price: 0,
    image: "",
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const { createProduct } = useProductStore();

  const handleAddProduct = async (): Promise<void> => {
    const { success, message } = await createProduct(newProduct);
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
    }

    setNewProduct({ name: "", price: 0, image: "" });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processFileBeforeUpload = async (file: File): Promise<TUpload> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data: TUpload = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error("Upload succeeded but no image URL was returned.");
      }

      setNewProduct((prev) => ({ ...prev, image: data.url, publicId: data.publicId }));

      toast({
        title: "Image uploaded",
        description: "Cloudinary image uploaded successfully",
        status: "success",
        isClosable: true,
      });

      return data;
    } catch (error) {
      console.error("Upload error:", error);

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
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        status: "error",
        isClosable: true,
      });
    } finally {
      setLoading(!true);
    }
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Create New Product
        </Heading>

        <Box w={"full"} bg={useColorModeValue("white", "gray.800")} p={6} rounded={"lg"} shadow={"md"}>
          <VStack spacing={4}>
            <Input
              placeholder="Product Name"
              name="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <Input
              placeholder="Price"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            />
            <Input
              ref={fileInputRef}
              placeholder="Image"
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

            <Button colorScheme="blue" onClick={handleAddProduct} w="full" isLoading={isLoading}>
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
