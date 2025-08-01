import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fg from "fast-glob";
import Handlebars from "handlebars";
import _ from "lodash";
import { sendEmailThroughBrevo } from "../services/brevo-service";
import { getBaseAppUrl } from "./env";

const BASE_APP_URL = getBaseAppUrl();
console.log("BASE_APP_URL:", BASE_APP_URL);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getHbrTemplates = _.memoize(async () => {
  const distDir = path.resolve(__dirname, "../emails/dist");
  const htmlPathsPattern = path.join(distDir, "*.html").replace(/\\/g, "/");

  const htmlPaths = fg.sync(htmlPathsPattern);
  const hbrTemplates: Record<string, HandlebarsTemplateDelegate> = {};

  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, ".html");
    const htmlTemplate = await fs.readFile(htmlPath, "utf8");
    hbrTemplates[templateName] = Handlebars.compile(htmlTemplate);
  }

  return hbrTemplates;
});

const getEmailHtml = async (templateName: string, templateVariables: Record<string, string> = {}) => {
  const hbrTemplates = await getHbrTemplates();
  const hbrTemplate = hbrTemplates[templateName];
  const html = hbrTemplate(templateVariables);

  return html;
};

const sendEmail = async ({
  to,
  subject,
  templateName,
  templateVariables = {},
}: {
  to: string;
  subject: string;
  templateName: string;
  templateVariables?: Record<string, any>;
}) => {
  try {
    const fullTemplateVaraibles = {
      ...templateVariables,
      homeUrl: BASE_APP_URL,
    };
    const html = await getEmailHtml(templateName, fullTemplateVaraibles);
    const { loggableResponse } = await sendEmailThroughBrevo({ to, html, subject });

    console.info("sendEmail", {
      to,
      subject,
      templateName,
      fullTemplateVaraibles,
      response: loggableResponse,
    });
    return { ok: true };
  } catch (error) {
    console.error(error);

    return { ok: false };
  }
};

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
