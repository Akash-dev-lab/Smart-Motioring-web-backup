import nodemailer, { type Transporter, type SentMessageInfo } from "nodemailer";
import type { SendEmailAlertInput } from "./types/index.js";

let transporter: Transporter | undefined;

const getTransporter = (): Transporter => {
  const { ALERT_EMAIL, ALERT_PASS } = process.env;

  if (!ALERT_EMAIL || !ALERT_PASS) {
    throw new Error("Missing ALERT_EMAIL or ALERT_PASS in environment");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: ALERT_EMAIL,
        pass: ALERT_PASS,
      },
    });
  }

  return transporter;
};

export const sendEmailAlert = async ({
  to,
  subject,
  text,
}: SendEmailAlertInput): Promise<SentMessageInfo> => {
  if (!to) {
    throw new Error("Missing alert recipient email");
  }

  return await getTransporter().sendMail({
    from: process.env.ALERT_EMAIL,
    to,
    subject,
    text,
  });
};
