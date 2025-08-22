import { getProducts } from "./get-products";

describe("get-products", () => {
  const mockData = {
    data: [
      { id: 1, name: "Shirt", price: 100, image: "shirt.png" },
      { id: 2, name: "Shirt-2", price: 200, image: "shirt-2.png" },
      { id: 3, name: "Shirt-3", price: 300, image: "shirt-3.png" },
      { id: 4, name: "Shirt-4", price: 400, image: "shirt-4.png" },
      { id: 5, name: "Shirt-5", price: 500, image: "shirt-5.png" },
      { id: 6, name: "Shirt-6", price: 600, image: "shirt-6.png" },
    ],
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetching products with default values", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify(mockData), { status: 200 }),
    );

    const response = await getProducts();
    const json = await response.json();

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products?page=1&limit=6",
      expect.objectContaining({
        method: "GET",
      }),
    );

    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products?page=1&limit=6",
      expect.objectContaining({
        method: "GET",
      }),
    );

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(json).toEqual(mockData);
    expect(json.data).toEqual(expect.arrayOf(expect.any(Object)));
    expect(json.data).toHaveLength(6);
  });

  test("fetching products with custom 'page' value", async () => {
    await getProducts({ page: 2 });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products?page=2&limit=6",
      expect.objectContaining({
        method: "GET",
      }),
    );

    expect(global.fetch).not.toHaveBeenCalledWith(
      "/api/products?page=1&limit=6",
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  test("fetching products with custom pagination", async () => {
    await getProducts({ page: 2, limit: 10 });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products?page=2&limit=10",
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  test("handles server error (500)", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response("Internal Server Error", { status: 500 }),
    );

    const response = await getProducts();

    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });
});
