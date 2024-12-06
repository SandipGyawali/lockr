import { Resend } from "resend";
import { env } from "../lib/env";

/**
 * resend sdk instance for mailer service.
 */
export const mail = new Resend(env.RESEND_API_KEY);
