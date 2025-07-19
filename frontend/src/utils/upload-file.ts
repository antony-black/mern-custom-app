import type { TCloudinaryImageRaw } from "@/types/cloudinary-type";
import type { UseToastOptions } from "@chakra-ui/react";
import type { TApiResponse, TProductBase } from "@shared/types";
import type { UseFormSetValue } from "react-hook-form";

interface IUploadFile {
  file: File;
  toast: (options: UseToastOptions) => void;
}

interface IHandleUploadFile extends IUploadFile {
  setValue: UseFormSetValue<TProductBase>;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const uploadFile = async ({
  file,
  toast,
}: IUploadFile): Promise<TApiResponse<TCloudinaryImageRaw>> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadedImage: TApiResponse<TCloudinaryImageRaw> = await res.json();
    const { success, message, data } = uploadedImage;

    if (!res.ok || !data?.secure_url) {
      throw new Error("Upload succeeded but no image URL was returned.");
    }

    toast({
      title: "Image uploaded",
      description: message,
      status: "success",
      isClosable: true,
    });

    return { success, message, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Upload error.", error.message);
    }

    toast({
      title: "Upload failed",
      description: (error as Error).message ?? "Something went wrong during upload.",
      status: "error",
      isClosable: true,
    });

    throw new Error("Upload error.");
  }
};

export const handleUploadFile = async ({
  file,
  toast,
  setValue,
  setUploading,
}: IHandleUploadFile): Promise<void> => {
  try {
    setUploading(true);

    const uploadedFileData = await uploadFile({ file, toast });
    const { data, success } = uploadedFileData;

    if (success && data?.secure_url) {
      setValue("image", data.secure_url, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("publicId", data.public_id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    setUploading(false);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Upload error.", error.message);
    }
  } finally {
    // setUploading(false);
  }
};
