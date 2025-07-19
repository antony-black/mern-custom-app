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
import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { PageWrapperComponent } from "../page-wrapper-component";
import type { TCloudinaryImageRaw } from "@/types/cloudinary-type";
import type { TProduct, TProductBase, TApiResponse } from "@shared/types";
import { useProductStore } from "@/store";
import { productActionHandler } from "@/utils/product-action-handler";
import { handleUploadFile } from "@/utils/upload-file";

type TProductCardProps = {
  product: TProduct;
};

export const ProductCard: React.FC<TProductCardProps> = ({ product }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
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

  const onSubmit: SubmitHandler<TProductBase> = async (data) => {
    await productActionHandler({
      toast,
      data: {
        productId: product._id,
        updatedData: data,
      },
      actionHandler: async ({ productId, updatedData }) => {
        return updateProduct(productId, updatedData);
      },
    });

    onClose();
  };

  const handleDeleteProduct = async () => {
    await productActionHandler({ actionHandler: deleteProduct, toast, data: product._id });
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
          <IconButton icon={<DeleteIcon />} onClick={handleDeleteProduct} colorScheme="red" aria-label={""} />
        </HStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <PageWrapperComponent title="edit | Product Store" content="Edit your product details" />

        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />

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

                      await handleUploadFile({ file, toast, setValue, setUploading });
                    }}
                  />
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
