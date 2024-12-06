import { env } from "../lib/env";
import { mail } from "./mail.client";

type Params = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  from?: string;
};

const sender =
  env.NODE_ENV === "development"
    ? `no-reply <onboarding@resend.dev>`
    : `no-replay <${env.MAIL_SENDER}>`; //add custom during production

export const sendMail = async ({
  to,
  html,
  subject,
  text,
  from = sender,
}: Params) =>
  await mail.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    text,
    subject,
    html,
  });
