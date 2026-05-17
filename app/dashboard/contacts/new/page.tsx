import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import { createContact } from '../actions'

export default async function NewContactPage() {
  const user = await requireUser()

  let companies: { id: string; name: string }[] = []
  if (user) {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('companies')
      .select('id, name')
      .eq('user_id', user.id)
      .order('name')
    companies = data ?? []
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <Link
        href="/dashboard/contacts"
        className="mb-6 inline-flex items-center gap-2 text-caption text-ink-muted transition-colors hover:text-ink-primary"
      >
        <ArrowLeft size={14} />
        Back to Contacts
      </Link>

      <h1 className="mb-8 text-heading text-ink-primary">New Contact</h1>

      <form action={createContact} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First Name" name="first_name" required />
          <FormField label="Last Name" name="last_name" required />
        </div>
        <FormField label="Email" name="email" type="email" />
        <FormField label="Phone" name="phone" type="tel" />
        <FormField label="Title / Role" name="title" />

        {/* Company */}
        <div>
          <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
            Company
          </label>
          <select
            name="company_id"
            className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
          >
            <option value="">No company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
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
            Create Contact
          </button>
          <Link
            href="/dashboard/contacts"
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
  required = false,
}: {
  label: string
  name: string
  type?: string
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
        required={required}
        className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
      />
    </div>
  )
}
