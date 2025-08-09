import type { TValidator } from "@shared/types";
import type { ZodSchema } from "zod";

export function createZodValidator<T>(schema: ZodSchema<T>): TValidator<T> {
  return (data: T) => {
    const result = schema.safeParse(data);
    return result.success
      ? { success: true, message: "" }
      : { success: false, message: result.error.message };
  };
}
