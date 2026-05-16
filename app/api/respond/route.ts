import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function buildHtml(isAccept: boolean, timestamp: string): string {
  const emoji = isAccept ? "🎉" : "😔";
  const headline = isAccept ? "He said yes." : "He said no.";
  const body = isAccept
    ? "Andres graciously accepted the CRM gift. Time to build."
    : "Andres politely declined. The confetti has been returned to the store.";
  const accentColor = isAccept ? "#c9a96e" : "#57534e";
  const subtext = isAccept
    ? "He's expecting something great. No pressure."
    : "Give him a day. He'll come around.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${headline}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;min-height:100vh;">
    <tr>
      <td align="center" style="padding:60px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Top accent line -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,transparent,${accentColor},transparent);border-radius:2px;"></td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#111111;border:1px solid #2e2e2e;border-top:none;border-radius:0 0 12px 12px;padding:48px 40px 40px;">

              <!-- Emoji -->
              <p style="margin:0 0 24px;font-size:52px;line-height:1;text-align:center;">${emoji}</p>

              <!-- Headline -->
              <h1 style="margin:0 0 12px;font-size:32px;font-weight:700;color:#f5f5f4;text-align:center;letter-spacing:-0.02em;">${headline}</h1>

              <!-- Body -->
              <p style="margin:0 0 32px;font-size:16px;line-height:1.6;color:#a8a29e;text-align:center;">${body}</p>

              <!-- Divider -->
              <div style="height:1px;background:#2e2e2e;margin:0 0 28px;"></div>

              <!-- Subtext -->
              <p style="margin:0 0 28px;font-size:14px;color:#57534e;text-align:center;font-style:italic;">${subtext}</p>

              <!-- Timestamp -->
              <p style="margin:0;font-size:12px;color:#3d3935;text-align:center;letter-spacing:0.04em;text-transform:uppercase;">${timestamp}</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#3d3935;letter-spacing:0.04em;">amp-crm · made with care, by Aaron</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const action: "accept" | "decline" = body?.action;

  if (action !== "accept" && action !== "decline") {
    return NextResponse.json({ ok: false, error: "Invalid action" }, { status: 400 });
  }

  const isAccept = action === "accept";
  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.FROM_EMAIL ?? "onboarding@resend.dev",
      to: process.env.NOTIFICATION_EMAIL ?? "",
      subject: isAccept ? "🎉 Andres accepted!" : "😔 Andres declined.",
      html: buildHtml(isAccept, timestamp),
      text: isAccept
        ? `Andres accepted at ${timestamp}. Time to build!`
        : `Andres declined at ${timestamp}. The confetti has been returned.`,
    });
  } catch (err) {
    console.error("Resend error:", err);
  }

  return NextResponse.json({ ok: true });
}
