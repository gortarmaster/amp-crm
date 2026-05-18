'use client'

import type { IntakeAnswers } from '@/lib/intake/types'

const GAP_OPTIONS = [
  'Following up on leads',
  'Sending contracts/invoices',
  'Tracking which projects are where',
  'Getting paid on time',
  'Delivering files',
  'Client communication',
  'Something else',
]

interface Props {
  answers: Partial<IntakeAnswers>
  onChange: (patch: Partial<IntakeAnswers>) => void
}

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block text-caption font-medium text-ink-primary">{children}</label>
      {hint && <p className="mt-0.5 text-caption text-ink-muted">{hint}</p>}
    </div>
  )
}

function Textarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full resize-none rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
    />
  )
}

export default function Chapter5({ answers, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <Label>What&apos;s the biggest gap in how you run your business right now?</Label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {GAP_OPTIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => onChange({ biggest_gap: o, biggest_gap_other: o === 'Something else' ? answers.biggest_gap_other : '' })}
              className={`flex items-start gap-2.5 rounded-token-md border px-3 py-2.5 text-left text-caption transition-all ${
                answers.biggest_gap === o
                  ? 'border-gold/40 bg-gold/10 text-ink-primary'
                  : 'border-line bg-bg-card text-ink-secondary hover:border-gold/20 hover:bg-bg-hover'
              }`}
            >
              <span className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border text-[10px] transition-all ${
                answers.biggest_gap === o ? 'border-gold bg-gold text-bg-base' : 'border-line bg-transparent'
              }`}>
                {answers.biggest_gap === o && '✓'}
              </span>
              {o}
            </button>
          ))}
        </div>
        {answers.biggest_gap === 'Something else' && (
          <div className="mt-2">
            <input
              type="text"
              value={answers.biggest_gap_other ?? ''}
              onChange={(e) => onChange({ biggest_gap_other: e.target.value })}
              placeholder="Tell us more…"
              className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
          </div>
        )}
      </div>

      <div>
        <Label
          hint="This tells me what to protect — I won't build anything that disrupts what's already working."
        >
          What&apos;s the one tool you&apos;d never give up?
        </Label>
        <Textarea
          value={answers.tool_id_never_give_up ?? ''}
          onChange={(v) => onChange({ tool_id_never_give_up: v })}
          placeholder="e.g. HoneyBook, Acuity, my Notes app…"
        />
      </div>

      <div>
        <Label>If you could fix one part of your workflow overnight, what would it be?</Label>
        <Textarea
          value={answers.one_thing_to_fix ?? ''}
          onChange={(v) => onChange({ one_thing_to_fix: v })}
          placeholder="Be as specific or vague as you like…"
        />
      </div>

      <div>
        <Label hint="Optional — anything you want me to know before we start building.">
          Anything else?
        </Label>
        <Textarea
          value={answers.anything_else ?? ''}
          onChange={(v) => onChange({ anything_else: v })}
          placeholder="Open floor…"
        />
      </div>
    </div>
  )
}
