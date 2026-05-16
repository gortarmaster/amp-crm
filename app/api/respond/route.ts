import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const action: "accept" | "decline" = body?.action;

  if (action !== "accept" && action !== "decline") {
    return NextResponse.json({ ok: false, error: "Invalid action" }, { status: 400 });
  }

  const isAccept = action === "accept";
  const subject = isAccept ? "🎉 Andres accepted!" : "😭 Andres declined.";
  const text = isAccept
    ? `Andres graciously accepted the CRM gift at ${new Date().toLocaleString()}. Time to build!`
    : `Andres politely declined at ${new Date().toLocaleString()}. The confetti has been returned.`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.FROM_EMAIL ?? "crm@resend.dev",
      to: process.env.NOTIFICATION_EMAIL ?? "",
      subject,
      text,
    });
  } catch (err) {
    // Log but don't fail — the UX should never block on email delivery
    console.error("Resend error:", err);
  }

  return NextResponse.json({ ok: true });
}
