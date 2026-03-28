// app/api/test-email/route.js

import { sendEmail } from "@/actions/send-email";

export async function GET() {
  const res = await sendEmail();
  return Response.json(res);
}