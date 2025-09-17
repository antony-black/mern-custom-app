import logger from "loglevel";
import { addGroupMethods } from "./add-logger-group";

const isDev = process.env.NODE_ENV !== "production";
if (process.env.NODE_ENV !== "test") {
  console.log(`Logger initialized in ${isDev ? "development" : "production"} mode.`);
}

const originalFactory = logger.methodFactory;

const levelColors: Record<string, string> = {
  trace: `background: gray; color: white`,
  debug: `background: #4ea1d3; color: white`, // blue
  info: `background: #2ecc71; color: white`, // green
  warn: `background: #f39c12; color: white`, // orange
  error: `background: #e74c3c; color: white`, // red
};

logger.methodFactory = (methodName, logLevel, loggerName) => {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);

  return (...args: any[]) => {
    const timestamp = new Date().toISOString();
    const tag = typeof loggerName === "string" ? `${loggerName.toUpperCase()}` : "";
    const style = levelColors[methodName] || "";

    rawMethod(`%c[${tag}] [${timestamp}]`, style, ...args);
  };
};

logger.setLevel(isDev ? "debug" : "warn");

logger.setDefaultLevel(logger.getLevel());

// logger.setLevel(logger.levels.DEBUG); // Adjust globally if needed

addGroupMethods(logger);

export const appLogger = addGroupMethods(logger.getLogger("app"));
export const authLogger = addGroupMethods(logger.getLogger("auth"));
export const storeLogger = addGroupMethods(logger.getLogger("store"));
export const cloudinaryLogger = addGroupMethods(logger.getLogger("cloudinary"));
export const formLogger = addGroupMethods(logger.getLogger("form"));
export const homePageLogger = addGroupMethods(logger.getLogger("home-page"));

appLogger.setLevel(isDev ? "debug" : "warn");
authLogger.setLevel(isDev ? "info" : "error");
storeLogger.setLevel(isDev ? "debug" : "info");
homePageLogger.setLevel(isDev ? "debug" : "info");
cloudinaryLogger.setLevel(isDev ? "debug" : "info");
formLogger.setLevel(isDev ? "info" : "error");

export const createLogger = (name: string) => logger.getLogger(name);
export default logger;
