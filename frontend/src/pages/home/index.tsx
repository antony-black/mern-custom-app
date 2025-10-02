import { Container, SimpleGrid, Text, VStack, Spinner, Box } from "@chakra-ui/react";
import { ProductCard, PageWrapperComponent } from "components";
import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import { useProductStore } from "store/index";
import { homePageLogger } from "utils";

const HomePage: React.FC = () => {
  const { fetchProducts, loadMoreProducts, hasMore, products } = useProductStore();

  useEffect(() => {
    homePageLogger.info("Fetching initial products");
    fetchProducts()
      .then(() => homePageLogger.info("Products loaded"))
      .catch((error) => homePageLogger.error("Failed to fetch products", error));
  }, [fetchProducts]);

  return (
    <Container maxW="container.xl" py={12}>
      <PageWrapperComponent
        title="Product Store"
        content="Buy the best products at Product Store!"
      />

      <VStack spacing={8}>
        <Text
          fontSize={"30"}
          fontWeight={"bold"}
          bgGradient={"linear(to-r, cyan.400, blue.500)"}
          bgClip={"text"}
          textAlign={"center"}
        >
          Current Products 🚀
        </Text>

        <InfiniteScroll
          threshold={250}
          loadMore={() => {
            if (hasMore) {
              void loadMoreProducts();
            }
          }}
          hasMore={hasMore}
          loader={
            <Box key={"loader"} textAlign="center" py={6}>
              <Spinner size="xl" />
            </Box>
          }
        >
          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
              lg: 3,
            }}
            spacing={10}
            w={"full"}
          >
            {!!products.length &&
              products.map((product) => <ProductCard key={product._id} product={product} />)}
          </SimpleGrid>
        </InfiniteScroll>

        {products.length === 0 && (
          <Text fontSize="xl" textAlign={"center"} fontWeight="bold" color="gray.500">
            No products found 😢{" "}
            <Link to={"/create"}>
              <Text as="span" color="blue.500" _hover={{ textDecoration: "underline" }}>
                Create a product
              </Text>
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;
