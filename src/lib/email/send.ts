import nodemailer, { type Transporter } from "nodemailer";
import { getEnv } from "@/lib/env";

export type SendMailInput = {
  to?: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

let transporter: Transporter | null = null;

function getSmtpConfig() {
  const { smtp } = getEnv();
  if (!smtp.host || !smtp.user || !smtp.password) return null;
  return smtp;
}

export function isSmtpConfigured(): boolean {
  return getSmtpConfig() !== null;
}

function getTransporter(): Transporter | null {
  const smtp = getSmtpConfig();
  if (!smtp) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port ?? 465,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.password,
      },
    });
  }

  return transporter;
}

export async function sendMail(input: SendMailInput): Promise<boolean> {
  const smtp = getSmtpConfig();
  const mailer = getTransporter();
  if (!smtp || !mailer) return false;

  const from = smtp.from ?? smtp.user!;
  const to = input.to ?? smtp.to ?? from;

  try {
    await mailer.sendMail({
      from: `"Light for Immigrants" <${from}>`,
      to,
      replyTo: input.replyTo,
      subject: input.subject,
      text: input.text,
      html: input.html ?? input.text.replace(/\n/g, "<br>"),
    });
    return true;
  } catch (error) {
    console.error("[email] Failed to send:", error);
    return false;
  }
}

export async function verifySmtpConnection(): Promise<boolean> {
  const mailer = getTransporter();
  if (!mailer) return false;
  try {
    await mailer.verify();
    return true;
  } catch (error) {
    console.error("[email] SMTP verification failed:", error);
    return false;
  }
}
