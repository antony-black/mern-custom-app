import { Box, Container, Heading, useColorModeValue, VStack } from "@chakra-ui/react";
import { PageWrapperComponent } from "components/page-wrapper-component";
import { ProductForm } from "components/product-form";
import { useProductStore } from "store/index";
import type { TProductBase } from "@shared/types";

const initialFormState = {
  name: "",
  price: 0,
  image: "",
} satisfies TProductBase;

export const CreatePage: React.FC = () => {
  const { createProduct } = useProductStore();

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
            initialFormState={initialFormState}
            action={{
              type: "create",
              actionHandler: createProduct,
            }}
            shouldReset={true}
          />
        </Box>
      </VStack>
    </Container>
  );
};
