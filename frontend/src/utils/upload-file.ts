import { cloudinaryLogger } from "./logger/logger-handler";
// import type { UseToastOptions } from "@chakra-ui/react";
import type { TApiResponse, TProductBase } from "@shared/types";
import type { UseFormSetValue } from "react-hook-form";
import type { TCloudinaryImageRaw } from "types/cloudinary-type";

interface IUploadFile {
  file: File;
  // toast: (options: UseToastOptions) => void;
}

interface IHandleUploadFile extends IUploadFile {
  setValue: UseFormSetValue<TProductBase>;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const uploadFile = async ({
  file,
  // toast,
}: IUploadFile): Promise<TApiResponse<TCloudinaryImageRaw>> => {
  const formData = new FormData();
  formData.append("image", file);

  cloudinaryLogger.groupCollapsed(
    "%cUploadFile",
    "background: purple; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
  );
  cloudinaryLogger.debug("File name:", file.name);
  cloudinaryLogger.debug("File size:", `${(file.size / 1024).toFixed(2)} KB`);
  cloudinaryLogger.debug("File type:", file.type);
  cloudinaryLogger.groupEnd();

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    cloudinaryLogger.debug("API Response status:", response.status);

    const uploadedImage: TApiResponse<TCloudinaryImageRaw> = await response.json();
    const { success, message, data } = uploadedImage;

    cloudinaryLogger.debug("Parsed API response:", uploadedImage);

    if (!response.ok || !data?.secure_url) {
      throw new Error("Upload succeeded but no image URL was returned.");
    }

    // toast({
    //   title: "Image uploaded",
    //   description: message,
    //   status: "success",
    //   isClosable: true,
    // });

    return { success, message, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    cloudinaryLogger.error("Upload error:", errorMessage);

    // toast({
    //   title: "Upload failed",
    //   description: (error as Error).message ?? "Something went wrong during upload.",
    //   status: "error",
    //   isClosable: true,
    // });

    throw error;
  }
};

export const handleUploadFile = async ({
  file,
  // toast,
  setValue,
  setUploading,
}: IHandleUploadFile): Promise<void> => {
  cloudinaryLogger.groupCollapsed(
    "%cHandleUploadFile",
    "background: purple; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
  );

  try {
    setUploading(true);
    cloudinaryLogger.info("Starting file upload...");
    // const uploadedFileData = await uploadFile({ file, toast });
    const uploadedFileData = await uploadFile({ file });
    const { data, success } = uploadedFileData;

    if (success && data?.secure_url) {
      cloudinaryLogger.info("Updating form values with uploaded image data");
      setValue("image", data.secure_url, { shouldValidate: true, shouldDirty: true });
      setValue("publicId", data.public_id, { shouldValidate: true, shouldDirty: true });
      cloudinaryLogger.debug("File uploaded successfully:", data.secure_url);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    cloudinaryLogger.error("Upload handler error:", errorMessage);
  } finally {
    setUploading(false);

    cloudinaryLogger.info("Upload process finished.");
    cloudinaryLogger.groupEnd();
  }
};
