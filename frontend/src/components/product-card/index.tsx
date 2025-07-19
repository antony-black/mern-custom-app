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
} from "@chakra-ui/react";
import { type SubmitHandler } from "react-hook-form";
import { PageWrapperComponent } from "../page-wrapper-component";
import { ProductForm } from "../product-form";
import type { TProduct, TProductBase } from "@shared/types";
import { useProductStore } from "@/store";
import { productActionHandler } from "@/utils/product-action-handler";

type TProductCardProps = {
  product: TProduct;
};

export const ProductCard: React.FC<TProductCardProps> = ({ product }) => {
  const initialState = {
    name: product.name,
    price: product.price,
    image: product.image,
    publicId: product.publicId,
  } satisfies TProductBase;

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
          <IconButton
            icon={<DeleteIcon />}
            onClick={handleDeleteProduct}
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
            <ProductForm formId="update" initialFormState={initialState} onSubmit={onSubmit} />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
