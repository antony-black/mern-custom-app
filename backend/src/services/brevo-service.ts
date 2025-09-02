import { env } from "../utils/env";
import { makeRequestToBrevo } from "../utils/make-response-to-brevo/make-request-to-brevo";

export const sendEmailThroughBrevo = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  return await makeRequestToBrevo({
    path: "smtp/email",
    data: {
      subject,
      htmlContent: html,
      sender: { email: env.FROM_EMAIL_ADDRESS, name: env.FROM_EMAIL_NAME },
      to: [{ email: to }],
      headers: {
        "X-Mailin-track": "0", // disable all tracking
        "X-Mailin-open-track": "0", // disable open tracking pixel
        "X-Mailin-click-track": "0", // disable click tracking redirects
      },
    },
  });
};
