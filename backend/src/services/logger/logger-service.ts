import { serializeError } from "serialize-error";
import { winstonLogger } from "./winston-logger";

type TLoggerBase = {
  logType: string;
  logData?: Record<string, any>;
};

type TLoggerInfo = TLoggerBase & {
  message: string;
};

type TLoggerError = TLoggerBase & {
  error: any;
};

export const logger = {
  info: ({ logType, message, logData }: TLoggerInfo) => {
    winstonLogger.info({
      logType,
      message,
      logData: logData ?? {},
    });
  },

  http: ({ logType, message, logData }: TLoggerInfo) => {
    winstonLogger.info({
      logType,
      message,
      logData: logData ?? {},
    });
  },

  error: ({ logType, error, logData }: TLoggerError) => {
    const serializedError = serializeError(error);

    winstonLogger.error({
      logType,
      message: serializedError.message || "Unknown error",
      error: serializedError,
      logData: logData ?? {},
    });
  },
};
