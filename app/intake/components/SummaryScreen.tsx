import type { IntakeAnswers } from '@/lib/intake/types'

interface Props {
  answers: Partial<IntakeAnswers>
  onSubmit: () => void
  submitting: boolean
}

function Row({ label, value }: { label: string; value: string | string[] | null | undefined }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  const display = Array.isArray(value) ? value.join(', ') : value
  return (
    <div className="flex gap-3 py-2 border-b border-line/50 last:border-0">
      <span className="w-40 flex-shrink-0 text-caption text-ink-muted">{label}</span>
      <span className="text-caption text-ink-primary">{display}</span>
    </div>
  )
}

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="rounded-token-lg border border-line bg-bg-card p-5">
      <h3 className="mb-3 flex items-center gap-2 text-caption font-semibold text-ink-primary">
        <span>{emoji}</span> {title}
      </h3>
      {children}
    </div>
  )
}

export default function SummaryScreen({ answers, onSubmit, submitting }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-light.svg" alt="AM" className="mb-8 h-8 w-auto opacity-80" />

        <h2 className="mb-2 text-[1.75rem] font-bold tracking-tight text-ink-primary">Your stack at a glance</h2>
        <p className="mb-8 text-body text-ink-muted">Review your answers before submitting. Looks good? Hit send.</p>

        <div className="space-y-4">
          <Section title="Home Base" emoji="🌐">
            <Row label="Website" value={answers.website_url} />
            <Row label="Host" value={answers.website_host === 'Other' ? `Other — ${answers.website_host_other}` : answers.website_host} />
            <Row label="Registrar" value={answers.domain_registrar === 'Other' ? `Other — ${answers.domain_registrar_other}` : answers.domain_registrar} />
            <Row label="Email" value={answers.email_provider} />
          </Section>

          <Section title="Money" emoji="💳">
            <Row label="Payment" value={answers.payment_processor} />
            <Row label="Deposit required" value={answers.requires_deposit} />
            <Row label="Invoicing" value={answers.invoice_tool === 'Other' ? `Other — ${answers.invoice_tool_other}` : answers.invoice_tool} />
            <Row label="Payment tracking" value={answers.invoice_tracking} />
            <Row label="Bookkeeper" value={answers.has_bookkeeper} />
          </Section>

          <Section title="Booking Flow" emoji="📋">
            <Row label="Lead sources" value={answers.lead_sources} />
            <Row label="Proposals" value={answers.proposal_tool} />
            <Row label="Contracts" value={answers.contract_tool} />
            <Row label="Booking platform" value={answers.booking_platform} />
            <Row label="Time to book" value={answers.avg_time_to_book} />
          </Section>

          <Section title="Project & Delivery" emoji="📦">
            <Row label="Project tracking" value={answers.project_tracking} />
            <Row label="Client comms" value={answers.client_communication} />
            <Row label="File delivery" value={answers.delivery_method} />
            <Row label="File storage" value={answers.file_storage} />
            <Row label="Active projects" value={answers.typical_active_projects} />
          </Section>

          <Section title="Pain Points" emoji="⚡">
            <Row label="Biggest gap" value={answers.biggest_gap === 'Something else' ? `Something else — ${answers.biggest_gap_other}` : answers.biggest_gap} />
            <Row label="Tool to keep" value={answers.tool_id_never_give_up} />
            <Row label="Fix overnight" value={answers.one_thing_to_fix} />
            <Row label="Anything else" value={answers.anything_else} />
          </Section>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-token-md bg-gold px-10 py-3.5 text-body font-semibold text-bg-base transition-all hover:bg-gold-light disabled:opacity-50"
          >
            {submitting ? 'Sending…' : 'Submit'}
            {!submitting && <span aria-hidden>→</span>}
          </button>
          <p className="text-caption text-ink-muted">Your answers go directly to Aaron. That&apos;s it.</p>
        </div>
      </div>
    </div>
  )
}
