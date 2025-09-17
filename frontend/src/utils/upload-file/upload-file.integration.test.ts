import { handleRequest } from "utils/handle-request";
import * as cloudinaryLoggerModule from "utils/logger";
import { handleUploadFile } from "utils/upload-file";

jest.mock("utils/handle-request", () => ({
  handleRequest: jest.fn(),
}));

describe("upload-file-integrate-test", () => {
  const mockSetValue = jest.fn();
  const mockSetUploading = jest.fn();
  const mockFile = new File(["dummy content"], "example.png", { type: "image/png" });
  const mockResponse = {
    success: true,
    message: "File uploaded successfully.",
    data: { secure_url: "https://example.com/image.png", public_id: "abc123" },
  };

  const spyGroupCollapsed = jest.spyOn(cloudinaryLoggerModule.cloudinaryLogger, "groupCollapsed");
  const spyDebug = jest.spyOn(cloudinaryLoggerModule.cloudinaryLogger, "debug");
  const spyInfo = jest.spyOn(cloudinaryLoggerModule.cloudinaryLogger, "info");
  const spyError = jest.spyOn(cloudinaryLoggerModule.cloudinaryLogger, "error");
  const spyGroupEnd = jest.spyOn(cloudinaryLoggerModule.cloudinaryLogger, "groupEnd");

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    expect(spyGroupCollapsed).toHaveBeenCalled();
    expect(spyInfo).toHaveBeenCalled();
    expect(spyDebug).toHaveBeenCalledWith(
      "File uploaded successfully:",
      "https://example.com/image.png",
    );
    expect(spyInfo).toHaveBeenCalledWith("Upload process finished.");
    expect(spyGroupEnd).toHaveBeenCalled();
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

    expect(spyError).toHaveBeenCalledWith("Upload handler error:", expect.anything());

    expect(mockSetUploading).toHaveBeenCalledWith(false);
    expect(mockSetUploading).toHaveBeenCalledTimes(2);

    expect(spyInfo).toHaveBeenCalledWith("Upload process finished.");
    expect(spyGroupEnd).toHaveBeenCalled();
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

    expect(spyError).toHaveBeenCalledWith("Upload error:", "Network error");

    expect(mockSetUploading).toHaveBeenCalledWith(false);
    expect(mockSetUploading).toHaveBeenCalledTimes(2);

    expect(spyInfo).toHaveBeenCalledWith("Upload process finished.");
    expect(spyGroupEnd).toHaveBeenCalled();
  });
});
