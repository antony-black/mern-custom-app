import { runStoreAction } from "utils";
import { storeLogger } from "utils/logger";

jest.mock("utils/logger", () => {
  const originalModule = jest.requireActual("utils");
  return {
    ...originalModule,
    storeLogger: {
      groupCollapsed: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      groupEnd: jest.fn(),
    },
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("run-store-action", () => {
  const mockLabel = "mock-label";
  const mockInputData = { name: "Shirt", price: 20, image: "https://example.com/shirt.png" };
  const mockInputValidator = jest.fn();
  const mockAction = jest.fn();
  const mockResponseValidator = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnDelete = jest.fn();

  const mockApiResponse = {
    success: true,
    message: "ok",
    data: { name: "Shirt", price: 20, image: "https://example.com/shirt.png" },
  };

  test("should call onSuccess if data is valid", async () => {
    mockInputValidator.mockReturnValueOnce({ success: true });
    mockAction.mockResolvedValueOnce(new Response(JSON.stringify(mockApiResponse)));
    mockResponseValidator.mockReturnValueOnce({ success: true });

    const result = await runStoreAction({
      label: mockLabel,
      inputData: mockInputData,
      inputValidator: mockInputValidator,
      action: mockAction,
      responseValidator: mockResponseValidator,
      onSuccess: mockOnSuccess,
    });

    expect(result).toEqual(mockApiResponse);
    expect(mockOnSuccess).toHaveBeenCalledWith({
      name: "Shirt",
      price: 20,
      image: "https://example.com/shirt.png",
    });

    expect(storeLogger.groupCollapsed).toHaveBeenCalled();
    expect(storeLogger.info).toHaveBeenCalledWith(`${mockLabel} is succeeded.`, {
      name: "Shirt",
      price: 20,
      image: "https://example.com/shirt.png",
    });
    expect(storeLogger.debug).toHaveBeenCalled();
    expect(storeLogger.groupEnd).toHaveBeenCalled();
  });

  test("should call onDelete if provided", async () => {
    mockResponseValidator.mockReturnValueOnce({ success: true });
    mockAction.mockResolvedValueOnce(
      new Response(JSON.stringify({ ...mockApiResponse, message: "deleted", data: undefined })),
    );

    const result = await runStoreAction({
      label: mockLabel,
      inputData: "abc",
      action: mockAction,
      responseValidator: mockResponseValidator,
      onDelete: mockOnDelete,
    });

    expect(result).toEqual({ ...mockApiResponse, message: "deleted", data: undefined });
    expect(mockOnDelete).toHaveBeenCalled();

    expect(storeLogger.groupCollapsed).toHaveBeenCalled();
    expect(storeLogger.info).toHaveBeenCalledWith(`${mockLabel} is succeeded.`, undefined);
    expect(storeLogger.debug).toHaveBeenCalled();
    expect(storeLogger.groupEnd).toHaveBeenCalled();
  });

  test("should validator return error when input is invalid", async () => {
    mockInputValidator.mockReturnValueOnce({ success: false, message: "Invalid input." });

    const result = await runStoreAction({
      label: mockLabel,
      inputData: { ...mockInputData, name: null },
      inputValidator: mockInputValidator,
      action: mockAction,
      responseValidator: mockResponseValidator,
      onSuccess: mockOnSuccess,
    });

    expect(result).toEqual({ success: false, message: "Invalid input." });
    expect(storeLogger.warn).toHaveBeenCalledWith("Invalid product input.", {
      ...mockInputData,
      name: null,
    });
    expect(storeLogger.groupEnd).toHaveBeenCalled();
    expect(mockAction).not.toHaveBeenCalled();
  });

  test("should validator return error when response is invalid", async () => {
    mockInputValidator.mockReturnValueOnce({ success: true });
    mockAction.mockResolvedValueOnce(
      new Response(JSON.stringify({ ...mockApiResponse, data: { id: "1" } })),
    );
    mockResponseValidator.mockReturnValueOnce({ success: false });

    const result = await runStoreAction({
      label: mockLabel,
      inputData: mockInputData,
      inputValidator: mockInputValidator,
      action: mockAction,
      responseValidator: mockResponseValidator,
      onSuccess: mockOnSuccess,
    });

    expect(result).toEqual({ success: false, message: "Invalid API response, mock-label" });
    expect(storeLogger.error).toHaveBeenCalledWith(`Invalid ${mockLabel} schema`, {
      ...mockApiResponse,
      data: { id: "1" },
    });
    expect(storeLogger.groupEnd).toHaveBeenCalled();
  });

  test("should throw and log error when action fails", async () => {
    const mockError = new Error("network failed");
    mockAction.mockRejectedValueOnce(mockError);

    await expect(
      runStoreAction({
        label: "error-action",
        action: mockAction,
        responseValidator: mockResponseValidator,
      }),
    ).rejects.toThrow("network failed");

    expect(storeLogger.error).toHaveBeenCalledWith("Failed error-action", mockError);
  });
});
