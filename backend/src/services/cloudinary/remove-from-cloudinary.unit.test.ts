import { v2 as cloudinary } from "cloudinary";
import { logger } from "../logger/logger-service";
import { removeFromCloudinaryService } from "./cloudinary-service";

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
        destroy: jest.fn(),
      },
      config: jest.fn(),
    },
  };
});

const mockPublicId = "test-image-id";

describe("remove-from-cloudinary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("SUCCESS: remove file from cloudinary", async () => {
    const mockRemoveResponse = { result: "ok" };

    (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue(mockRemoveResponse);

    const response = await removeFromCloudinaryService(mockPublicId);

    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(mockPublicId);

    expect(logger.info).toHaveBeenCalledWith({
      logType: "cloudinary/removeFromCloudinaryService",
      message: "Image deleted",
    });

    expect(response).toEqual({
      success: true,
      message: "Image deleted",
    });
  });

  test("SUCCESS: image not found", async () => {
    (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({ result: "not_found" });

    const response = await removeFromCloudinaryService(mockPublicId);

    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(mockPublicId);
    expect(logger.info).toHaveBeenCalledWith({
      logType: "cloudinary/removeFromCloudinaryService",
      message: "Image not found",
    });
    expect(response).toEqual({
      success: true,
      message: "Image not found",
    });
  });

  test("FAILURE: unexpected result", async () => {
    (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({ result: "error" });

    const response = await removeFromCloudinaryService(mockPublicId);

    expect(logger.error).toHaveBeenCalledWith({
      logType: "cloudinary/removeFromCloudinaryService",
      error: expect.any(Error),
      logData: { publicId: mockPublicId },
    });

    expect(response).toEqual({
      success: false,
      message: "Cloudinary image deletion failed.",
    });
  });

  test("FAILURE: throws exception", async () => {
    const error = new Error("Network error");
    (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(error);

    const response = await removeFromCloudinaryService(mockPublicId);

    expect(logger.error).toHaveBeenCalledWith({
      logType: "cloudinary/removeFromCloudinaryService",
      error,
      logData: { publicId: mockPublicId },
    });

    expect(response).toEqual({
      success: false,
      message: "Cloudinary image deletion failed.",
    });
  });
});
