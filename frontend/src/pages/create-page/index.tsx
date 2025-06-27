import { Box, Button, Container, Heading, Input, useColorModeValue, useToast, VStack } from "@chakra-ui/react";

import { useState } from "react";

import type { IProduct } from "../../../../backend/src/models/product-model";
import { useProductStore } from "@/store";

export const CreatePage: React.FC = () => {
  const [newProduct, setNewProduct] = useState<IProduct>({
    name: "",
    price: 0,
    image: "",
  });
  const toast = useToast();

  const { createProduct } = useProductStore();

  const handleAddProduct = async () => {
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
              placeholder="Image"
              name="image"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                console.log("target:", e.target);
                const file = e.target.files?.[0];
                if (!file) return;
                console.log("file:", file);
                const formData = new FormData();
                formData.append("image", file);
                console.log("formData:", formData);
                try {
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });

                  const data = await res.json();
                  console.log("data:", data);
                  if (data?.url) {
                    setNewProduct((prev) => ({ ...prev, image: data.url }));
                    toast({
                      title: "Image uploaded",
                      description: "Cloudinary image uploaded successfully",
                      status: "success",
                      isClosable: true,
                    });
                  } else {
                    throw new Error("Upload failed");
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
                }
              }}
            />

            <Button colorScheme="blue" onClick={handleAddProduct} w="full">
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
