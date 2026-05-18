import type { IntakeSubmission } from './types'

function row(label: string, value: string | string[] | null | undefined): string {
  if (!value || (Array.isArray(value) && value.length === 0)) return ''
  const display = Array.isArray(value) ? value.join(', ') : value
  return `
    <tr>
      <td style="padding:6px 0;color:#a8a29e;font-size:13px;width:200px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:#f5f5f4;font-size:13px;vertical-align:top;">${display}</td>
    </tr>`
}

function blockRow(label: string, value: string | null | undefined): string {
  if (!value) return ''
  return `
    <tr>
      <td colspan="2" style="padding:6px 0;">
        <div style="color:#a8a29e;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">${label}</div>
        <div style="color:#f5f5f4;font-size:13px;background:#1a1a1a;border-left:2px solid #D4622A;padding:10px 14px;border-radius:0 4px 4px 0;">${value}</div>
      </td>
    </tr>`
}

function section(title: string, emoji: string, rows: string): string {
  return `
    <tr>
      <td colspan="2" style="padding:28px 0 6px;">
        <div style="font-size:15px;font-weight:600;color:#f5f5f4;border-bottom:1px solid #2e2e2e;padding-bottom:8px;">
          ${emoji} ${title}
        </div>
      </td>
    </tr>
    ${rows}`
}

export function formatIntakeEmail(s: IntakeSubmission): { subject: string; html: string; text: string } {
  const name = s.respondent_name ?? s.respondent_email ?? 'Someone'
  const submittedAt = s.submitted_at
    ? new Date(s.submitted_at).toLocaleString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
      })
    : 'just now'

  const body = `
    ${section('Home Base', '🌐',
      row('Website URL', s.website_url) +
      row('Website host', s.website_host === 'Other' ? `Other — ${s.website_host_other}` : s.website_host) +
      row('Domain registrar', s.domain_registrar === 'Other' ? `Other — ${s.domain_registrar_other}` : s.domain_registrar) +
      row('Email provider', s.email_provider)
    )}
    ${section('Money', '💳',
      row('Payment processor', s.payment_processor) +
      row('Requires deposit', s.requires_deposit) +
      row('Invoice tool', s.invoice_tool === 'Other' ? `Other — ${s.invoice_tool_other}` : s.invoice_tool) +
      row('Invoice tracking', s.invoice_tracking) +
      row('Has bookkeeper', s.has_bookkeeper)
    )}
    ${section('Booking Flow', '📋',
      row('Lead sources', s.lead_sources) +
      row('Proposal tool', s.proposal_tool) +
      row('Contract tool', s.contract_tool) +
      row('Booking platform', s.booking_platform) +
      row('Avg time to book', s.avg_time_to_book)
    )}
    ${section('Project & Delivery', '📦',
      row('Project tracking', s.project_tracking) +
      row('Client communication', s.client_communication) +
      row('Delivery method', s.delivery_method) +
      row('File storage', s.file_storage) +
      row('Active projects (typical)', s.typical_active_projects)
    )}
    ${section('Pain Points', '⚡',
      row('Biggest gap', s.biggest_gap === 'Something else' ? `Something else — ${s.biggest_gap_other}` : s.biggest_gap) +
      blockRow("Tool they'd never give up", s.tool_id_never_give_up) +
      blockRow('One thing to fix overnight', s.one_thing_to_fix) +
      blockRow('Anything else', s.anything_else)
    )}`

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;min-height:100vh;">
    <tr><td align="center" style="padding:60px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">
        <tr><td style="height:3px;background:linear-gradient(90deg,transparent,#D4622A,transparent);border-radius:2px;"></td></tr>
        <tr><td style="background:#111111;border:1px solid #2e2e2e;border-top:none;border-radius:0 0 12px 12px;padding:40px 40px 32px;">
          <h1 style="margin:0 0 6px;font-size:24px;font-weight:700;color:#f5f5f4;letter-spacing:-0.02em;">New intake submission</h1>
          <p style="margin:0 0 32px;font-size:15px;color:#a8a29e;">${name} &middot; ${submittedAt}</p>
          <table width="100%" cellpadding="0" cellspacing="0">${body}</table>
          <div style="height:1px;background:#2e2e2e;margin:32px 0 20px;"></div>
          <p style="margin:0;font-size:12px;color:#3d3935;">Submitted via amp-crm.us/intake</p>
        </td></tr>
        <tr><td style="padding:20px 0 0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#3d3935;letter-spacing:0.04em;">amp-crm · made with care, by Aaron</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  const text = `New intake submission from ${name}\n\n${submittedAt}\n\nFull details in your dashboard.`

  return { subject: `New intake submission — ${name}`, html, text }
}
