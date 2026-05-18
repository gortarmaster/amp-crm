'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Edit2, Trash2, Mail, Phone, Building2, FolderOpen } from 'lucide-react'
import { updateContact, deleteContact } from '../actions'
import ProjectStatusBadge from '@/components/dashboard/ProjectStatusBadge'
import type { ContactWithCompany, Company, Project, ProjectStatus } from '@/lib/supabase/database.types'

interface Props {
  contact: ContactWithCompany
  companies: Pick<Company, 'id' | 'name'>[]
  projects: Pick<Project, 'id' | 'title' | 'status' | 'shoot_date'>[]
}

export default function ContactDetail({ contact, companies, projects }: Props) {
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      await updateContact(contact.id, formData)
      setEditing(false)
    })
  }

  function handleDelete() {
    if (
      !confirm(
        `Delete ${contact.first_name} ${contact.last_name}? This cannot be undone.`
      )
    )
      return
    startTransition(async () => {
      await deleteContact(contact.id)
    })
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left — contact info */}
      <div className="flex-1 overflow-y-auto border-r border-line px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-caption font-semibold uppercase tracking-widest text-ink-muted">
            Contact Info
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(!editing)}
              className="inline-flex items-center gap-1.5 rounded-token-md border border-line px-3 py-1.5 text-caption font-medium text-ink-secondary transition-colors hover:border-gold/30 hover:text-gold"
            >
              <Edit2 size={12} />
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-token-md border border-line px-3 py-1.5 text-caption font-medium text-ink-muted transition-colors hover:border-red-900/40 hover:text-red-400 disabled:opacity-50"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </div>

        {editing ? (
          <form action={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <EditField label="First Name" name="first_name" defaultValue={contact.first_name} required />
              <EditField label="Last Name" name="last_name" defaultValue={contact.last_name} required />
            </div>
            <EditField label="Email" name="email" type="email" defaultValue={contact.email ?? ''} />
            <EditField label="Phone" name="phone" type="tel" defaultValue={contact.phone ?? ''} />
            <EditField label="Title" name="title" defaultValue={contact.title ?? ''} />

            <div>
              <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                Company
              </label>
              <select
                name="company_id"
                defaultValue={contact.company_id ?? ''}
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

            <div>
              <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                Notes
              </label>
              <textarea
                name="notes"
                rows={4}
                defaultValue={contact.notes ?? ''}
                className="w-full resize-none rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-token-md bg-gold px-5 py-2 text-caption font-semibold text-bg-base transition-colors hover:bg-gold-light disabled:opacity-50"
              >
                {isPending ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-token-md border border-line px-5 py-2 text-caption font-medium text-ink-secondary transition-colors hover:text-ink-primary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <dl className="space-y-5">
            <InfoRow icon={Mail} label="Email" value={contact.email} href={contact.email ? `mailto:${contact.email}` : undefined} />
            <InfoRow icon={Phone} label="Phone" value={contact.phone} href={contact.phone ? `tel:${contact.phone}` : undefined} />
            {contact.companies && (
              <div className="flex gap-3">
                <Building2 size={14} strokeWidth={1.5} className="mt-0.5 flex-shrink-0 text-ink-muted" />
                <div>
                  <dt style={{ fontSize: '11px' }} className="text-ink-muted">Company</dt>
                  <dd className="mt-0.5 text-caption text-ink-primary">
                    <Link
                      href={`/dashboard/companies/${contact.company_id}`}
                      className="transition-colors hover:text-gold"
                    >
                      {contact.companies.name}
                    </Link>
                  </dd>
                </div>
              </div>
            )}
            <InfoRow label="Title" value={contact.title} />
            {contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gold/20 bg-gold/5 px-2.5 py-0.5 text-caption text-gold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </dl>
        )}

        {/* Projects this contact is on */}
        <div className="mt-10">
          <h2 className="mb-4 text-caption font-semibold uppercase tracking-widest text-ink-muted">
            Projects
          </h2>
          {projects.length > 0 ? (
            <div className="space-y-1">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex items-center justify-between rounded-token-md px-3 py-2.5 transition-colors hover:bg-bg-hover/60"
                >
                  <p className="text-caption font-medium text-ink-primary">{project.title}</p>
                  <ProjectStatusBadge status={project.status as ProjectStatus} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <FolderOpen size={18} strokeWidth={1.5} className="text-ink-muted" />
              <p className="text-caption text-ink-muted">No projects yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Right — notes + metadata */}
      <div className="w-72 flex-shrink-0 overflow-y-auto px-6 py-6">
        <h2 className="mb-4 text-caption font-semibold uppercase tracking-widest text-ink-muted">
          Notes
        </h2>
        <div className="min-h-[120px] rounded-token-md border border-line bg-bg-card p-4">
          {contact.notes ? (
            <p className="whitespace-pre-wrap text-caption text-ink-secondary">
              {contact.notes}
            </p>
          ) : (
            <p className="text-caption italic text-ink-muted">No notes yet.</p>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <MetaRow
            label="Created"
            value={new Date(contact.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          />
          <MetaRow
            label="Updated"
            value={new Date(contact.updated_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          />
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon?: React.ComponentType<{ size?: number | string; strokeWidth?: number | string; className?: string }>
  label: string
  value: string | null | undefined
  href?: string
}) {
  if (!value) return null
  return (
    <div className="flex gap-3">
      {Icon && (
        <Icon size={14} strokeWidth={1.5} className="mt-0.5 flex-shrink-0 text-ink-muted" />
      )}
      <div>
        <dt style={{ fontSize: '11px' }} className="text-ink-muted">
          {label}
        </dt>
        <dd className="mt-0.5 text-caption text-ink-primary">
          {href ? (
            <a href={href} className="transition-colors hover:text-gold">
              {value}
            </a>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ fontSize: '11px' }} className="text-ink-muted">
        {label}
      </span>
      <span style={{ fontSize: '11px' }} className="text-ink-muted">
        {value}
      </span>
    </div>
  )
}

function EditField({
  label,
  name,
  type = 'text',
  defaultValue,
  required = false,
}: {
  label: string
  name: string
  type?: string
  defaultValue: string
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
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
      />
    </div>
  )
}
