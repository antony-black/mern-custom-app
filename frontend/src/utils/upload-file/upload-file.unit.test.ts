import { handleRequest } from "utils/handle-request/handle-request";
import { cloudinaryLogger } from "utils/logger/logger-handler";
import { uploadFile } from "./upload-file";

jest.mock("../handle-request/handle-request", () => ({
  handleRequest: jest.fn(),
}));

jest.mock("utils/logger/logger-handler", () => ({
  cloudinaryLogger: {
    groupCollapsed: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    groupEnd: jest.fn(),
  },
}));

describe("upload-file", () => {
  const mockResponse = {
    success: true,
    message: "File uploaded successfully.",
    data: { secure_url: "https://example.com/image.png", public_id: "abc123" },
  };
  const mockFile = new File(["dummy content"], "example.png", { type: "image/png" });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("SUCCESS: should upload file successfully, log a response, and return a result", async () => {
    (handleRequest as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    const formData = new FormData();
    formData.append("image", mockFile);

    const response = await uploadFile({ file: mockFile });

    expect(handleRequest).toHaveBeenCalledTimes(1);
    const calledArgs = (handleRequest as jest.Mock).mock.calls[0][0];
    expect(calledArgs.method).toBe("POST");
    expect(calledArgs.url).toBe("/api/upload");
    expect(calledArgs.data).toBeInstanceOf(FormData);
    expect(calledArgs.data.get("image")).toBe(mockFile);

    expect(response).toEqual(mockResponse);

    expect(cloudinaryLogger.groupCollapsed).toHaveBeenCalled();
    expect(cloudinaryLogger.debug).toHaveBeenCalledWith("File name:", mockFile.name);
    expect(cloudinaryLogger.debug).toHaveBeenCalledWith(
      "File size:",
      `${(mockFile.size / 1024).toFixed(2)} KB`,
    );
    expect(cloudinaryLogger.debug).toHaveBeenCalledWith("File type:", mockFile.type);
    expect(cloudinaryLogger.groupEnd).toHaveBeenCalled();
  });

  test("FAILURE: should throw error if no secure_url returned", async () => {
    const failureMockInput = { ...mockResponse, data: { secure_url: null } };

    (handleRequest as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify(failureMockInput), { status: 200 }),
    );

    await expect(uploadFile({ file: mockFile })).rejects.toThrow(
      "Upload succeeded but no image URL was returned.",
    );

    expect(cloudinaryLogger.error).toHaveBeenCalledWith(
      "Upload error:",
      "Upload succeeded but no image URL was returned.",
    );
  });

  test("EXCEPTION: should throw error if handleRequest rejects", async () => {
    (handleRequest as jest.Mock).mockRejectedValue(new Error("Network error"));

    await expect(uploadFile({ file: mockFile })).rejects.toThrow("Network error");

    expect(cloudinaryLogger.error).toHaveBeenCalledWith("Upload error:", "Network error");
  });
});
