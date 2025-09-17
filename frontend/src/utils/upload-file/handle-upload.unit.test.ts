import { handleUploadFile } from "utils";
import { cloudinaryLogger } from "utils/logger";
import * as uploadFileModule from "utils/upload-file";

jest.mock("utils/logger", () => {
  const originalModule = jest.requireActual("utils");
  return {
    ...originalModule,
    cloudinaryLogger: {
      groupCollapsed: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      groupEnd: jest.fn(),
    },
  };
});

describe("handle-upload", () => {
  const mockSetValue = jest.fn();
  const mockSetUploading = jest.fn();
  const mockFile = new File(["dummy content"], "example.png", { type: "image/png" });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("SUCCESS: should upload file successfully and update form values", async () => {
    const spyUploadFile = jest.spyOn(uploadFileModule, "uploadFile").mockResolvedValue({
      success: true,
      message: "File uploaded successfully.",
      data: { secure_url: "https://example.com/image.png", public_id: "abc123" },
    });

    await handleUploadFile({
      file: mockFile,
      setValue: mockSetValue,
      setUploading: mockSetUploading,
    });

    expect(mockSetUploading).toHaveBeenCalledWith(true);

    expect(spyUploadFile).toHaveBeenCalledWith({ file: mockFile });
    expect(spyUploadFile).toHaveBeenCalled();
    expect(spyUploadFile).toHaveBeenCalledTimes(1);

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

  test("FAILURE: should fail upload file and log error", async () => {
    const spyUploadFile = jest.spyOn(uploadFileModule, "uploadFile").mockResolvedValue({
      success: false,
      message: "File uploaded is failed.",
      data: undefined,
    });

    await handleUploadFile({
      file: mockFile,
      setValue: mockSetValue,
      setUploading: mockSetUploading,
    });

    expect(mockSetUploading).toHaveBeenCalledWith(true);

    expect(spyUploadFile).toHaveBeenCalledWith({ file: mockFile });
    expect(spyUploadFile).toHaveBeenCalled();
    expect(spyUploadFile).toHaveBeenCalledTimes(1);

    expect(mockSetValue).not.toHaveBeenCalled();
    expect(cloudinaryLogger.error).toHaveBeenCalledWith(
      "Upload handler error:",
      "File uploaded is failed.",
    );

    expect(mockSetUploading).toHaveBeenCalledWith(false);
    expect(mockSetUploading).toHaveBeenCalledTimes(2);

    expect(cloudinaryLogger.info).toHaveBeenCalledWith("Upload process finished.");
    expect(cloudinaryLogger.groupEnd).toHaveBeenCalled();
  });

  test("EXCEPTION: should handle thrown error and log it", async () => {
    const spyUploadFile = jest
      .spyOn(uploadFileModule, "uploadFile")
      .mockRejectedValue(new Error("Network error."));

    await handleUploadFile({
      file: mockFile,
      setValue: mockSetValue,
      setUploading: mockSetUploading,
    });

    expect(mockSetUploading).toHaveBeenCalledWith(true);
    expect(spyUploadFile).toHaveBeenCalledWith({ file: mockFile });
    expect(mockSetValue).not.toHaveBeenCalled();
    expect(cloudinaryLogger.error).toHaveBeenCalledWith("Upload handler error:", "Network error.");

    expect(mockSetUploading).toHaveBeenCalledWith(false);
    expect(cloudinaryLogger.info).toHaveBeenCalledWith("Upload process finished.");
    expect(cloudinaryLogger.groupEnd).toHaveBeenCalled();
  });
});
