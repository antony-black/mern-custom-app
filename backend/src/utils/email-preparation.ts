import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fg from "fast-glob";
import _ from "lodash";
import { env } from "./env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getHtmlTemplates = _.memoize(async () => {
  // const htmlPathsPattern = path.resolve(__dirname, "../emails/dist/**/*.html");
  const distDir = path.resolve(__dirname, "../emails/dist");
  const htmlPathsPattern = path.join(distDir, "*.html").replace(/\\/g, "/");

  console.log("HERE >>>> htmlPathsPattern:", htmlPathsPattern);
  const htmlPaths = fg.sync(htmlPathsPattern);
  console.log("HERE >>>> htmlPaths:", htmlPaths);
  const htmlTemplates: Record<string, string> = {};
  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, ".html");
    console.log("HERE >>>> templateName:", templateName);
    htmlTemplates[templateName] = await fs.readFile(htmlPath, "utf8");
    console.log("HERE >>>> htmlTemplates[templateName]:", htmlTemplates[templateName]);
  }
  console.log("HERE >>>> htmlTemplates:", htmlTemplates);
  return htmlTemplates;
});

const getHtmlTemplate = async (templateName: string) => {
  const htmlTemplates = await getHtmlTemplates();
  console.log("HERE >>>> htmlTemplates:", htmlTemplates);
  console.log("HERE >>>> htmlTemplates[templateName]:", htmlTemplates[templateName]);
  return htmlTemplates[templateName];
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
    const htmlTemplate = await getHtmlTemplate(templateName);
    console.log("HERE >>>> htmlTemplate:", htmlTemplate);
    const fullTemplateVaraibles = {
      ...templateVariables,
      homeUrl: env.WEBAPP_URL,
    };
    console.log("HERE >>>> fullTemplateVaraibles:", fullTemplateVaraibles);
    console.info("sendEmail", {
      to,
      subject,
      templateName,
      fullTemplateVaraibles,
      htmlTemplate,
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
    to: "designapp79@gmail.com",
    subject: "Thanks For Adding a new product!",
    templateName: "success",
    templateVariables: {
      name: "Makar",
      addUrl: `${env.WEBAPP_URL}/create`,
    },
  });
};
