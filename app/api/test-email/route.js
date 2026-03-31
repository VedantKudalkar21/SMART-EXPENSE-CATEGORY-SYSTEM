import arcjet, { detectBot, shield } from "@arcjet/next";
import { NextResponse } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
    }),
  ],
});

export async function GET(req) {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    return new NextResponse("Blocked", { status: 403 });
  }

  return NextResponse.json({ success: true });
}