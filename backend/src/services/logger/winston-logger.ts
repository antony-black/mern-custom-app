import { EOL } from "os";
import _ from "lodash";
import pc from "picocolors";
import { MESSAGE } from "triple-beam";
import winston from "winston";
import * as yaml from "yaml";
import { env } from "../../utils/env";

export const winstonLogger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: "backend", environment: env.NODE_ENV },
  transports: [
    new winston.transports.Console({
      format: winston.format((logData) => {
        const setColor =
          {
            info: (str: string) => pc.blue(str),
            error: (str: string) => pc.red(str),
            debug: (str: string) => pc.cyan(str),
            http: (str: string) => pc.magenta(str),
          }[logData.level as "info" | "error" | "debug" | "http"] ?? ((str: string) => str);

        const levelAndType = `[${logData.level.toUpperCase()}] ${logData.logType ?? ""}`;
        const mainMessage = `${setColor(levelAndType)} ${pc.green(logData.timestamp as string)}${EOL}${logData.message}`;

        const visibleMessageTags = _.omit(logData, ["level", "logType", "timestamp", "message", "service", "hostEnv"]);
        const stringifiedLogData = _.trim(
          yaml.stringify(visibleMessageTags, (_k, v) => (_.isFunction(v) ? "Function" : v)),
        );

        const resultLogData = {
          ...logData,
          [MESSAGE]:
            [mainMessage, Object.keys(visibleMessageTags).length > 0 ? `${EOL}${stringifiedLogData}` : ""]
              .filter(Boolean)
              .join("") + EOL,
        };

        return resultLogData;
      })(),
    }),
  ],
});
