import { handleRequest } from "utils/handle-request/handle-request";
import { cloudinaryLogger } from "utils/logger/logger-handler";
import { handleUploadFile } from "./upload-file";

jest.mock("utils/logger/logger-handler", () => ({
  cloudinaryLogger: {
    groupCollapsed: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    groupEnd: jest.fn(),
  },
}));

jest.mock("../handle-request/handle-request", () => ({
  handleRequest: jest.fn(),
}));

describe("upload-file-integrate-test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSetValue = jest.fn();
  const mockSetUploading = jest.fn();
  const mockFile = new File(["dummy content"], "example.png", { type: "image/png" });
  const mockResponse = {
    success: true,
    message: "File uploaded successfully.",
    data: { secure_url: "https://example.com/image.png", public_id: "abc123" },
  };

  test("SUCCESS: should successfully uploads file and updates form state", async () => {
    (handleRequest as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    await handleUploadFile({
      file: mockFile,
      setValue: mockSetValue,
      setUploading: mockSetUploading,
    });

    expect(mockSetUploading).toHaveBeenCalledWith(true);

    expect(handleRequest).toHaveBeenCalledTimes(1);
    const calledArgs = (handleRequest as jest.Mock).mock.calls[0][0];
    console.log("calledArgs:", calledArgs);
    expect(calledArgs.method).toBe("POST");
    expect(calledArgs.url).toBe("/api/upload");
    expect(calledArgs.data).toBeInstanceOf(FormData);
    expect(calledArgs.data.get("image")).toBe(mockFile);

    expect(mockSetValue).toHaveBeenCalledWith("image", "https://example.com/image.png", {
      shouldValidate: true,
      shouldDirty: true,
    });
    expect(mockSetValue).toHaveBeenCalledWith("publicId", "abc123", {
      shouldValidate: true,
      shouldDirty: true,
    });

    expect(mockSetUploading).toHaveBeenCalledWith(false);
    expect(mockSetUploading).toHaveBeenCalledTimes(2);

    expect(cloudinaryLogger.groupCollapsed).toHaveBeenCalled();
    expect(cloudinaryLogger.info).toHaveBeenCalled();
    expect(cloudinaryLogger.debug).toHaveBeenCalledWith(
      "File uploaded successfully:",
      "https://example.com/image.png",
    );
    expect(cloudinaryLogger.info).toHaveBeenCalledWith("Upload process finished.");
    expect(cloudinaryLogger.groupEnd).toHaveBeenCalled();
  });

  test("FAILURE: should at least log some error when upload fails", async () => {
    const mockFailureInput = {
      ...mockResponse,
      success: false,
      data: undefined,
    };

    (handleRequest as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify(mockFailureInput), { status: 200 }),
    );

    await handleUploadFile({
      file: mockFile,
      setValue: mockSetValue,
      setUploading: mockSetUploading,
    });

    expect(mockSetUploading).toHaveBeenCalledWith(true);

    expect(handleRequest).toHaveBeenCalledTimes(1);

    expect(mockSetValue).not.toHaveBeenCalled();

    expect(cloudinaryLogger.error).toHaveBeenCalledWith("Upload handler error:", expect.anything());

    expect(mockSetUploading).toHaveBeenCalledWith(false);
    expect(mockSetUploading).toHaveBeenCalledTimes(2);

    expect(cloudinaryLogger.info).toHaveBeenCalledWith("Upload process finished.");
    expect(cloudinaryLogger.groupEnd).toHaveBeenCalled();
  });

  test("EXCEPTION: should through an error", async () => {
    (handleRequest as jest.Mock).mockRejectedValue(new Error("Network error"));

    await handleUploadFile({
      file: mockFile,
      setValue: mockSetValue,
      setUploading: mockSetUploading,
    });

    expect(mockSetUploading).toHaveBeenCalledWith(true);

    expect(handleRequest).toHaveBeenCalledTimes(1);

    expect(mockSetValue).not.toHaveBeenCalled();

    expect(cloudinaryLogger.error).toHaveBeenCalledWith("Upload error:", "Network error");

    expect(mockSetUploading).toHaveBeenCalledWith(false);
    expect(mockSetUploading).toHaveBeenCalledTimes(2);

    expect(cloudinaryLogger.info).toHaveBeenCalledWith("Upload process finished.");
    expect(cloudinaryLogger.groupEnd).toHaveBeenCalled();
  });
});
