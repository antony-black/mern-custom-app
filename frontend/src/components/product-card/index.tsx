import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { zProductBaseSchema } from "@shared/types/zod";
import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { PageWrapperComponent } from "../page-wrapper-component";
import type { TCloudinaryImageRaw } from "@/types/cloudinary-type";
import type { TProduct, TProductBase, TApiResponse } from "@shared/types";
import { useProductStore } from "@/store";

type TProductCardProps = {
  product: TProduct;
};

export const ProductCard: React.FC<TProductCardProps> = ({ product }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue,
  } = useForm<TProductBase>({
    resolver: zodResolver(zProductBaseSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      image: product.image,
      publicId: product.publicId,
    },
  });

  const [isUploading, setUploading] = useState<boolean>(false);

  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    if (isOpen) {
      reset({
        name: product.name,
        price: product.price,
        image: product.image,
        publicId: product.publicId,
      });
    }
  }, [isOpen, product, reset]);

  const onSubmit: SubmitHandler<TProductBase> = async (data) => {
    await handleUpdateProduct(product._id, data);
    reset();
  };

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

  const handleUpdateProduct = async (productId: string, updatedProduct: any) => {
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

          {/* Move the form to wrap the entire modal content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
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

                      await handleUploadFile(file);
                    }}
                  />
                  {/* Fixed: Use correct error field */}
                  <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                type="submit"
                colorScheme="blue"
                w="full"
                isLoading={isUploading || isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                Update
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};
