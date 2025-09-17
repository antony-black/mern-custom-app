import { getProducts, handleRequest } from "utils";
import { useProductStore } from ".";

jest.mock("utils", () => {
  const originalModule = jest.requireActual("utils");
  return {
    ...originalModule,
    handleRequest: jest.fn(),
    getProducts: jest.fn(),
  };
});

describe("product-store", () => {
  const mockProducts = [
    { _id: "1", name: "Skirt", price: 25, image: "https://example.com/skirt.png" },
    { _id: "2", name: "T-Shirt", price: 30, image: "https://example.com/T-shirt.png" },
    { _id: "3", name: "Shirt", price: 20, image: "https://example.com/shirt.png" },
    { _id: "4", name: "Pants", price: 35, image: "https://example.com/panst.png" },
    { _id: "5", name: "Short-Pants", price: 40, image: "https://example.com/short-panst.png" },
    { _id: "6", name: "Jacket", price: 45, image: "https://example.com/jacket.png" },
  ];

  const mockApiResponse = {
    success: true,
    message: "ok",
    data: undefined,
  };

  function mockApi(mockApiResponse: { success: boolean; message: string; data: unknown }) {
    const { success, message, data } = mockApiResponse;
    return new Response(JSON.stringify({ success, message, data }));
  }

  beforeEach(() => {
    const { setState } = useProductStore;

    setState({
      products: [],
      page: 1,
      hasMore: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("CREATE: should update state when API succeeds", async () => {
    useProductStore.setState({ products: [...mockProducts] });

    const mockProduct = {
      name: "Sneakers",
      price: 40,
      image: "https://example.com/sneakers.png",
    };

    const mockCreateResponse = { ...mockApiResponse, data: { _id: "777", ...mockProduct } };

    (handleRequest as jest.Mock).mockResolvedValueOnce(mockApi(mockCreateResponse));

    const result = await useProductStore.getState().createProduct(mockProduct);

    expect(handleRequest).toHaveBeenCalledWith({ method: "POST", data: mockProduct });

    const products = useProductStore.getState().products;
    const mockUpdatedProducts = [...mockProducts, { _id: "777", ...mockProduct }];
    expect(products).toEqual(mockUpdatedProducts);

    expect(result).toEqual(mockCreateResponse);
  });

  test("CREATE: should not update store when API fails", async () => {
    const mockProduct = {
      name: "Sneakers",
      price: 40,
      image: "https://example.com/sneakers.png",
    };

    (handleRequest as jest.Mock).mockResolvedValueOnce(
      mockApi({ success: false, message: "API failed", data: null }),
    );

    const result = await useProductStore.getState().createProduct(mockProduct);

    expect(useProductStore.getState().products).toEqual([]);

    expect(result.success).toBe(false);
    expect(result.message).toContain("expected");
  });

  test("UPDATE: should replace product with updated one", async () => {
    useProductStore.setState({
      products: [...mockProducts],
    });

    const mockId = "3";
    const mockUpdatedProduct = {
      _id: mockId,
      name: "Shirt-updated",
      price: 20,
      image: "https://example.com/shirt.png",
    };

    const mockUpdatedResponse = { ...mockApiResponse, data: mockUpdatedProduct };

    (handleRequest as jest.Mock).mockResolvedValueOnce(mockApi(mockUpdatedResponse));

    const result = await useProductStore.getState().updateProduct(mockId, mockUpdatedProduct);

    expect(handleRequest).toHaveBeenCalledWith({
      method: "PUT",
      id: mockId,
      data: mockUpdatedProduct,
    });

    const products = useProductStore.getState().products;

    const mockUpdatedProducts = mockProducts.map((product) =>
      product._id === mockId ? mockUpdatedProduct : product,
    );

    expect(products).toEqual(mockUpdatedProducts);

    expect(result).toEqual(mockUpdatedResponse);
  });

  test("DELETE: should remove product from state", async () => {
    useProductStore.setState({
      products: [...mockProducts],
    });

    (handleRequest as jest.Mock).mockResolvedValueOnce(mockApi(mockApiResponse));

    const mockId = "3";
    const result = await useProductStore.getState().deleteProduct(mockId);

    expect(handleRequest).toHaveBeenCalledWith({
      method: "DELETE",
      id: mockId,
    });

    const products = useProductStore.getState().products;
    const mockUpdatedProducts = mockProducts.filter((product) => product._id !== mockId);
    expect(products).toEqual(mockUpdatedProducts);

    expect(result).toEqual(mockApiResponse);
  });

  test("FETCH: should made initial fetching to tstate", async () => {
    const mockFetchResponse = { ...mockApiResponse, data: mockProducts };

    (getProducts as jest.Mock).mockResolvedValueOnce(mockApi(mockFetchResponse));

    const result = await useProductStore.getState().fetchProducts();

    const products = useProductStore.getState().products;
    expect(products).toHaveLength(mockProducts.length);
    expect(products).toEqual(expect.arrayContaining(mockProducts));

    const page = useProductStore.getState().page;
    expect(page).toBe(2);

    expect(result).toEqual(mockFetchResponse);
  });

  test("LOAD-MORE: should check and load more to state in success", async () => {
    useProductStore.setState({
      products: [...mockProducts],
      page: 2,
    });

    const mockLoadMoreProducts = [
      { _id: "7", name: "Skirt", price: 25, image: "https://example.com/skirt.png" },
      { _id: "8", name: "T-Shirt", price: 30, image: "https://example.com/T-shirt.png" },
      { _id: "9", name: "Shirt", price: 20, image: "https://example.com/shirt.png" },
      { _id: "10", name: "Pants", price: 35, image: "https://example.com/panst.png" },
      { _id: "11", name: "Short-Pants", price: 40, image: "https://example.com/short-panst.png" },
      { _id: "12", name: "Jacket", price: 45, image: "https://example.com/jacket.png" },
    ];

    const mockLoadMoreResponse = { ...mockApiResponse, data: mockLoadMoreProducts };

    (getProducts as jest.Mock).mockResolvedValueOnce(mockApi(mockLoadMoreResponse));

    const result = await useProductStore.getState().loadMoreProducts();
    expect(useProductStore.getState().hasMore).toBe(true);

    const products = useProductStore.getState().products;
    expect(products).toHaveLength(mockProducts.length + mockLoadMoreProducts.length);
    expect(products).toEqual(expect.arrayContaining([...mockProducts, ...mockLoadMoreProducts]));

    expect(useProductStore.getState().page).toBe(3);
    expect(result).toEqual(mockLoadMoreResponse);
  });
});
