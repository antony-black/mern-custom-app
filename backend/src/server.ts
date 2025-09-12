import fs from "fs";
import path from "path";

// import dotenv from "dotenv";
import express from "express";

import { connectDB } from "./config/db";

import router from "./routes/products-router";
import uploadRouter from "./routes/upload-router";
import { applyCron } from "./services/cron-service";
import { logger } from "./services/logger/logger-service";
import { morganMiddleware } from "./services/morgan-service";
import { env } from "./utils/env";

// dotenv.config();

const app = express();

app.use(morganMiddleware);

const PORT = env.PORT || 5000;

connectDB();

const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body
app.use("/api/products/", router);
app.use("/api/upload", uploadRouter);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

applyCron();

logger.info({
  logType: "server",
  message: "App started.",
  logData: { port: PORT, env: process.env.NODE_ENV },
});

if (process.env.NODE_ENV === "production") {
  // const distPath = path.resolve(__dirname, "../frontend/dist");
  const distPath = path.join(__dirname, "public");

  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, async () => {
  logger.info({
    logType: "server",
    message: `Running on ${process.env.PORT}`,
  });
});
// uSLCRsVaQQ49Hh1t
