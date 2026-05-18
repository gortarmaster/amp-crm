export function buildInviteEmail(baseUrl: string): string {
  const surveyUrl = `${baseUrl}/api/invite/track/click?to=${encodeURIComponent('/intake?name=Andres')}`
  const pixelUrl = `${baseUrl}/api/invite/track/open`
  const accent = '#D4622A'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Let's map out your workflow</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;min-height:100vh;">
    <tr>
      <td align="center" style="padding:60px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Top accent line -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,transparent,${accent},transparent);border-radius:2px;"></td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#111111;border:1px solid #2e2e2e;border-top:none;border-radius:0 0 12px 12px;padding:48px 44px 44px;">

              <!-- Wordmark -->
              <p style="margin:0 0 40px;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accent};">AM</p>

              <!-- Greeting -->
              <h1 style="margin:0 0 20px;font-size:28px;font-weight:700;color:#f5f5f4;line-height:1.25;letter-spacing:-0.02em;">
                Hey Andres &mdash; before we build anything, I want to understand how you work.
              </h1>

              <!-- Body copy -->
              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#a8a29e;">
                I put together a short survey &mdash; 5 chapters, about 5 minutes &mdash; that walks through your tools, your booking flow, how you handle money, and where the friction is.
              </p>
              <p style="margin:0 0 36px;font-size:16px;line-height:1.7;color:#a8a29e;">
                Your answers come straight to me. Takes about 5 minutes.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 40px;">
                <tr>
                  <td style="border-radius:8px;background:${accent};">
                    <a
                      href="${surveyUrl}"
                      style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;letter-spacing:0.01em;"
                    >
                      Start the survey &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px;background:#2e2e2e;margin:0 0 28px;"></div>

              <!-- Sign-off -->
              <p style="margin:0 0 4px;font-size:15px;color:#f5f5f4;font-weight:500;">Aaron</p>
              <p style="margin:0;font-size:13px;color:#57534e;">Building something for you</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#3d3935;letter-spacing:0.04em;">
                Not interested? <a href="mailto:${process.env.FROM_EMAIL ?? ''}" style="color:#57534e;">Just reply and let me know.</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

  <!-- Open tracking pixel -->
  <img src="${pixelUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;" />
</body>
</html>`
}
