import { CronJob } from "cron";
import { sendReminderEmail } from "./emails-service";
import { logger } from "./logger-service";

export const applyCron = () => {
  logger.info({
    logType: "cron",
    message: `Initializing cron job with schedule: "*/5 * * * *"`,
    logData: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  });

  new CronJob(
    "*/5 * * * *", // every 5 minutes
    // "* * * * *", // every minute
    // "* * * * * *", // every second
    async () => {
      const start = Date.now();

      logger.info({
        logType: "cron",
        message: "Cron job started: sendReminderEmail.",
        logData: { startedAt: new Date().toISOString() },
      });

      try {
        const result = await sendReminderEmail();
        logger.info({
          logType: "cron",
          message: "Cron job completed successfully.",
          logData: { durationMs: getDuration(start), result },
        });
      } catch (error) {
        logger.error({
          logType: "cron",
          error: "Cron job failed.",
          logData: { durationMs: getDuration(start), error },
        });
      }
    },
    null, // onComplete
    true, // start right now
    // env.CRON_TIMEZONE || "UTC" // default timezone
  );
};

const getDuration = (start: number) => {
  return Date.now() - start;
};
