import "loglevel";

declare module "loglevel" {
  export interface Logger {
    group: (...args: any[]) => void;
    groupCollapsed: (...args: any[]) => void;
    groupEnd: () => void;
  }
}
