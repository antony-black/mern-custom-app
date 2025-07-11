import { VStack, Input, Box, Button, useColorModeValue } from "@chakra-ui/react";
import type { IProduct, TProduct } from "../../../../backend/src/types";
import { productTypeValidation } from "@/utils/product-type-validation";

type TProductFormProps = {
  formId: string;
  product: IProduct | TProduct;
  setProduct: React.Dispatch<React.SetStateAction<IProduct | TProduct>>;
  onFileSelect: (file: File) => void;
  onAddProduct?: () => Promise<void>;
  isLoading?: boolean;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
};

export const ProductForm: React.FC<TProductFormProps> = ({
  formId,
  product,
  setProduct,
  onFileSelect,
  onAddProduct,
  isLoading,
  fileInputRef,
}) => {
  const validatedProduct = productTypeValidation(product);

  return (
    <Box w={"full"} bg={useColorModeValue("white", "gray.800")} p={6} rounded={"lg"} shadow={"md"}>
      <VStack spacing={4}>
        <Input
          placeholder="Product Name"
          name="name"
          value={validatedProduct.name}
          onChange={(e) => setProduct({ ...validatedProduct, name: e.target.value })}
        />
        <Input
          placeholder="Price"
          name="price"
          type="number"
          value={validatedProduct.price}
          onChange={(e) => setProduct({ ...validatedProduct, price: parseFloat(e.target.value) })}
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

            await onFileSelect(file);
          }}
        />
        {formId === "create" && (
          <Button colorScheme="blue" onClick={onAddProduct} w="full" isLoading={isLoading}>
            Add Product
          </Button>
        )}
      </VStack>
    </Box>
  );
};
