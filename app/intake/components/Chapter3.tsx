'use client'

import type { IntakeAnswers } from '@/lib/intake/types'

const LEAD_SOURCE_OPTIONS = ['Contact form on website', 'Instagram DM', 'Referral from past client', 'Google search', 'Email directly', 'Phone call', 'Other']
const PROPOSAL_OPTIONS = ['HoneyBook', 'Dubsado', '17hats', 'Email a PDF', "I don't send formal proposals", 'Other']
const CONTRACT_OPTIONS = ['HoneyBook', 'Dubsado', 'DocuSign', 'HelloSign', 'Email a PDF', 'Paper', 'Other']
const BOOKING_OPTIONS = ['HoneyBook', 'Dubsado', '17hats', 'Acuity', 'Calendly', 'None — I manage manually', 'Other']
const TIME_OPTIONS = ['Same day', '1–3 days', '1 week', '2+ weeks', 'Varies a lot']

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

export default function Chapter3({ answers, onChange }: Props) {
  const leadSources = answers.lead_sources ?? []

  return (
    <div className="space-y-6">
      <div>
        <Label>How do most of your leads find you? (select all that apply)</Label>
        <MultiCheck
          options={LEAD_SOURCE_OPTIONS}
          selected={leadSources}
          onChange={(v) => onChange({ lead_sources: v })}
        />
      </div>

      <div>
        <Label>How do you send proposals?</Label>
        <Select
          value={answers.proposal_tool ?? ''}
          onChange={(v) => onChange({ proposal_tool: v })}
          options={PROPOSAL_OPTIONS}
        />
      </div>

      <div>
        <Label>How do you send and sign contracts?</Label>
        <Select
          value={answers.contract_tool ?? ''}
          onChange={(v) => onChange({ contract_tool: v })}
          options={CONTRACT_OPTIONS}
        />
      </div>

      <div>
        <Label>What platform do you use for booking / scheduling?</Label>
        <Select
          value={answers.booking_platform ?? ''}
          onChange={(v) => onChange({ booking_platform: v })}
          options={BOOKING_OPTIONS}
        />
      </div>

      <div>
        <Label>How long does it usually take from first contact to a signed contract?</Label>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => onChange({ avg_time_to_book: o })}
              className={`rounded-full border px-4 py-1.5 text-caption transition-all ${
                answers.avg_time_to_book === o
                  ? 'border-gold bg-gold/10 text-ink-primary'
                  : 'border-line bg-bg-card text-ink-secondary hover:border-gold/20 hover:bg-bg-hover'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
