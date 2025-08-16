import { sendEmail } from "../utils/email-preparation";
import { getBaseAppUrl } from "../utils/env";

const BASE_APP_URL = getBaseAppUrl();

// export const sendSuccessEmail = async ({ user }: { user: Pick<User, "nick" | "email"> }) => {
export const sendSuccessEmail = async () => {
  return await sendEmail({
    to: "merncustomapp@gmail.com",
    subject: "Thanks For Adding a new product!",
    templateName: "successNotification",
    templateVariables: {
      name: "New Product",
      addUrl: `${BASE_APP_URL}/create`,
    },
  });
};

export const sendReminderEmail = async () => {
  return await sendEmail({
    to: "merncustomapp@gmail.com",
    subject: "Hey Makar, quick reminder for you",
    templateName: "reminder",
    templateVariables: {
      name: "Makar",
    },
  });
};
