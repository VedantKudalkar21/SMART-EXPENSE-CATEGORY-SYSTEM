"use server";

import { Resend } from "resend";
import { render } from "@react-email/render";
import EmailTemplate from "@/emails/template"; // adjust path

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, type, data, userName }) {
  try {
    console.log("📨 Sending email to:", to);

    // ✅ Render React template to HTML
    const html = render(
      EmailTemplate({
        userName,
        type,
        data,
      })
    );

    const response = await resend.emails.send({
      from: "Finexa <onboarding@resend.dev>",
      to,
      subject,
      html, // ✅ THIS is the key fix
    });

    console.log("✅ Email sent:", response);

    return response;
  } catch (error) {
    console.error("❌ Email error:", error);
    return null;
  }
}