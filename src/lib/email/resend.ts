import { Resend } from "resend";

const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_ADDRESS = process.env.RESEND_FROM ?? "몽리 <no-reply@mongree.app>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  if (!resendClient) {
    console.warn("[email] RESEND_API_KEY 미설정 — 이메일 전송 건너뜀:", subject);
    return;
  }

  const { error } = await resendClient.emails.send({ from: FROM_ADDRESS, to, subject, html });
  if (error) {
    console.error("[email] 이메일 전송 실패:", error.message);
  }
}
