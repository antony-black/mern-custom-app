import { Request } from "express";
import morgan from "morgan";
import pc from "picocolors";
import { logger } from "./logger-service";

const getStatusColor = (status: string) => {
  return (
    {
      "500": (str: string) => pc.blue(str),
      "400": (str: string) => pc.red(str),
      "300": (str: string) => pc.cyan(str),
      "200": (str: string) => pc.magenta(str),
    }[status as "500" | "400" | "300" | "200"] ?? ((str: string) => str)
  );
};

morgan.token("colored-method", (req) => pc.magenta(req.method));

morgan.token("colored-url", (req) => {
  const expressReq = req as Request;
  const fullUrl = expressReq.originalUrl || expressReq.url || "";
  return pc.cyan(fullUrl);
});

morgan.token("colored-status", (_req, res) => {
  const color = getStatusColor(String(res.statusCode));
  return color(String(res.statusCode));
});

morgan.token("colored-time", () => pc.gray("ms"));

// Define a stream for morgan to use Winston
const morganStream = {
  write: (message: string) => {
    logger.http({
      logType: "http",
      message: message.trim(),
    });
  },
};

// const skip = () => process.env.NODE_ENV === "test";

const format = ":colored-method :colored-url :colored-status :response-time ms - :res[content-length] bytes";

export const morganMiddleware = morgan(format, {
  stream: morganStream,
  // skip,
});
