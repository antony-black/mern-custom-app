import { storeLogger } from "./logger-handler";
import type { TValidator } from "@shared/types";

type TRunStoreAction<
  Input,
  OutputData,
  Output extends { success: boolean; message: string; data?: OutputData },
> = {
  label: string;
  inputData?: Input;
  inputValidator?: TValidator<Input>;
  action: (data?: Input) => Promise<Response>;
  responseValidator: TValidator<Output>;
  onSuccess?: (data: OutputData) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export async function runStoreAction<
  Input,
  OutputData,
  Output extends { success: boolean; message: string; data?: OutputData },
>({
  label,
  inputData,
  inputValidator,
  action,
  responseValidator,
  onSuccess,
  onDelete,
}: TRunStoreAction<Input, OutputData, Output>) {
  const start = performance.now();
  storeLogger.groupCollapsed(label);

  if (inputData && inputValidator) {
    const isValidInput = inputValidator(inputData);

    if (!isValidInput.success) {
      storeLogger.warn("Invalid product input", inputData);
      storeLogger.groupEnd();

      return {
        success: false,
        message: isValidInput.message ?? "Please fill in all fields.",
      };
    }
  }

  try {
    if (inputData) {
      storeLogger.debug(`Sending ${label} request to API`, inputData);
    } else {
      storeLogger.debug(`Sending ${label} request to API`);
    }

    const apiResponse = await action(inputData);
    const responseData: Output = await apiResponse.json();
    storeLogger.debug("API responded with:", responseData);

    const isValidApiResponse = responseValidator(responseData);
    if (!isValidApiResponse.success) {
      storeLogger.error(`Invalid ${label} schema`, responseData);
      storeLogger.groupEnd();

      return {
        success: false,
        message: isValidApiResponse.message ?? `Invalid API response, ${label}`,
      };
    }

    const { success, data } = responseData;

    if (onSuccess && success && data !== undefined) {
      await onSuccess(data);
    }

    if (onDelete) {
      await onDelete();
    }

    storeLogger.info(`${label} is succeeded.`, data);
    const duration = performance.now() - start;
    storeLogger.debug(`${label} took ${duration.toFixed(2)}ms`);
    storeLogger.groupEnd();

    return responseData;
  } catch (error) {
    storeLogger.error(`Failed ${label}`, error);
    storeLogger.groupEnd();

    throw error;
  }
}
