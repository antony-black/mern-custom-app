import logger from "loglevel";

const isDev = process.env.NODE_ENV !== "production";
console.log(`Logger initialized in ${isDev ? "development" : "production"} mode.`);
// const isDev = import.meta.env.MODE !== "production";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const appLogger = logger.getLogger("app");
export const authLogger = logger.getLogger("auth");
export const storeLogger = logger.getLogger("store");

appLogger.setLevel(isDev ? "debug" : "warn");
authLogger.setLevel(isDev ? "info" : "error");
storeLogger.setLevel(isDev ? "debug" : "info");

export const createLogger = (name: string) => logger.getLogger(name);
export default logger;
