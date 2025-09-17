import { productActionHandler } from "utils";
import type { UseToastOptions } from "@chakra-ui/react";
import type { TProductApiResponse } from "@shared/types";

describe("product-action-handler", () => {
  const mockToast = jest.fn();
  const mockHandleProduct = jest.fn();
  const mockData = { name: "Shirt", price: 20, image: "https://example.com/shirt.png" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("CREATE: calls toast with success when handleProduct resolves successfully", async () => {
    mockHandleProduct.mockResolvedValueOnce({
      success: true,
      message: "Product created successfully.",
    } satisfies TProductApiResponse);

    await productActionHandler({
      handleProduct: mockHandleProduct,
      toast: mockToast,
      data: mockData,
    });

    expect(mockToast).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledTimes(1);
    expect(mockHandleProduct).toHaveBeenCalledWith(mockData);
    expect(mockToast).toHaveBeenLastCalledWith(
      expect.objectContaining({
        title: "Success",
        description: "Product created successfully.",
        status: "success",
      } satisfies UseToastOptions),
    );
  });

  test("UPDATE: calls toast with success when handleProduct resolves successfully", async () => {
    const mockUpdateInput = {
      ...mockData,
      data: {
        productId: "abc",
        updatedData: {
          name: "Shirt-updated",
          price: 25,
          image: "https://example.com/shirt-updated.png",
        },
      },
    };
    mockHandleProduct.mockResolvedValueOnce({
      success: true,
      message: "Product updated successfully.",
    } satisfies TProductApiResponse);

    await productActionHandler({
      handleProduct: mockHandleProduct,
      toast: mockToast,
      data: mockUpdateInput,
    });

    expect(mockToast).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledTimes(1);
    expect(mockHandleProduct).toHaveBeenCalledWith(mockUpdateInput);
    expect(mockToast).toHaveBeenLastCalledWith(
      expect.objectContaining({
        title: "Success",
        description: "Product updated successfully.",
        status: "success",
      } satisfies UseToastOptions),
    );
  });

  test("ERROR: should call toast with error when handleProduct throws an error", async () => {
    const mockErrorInput = { ...mockData, name: 0 };

    mockHandleProduct.mockResolvedValueOnce({
      success: false,
      message: "Create product is failed.",
    } satisfies TProductApiResponse);

    await productActionHandler({
      handleProduct: mockHandleProduct,
      toast: mockToast,
      data: mockErrorInput,
    });

    expect(mockToast).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledTimes(1);
    expect(mockHandleProduct).toHaveBeenCalledWith(mockErrorInput);
    expect(mockToast).toHaveBeenLastCalledWith(
      expect.objectContaining({
        title: "Error",
        description: "Create product is failed.",
        status: "error",
      } satisfies UseToastOptions),
    );
  });

  it("ERROR: should call toast with error when handleProduct throws an error", async () => {
    const mockErrorInput = { ...mockData, name: 0 };
    const mockHandleProduct = jest.fn().mockRejectedValue(new Error("Network error."));

    await productActionHandler({
      data: mockErrorInput,
      toast: mockToast,
      handleProduct: mockHandleProduct,
    });

    expect(mockHandleProduct).toHaveBeenCalledWith(mockErrorInput);
    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "Network error.",
      status: "error",
      isClosable: true,
    } satisfies UseToastOptions);
  });
});
