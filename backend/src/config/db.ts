import mongoose from "mongoose";
import { logger } from "../services/logger-service";
import { env } from "../utils/env";

export const connectDB = async () => {
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info({
      logType: "db",
      message: "MongoDB Connected.",
    });
  } catch (error) {
    logger.error({
      logType: "db",
      error: new Error("Connection failed"),
    });

    process.exit(1); // process code 1 code means exit with failure, 0 means success
  }
};
