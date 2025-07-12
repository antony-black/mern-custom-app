import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
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
import { PageWrapperComponent } from "../page-wrapper-component";
import { ProductForm } from "../product-form";
import type { TCloudinaryImageRaw } from "@/types/cloudinary-type";
import type { TProduct, IProduct, TApiResponse } from "@shared/types";
import { useProductStore } from "@/store";

type TProductCardProps = {
  product: TProduct;
};

export const ProductCard: React.FC<TProductCardProps> = ({ product }) => {
  const [updatedProduct, setUpdatedProduct] = useState<IProduct | TProduct>(product);
  const [isLoading, setLoading] = useState<boolean>(false);

  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteProduct = async (productId: string) => {
    const { success, message } = await deleteProduct(productId);
    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdateProduct = async (productId: string, updatedProduct: TProduct) => {
    const { success, message } = await updateProduct(productId, updatedProduct);
    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });

    onClose();
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

      setUpdatedProduct((prev) => ({ ...prev, image: data.secure_url, publicId: data.public_id }));

      toast({
        title: success ? "Image uploaded" : "Upload failed",
        description: success ? message : "Something went wrong during upload.",
        status: success ? "success" : "error",
        isClosable: true,
      });

      return { success, message, data };
    } catch (error) {
      if (error instanceof Error) {
        console.error("Upload error.", error.message);
      }

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
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
      cursor={"pointer"}
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
        <PageWrapperComponent title="edit | Product Store" content="Edit your product details" />

        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <ProductForm
                formId="update"
                product={updatedProduct}
                setProduct={setUpdatedProduct}
                onFileSelect={handleUploadFile}
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateProduct(product._id, updatedProduct as TProduct)}
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
