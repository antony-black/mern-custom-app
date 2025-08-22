import { handleRequest } from "./handle-request";

describe("handle-request", () => {
  const newMockData = { id: 1, name: "Shirt", price: 100, image: "shirt.png" };
  const updateMockData = { id: 1, name: "Shirt-updated", price: 150 };

  beforeEach(() => {
    // Mock the fetch function
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("POST: sets JSON header, stringifies body, without setting url manually", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify(newMockData), { status: 200 }),
    );

    const response = await handleRequest({
      method: "POST",
      data: { name: "Shirt", price: 20, image: "shirt.png" },
    });
    const json = await response.json();

    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Shirt", price: 20, image: "shirt.png" }),
      }),
    );

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(json).toEqual(newMockData);
  });

  test("PUT with ID: appends ID to URL and stringifies body, without setting url manually", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify(updateMockData), { status: 200 }),
    );

    const response = await handleRequest({
      method: "PUT",
      id: "123",
      data: { name: "Shirt-updated", price: 30, image: "shirt-updated.png" },
    });
    const json = await response.json();

    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products/123",
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Shirt-updated", price: 30, image: "shirt-updated.png" }),
      }),
    );

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(json).toEqual(updateMockData);
  });

  test("DELETE with ID: appends ID and has no body, without setting url manually", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(new Response(null, { status: 200 }));
    const response = await handleRequest({
      method: "DELETE",
      id: "123",
      data: { name: "Shirt", price: 20, image: "shirt.png" },
    });

    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products/123",
      expect.objectContaining({
        method: "DELETE",
        body: undefined,
      }),
    );

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
  });

  test("POST: handles FormData without setting Content-Type manually", async () => {
    const formData = new FormData();
    const file = new File(["content"], "shirt.png", { type: "image/png" });
    formData.append("image", file);

    (global.fetch as jest.Mock).mockResolvedValue(new Response(null, { status: 200 }));

    const response = await handleRequest({
      url: "/api/upload",
      method: "POST",
      data: formData,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/upload",
      expect.objectContaining({
        method: "POST",
        body: formData,
      }),
    );

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
  });

  test("throws when server returns an error", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response("Internal Server Error", { status: 500 }),
    );

    await expect(handleRequest({ method: "POST", data: { name: "Bad Shirt" } })).rejects.toThrow(
      /Failed to perform request/,
    );
  });
});
