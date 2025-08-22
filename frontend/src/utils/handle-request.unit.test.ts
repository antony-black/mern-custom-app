import { handleRequest } from "./handle-request";

describe("handle-request", () => {
  beforeEach(() => {
    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValue(new Response(null, { status: 200 }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("POST: sets JSON header, stringifies body, without setting url manually", async () => {
    await handleRequest({
      method: "POST",
      data: { name: "Shirt", price: 20, image: "shirt.png" },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Shirt", price: 20, image: "shirt.png" }),
      }),
    );
  });

  test("PUT with ID: appends ID to URL and stringifies body, without setting url manually", async () => {
    await handleRequest({
      method: "PUT",
      id: "123",
      data: { name: "Shirt-updated", price: 30, image: "shirt-updated.png" },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products/123",
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Shirt-updated", price: 30, image: "shirt-updated.png" }),
      }),
    );
  });

  test("DELETE with ID: appends ID and has no body, without setting url manually", async () => {
    await handleRequest({
      method: "DELETE",
      id: "123",
      data: { name: "Shirt", price: 20, image: "shirt.png" },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products/123",
      expect.objectContaining({
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: undefined,
      }),
    );
  });

  test("POST: handles FormData without setting Content-Type manually", async () => {
    const formData = new FormData();
    const file = new File(["content"], "shirt.png", { type: "image/png" });
    formData.append("image", file);

    await handleRequest({
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
  });
});
