import type logger from ".";

export const addGroupMethods = (logInstance: logger.Logger) => {
  logInstance.group = (...args: any[]) => {
    if (console.group) console.group(...args);
  };
  logInstance.groupCollapsed = (...args: any[]) => {
    if (console.groupCollapsed) console.groupCollapsed(...args);
  };
  logInstance.groupEnd = () => {
    if (console.groupEnd) console.groupEnd();
  };
  return logInstance;
};
