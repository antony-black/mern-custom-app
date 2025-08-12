import { env } from "../utils/env";
import { makeRequestToBrevo } from "../utils/make-request-to-brevo";

export const sendEmailThroughBrevo = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  return await makeRequestToBrevo({
    path: "smtp/email",
    data: {
      subject,
      htmlContent: html,
      sender: { email: env.FROM_EMAIL_ADDRESS, name: env.FROM_EMAIL_NAME },
      to: [{ email: to }],
    },
  });
};
