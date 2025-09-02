import { v2 as cloudinary } from "cloudinary";
import { logger } from "../logger/logger-service";
import { uploadToCloudinaryService } from "./cloudinary-service";

jest.mock("../../utils/env", () => ({
  env: {
    CLOUDINARY_CLOUD_NAME: "test-cloud",
    CLOUDINARY_API_KEY: "test-key",
    CLOUDINARY_API_SECRET: "test-secret",
  },
}));

jest.mock("../logger/logger-service", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("cloudinary", () => {
  const actual = jest.requireActual("cloudinary");
  return {
    ...actual,
    v2: {
      uploader: {
        upload: jest.fn(),
      },
      config: jest.fn(),
    },
  };
});

describe("upload-to-cloudinary", () => {
  const mockFilePath = "path/to/image.jpg";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("SUCCESS: uploads file to cloudinary", async () => {
    const mockUploadResponse = {
      public_id: "abc123",
      version: 1,
      width: 200,
      height: 200,
      format: "jpg",
      secure_url: "https://res.cloudinary.com/test/image/upload/abc123.jpg",
    };

    (cloudinary.uploader.upload as jest.Mock).mockResolvedValue(mockUploadResponse);

    const response = await uploadToCloudinaryService(mockFilePath);

    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(mockFilePath, {
      folder: "mern-products",
      transformation: [{ width: 200, height: 200, crop: "limit" }, { quality: "auto" }, { fetch_format: "auto" }],
    });

    expect(logger.info).toHaveBeenCalledWith({
      logType: "cloudinary",
      message: "uploadToCloudinaryService.",
      logData: mockUploadResponse,
    });

    expect(response).toEqual({
      success: true,
      message: "Upload to cloudinary.",
      data: mockUploadResponse,
    });
  });

  test("FAILURE: handles upload error", async () => {
    const mockError = new Error("Network Error");

    (cloudinary.uploader.upload as jest.Mock).mockRejectedValue(mockError);

    await expect(uploadToCloudinaryService(mockFilePath)).rejects.toThrow("Cloudinary upload failed");

    expect(logger.error).toHaveBeenCalledWith({
      logType: "cloudinary/uploadToCloudinaryService",
      error: mockError,
      logData: { filePath: mockFilePath },
    });
  });
});
