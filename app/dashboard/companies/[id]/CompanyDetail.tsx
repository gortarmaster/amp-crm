'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Edit2, Trash2, Globe, Users, FolderOpen } from 'lucide-react'
import { updateCompany, deleteCompany } from '../actions'
import ProjectStatusBadge from '@/components/dashboard/ProjectStatusBadge'
import type { Company, Contact, Project, ProjectStatus } from '@/lib/supabase/database.types'

interface Props {
  company: Company
  contacts: Pick<Contact, 'id' | 'first_name' | 'last_name' | 'title' | 'email'>[]
  projects: Pick<Project, 'id' | 'title' | 'status' | 'shoot_date'>[]
}

export default function CompanyDetail({ company, contacts, projects }: Props) {
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      await updateCompany(company.id, formData)
      setEditing(false)
    })
  }

  function handleDelete() {
    if (!confirm(`Delete ${company.name}? This cannot be undone.`)) return
    startTransition(async () => {
      await deleteCompany(company.id)
    })
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
      {/* Left — company info */}
      <div className="flex-1 border-b border-line px-5 py-6 md:overflow-y-auto md:border-b-0 md:border-r md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-caption font-semibold uppercase tracking-widest text-ink-muted">
            Company Info
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
            <EditField label="Company Name" name="name" defaultValue={company.name} required />
            <EditField label="Website" name="website" type="url" defaultValue={company.website ?? ''} placeholder="https://example.com" />
            <EditField label="Industry" name="industry" defaultValue={company.industry ?? ''} placeholder="e.g. Architecture, Photography" />

            <div>
              <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                Notes
              </label>
              <textarea
                name="notes"
                rows={4}
                defaultValue={company.notes ?? ''}
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
            {company.website && (
              <InfoRow
                icon={Globe}
                label="Website"
                value={company.website.replace(/^https?:\/\//, '')}
                href={company.website}
              />
            )}
            {company.industry && (
              <InfoRow label="Industry" value={company.industry} />
            )}
          </dl>
        )}

        {/* Contacts at this company */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-caption font-semibold uppercase tracking-widest text-ink-muted">
              Contacts
            </h2>
            <Link
              href={`/dashboard/contacts/new`}
              className="text-caption text-ink-muted transition-colors hover:text-gold"
            >
              + Add
            </Link>
          </div>

          {contacts.length > 0 ? (
            <div className="space-y-1">
              {contacts.map((contact) => (
                <Link
                  key={contact.id}
                  href={`/dashboard/contacts/${contact.id}`}
                  className="flex items-center justify-between rounded-token-md px-3 py-2.5 transition-colors hover:bg-bg-hover/60"
                >
                  <div>
                    <p className="text-caption font-medium text-ink-primary">
                      {contact.first_name} {contact.last_name}
                    </p>
                    {contact.title && (
                      <p className="mt-0.5 text-caption text-ink-muted" style={{ fontSize: '11px' }}>
                        {contact.title}
                      </p>
                    )}
                  </div>
                  {contact.email && (
                    <span className="text-caption text-ink-muted" style={{ fontSize: '11px' }}>
                      {contact.email}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Users size={18} strokeWidth={1.5} className="text-ink-muted" />
              <p className="text-caption text-ink-muted">No contacts yet</p>
            </div>
          )}
        </div>

        {/* Projects at this company */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-caption font-semibold uppercase tracking-widest text-ink-muted">
              Projects
            </h2>
            <Link
              href="/dashboard/projects/new"
              className="text-caption text-ink-muted transition-colors hover:text-gold"
            >
              + Add
            </Link>
          </div>

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
      <div className="px-5 py-6 md:w-72 md:flex-shrink-0 md:overflow-y-auto md:px-6">
        <h2 className="mb-4 text-caption font-semibold uppercase tracking-widest text-ink-muted">
          Notes
        </h2>
        <div className="min-h-[120px] rounded-token-md border border-line bg-bg-card p-4">
          {company.notes ? (
            <p className="whitespace-pre-wrap text-caption text-ink-secondary">
              {company.notes}
            </p>
          ) : (
            <p className="text-caption italic text-ink-muted">No notes yet.</p>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <MetaRow
            label="Created"
            value={new Date(company.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          />
          <MetaRow
            label="Updated"
            value={new Date(company.updated_at).toLocaleDateString('en-US', {
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
            <a href={href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold">
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
      <span style={{ fontSize: '11px' }} className="text-ink-muted">{label}</span>
      <span style={{ fontSize: '11px' }} className="text-ink-muted">{value}</span>
    </div>
  )
}

function EditField({
  label,
  name,
  type = 'text',
  defaultValue,
  placeholder,
  required = false,
}: {
  label: string
  name: string
  type?: string
  defaultValue: string
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
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
      />
    </div>
  )
}
