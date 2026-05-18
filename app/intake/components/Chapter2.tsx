'use client'

import type { IntakeAnswers } from '@/lib/intake/types'

const PAYMENT_OPTIONS = ['Stripe', 'Square', 'PayPal', 'Venmo/Zelle', 'Built into booking platform', 'Client pays by check', 'Other']
const INVOICE_OPTIONS = ['QuickBooks', 'FreshBooks', 'Wave', 'Xero', 'HoneyBook', 'Dubsado', 'Excel/Google Sheets', 'I email a PDF template', 'Other']
const TRACKING_OPTIONS = ['My accounting software tracks it', 'Spreadsheet', 'I remember / check my email', 'A platform like HoneyBook', 'Other']
const BOOKKEEPER_OPTIONS = ['Yes', 'No', 'Sometimes']
const DEPOSIT_OPTIONS = ['Yes', 'No']

interface Props {
  answers: Partial<IntakeAnswers>
  onChange: (patch: Partial<IntakeAnswers>) => void
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-caption font-medium text-ink-primary">{children}</label>
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
    >
      <option value="">Select one…</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function MultiCheck({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((o) => {
        const checked = selected.includes(o)
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(checked ? selected.filter((x) => x !== o) : [...selected, o])}
            className={`flex items-center gap-2.5 rounded-token-md border px-3 py-2.5 text-left text-caption transition-all ${
              checked
                ? 'border-gold/40 bg-gold/10 text-ink-primary'
                : 'border-line bg-bg-card text-ink-secondary hover:border-gold/20 hover:bg-bg-hover'
            }`}
          >
            <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border text-[10px] transition-all ${
              checked ? 'border-gold bg-gold text-bg-base' : 'border-line bg-transparent'
            }`}>
              {checked && '✓'}
            </span>
            {o}
          </button>
        )
      })}
    </div>
  )
}

function YesNo({ value, onChange, options = ['Yes', 'No'] }: { value: string; onChange: (v: string) => void; options?: string[] }) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`flex-1 rounded-token-md border px-4 py-2.5 text-caption font-medium transition-all ${
            value === o
              ? 'border-gold/40 bg-gold/10 text-ink-primary'
              : 'border-line bg-bg-card text-ink-secondary hover:border-gold/20 hover:bg-bg-hover'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export default function Chapter2({ answers, onChange }: Props) {
  const paymentSelected = answers.payment_processor ?? []

  return (
    <div className="space-y-6">
      <div>
        <Label>How do clients pay you? (select all that apply)</Label>
        <MultiCheck
          options={PAYMENT_OPTIONS}
          selected={paymentSelected}
          onChange={(v) => onChange({ payment_processor: v })}
        />
      </div>

      <div>
        <Label>Do you require a deposit before booking?</Label>
        <YesNo
          value={answers.requires_deposit ?? ''}
          onChange={(v) => onChange({ requires_deposit: v })}
          options={DEPOSIT_OPTIONS}
        />
      </div>

      <div>
        <Label>How do you send invoices?</Label>
        <Select
          value={answers.invoice_tool ?? ''}
          onChange={(v) => onChange({ invoice_tool: v, invoice_tool_other: v === 'Other' ? answers.invoice_tool_other : '' })}
          options={INVOICE_OPTIONS}
        />
        {answers.invoice_tool === 'Other' && (
          <div className="mt-2">
            <input
              type="text"
              value={answers.invoice_tool_other ?? ''}
              onChange={(e) => onChange({ invoice_tool_other: e.target.value })}
              placeholder="Tell us what you use…"
              className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
          </div>
        )}
      </div>

      <div>
        <Label>How do you track who&apos;s paid?</Label>
        <Select
          value={answers.invoice_tracking ?? ''}
          onChange={(v) => onChange({ invoice_tracking: v })}
          options={TRACKING_OPTIONS}
        />
      </div>

      <div>
        <Label>Do you have a bookkeeper or CPA involved?</Label>
        <YesNo
          value={answers.has_bookkeeper ?? ''}
          onChange={(v) => onChange({ has_bookkeeper: v })}
          options={BOOKKEEPER_OPTIONS}
        />
      </div>
    </div>
  )
}
