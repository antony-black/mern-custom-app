import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables first
dotenv.config();

const zNonEmptyTrimmedSchema = z.string().trim().min(1, { message: "There is no ENV key." });

const zEnvSchema = z.object({
  PORT: zNonEmptyTrimmedSchema,
  MONGO_URI: zNonEmptyTrimmedSchema,
  CLOUDINARY_API_KEY: zNonEmptyTrimmedSchema,
  CLOUDINARY_API_SECRET: zNonEmptyTrimmedSchema,
  CLOUDINARY_CLOUD_NAME: zNonEmptyTrimmedSchema,
  WEBAPP_URL: zNonEmptyTrimmedSchema,
});

export const env = zEnvSchema.parse(process.env);
