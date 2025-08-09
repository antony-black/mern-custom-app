import { storeLogger } from "./logger-handler";

export async function withLoggerGroup<T>(label: string, fn: () => Promise<T> | T): Promise<T> {
  const start = performance.now();
  console.groupCollapsed(label);

  try {
    const result = await fn();
    const duration = performance.now() - start;
    storeLogger.debug(`${label} took ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    storeLogger.error(`${label} failed`, error);
    throw error;
  } finally {
    console.groupEnd();
  }
}
