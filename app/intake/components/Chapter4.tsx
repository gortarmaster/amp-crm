'use client'

import type { IntakeAnswers } from '@/lib/intake/types'

const TRACKING_OPTIONS = ['HoneyBook/Dubsado/platform', 'Notion', 'Trello/Asana', 'Spreadsheet', 'Email threads', 'My head', 'Other']
const COMM_OPTIONS = ['Email', 'Text/iMessage', 'A client portal', 'Instagram DM', 'Phone calls']
const DELIVERY_OPTIONS = ['Pixieset', 'Shootproof', 'Google Drive', 'Dropbox', 'WeTransfer', 'USB drive', 'Other']
const STORAGE_OPTIONS = ['External hard drives', 'Cloud (Google Drive, Dropbox, iCloud)', 'NAS / home server', 'A mix', 'Other']
const ACTIVE_OPTIONS = ['1–2', '3–5', '6–10', '10+']

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

export default function Chapter4({ answers, onChange }: Props) {
  const commSelected = answers.client_communication ?? []

  return (
    <div className="space-y-6">
      <div>
        <Label>How do you keep track of active projects?</Label>
        <Select
          value={answers.project_tracking ?? ''}
          onChange={(v) => onChange({ project_tracking: v })}
          options={TRACKING_OPTIONS}
        />
      </div>

      <div>
        <Label>How do you communicate with clients during a project? (select all)</Label>
        <MultiCheck
          options={COMM_OPTIONS}
          selected={commSelected}
          onChange={(v) => onChange({ client_communication: v })}
        />
      </div>

      <div>
        <Label>How do you deliver final files?</Label>
        <Select
          value={answers.delivery_method ?? ''}
          onChange={(v) => onChange({ delivery_method: v })}
          options={DELIVERY_OPTIONS}
        />
      </div>

      <div>
        <Label>Where do you store your files long-term?</Label>
        <Select
          value={answers.file_storage ?? ''}
          onChange={(v) => onChange({ file_storage: v })}
          options={STORAGE_OPTIONS}
        />
      </div>

      <div>
        <Label>How many active projects do you typically have at once?</Label>
        <div className="flex gap-2">
          {ACTIVE_OPTIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => onChange({ typical_active_projects: o })}
              className={`flex-1 rounded-token-md border px-3 py-2.5 text-caption font-medium transition-all ${
                answers.typical_active_projects === o
                  ? 'border-gold/40 bg-gold/10 text-ink-primary'
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
