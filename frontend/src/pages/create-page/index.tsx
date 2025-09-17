import { Box, Container, Heading, useColorModeValue, VStack } from "@chakra-ui/react";
import React, { Suspense } from "react";
import { useProductStore } from "store/index";
import type { TProductBase } from "@shared/types";

const initialFormState = {
  name: "",
  price: 0,
  image: "",
} satisfies TProductBase;

const PageWrapperComponent = React.lazy(() =>
  import("../../components/page-wrapper-component").then((mod) => ({
    default: mod.PageWrapperComponent,
  })),
);
const ProductForm = React.lazy(() =>
  import("../../components/product-form").then((mod) => ({ default: mod.ProductForm })),
);

const CreatePage: React.FC = () => {
  const { createProduct } = useProductStore();

  return (
    <Container maxW={"container.sm"}>
      <Suspense fallback={<div>Loading page...</div>}>
        <PageWrapperComponent
          title="add new | Product Store"
          content="Add a new amazing product!"
        />
      </Suspense>

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
          <Suspense fallback={<div>Loading form...</div>}>
            <ProductForm
              initialFormState={initialFormState}
              action={{ type: "create", actionHandler: createProduct }}
              shouldReset
            />
          </Suspense>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;
