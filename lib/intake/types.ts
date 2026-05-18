export type IntakeSubmission = {
  id: string
  created_at: string
  updated_at: string

  respondent_email: string | null
  respondent_name: string | null
  respondent_google_id: string | null

  completed_chapters: number
  submitted_at: string | null

  // Chapter 1 — Home Base
  website_url: string | null
  website_host: string | null
  website_host_other: string | null
  domain_registrar: string | null
  domain_registrar_other: string | null
  email_provider: string | null

  // Chapter 2 — Money
  payment_processor: string[] | null
  requires_deposit: string | null
  invoice_tool: string | null
  invoice_tool_other: string | null
  invoice_tracking: string | null
  has_bookkeeper: string | null

  // Chapter 3 — Booking Flow
  lead_sources: string[] | null
  proposal_tool: string | null
  contract_tool: string | null
  booking_platform: string | null
  avg_time_to_book: string | null

  // Chapter 4 — Project & Delivery
  project_tracking: string | null
  client_communication: string[] | null
  delivery_method: string | null
  file_storage: string | null
  typical_active_projects: string | null

  // Chapter 5 — Pain Points
  biggest_gap: string | null
  biggest_gap_other: string | null
  tool_id_never_give_up: string | null
  one_thing_to_fix: string | null
  anything_else: string | null
}

export type IntakeAnswers = Omit<IntakeSubmission, 'id' | 'created_at' | 'updated_at' | 'submitted_at'>
