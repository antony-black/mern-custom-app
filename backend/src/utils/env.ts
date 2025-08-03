import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables first
dotenv.config();

const zNonEmptyTrimmedSchema = z.string().trim().min(1, { message: "There is no ENV key." });

const zEnvSchema = z.object({
  NODE_ENV: zNonEmptyTrimmedSchema,
  PORT: zNonEmptyTrimmedSchema,
  MONGO_URI: zNonEmptyTrimmedSchema,
  CLOUDINARY_API_KEY: zNonEmptyTrimmedSchema,
  CLOUDINARY_API_SECRET: zNonEmptyTrimmedSchema,
  CLOUDINARY_CLOUD_NAME: zNonEmptyTrimmedSchema,
  WEBAPP_URL: zNonEmptyTrimmedSchema,
  SERVER_URL: zNonEmptyTrimmedSchema,
  BREVO_API_KEY: zNonEmptyTrimmedSchema,
  FROM_EMAIL_NAME: zNonEmptyTrimmedSchema,
  FROM_EMAIL_ADDRESS: zNonEmptyTrimmedSchema,
});

export const env = zEnvSchema.parse(process.env);

export const getBaseAppUrl = (): string => {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && !env.SERVER_URL) {
    throw new Error("❌ SERVER_URL must be defined in production.");
  }

  return isProduction ? env.SERVER_URL : env.WEBAPP_URL;
};
