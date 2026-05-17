import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireUser } from '@/lib/supabase/auth'
import { createCompany } from '../actions'

export default async function NewCompanyPage() {
  await requireUser()

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <Link
        href="/dashboard/companies"
        className="mb-6 inline-flex items-center gap-2 text-caption text-ink-muted transition-colors hover:text-ink-primary"
      >
        <ArrowLeft size={14} />
        Back to Companies
      </Link>

      <h1 className="mb-8 text-heading text-ink-primary">New Company</h1>

      <form action={createCompany} className="space-y-5">
        <FormField label="Company Name" name="name" required />
        <FormField label="Website" name="website" type="url" placeholder="https://example.com" />
        <FormField label="Industry" name="industry" placeholder="e.g. Architecture, Photography" />

        <div>
          <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
            Notes
          </label>
          <textarea
            name="notes"
            rows={4}
            placeholder="Any relevant context…"
            className="w-full resize-none rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-token-md bg-gold px-6 py-2.5 text-caption font-semibold text-bg-base transition-colors hover:bg-gold-light"
          >
            Create Company
          </button>
          <Link
            href="/dashboard/companies"
            className="rounded-token-md border border-line px-6 py-2.5 text-caption font-medium text-ink-secondary transition-colors hover:border-ink-muted hover:text-ink-primary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
        {label}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
      />
    </div>
  )
}
