import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { myEnvironment } from "../config/env.js";

// extra processing
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// sending mail
export const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: myEnvironment.SMTP_HOST,
    port: parseInt(myEnvironment.SMTP_PORT || "587"),
    service: myEnvironment.SMTP_SERVICE,
    auth: {
      user: myEnvironment.SMTP_MAIL,
      pass: myEnvironment.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;

  const templatePath = path.join(__dirname, "../", "mailTemplates", template);

  const html = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: myEnvironment.SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
