import { Box, Container, Heading, useColorModeValue, useToast, VStack } from "@chakra-ui/react";
import { type SubmitHandler } from "react-hook-form";
import type { TProductBase } from "@shared/types";
import { PageWrapperComponent } from "@/components/page-wrapper-component";
import { ProductForm } from "@/components/product-form";
import { useProductStore } from "@/store";
import { productActionHandler } from "@/utils/product-action-handler";

const initialFormState = {
  name: "",
  price: 0,
  image: "",
} satisfies TProductBase;

export const CreatePage: React.FC = () => {
  const toast = useToast();
  const { createProduct } = useProductStore();

  const onSubmit: SubmitHandler<TProductBase> = async (data) => {
    await productActionHandler({ actionHandler: createProduct, toast, data });
  };

  return (
    <Container maxW={"container.sm"}>
      <PageWrapperComponent title="add new | Product Store" content="Add a new amazing product!" />

      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Create New Product
        </Heading>

        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded={"lg"}
          shadow={"md"}
        >
          <ProductForm
            formId="create"
            initialFormState={initialFormState}
            onSubmit={onSubmit}
            shouldReset={true}
          />
        </Box>
      </VStack>
    </Container>
  );
};
