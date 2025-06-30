import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import type { IProduct } from "@/store";
import { useProductStore } from "@/store";

type TProductCardProps = {
  product: IProduct;
};

type TUpload = {
  success: boolean;
  url: string;
  publicId: string;
};

export const ProductCard: React.FC<TProductCardProps> = ({ product }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [isLoading, setLoading] = useState<boolean>(false);

  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteProduct = async (productId: string) => {
    const { success, message } = await deleteProduct(productId);
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateProduct = async (productId: string, updatedProduct: IProduct) => {
    const { success, message } = await updateProduct(productId, updatedProduct);
    onClose();
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: "Product updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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

      setUpdatedProduct((prev) => ({ ...prev, image: data.url, publicId: data.publicId }));

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
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
    >
      <Image src={product.image} alt={product.name} h={48} w="full" objectFit="contain" />

      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {product.name}
        </Heading>

        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
          ${product.price}
        </Text>

        <HStack spacing={2}>
          <IconButton icon={<EditIcon />} onClick={onOpen} colorScheme="blue" aria-label={""} />
          <IconButton
            icon={<DeleteIcon />}
            onClick={() => handleDeleteProduct(product._id)}
            colorScheme="red"
            aria-label={""}
          />
        </HStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Product Name"
                name="name"
                value={updatedProduct.name}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
              />
              <Input
                placeholder="Price"
                name="price"
                type="number"
                value={updatedProduct.price}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: parseFloat(e.target.value) })}
              />
              <Input
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
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateProduct(product._id, updatedProduct)}
              isLoading={isLoading}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
