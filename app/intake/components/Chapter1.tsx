'use client'

import type { IntakeAnswers } from '@/lib/intake/types'

const HOST_OPTIONS = ['Squarespace', 'Wix', 'Webflow', 'WordPress', 'Custom/Dev-built', "Don't have one", 'Other']
const REGISTRAR_OPTIONS = ['GoDaddy', 'Namecheap', 'Squarespace', 'Google Domains', 'Cloudflare', 'Same as host', 'Not sure', 'Other']
const EMAIL_OPTIONS = ['Google Workspace', 'Microsoft 365', 'Built into my host', 'Personal Gmail/Outlook', 'Other']

interface Props {
  answers: Partial<IntakeAnswers>
  onChange: (patch: Partial<IntakeAnswers>) => void
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-caption font-medium text-ink-primary">{children}</label>
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
    />
  )
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

export default function Chapter1({ answers, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Who hosts your website?</Label>
        <Select
          value={answers.website_host ?? ''}
          onChange={(v) => onChange({ website_host: v, website_host_other: v === 'Other' ? answers.website_host_other : '' })}
          options={HOST_OPTIONS}
        />
        {answers.website_host === 'Other' && (
          <div className="mt-2">
            <TextInput
              value={answers.website_host_other ?? ''}
              onChange={(v) => onChange({ website_host_other: v })}
              placeholder="Tell us which host…"
            />
          </div>
        )}
      </div>

      <div>
        <Label>Where is your domain registered?</Label>
        <Select
          value={answers.domain_registrar ?? ''}
          onChange={(v) => onChange({ domain_registrar: v, domain_registrar_other: v === 'Other' ? answers.domain_registrar_other : '' })}
          options={REGISTRAR_OPTIONS}
        />
        {answers.domain_registrar === 'Other' && (
          <div className="mt-2">
            <TextInput
              value={answers.domain_registrar_other ?? ''}
              onChange={(v) => onChange({ domain_registrar_other: v })}
              placeholder="Tell us which registrar…"
            />
          </div>
        )}
      </div>

      <div>
        <Label>What do you use for email?</Label>
        <Select
          value={answers.email_provider ?? ''}
          onChange={(v) => onChange({ email_provider: v })}
          options={EMAIL_OPTIONS}
        />
      </div>
    </div>
  )
}
