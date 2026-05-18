export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireUser } from '@/lib/supabase/auth'
import { createServerClient } from '@/lib/supabase/server'
import { createProject } from '../actions'

const CATEGORIES = ['Wedding', 'Portrait', 'Commercial', 'Events', 'Family', 'Boudoir', 'Editorial', 'Other']

const STATUSES = [
  { value: 'lead', label: 'Lead' },
  { value: 'booked', label: 'Booked' },
  { value: 'shooting', label: 'Shooting' },
  { value: 'editing', label: 'Editing' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'archived', label: 'Archived' },
]

export default async function NewProjectPage() {
  const user = await requireUser()
  const supabase = createServerClient()

  const userId = user?.id ?? ''

  const [{ data: companies }, { data: contacts }] = await Promise.all([
    supabase.from('companies').select('id, name').eq('user_id', userId).order('name'),
    supabase
      .from('contacts')
      .select('id, first_name, last_name')
      .eq('user_id', userId)
      .order('first_name'),
  ])

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <Link
        href="/dashboard/projects"
        className="mb-6 inline-flex items-center gap-2 text-caption text-ink-muted transition-colors hover:text-ink-primary"
      >
        <ArrowLeft size={14} />
        Back to Projects
      </Link>

      <h1 className="mb-8 text-heading text-ink-primary">New Project</h1>

      <form action={createProject} className="space-y-5">
        {/* Core */}
        <FormField label="Project Title" name="title" required />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
              Status
            </label>
            <select
              name="status"
              defaultValue="lead"
              className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
              Category
            </label>
            <select
              name="category"
              className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Associations */}
        <div>
          <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
            Company
          </label>
          <select
            name="company_id"
            className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
          >
            <option value="">No company</option>
            {(companies ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
            Contacts
          </label>
          <p className="mb-1.5 text-ink-muted" style={{ fontSize: '11px' }}>
            Hold Cmd (Mac) or Ctrl (Windows) to select multiple
          </p>
          <select
            name="contact_ids"
            multiple
            className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2 text-caption text-ink-primary transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            style={{ minHeight: '7rem' }}
          >
            {(contacts ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Dates & value */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Shoot Date" name="shoot_date" type="date" />
          <FormField label="Delivery Date" name="delivery_date" type="date" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Value ($)" name="deal_value" type="number" placeholder="0" />
          <FormField label="Location" name="location" placeholder="City, State" />
        </div>

        {/* Internal notes */}
        <div>
          <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
            Internal Notes
          </label>
          <textarea
            name="internal_notes"
            rows={3}
            placeholder="Internal context, next steps…"
            className="w-full resize-none rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
          />
        </div>

        {/* CMS divider */}
        <div className="border-t border-line pt-5">
          <p className="mb-4 text-caption font-semibold uppercase tracking-widest text-ink-muted">
            Portfolio / Client Info
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                Public Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Shown on public portfolio and client gallery…"
                className="w-full resize-none rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Year" name="year" type="number" placeholder={new Date().getFullYear().toString()} />
              <div>
                <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                  URL Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  placeholder="auto-generated if blank"
                  className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
                />
                <p className="mt-1 text-ink-muted" style={{ fontSize: '11px' }}>
                  Used for /p/[slug] public URL
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-token-md bg-gold px-6 py-2.5 text-caption font-semibold text-bg-base transition-colors hover:bg-gold-light"
          >
            Create Project
          </button>
          <Link
            href="/dashboard/projects"
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
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
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
        placeholder={placeholder}
        className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
      />
    </div>
  )
}
