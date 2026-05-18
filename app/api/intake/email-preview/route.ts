import { NextResponse } from 'next/server'
import { formatIntakeEmail } from '@/lib/intake/email'
import type { IntakeSubmission } from '@/lib/intake/types'

const SAMPLE: IntakeSubmission = {
  id: 'preview-000',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  submitted_at: new Date().toISOString(),

  respondent_email: 'andres@example.com',
  respondent_name: 'Andres Morales',
  respondent_google_id: 'google-preview-000',

  completed_chapters: 5,

  // Chapter 1
  website_url: null,
  website_host: 'Squarespace',
  website_host_other: null,
  domain_registrar: 'GoDaddy',
  domain_registrar_other: null,
  email_provider: 'Google Workspace',

  // Chapter 2
  payment_processor: ['Stripe', 'Venmo/Zelle'],
  requires_deposit: 'Yes',
  invoice_tool: 'HoneyBook',
  invoice_tool_other: null,
  invoice_tracking: 'A platform like HoneyBook',
  has_bookkeeper: 'Sometimes',

  // Chapter 3
  lead_sources: ['Instagram DM', 'Referral from past client', 'Contact form on website'],
  proposal_tool: 'HoneyBook',
  contract_tool: 'HoneyBook',
  booking_platform: 'Acuity',
  avg_time_to_book: '1–3 days',

  // Chapter 4
  project_tracking: 'HoneyBook/Dubsado/platform',
  client_communication: ['Email', 'Text/iMessage'],
  delivery_method: 'Pixieset',
  file_storage: 'A mix',
  typical_active_projects: '3–5',

  // Chapter 5
  biggest_gap: 'Following up on leads',
  biggest_gap_other: null,
  tool_id_never_give_up: 'HoneyBook — everything lives there, contracts, invoices, client communication.',
  one_thing_to_fix: 'Following up with leads who go cold. I\'ll respond to an inquiry, then never hear back, and I forget to follow up a week later. I\'ve definitely lost bookings because of this.',
  anything_else: 'I shoot mostly commercial and events. Weddings are maybe 20% of my work. Would love something that helps me track which leads are actually serious vs. just browsing.',
}

export async function GET() {
  const { html } = formatIntakeEmail(SAMPLE)
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
